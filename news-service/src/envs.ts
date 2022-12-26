import { config } from 'dotenv';

config();

export default {
    port: process.env.PORT || 4000,
    graphqlPath: process.env.GRAPHQL_PATH || '/graphql'
}