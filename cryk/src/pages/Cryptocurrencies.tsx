import React, { useEffect } from "react";
import { Helmet } from "react-helmet";
import CryptoCard  from "../components/CryptoCard"

export default function Cryptocurrencies() {
    const title = "Cryptocurrencies";

    useEffect(() => {
        async function init() {
        }
        init();
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
                <p>This is the cryptocurrencies page</p>
                <CryptoCard/>
            </div>
        </>
    );
}