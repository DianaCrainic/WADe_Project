import React, { useState, useEffect } from "react";
import { Helmet, HelmetProvider } from "react-helmet-async";
import NewsCard from "../components/NewsCard";
import "./css/CryptoInformation.css";
import { useParams } from "react-router-dom";
import { gql, useQuery } from "@apollo/client";
import { Cryptocurrency } from "../models/Cryptocurrency";
import { News } from "../models/News";
import CircularProgress from "@mui/material/CircularProgress";
import Alert from "@mui/material/Alert";

const GET_CRYPTOCURRENCY_BY_ID_QUERY = gql`
    query GetSomeDetailsAboutCryptocurrency($id: ID!) {
        cryptocurrency(id: $id) {
            symbol
            description
            source
            totalCoins
            website
            blockReward
            distributionScheme {
                description
            }
        }
    }
`;

export default function CryptoInformation(props: any) {
    const title = "Cryptocurrency information";

    const { id } = useParams<string>();

    const { data, loading, error } = useQuery(GET_CRYPTOCURRENCY_BY_ID_QUERY, {
        variables: {
            id: `http://purl.org/net/bel-epa/doacc#${id}`
        }
    });

    const [cryptocurrency, setCryptocurrency] = useState<Cryptocurrency>();
    const [news, setNews] = useState<News[]>([]);

    useEffect(() => {
        if (data) {
            setCryptocurrency(data.cryptocurrency);
        }
    }, [loading, data]);

    if (loading) {
        return (
            <div className="page-container">
                <CircularProgress color="inherit" />
            </div>
        )
    }

    if (error) {
        return (
            <div className="page-container">
                <Alert severity="error">{error.message}</Alert>
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
                        <h1>{cryptocurrency?.symbol}</h1>
                    </div>
                    <p className="crypto-description">
                        {cryptocurrency?.description}
                    </p>
                    {cryptocurrency?.website &&
                        <p className="crypto-website">
                            Official website: <a href={`${cryptocurrency?.website}`}>{`${cryptocurrency?.website}`}</a>
                        </p>}
                    {cryptocurrency?.blockReward && <p className="crypto-reward">
                        Reward: {`${cryptocurrency?.blockReward}`}
                    </p>}

                    <h2 className="news-title">News</h2>
                    <div className="news-cards-container">
                        {news.map((oneNews: News, index: number) => (
                            <NewsCard news={oneNews} key={index} />
                        ))}
                    </div>

                </div>
            </div>
        </HelmetProvider>
    )
}
