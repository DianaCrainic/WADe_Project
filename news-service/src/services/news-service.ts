import envs from "../envs";
import ParsingClient from "sparql-http-client/ParsingClient";
import { CreateCryptoNewsInput } from "../models/create-crypto-news-input";
import { CryptoNews } from "../models/crypto-news";
import { UpdateCryptoNewsInput } from "../models/update-crypto-news-input";
import sparqlTransformer from "sparql-transformer";

const sparqlClient = new ParsingClient({ endpointUrl: envs.sparqlEndpoint, updateUrl: envs.sparqlEndpoint });

export const getCryptoNewsById = async (id: string): Promise<any> => {
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

    const foundNews: CryptoNews = result["@graph"][0] as CryptoNews;
    foundNews.id = foundNews.id.slice(1, -1);
    return foundNews;
}

export const getCryptoNewsByCryptocurrencyId = async (cryptocurrencyId: string): Promise<any> => {
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

    if (result["@graph"].length === 0) {
        throw new Error(`No CryptoNews for Cryptocurrency with id ${cryptocurrencyId} found`);
    }

    return result["@graph"] as CryptoNews[];
}

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
