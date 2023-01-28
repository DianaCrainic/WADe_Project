import "./index.css";
import React from "react";
import ReactDOM from "react-dom";
import App from "./App";
import { ApolloClient, ApolloLink, ApolloProvider, HttpLink, InMemoryCache } from "@apollo/client";

const cryptocurrenciesGraphqlEndpoint = new HttpLink({
  uri: "http://localhost:3000/graphql"
})

const newsGraphqlEndpoint = new HttpLink ({
  uri: "http://localhost:4000/graphql"
})

const graphqlClient = new ApolloClient({
  link: ApolloLink.split(
    operation => operation.getContext().clientName === "newsGraphqlEndpoint",
    newsGraphqlEndpoint, //if above 
    cryptocurrenciesGraphqlEndpoint
  ),
  cache: new InMemoryCache()
});

ReactDOM.render(
  <React.StrictMode>
    <ApolloProvider client={graphqlClient}>
      <App />
    </ApolloProvider>
  </React.StrictMode>,
  document.getElementById("root")
);
