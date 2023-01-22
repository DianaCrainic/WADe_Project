import envs from "../envs";
import ParsingClient from "sparql-http-client/ParsingClient";
import { CreateCryptocurrencyInput, Cryptocurrency, UpdateCryptocurrencyInput, CryptocurrenciesInfo } from "../models/cryptocurrency";
import sparqlTransformer from "sparql-transformer";

const sparqlClient = new ParsingClient({ endpointUrl: envs.sparqlEndpoint, updateUrl: envs.sparqlEndpoint });

const convertDateToStandardFormat = (date: Date): string => {
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const day = date.getDate();
    return `${year}-${month > 9 ? month : `0${month}`}-${day}`;
}

export const getCryptocurrencyById = async (id: string): Promise<any> => {
    const jsonLdQuery = {
        "@graph": [{
            "@type": "Cryptocurrency",
            "id": `<${id}>`,
            "symbol": "$doacc:symbol$required",
            "description": "$elements:description",
            "blockReward": "$doacc:block-reward",
            "blockTime": "$doacc:block-time",
            "totalCoins": "$doacc:total-coins",
            "dateFounded": "$doacc:date-founded",
            "source": "$doacc:source",
            "website": "$doacc:website",
            "protectionScheme": {
                "@type": "ProtectionScheme",
                "id": "$doacc:protection-scheme",
                "description": "$elements:description"
            },
            "distributionScheme": {
                "@type": "DistributionScheme",
                "id": "$doacc:distribution-scheme",
                "description": "$elements:description"
            }
        }],
        "$where": [
            `<${id}> rdf:type doacc:Cryptocurrency`
        ],
        "$prefixes": {
            "doacc": "http://purl.org/net/bel-epa/doacc#",
            "rdf": "http://www.w3.org/1999/02/22-rdf-syntax-ns#",
            "elements": "http://purl.org/dc/elements/1.1/"
        }
    };

    const result = await sparqlTransformer.default(jsonLdQuery, {
        debug: false,
        sparqlFunction: async (query: string) => {
            return {
                results: {
                    bindings: await sparqlClient.query.select(query),
                }
            };
        }
    });

    if (result["@graph"].length === 0) {
        throw new Error(`Cryptocurrency with id ${id} not found`);
    }

    const cryptocurrency: Cryptocurrency = result["@graph"][0];
    cryptocurrency.id = cryptocurrency.id.slice(1, -1);
    return cryptocurrency;
}

export const getCryptocurrencies = async (limit = 10, offset = 0): Promise<Cryptocurrency[]> => {
    const jsonLdQuery = {
        "@graph": [{
            "@type": "Cryptocurrency",
            "id": "?id",
            "symbol": "$doacc:symbol$required$var:?symbol",
            "description": "$elements:description",
            "blockReward": "$doacc:block-reward",
            "blockTime": "$doacc:block-time",
            "totalCoins": "$doacc:total-coins",
            "dateFounded": "$doacc:date-founded",
            "source": "$doacc:source",
            "website": "$doacc:website",
            "protectionScheme": {
                "@type": "ProtectionScheme",
                "id": "$doacc:protection-scheme",
                "description": "$elements:description"
            },
            "distributionScheme": {
                "@type": "DistributionScheme",
                "id": "$doacc:distribution-scheme",
                "description": "$elements:description"
            }
        }],
        "$where": [
            "?id rdf:type doacc:Cryptocurrency"
        ],
        "$limit": limit,
        "$offset": offset,
        "$orderby": "?symbol",
        "$prefixes": {
            "doacc": "http://purl.org/net/bel-epa/doacc#",
            "rdf": "http://www.w3.org/1999/02/22-rdf-syntax-ns#",
            "elements": "http://purl.org/dc/elements/1.1/"
        }
    };

    const result = await sparqlTransformer.default(jsonLdQuery, {
        debug: false,
        sparqlFunction: async (query: string) => {
            return {
                results: {
                    bindings: await sparqlClient.query.select(query),
                }
            };
        }
    });

    return result["@graph"] as Cryptocurrency[];
};

export const getCryptocurrenciesInfo = async (): Promise<CryptocurrenciesInfo> => {
    const query = `
        PREFIX doacc:    <http://purl.org/net/bel-epa/doacc#>
        PREFIX rdf:      <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
        SELECT (COUNT(?id) AS ?totalCount)
        WHERE {
            ?id rdf:type doacc:Cryptocurrency 
        }
    `;
    const result = await sparqlClient.query.select(query);

    return { totalCount: parseInt(result[0].totalCount.value) };
};

export const createCryptocurrency = async (cryptocurrency: CreateCryptocurrencyInput): Promise<Cryptocurrency> => {
    const id = `http://purl.org/net/bel-epa/doacc#${crypto.randomUUID()}`;

    if (cryptocurrency.dateFounded) {
        const dateFounded = new Date(cryptocurrency.dateFounded);
        if (!(dateFounded instanceof Date) || isNaN(dateFounded.valueOf())) {
            throw new Error("Invalid date (dateFounded)");
        }
        cryptocurrency.dateFounded = convertDateToStandardFormat(dateFounded);
    }

    const query = `
        PREFIX doacc:    <http://purl.org/net/bel-epa/doacc#>
        PREFIX rdf:      <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
        PREFIX elements: <http://purl.org/dc/elements/1.1/>

        INSERT DATA {
            <${id}> rdf:type                  doacc:Cryptocurrency                        ;
                    doacc:symbol              "${cryptocurrency.symbol}"@en               ;
                    doacc:protection-scheme   doacc:D9758d7c9-6b22-4039-a325-285d680c22fe ;
                    doacc:distribution-scheme doacc:Dc10c93fb-f7ec-40cd-a06e-7890686f6ef8 .
            
            ${cryptocurrency.description ? `<${id}> elements:description "${cryptocurrency.description}"@en                                         .` : ""}
            ${cryptocurrency.blockReward ? `<${id}> doacc:block-reward   "${cryptocurrency.blockReward}"^^<http://www.w3.org/2001/XMLSchema#string> .` : ""}
            ${cryptocurrency.blockTime   ? `<${id}> doacc:block-time     "${cryptocurrency.blockTime}"^^<http://www.w3.org/2001/XMLSchema#integer>  .` : ""}
            ${cryptocurrency.totalCoins  ? `<${id}> doacc:total-coins    "${cryptocurrency.totalCoins}"^^<http://www.w3.org/2001/XMLSchema#string>  .` : ""}
            ${cryptocurrency.dateFounded ? `<${id}> doacc:date-founded   "${cryptocurrency.dateFounded}"^^<http://www.w3.org/2001/XMLSchema#date>   .` : ""}
            ${cryptocurrency.source      ? `<${id}> doacc:source         <${cryptocurrency.source}>                                                 .` : ""}
            ${cryptocurrency.website     ? `<${id}> doacc:website        <${cryptocurrency.website}>                                                .` : ""}
        }
    `;

    await sparqlClient.query.update(query);

    return await getCryptocurrencyById(id);
}

export const updateCryptocurrencyById = async (cryptocurrency: UpdateCryptocurrencyInput): Promise<Cryptocurrency> => {
    const id = cryptocurrency.id;

    const askQuery = `
        PREFIX doacc: <http://purl.org/net/bel-epa/doacc#>
        PREFIX rdf:   <http://www.w3.org/1999/02/22-rdf-syntax-ns#>

        ASK {
            <${id}> rdf:type doacc:Cryptocurrency .
        }
    `;

    const doesCryptocurrencyExist = await sparqlClient.query.ask(askQuery);
    if (!doesCryptocurrencyExist) {
        throw new Error(`Cryptocurrency with id ${id} not found`);
    }

    if (cryptocurrency.dateFounded) {
        const dateFounded = new Date(cryptocurrency.dateFounded);
        if (!(dateFounded instanceof Date) || isNaN(dateFounded.valueOf())) {
            throw new Error("Invalid date (dateFounded)");
        }
        cryptocurrency.dateFounded = convertDateToStandardFormat(dateFounded);
    }

    const updateQuery = `
        PREFIX doacc:    <http://purl.org/net/bel-epa/doacc#>
        PREFIX rdf:      <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
        PREFIX elements: <http://purl.org/dc/elements/1.1/>

        DELETE {
            ${cryptocurrency.description ? `<${id}> elements:description ?oldDescription . ` : ""}
            ${cryptocurrency.blockReward ? `<${id}> doacc:block-reward   ?oldBlockReward . ` : ""}
            ${cryptocurrency.blockTime   ? `<${id}> doacc:block-time     ?oldBlockTime   . ` : ""}
            ${cryptocurrency.totalCoins  ? `<${id}> doacc:total-coins    ?oldTotalCoins  . ` : ""}
            ${cryptocurrency.dateFounded ? `<${id}> doacc:date-founded   ?oldDateFounded . ` : ""}
            ${cryptocurrency.source      ? `<${id}> doacc:source         ?oldSource      . ` : ""}
            ${cryptocurrency.website     ? `<${id}> doacc:website        ?oldWebsite     . ` : ""}
        }
        INSERT {
            ${cryptocurrency.description ? `<${id}> elements:description "${cryptocurrency.description}"@en                                         .` : ""}
            ${cryptocurrency.blockReward ? `<${id}> doacc:block-reward   "${cryptocurrency.blockReward}"^^<http://www.w3.org/2001/XMLSchema#string> .` : ""}
            ${cryptocurrency.blockTime   ? `<${id}> doacc:block-time     "${cryptocurrency.blockTime}"^^<http://www.w3.org/2001/XMLSchema#integer>  .` : ""}
            ${cryptocurrency.totalCoins  ? `<${id}> doacc:total-coins    "${cryptocurrency.totalCoins}"^^<http://www.w3.org/2001/XMLSchema#string>  .` : ""}
            ${cryptocurrency.dateFounded ? `<${id}> doacc:date-founded   "${cryptocurrency.dateFounded}"^^<http://www.w3.org/2001/XMLSchema#date>   .` : ""}
            ${cryptocurrency.source      ? `<${id}> doacc:source         <${cryptocurrency.source}>                                                 .` : ""}
            ${cryptocurrency.website     ? `<${id}> doacc:website        <${cryptocurrency.website}>                                                .` : ""}
        }
        WHERE {
            ${cryptocurrency.description ? `<${id}> elements:description ?oldDescription . ` : ""}
            ${cryptocurrency.blockReward ? `<${id}> doacc:block-reward   ?oldBlockReward . ` : ""}
            ${cryptocurrency.blockTime   ? `<${id}> doacc:block-time     ?oldBlockTime   . ` : ""}
            ${cryptocurrency.totalCoins  ? `<${id}> doacc:total-coins    ?oldTotalCoins  . ` : ""}
            ${cryptocurrency.dateFounded ? `<${id}> doacc:date-founded   ?oldDateFounded . ` : ""}
            ${cryptocurrency.source      ? `<${id}> doacc:source         ?oldSource      . ` : ""}
            ${cryptocurrency.website     ? `<${id}> doacc:website        ?oldWebsite     . ` : ""}
        }
    `;

    await sparqlClient.query.update(updateQuery);

    return await getCryptocurrencyById(cryptocurrency.id);
}

export const removeCryptocurrencyById = async (id: string): Promise<Cryptocurrency> => {
    const cryptocurrency: Cryptocurrency = await getCryptocurrencyById(id);

    const query = `
        PREFIX doacc: <http://purl.org/net/bel-epa/doacc#>

        DELETE {
            <${id}> ?p ?o
        }
        WHERE {
            <${id}> ?p ?o
        }
    `;

    await sparqlClient.query.update(query);

    return cryptocurrency;
};