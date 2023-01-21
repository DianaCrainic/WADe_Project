import React, { useEffect, useState } from "react";
import { Helmet, HelmetProvider } from "react-helmet-async";
import CryptoCard from "../components/CryptoCard"
import "./css/Cryptocurrencies.css";
import { gql, useQuery } from "@apollo/client";
import { Cryptocurrency } from "../models/Cryptocurrency";
import { useNavigate } from "react-router-dom";
import { Alert, Button, CircularProgress } from "@mui/material";

const GET_PAGINATED_CRYPTOCURRENCIES_QUERY = gql`
    query GetPaginatedCryptocurrencies($limit: Int = 10, $offset: Int = 0) {
        cryptocurrencies(limit: $limit, offset: $offset) {
            id
            symbol
            description
        }
    }
`;

export default function Cryptocurrencies() {
    const title = "Cryptocurrencies";

    const navigate = useNavigate();

    const { data, loading, error } = useQuery(GET_PAGINATED_CRYPTOCURRENCIES_QUERY, {
        variables: {
            // TODO: pagination
            // these values are provided for testing purposes
            limit: 10,
            offset: 1,
        }
    });

    const [cryptocurrencies, setCryptocurrencies] = useState<Cryptocurrency[]>([]);

    useEffect(() => {
        if (data) {
            setCryptocurrencies(data.cryptocurrencies);
        }
    }, [loading, data]);

    if (loading) {
        return (
            <div className="page-container">
                <CircularProgress size="large" />
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
                        <h1>Cryptocurrency Knowledge Manager</h1>
                    </div>
                    <div className="buttons-container">
                        <Button
                            className="visualizations-button"
                            variant="outlined"
                            size="large"
                            onClick={() => { navigate(`/cryptos/visualizations`) }}
                        >
                            Visualizations
                        </Button>
                    </div>
                    <div className="cards-container">
                        {cryptocurrencies.map((cryptocurrency: Cryptocurrency, index: number) => (
                            <CryptoCard cryptocurrency={cryptocurrency} key={index} />
                        ))}
                    </div>
                </div>
            </div>
        </HelmetProvider>
    );
}