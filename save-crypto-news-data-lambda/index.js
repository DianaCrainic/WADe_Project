"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.handler = void 0;
const ParsingClient_1 = __importDefault(require("sparql-http-client/ParsingClient"));
const axios_1 = __importDefault(require("axios"));
const crypto_1 = __importDefault(require("crypto"));
const SPARQL_ENDPOINT = process.env.SPARQL_ENDPOINT || "http://localhost:9999/blazegraph/sparql";
const sparqlClient = new ParsingClient_1.default({ endpointUrl: SPARQL_ENDPOINT, updateUrl: SPARQL_ENDPOINT });
const MESSARI_API_URL = "https://data.messari.io/api/v1/news/";
const currenciesObject = {
    "apecoin": "http://purl.org/net/bel-epa/doacc#D7822ae84-57b8-49a9-a96d-4db6b17e17da",
    "bitcoin": "http://purl.org/net/bel-epa/doacc#Df625a2c6-3455-43b8-b2b1-83d5be6aa671",
    "dash": "http://purl.org/net/bel-epa/doacc#D18b06195-ed5c-4b46-abe7-c41fcdb02e07",
    "dogecoin": "http://purl.org/net/bel-epa/doacc#Dd5bd8eaf-b432-440b-9502-3707aa57ff93",
    "ethereum": "http://purl.org/net/bel-epa/doacc#D09fe733c-bb49-4854-a6d2-0c9cf77fa545",
    "ethereum-classic": "http://purl.org/net/bel-epa/doacc#D97674fb1-ef92-47a8-9c49-f472065c3822",
    "filecoin": "http://purl.org/net/bel-epa/doacc#Dc0d872de-d689-4b48-ab94-c8c63c21bb77",
    "gamecredits": "http://purl.org/net/bel-epa/doacc#D28c22140-0f4c-47c6-985c-519714222cd4",
    "lisk": "http://purl.org/net/bel-epa/doacc#D7ba179e0-10d0-40a7-a7bf-fce2dc4beedb",
    "litecoin": "http://purl.org/net/bel-epa/doacc#D8c037049-fb79-41f4-bb61-3d8ac12961d9",
    "monero": "http://purl.org/net/bel-epa/doacc#Dcc87ddf9-d138-48d4-ab89-18f36c6fb5b9",
    "nxt": "http://purl.org/net/bel-epa/doacc#De033a1b0-06bf-405e-b88c-4bd7c15c750d",
    "osmosis": "http://purl.org/net/bel-epa/doacc#D197fdf71-8b27-4a4d-8473-0473e7ac75c7",
    "stellar": "http://purl.org/net/bel-epa/doacc#D7c9fb142-f928-43af-bc8b-ff880631fc9d",
    "stratis": "http://purl.org/net/bel-epa/doacc#D25727817-4602-4457-ab2b-67c73e917c83",
    "waves": "http://purl.org/net/bel-epa/doacc#D229bc77b-d9a5-4ed4-a15a-b8ab795d8305",
    "xrp": "http://purl.org/net/bel-epa/doacc#D1edd900c-399e-471c-87a3-c214ce3c969d",
    "zcash": "http://purl.org/net/bel-epa/doacc#D37b26e0c-d69e-49f4-88f9-4e3b74eec808"
};
const currenciesMap = new Map(Object.entries(currenciesObject));
const getCryptoNewsData = async (currency) => {
    let collectedCryptoNews = [];
    let currentPage = 1;
    while (true) {
        if (currentPage > 3) {
            break;
        }
        try {
            const { data } = await axios_1.default.get(`${MESSARI_API_URL}${currency}`, {
                params: {
                    page: currentPage
                },
                headers: {
                    Accept: "application/json"
                }
            });
            if (data.data) {
                for (let dataIndex = 0; dataIndex < data.data.length; dataIndex++) {
                    const sanitizedTitle = data.data[dataIndex]["title"].replace(/(?:\")/g, '\\\"');
                    const sanitizedContent = (data.data[dataIndex]["content"].replace(/(?:\r\n|\r|\n)/g, '<br>')).replace(/(?:\")/g, '\\\"');
                    let cryptoNewsEntry = {
                        id: `http://schema.org/${crypto_1.default.randomUUID()}`,
                        title: sanitizedTitle,
                        body: sanitizedContent,
                        publishedAt: data.data[dataIndex]["published_at"],
                        source: data.data[dataIndex]["url"],
                        about: [currenciesMap.get(currency)]
                    };
                    collectedCryptoNews.push(cryptoNewsEntry);
                }
                ;
            }
            else {
                break;
            }
            currentPage++;
        }
        catch (error) {
            if (axios_1.default.isAxiosError(error)) {
                if (error.response?.status !== 404) {
                    console.error(error.message);
                    return [];
                }
                else {
                    break;
                }
            }
            else {
                console.error(`An unexpected error occurred: ${error}`);
                return [];
            }
        }
    }
    return collectedCryptoNews;
};
const handler = async (event) => {
    const currencyName = event.name;
    const newsForCurrency = await getCryptoNewsData(currencyName);
    if (newsForCurrency.length > 0) {
        for (let index = 0; index < newsForCurrency.length; index++) {
            const query = `
                PREFIX schema:   <http://schema.org/>
                PREFIX rdf:      <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
                PREFIX elements: <http://purl.org/dc/elements/1.1/>

                INSERT DATA {
                    <${newsForCurrency[index].id}> rdf:type                  schema:NewsArticle       ;
                                                   schema:headline           "${newsForCurrency[index].title}"@en ;
                                                   schema:articleBody        "${newsForCurrency[index].body}"@en ;
                                                   schema:datePublished      "${newsForCurrency[index].publishedAt}"^^<http://schema.org/DateTime> ;
                                                   elements:subject          <${newsForCurrency[index].about[0]}> .

                    ${newsForCurrency[index].source ? `<${newsForCurrency[index].id}> schema:url <${newsForCurrency[index].source}> .` : ""}
                }
            `;
            await sparqlClient.query.update(query);
        }
        console.log("Execution finished without issues.");
    }
};
exports.handler = handler;
