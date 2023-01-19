import { config } from 'dotenv';

config();

export default {
    port: process.env.PORT || 4000,
    graphqlPath: process.env.GRAPHQL_PATH || '/graphql',
    sparqlEndpoint: process.env.SPARQL_ENDPOINT || "http://localhost:9999/blazegraph/sparql"
}