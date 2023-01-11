import React, { useState } from "react";
import { Helmet, HelmetProvider } from "react-helmet-async";
import NewsCard from "../components/NewsCard";
import "./css/CryptoInformation.css";
import { useParams } from "react-router-dom";
import { useQuery } from "react-query";


async function fetchCryptoById(id: any) {
    console.log("id in fetch: ", id);
    const response = await fetch('http://localhost:3000/graphql', {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query: 'query GetSomeDetailsAboutCryptocurrency($id: ID!) { cryptocurrency(id: $id) {symbol description source totalCoins website distributionScheme { description } }}' })
    });
    return response.json();
}

export default function CryptoInformation(props: any) {
    const title = "Cryptocurrency information";
    const [news, setNews] = useState([]);

    const { id } = useParams();
    console.log("id: ", id);
    const { data, status } = useQuery<any, Error>(['cryptoId', id], () => fetchCryptoById(id));
    console.log("data: ", data?.errors[0].message);
    console.log("data: ", data);



    const mockCryptoName = "Bitcoin";
    const mockCryptoDescription = "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer ac nisl sit amet purus iaculis ornare. Nam tristique iaculis nisi, id semper metus egestas quis."
    const mockWebsite = "https://bitcoin.org/en/";
    const mockCryptoReward = 100;

    // useEffect(() => {
    //     (async () => {
    //         let newsData;
    //         try {
    //             const response = await fetch('https://randomuser.me/api/?results=5');
    //             newsData = await response.json();
    //         } catch (error) {
    //             console.log(error);
    //             newsData = [];
    //         }

    //         setNews(newsData.results);
    //     })();
    // }, []);

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