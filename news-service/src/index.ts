import express, { Application } from "express";
import { graphqlHTTP } from "express-graphql";
import envs from "./envs";
import schema from "./graphql/schema";
import mutations from "./graphql/mutations";
import queries from "./graphql/queries";
import cors from "cors";

const app: Application = express();

app.use(express.json());
app.use(cors({
    origin: '*'
}));
app.use(envs.graphqlPath, graphqlHTTP({
    schema: schema,
    rootValue: {
        ...queries, ...mutations,
    },
    graphiql: true
}));

app.listen(envs.port, () => console.log(`Express GraphQL server now running on port ${envs.port}`));