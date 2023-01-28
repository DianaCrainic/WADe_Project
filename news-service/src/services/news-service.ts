import envs from "../envs";
import ParsingClient from "sparql-http-client/ParsingClient";
import { CreateCryptoNewsInput } from "../models/create-crypto-news-input";
import { CryptoNews } from "../models/crypto-news";
import { UpdateCryptoNewsInput } from "../models/update-crypto-news-input";
import { CryptoNewsInfo } from "../models/crypto-news-info";
import sparqlTransformer from "sparql-transformer";

const sparqlClient = new ParsingClient({ endpointUrl: envs.sparqlEndpoint, updateUrl: envs.sparqlEndpoint });

const getCryptoNewsById = async (id: string): Promise<any> => {
    const jsonLdQuery = {
        "@graph": [{
            "@type": "CryptoNews",
            "id": `<${id}>`,
            "title": "$schema:headline$required",
            "body": "$schema:articleBody",
            "about": "$elements:subject$required$list"
        }],
        "$where": [
            `<${id}> rdf:type schema:NewsArticle`
        ],
        "$prefixes": {
            "schema": "http://schema.org/",
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
        throw new Error(`CryptoNews with id ${id} not found`);
    }

    const cryptoNews: CryptoNews = result["@graph"][0] as CryptoNews;
    cryptoNews.id = cryptoNews.id.slice(1, -1);
    return cryptoNews;
}

export const getCryptoNewsByCryptocurrencyId = async (cryptocurrencyId: string, limit = 10, offset = 0): Promise<CryptoNews[]> => {
    const jsonLdQuery = {
        "@graph": [{
            "@type": "CryptoNews",
            "id": "?id",
            "title": "$schema:headline$required",
            "body": "$schema:articleBody",
            "about": "$elements:subject$required$list"
        }],
        "$where": [
            "?id rdf:type schema:NewsArticle",
            `?id elements:subject <${cryptocurrencyId}>`
        ],
        "$limit": limit,
        "$offset": offset,
        "$orderby": "?title",
        "$prefixes": {
            "schema": "http://schema.org/",
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

    return result["@graph"] as CryptoNews[];
}

export const getCryptoNewsInfoForCryptocurrency = async (cryptocurrencyId: string): Promise<CryptoNewsInfo> => {
    const query = `
        PREFIX schema:   <http://schema.org/>
        PREFIX rdf:      <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
        PREFIX elements: <http://purl.org/dc/elements/1.1/>
        SELECT (COUNT(?id) AS ?totalCount)
        WHERE {
            ?id rdf:type schema:NewsArticle .
            ?id elements:subject <${cryptocurrencyId}>
        }
    `;
    const result = await sparqlClient.query.select(query);

    return { totalCount: parseInt(result[0].totalCount.value) };
};

export const createCryptoNews = async (cryptoNews: CreateCryptoNewsInput): Promise<CryptoNews> => {
    const id = `http://schema.org/${crypto.randomUUID()}`;

    let cryptocurrencies = "";
    cryptoNews.about.forEach(function(item) {
        cryptocurrencies = cryptocurrencies + `<${id}> ` + "elements:subject " + `<${item}> .\n`
    });

    const query = `
        PREFIX schema:   <http://schema.org/>
        PREFIX rdf:      <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
        PREFIX elements: <http://purl.org/dc/elements/1.1/>

        INSERT DATA {
            <${id}> rdf:type                  schema:NewsArticle       ;
                    schema:headline           "${cryptoNews.title}"@en ;
                    schema:articleBody        "${cryptoNews.body}"@en .     

            ${cryptocurrencies}
        }
    `;

    await sparqlClient.query.update(query);

    return await getCryptoNewsById(id);
}

export const updateCryptoNewsById = async (cryptoNews: UpdateCryptoNewsInput): Promise<CryptoNews> => {
    const id = cryptoNews.id;

    const askQuery = `
        PREFIX schema: <http://schema.org/>
        PREFIX rdf:    <http://www.w3.org/1999/02/22-rdf-syntax-ns#>

        ASK {
            <${id}> rdf:type schema:NewsArticle .
        }
    `;

    const doesNewsArticleExist = await sparqlClient.query.ask(askQuery);
    if (!doesNewsArticleExist) {
        throw new Error(`CryptoNews with id ${id} not found`);
    }

    let cryptocurrencies = "";
    if(cryptoNews.about) {
        cryptoNews.about.forEach(function(item) {
            cryptocurrencies = cryptocurrencies + `<${id}> ` + "elements:subject " + `<${item}> .\n`
        });
    }

    const updateQuery = `
        PREFIX schema: <http://schema.org/>
        PREFIX rdf:    <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
        PREFIX elements: <http://purl.org/dc/elements/1.1/>

        DELETE {
            ${cryptoNews.title ? `<${id}> schema:headline ?oldTitle . ` : ""}
            ${cryptoNews.body ? `<${id}> schema:articleBody ?oldArticleBody . ` : ""}      
            ${cryptoNews.about ? `<${id}> elements:subject ?oldAbout . ` : ""}
        }
        INSERT {
            ${cryptoNews.title ? `<${id}> schema:headline "${cryptoNews.title}"@en .` : ""}
            ${cryptoNews.body ? `<${id}> schema:articleBody "${cryptoNews.body}"@en .` : ""}
            ${cryptocurrencies}
        }
        WHERE {
            ${cryptoNews.title ? `<${id}> schema:headline ?oldTitle . ` : ""}
            ${cryptoNews.body ? `<${id}> schema:articleBody ?oldArticleBody . ` : ""}
            ${cryptoNews.about ? `<${id}> elements:subject ?oldAbout . ` : ""}
        }
    `;

    await sparqlClient.query.update(updateQuery);

    return await getCryptoNewsById(id);
}

export const removeCryptoNewsById = async (id: string): Promise<CryptoNews> => {
    const newsArticle: CryptoNews = await getCryptoNewsById(id);

    const query = `
        PREFIX schema: <http://schema.org/>

        DELETE {
            <${id}> ?p ?o
        }
        WHERE {
            <${id}> ?p ?o
        }
    `;

    await sparqlClient.query.update(query);

    return newsArticle;
};
