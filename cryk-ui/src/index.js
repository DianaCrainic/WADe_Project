import "./index.css";
import React from "react";
import ReactDOM from "react-dom";
import App from "./App";
import { ApolloClient, ApolloProvider, InMemoryCache } from "@apollo/client";

const graphqlClient = new ApolloClient({
  uri: "http://localhost:3000/graphql",
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
