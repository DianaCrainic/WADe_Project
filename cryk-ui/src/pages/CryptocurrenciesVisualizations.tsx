import React, { useEffect, useState } from "react";
import { gql, useQuery } from "@apollo/client";
import { HelmetProvider, Helmet } from "react-helmet-async";
import { Cryptocurrency } from "../models/Cryptocurrency";
import CircularProgress from "@mui/material/CircularProgress";
import Alert from "@mui/material/Alert";
import { PieChart, Pie, Tooltip } from "recharts";

const MAX_INT = Math.pow(2, 31) - 1;
const GET_PAGINATED_CRYPTOCURRENCIES_QUERY = gql`
    query GetPaginatedCryptocurrencies($limit: Int = 10, $offset: Int = 0) {
        cryptocurrencies(limit: $limit, offset: $offset) {
            id
            symbol
            protectionScheme {
                description
            }
        }
    }
`;

export default function CryptocurrenciesVisualizations() {
    const title = "Visualizations";

    // TODO: implement a caching mechanism for this query
    const { data, loading, error } = useQuery(GET_PAGINATED_CRYPTOCURRENCIES_QUERY, {
        variables: {
            limit: MAX_INT,
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
                        <h1>Visualizations</h1>
                    </div>
                    <p>TODO: insert visualizations here</p>
                </div>
            </div>
        </HelmetProvider>
    );
}