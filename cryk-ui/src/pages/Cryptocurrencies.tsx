import React, { useState, useEffect } from "react";
import { Helmet, HelmetProvider } from "react-helmet-async";
import CryptoCard from "../components/CryptoCard"
import "./css/Cryptocurrencies.css";

export default function Cryptocurrencies() {
    const title = "Cryptocurrencies";

    const [cryptos, setCryptos] = useState([]);

    useEffect(() => {
        (async () => {
            let cryptoData;
            try {
                const response = await fetch('https://randomuser.me/api/?results=10');
                cryptoData = await response.json();
            } catch (error) {
                console.log(error);
                cryptoData = [];
            }

            setCryptos(cryptoData.results);
        })();
    }, []);



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
                        {cryptos.map((crypto, index) => (
                            <CryptoCard cryptoData={{ crypto }} key={index} />

                        ))}
                    </div>
                </div>
            </div>
        </HelmetProvider>
    );
}