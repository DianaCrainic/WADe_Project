import envs from "../envs";
import ParsingClient from "sparql-http-client/ParsingClient";
import { CreateCryptocurrencyInput, Cryptocurrency, UpdateCryptocurrencyInput } from "../models/cryptocurrency";
import { SparqlResultConverter, MappingDefinition } from "sparql-result-converter";
import { SparqlResultLine } from "sparql-result-converter/dist/ArrayUtil";

const sparqlClient = new ParsingClient({ endpointUrl: envs.sparqlEndpoint, updateUrl: envs.sparqlEndpoint });
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
        PREFIX rdf:   <http://www.w3.org/1999/02/22-rdf-syntax-ns#>

        SELECT ?id ?symbol ?description ?blockReward ?blockTime ?totalCoins ?source ?website ?protectionSchemeDescription ?distributionSchemeDescription
        WHERE { 
            doacc:${id} rdf:type                  doacc:Cryptocurrency  ;
                        doacc:symbol              ?symbol               ;
                        doacc:protection-scheme   ?protectionSchemeId   ;
                        doacc:distribution-scheme ?distributionSchemeId .
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
        throw new Error(`Cryptocurrency with id ${id} not found`);
    }

    const convertedBindings: any = sparqlResultConverter.convertToDefinition(parseBindings(bindings), mappingDefinition).getAll()["cryptocurrencies"][0];
    convertedBindings["protectionScheme"] = convertedBindings["protectionScheme"][0];
    convertedBindings["distributionScheme"] = convertedBindings["distributionScheme"][0];
    return convertedBindings as Cryptocurrency;
};

export const getCryptocurrencies = async (limit = 10, offset = 0): Promise<Cryptocurrency[]> => {
    const query = `
        PREFIX doacc: <http://purl.org/net/bel-epa/doacc#>
        PREFIX rdf:   <http://www.w3.org/1999/02/22-rdf-syntax-ns#>

        SELECT ?id ?symbol ?description ?blockReward ?blockTime ?totalCoins ?source ?website ?protectionSchemeDescription ?distributionSchemeDescription
        WHERE {
            ?idWithPrefix rdf:type                  doacc:Cryptocurrency  ;
                          doacc:symbol              ?symbol               ;
                          doacc:protection-scheme   ?protectionSchemeId   ;
                          doacc:distribution-scheme ?distributionSchemeId .
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

export const createCryptocurrency = async (cryptocurrency: CreateCryptocurrencyInput): Promise<Cryptocurrency> => {
    const id = crypto.randomUUID();

    const query = `
        PREFIX doacc: <http://purl.org/net/bel-epa/doacc#>
        PREFIX rdf:   <http://www.w3.org/1999/02/22-rdf-syntax-ns#>

        INSERT DATA {
            doacc:${id} rdf:type                  doacc:Cryptocurrency                        ;
                        doacc:symbol              "${cryptocurrency.symbol}"@en               ;
                        doacc:protection-scheme   doacc:D9758d7c9-6b22-4039-a325-285d680c22fe ;
                        doacc:distribution-scheme doacc:Dc10c93fb-f7ec-40cd-a06e-7890686f6ef8 .
            
            ${cryptocurrency.description ? `doacc:${id} <http://purl.org/dc/elements/1.1/description> "${cryptocurrency.description}"@en                                         .` : ""}
            ${cryptocurrency.blockReward ? `doacc:${id} doacc:block-reward                            "${cryptocurrency.blockReward}"^^<http://www.w3.org/2001/XMLSchema#string> .` : ""}
            ${cryptocurrency.blockTime   ? `doacc:${id} doacc:block-time                              "${cryptocurrency.blockTime}"^^<http://www.w3.org/2001/XMLSchema#integer>  .` : ""}
            ${cryptocurrency.source      ? `doacc:${id} doacc:source                                  <${cryptocurrency.source}>                                                 .` : ""}
            ${cryptocurrency.website     ? `doacc:${id} doacc:website                                 <${cryptocurrency.website}>                                                .` : ""}
        }
    `;

    await sparqlClient.query.update(query);

    return await getCryptocurrencyById(id);
}

export const updateCryptocurrencyById = async (cryptocurrency: UpdateCryptocurrencyInput): Promise<Cryptocurrency> => {
    throw new Error("Not yet implemented");
}

export const removeCryptocurrencyById = async (id: string): Promise<Cryptocurrency> => {
    const cryptocurrency: Cryptocurrency = await getCryptocurrencyById(id);

    const query = `
        PREFIX doacc: <http://purl.org/net/bel-epa/doacc#>

        DELETE {
            doacc:${id} ?p ?o
        }
        WHERE {
            doacc:${id} ?p ?o
        }
    `;

    await sparqlClient.query.update(query);

    return cryptocurrency;
};