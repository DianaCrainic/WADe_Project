import React, { useState, useEffect } from "react";
import { Helmet, HelmetProvider } from "react-helmet-async";
import { useParams } from "react-router-dom";
import NewsCard from "../components/NewsCard";
import "./css/CryptoInformation.css";

export default function CryptoInformation(props: any) {
    const title = "Cryptocurrency information";
    const [news, setNews] = useState([]);
    const id = useParams();
    console.log("id ", id);

    const mockCryptoName = "Bitcoin";
    const mockCryptoDescription = "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer ac nisl sit amet purus iaculis ornare. Nam tristique iaculis nisi, id semper metus egestas quis."
    const mockWebsite = "https://bitcoin.org/en/";
    const mockCryptoReward = 100;

    useEffect(() => {
        (async () => {
            let newsData;
            try {
                const response = await fetch('https://randomuser.me/api/?results=5');
                newsData = await response.json();
            } catch (error) {
                console.log(error);
                newsData = [];
            }

            setNews(newsData.results);
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
                        <h1>{mockCryptoName}</h1>
                    </div>
                    <p className="crypto-description">
                        {mockCryptoDescription}
                    </p>
                    <p className="crypto-website">
                        Official website: <a href={`${mockWebsite}`}>{`${mockWebsite}`}</a>
                    </p>
                    <p className="crypto-reward">
                        Reward: {`${mockCryptoReward}`}
                    </p>

                    <h2 className="news-title">News</h2>
                    <div className="news-cards-container">
                        {news.map((oneNews, index) => (
                            <NewsCard cryptoData={{ oneNews }} key={index} />

                        ))}
                    </div>

                </div>
            </div>
        </HelmetProvider>

    )
}