import envs from "../envs";
import ParsingClient from "sparql-http-client/ParsingClient";
import { Cryptocurrency } from "../models/cryptocurrency";
import { SparqlResultConverter, MappingDefinition } from "sparql-result-converter";
import { SparqlResultLine } from "sparql-result-converter/dist/ArrayUtil";

const sparqlClient = new ParsingClient({ endpointUrl: envs.sparqlEndpoint });
const sparqlResultConverter = new SparqlResultConverter();

const parseBindings = (bindings: any): SparqlResultLine[] => {
    return bindings.map((row: { [x: string]: any; }) => {
        Object.keys(row).forEach(key => {
            if (Array.isArray(row[key])) {
                parseBindings(row[key]);
            }

            if (key === "datatype") {
                row["type"] = row["datatype"]["value"];
            }
        })

        return row;
    });
}

const mappingDefinition: MappingDefinition[] = [
    {
        rootName: "cryptocurrencies",
        propertyToGroup: "symbol",
        name: "symbol",
        toCollect: ["id", "description", "blockReward", "blockTime", "totalCoins", "source", "website"],
        childMappings: [
            {
                rootName: "protectionScheme",
                propertyToGroup: "protectionSchemeDescription",
                name: "description"
            },
            {
                rootName: "distributionScheme",
                propertyToGroup: "distributionSchemeDescription",
                name: "description"
            }
        ]
    }
];

export const getCryptocurrencyById = async (id: string): Promise<Cryptocurrency> => {
    const query = `
        PREFIX doacc: <http://purl.org/net/bel-epa/doacc#>

        SELECT ?id ?symbol ?description ?blockReward ?blockTime ?totalCoins ?source ?website ?protectionSchemeDescription ?distributionSchemeDescription
        WHERE { 
            doacc:${id} <http://www.w3.org/1999/02/22-rdf-syntax-ns#type> doacc:Cryptocurrency  ;
                        doacc:symbol                                      ?symbol               ;
                        doacc:protection-scheme                           ?protectionSchemeId   ;
                        doacc:distribution-scheme                         ?distributionSchemeId .
            OPTIONAL { doacc:${id} <http://purl.org/dc/elements/1.1/description> ?tempDescription } .
            OPTIONAL { doacc:${id} doacc:block-reward                            ?tempBlockReward } .
            OPTIONAL { doacc:${id} doacc:block-time                              ?tempBlockTime   } .
            OPTIONAL { doacc:${id} doacc:total-coins                             ?tempTotalCoins  } .
            OPTIONAL { doacc:${id} doacc:source                                  ?tempSource      } .
            OPTIONAL { doacc:${id} doacc:website                                 ?tempWebsite     } .

            BIND("${id}" AS ?id) .

            BIND(COALESCE(?tempDescription, "-"      ) AS ?description) .
            BIND(COALESCE(?tempBlockReward, "unknown") AS ?blockReward) .
            BIND(COALESCE(?tempBlockTime,   -1       ) AS ?blockTime  ) .
            BIND(COALESCE(?tempTotalCoins,  "unknown") AS ?totalCoins ) .
            BIND(COALESCE(?tempSource,      "unknown") AS ?source     ) .
            BIND(COALESCE(?tempWebsite,     "unknown") AS ?website    ) .

            OPTIONAL { ?protectionSchemeId <http://purl.org/dc/elements/1.1/description> ?tempProtectionSchemeDescription } .
            BIND(COALESCE(?tempProtectionSchemeDescription, "-") AS ?protectionSchemeDescription) .

            OPTIONAL { ?distributionSchemeId <http://purl.org/dc/elements/1.1/description> ?tempDistributionSchemeDescription } .
            BIND(COALESCE(?tempDistributionSchemeDescription, "-") AS ?distributionSchemeDescription) .
        }
    `;

    const bindings = await sparqlClient.query.select(query);
    if (bindings.length === 0) {
        throw new Error("Not found");
    }

    const convertedBindings: any = sparqlResultConverter.convertToDefinition(parseBindings(bindings), mappingDefinition).getAll()["cryptocurrencies"][0];
    convertedBindings["protectionScheme"] = convertedBindings["protectionScheme"][0];
    convertedBindings["distributionScheme"] = convertedBindings["distributionScheme"][0];
    return convertedBindings as Cryptocurrency;
};

export const getCryptocurrencies = async (limit = 10, offset = 0): Promise<Cryptocurrency[]> => {
    const query = `
        PREFIX doacc: <http://purl.org/net/bel-epa/doacc#>

        SELECT ?id ?symbol ?description ?blockReward ?blockTime ?totalCoins ?source ?website ?protectionSchemeDescription ?distributionSchemeDescription
        WHERE {
            ?idWithPrefix <http://www.w3.org/1999/02/22-rdf-syntax-ns#type> doacc:Cryptocurrency  ;
                        doacc:symbol                                      ?symbol               ;
                        doacc:protection-scheme                           ?protectionSchemeId   ;
                        doacc:distribution-scheme                         ?distributionSchemeId .
            OPTIONAL { ?idWithPrefix <http://purl.org/dc/elements/1.1/description> ?tempDescription } .
            OPTIONAL { ?idWithPrefix doacc:block-reward                            ?tempBlockReward } .
            OPTIONAL { ?idWithPrefix doacc:block-time                              ?tempBlockTime   } .
            OPTIONAL { ?idWithPrefix doacc:total-coins                             ?tempTotalCoins  } .
            OPTIONAL { ?idWithPrefix doacc:source                                  ?tempSource      } .
            OPTIONAL { ?idWithPrefix doacc:website                                 ?tempWebsite     } .

            BIND(STRAFTER(STR(?idWithPrefix), "http://purl.org/net/bel-epa/doacc#") AS ?id) .

            BIND(COALESCE(?tempDescription, "-"      ) AS ?description) .
            BIND(COALESCE(?tempBlockReward, "unknown") AS ?blockReward) .
            BIND(COALESCE(?tempBlockTime,   -1       ) AS ?blockTime  ) .
            BIND(COALESCE(?tempTotalCoins,  "unknown") AS ?totalCoins ) .
            BIND(COALESCE(?tempSource,      "unknown") AS ?source     ) .
            BIND(COALESCE(?tempWebsite,     "unknown") AS ?website    ) .

            OPTIONAL { ?protectionSchemeId <http://purl.org/dc/elements/1.1/description> ?tempProtectionSchemeDescription } .
            BIND(COALESCE(?tempProtectionSchemeDescription, "-") AS ?protectionSchemeDescription) .

            OPTIONAL { ?distributionSchemeId <http://purl.org/dc/elements/1.1/description> ?tempDistributionSchemeDescription } .
            BIND(COALESCE(?tempDistributionSchemeDescription, "-") AS ?distributionSchemeDescription) .
        }
        ORDER BY ?symbol
        LIMIT ${limit}
        OFFSET ${offset}
    `;

    const bindings = await sparqlClient.query.select(query);

    const convertedBindings: any = sparqlResultConverter.convertToDefinition(parseBindings(bindings), mappingDefinition).getAll()["cryptocurrencies"];
    convertedBindings.map((binding: any) => {
        binding["protectionScheme"] = binding["protectionScheme"][0];
        binding["distributionScheme"] = binding["distributionScheme"][0];
        return binding;
    });
    return convertedBindings as Cryptocurrency[];
};