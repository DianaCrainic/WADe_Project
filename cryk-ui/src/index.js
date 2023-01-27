import "./index.css";
import React from "react";
import ReactDOM from "react-dom";
import App from "./App";
import { ApolloClient, ApolloLink, ApolloProvider, HttpLink, InMemoryCache } from "@apollo/client";

const endpoint1 = new HttpLink({
  uri: "http://localhost:3000/graphql"
})

const endpoint2 = new HttpLink ({
  uri: "http://localhost:4000/graphql"
})

const graphqlClient = new ApolloClient({
  link: ApolloLink.split(
    operation => operation.getContext().clientName === 'endpoint2',
    endpoint2, //if above 
    endpoint1
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
