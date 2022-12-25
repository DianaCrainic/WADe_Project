import React, { useState, useEffect } from "react";
import { Helmet } from "react-helmet";
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
        <>
            <Helmet>
                <title>{title}</title>
            </Helmet>
            <div className="page-container">
                <div className="title">
                    <h1>Cryptocurrencies</h1>
                </div>
                <div className="cards-container">
                    {cryptos.map((crypto, index) => (
                        <CryptoCard cryptoData={{ crypto }} key={index} />

                    ))}
                </div>
            </div>
        </>
    );
}