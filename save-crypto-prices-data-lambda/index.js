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
const COIN_GECKO_API_URL = "https://api.coingecko.com/api/v3/";
const getCryptocurrencyMarketData = async (name, startDate, endDate) => {
    try {
        const range = `range?vs_currency=usd&from=${startDate}&to=${endDate}`;
        const { data, status } = await axios_1.default.get(`${COIN_GECKO_API_URL}/coins/${name}/market_chart/${range}`, {
            headers: {
                Accept: "application/json",
            },
        });
        console.log(`Response status is: ${status}`);
        return data;
    }
    catch (error) {
        if (axios_1.default.isAxiosError(error)) {
            console.error(error.message);
            return error.message;
        }
        else {
            console.error(error);
            return "An unexpected error occurred";
        }
    }
};
const handler = async (event) => {
    const name = event.name;
    const startDate = new Date(new Date().setFullYear(new Date().getFullYear() - 5)).getTime() / 1000; // 5 years ago
    const endDate = new Date().getTime() / 1000; // now
    const cryptoMarketData = await getCryptocurrencyMarketData(name, startDate, endDate);
    const cryptocurrencyId = event.cryptocurrencyId;
    if (cryptoMarketData && cryptoMarketData.prices && cryptoMarketData.prices.length > 0) {
        for (let i = 0; i < cryptoMarketData.prices.length; ++i) {
            const priceDataId = `http://purl.org/net/bel-epa/doacc#${crypto_1.default.randomUUID()}`;
            const query = `
                PREFIX doacc:  <http://purl.org/net/bel-epa/doacc#>
                PREFIX schema: <http://schema.org/>
                PREFIX rdf:    <http://www.w3.org/1999/02/22-rdf-syntax-ns#>

                INSERT DATA {
                    <${cryptocurrencyId}> doacc:hadPrice    <${priceDataId}>                                                                .
                    <${priceDataId}>      rdf:type          doacc:PriceData                                                                 ;
                                          schema:currency   "USD"^^<http://www.w3.org/2001/XMLSchema#string>                                ;
                                          schema:datePosted "${cryptoMarketData.prices[i][0]}"^^<http://www.w3.org/2001/XMLSchema#integer>  ;
                                          schema:value      "${cryptoMarketData.prices[i][1]}"^^<http://www.w3.org/2001/XMLSchema#numeric>  .
                }
            `;
            await sparqlClient.query.update(query);
        }
    }
};
exports.handler = handler;
