import React, { useState, useEffect } from "react";
import { Helmet, HelmetProvider } from "react-helmet-async";
import CryptoCard from "../components/CryptoCard"
import "./css/Cryptocurrencies.css";
import { gql } from "apollo-boost";
import { useQuery } from "react-query";


async function fetchCryptos() {
    const response = await fetch('http://localhost:3000/graphql', {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query: 'query GetPaginatedCryptocurrencies($limit: Int = 10, $offset: Int = 0) {cryptocurrencies(limit: $limit, offset: $offset) { id symbol description blockReward blockTime totalCoins source website }}' })
    });
    return response.json();
}

export default function Cryptocurrencies() {
    const title = "Cryptocurrencies";

    const [cryptos, setCryptos] = useState([]);
    const { data, status } = useQuery<any, Error>('cryptos', fetchCryptos);
    let cryptoData = data;
    let cryptosObject = cryptoData?.data?.cryptocurrencies;

    if (status === 'loading') {
        return (
            <div>
                <p>Loading</p>
            </div>
        )
    }

    if (status === 'error') {
        return (
            <div>
                <p>There was an error</p>
            </div>
        )
    }


    return (
        <HelmetProvider>
            <div>
                <Helmet>
                    <title>{title}</title>
                </Helmet>
                <div className="page-container">
                    <div className="title">
                        <h1>Cryptocurrency Knowledge Manager</h1>
                    </div>
                    <div className="cards-container">
                        {Object.values(cryptosObject).map((crypto, index) => (
                            <CryptoCard cryptoData={{ crypto }} key={index} />
                        ))}
                    </div>
                </div>
            </div>
        </HelmetProvider>
    );
}