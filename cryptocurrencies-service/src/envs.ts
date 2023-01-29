import { config } from "dotenv";

config();

export default {
    sparqlEndpoint: process.env.SPARQL_ENDPOINT || "http://localhost:9999/blazegraph/sparql"
};