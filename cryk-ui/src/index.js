import "./index.css";
import React from "react";
import ReactDOM from "react-dom";
import App from "./App";
import { setContext } from "@apollo/client/link/context";
import {
  ApolloClient,
  ApolloProvider,
  InMemoryCache,
  HttpLink,
} from "@apollo/client";
import AppSyncConfig from "./aws-exports";

const authLink = setContext((_, { headers }) => {
  return {
    headers: {
      ...headers,
      "X-Api-Key": AppSyncConfig.aws_appsync_apiKey,
    },
  }
});
const httpLink = new HttpLink({
  uri: AppSyncConfig.aws_appsync_graphqlEndpoint,
});
const graphqlClient = new ApolloClient({
  link: authLink.concat(httpLink),
  cache: new InMemoryCache(),
});

ReactDOM.render(
  <React.StrictMode>
    <ApolloProvider client={graphqlClient}>
      <App />
    </ApolloProvider>
  </React.StrictMode>,
  document.getElementById("root")
);
