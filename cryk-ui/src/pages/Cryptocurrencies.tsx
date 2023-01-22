import React, { useEffect, useState } from "react";
import { Helmet, HelmetProvider } from "react-helmet-async";
import CryptoCard from "../components/CryptoCard"
import "./css/Cryptocurrencies.css";
import { gql, useQuery } from "@apollo/client";
import { Cryptocurrency } from "../models/Cryptocurrency";
import { useNavigate } from "react-router-dom";
import { Alert, Button, CircularProgress, Pagination } from "@mui/material";

const GET_PAGINATED_CRYPTOCURRENCIES_QUERY = gql`
    query GetPaginatedCryptocurrencies($limit: Int = 10, $offset: Int = 0) {
        cryptocurrencies(limit: $limit, offset: $offset) {
            id
            symbol
            description
        }
        cryptocurrenciesInfo {
            totalCount
        }
    }
`;

const CRYPTOS_PER_PAGE = 10;
const CURRENT_PAGE = 1;

export default function Cryptocurrencies() {
    const title = "Cryptocurrencies";
    const [currentPage, setCurrentPage] = useState(CURRENT_PAGE);
    const [totalNumberOfCryptocurrencies, setTotalNumberOfCryptocurrencies] = useState(Number);


    const navigate = useNavigate();

    const { data, loading, error } = useQuery(GET_PAGINATED_CRYPTOCURRENCIES_QUERY, {
        variables: {
            limit: CRYPTOS_PER_PAGE,
            offset: (currentPage - 1) * CRYPTOS_PER_PAGE,
        }
    });

    const [cryptocurrencies, setCryptocurrencies] = useState<Cryptocurrency[]>([]);

    useEffect(() => {
        if (data) {
            setCryptocurrencies(data.cryptocurrencies);
            setTotalNumberOfCryptocurrencies(Math.ceil(data.cryptocurrenciesInfo.totalCount / CRYPTOS_PER_PAGE));
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
                    <Pagination className="pagination"
                        count={totalNumberOfCryptocurrencies}
                        color="primary"
                        size="large"
                        page={currentPage}
                        variant="outlined"
                        onChange={(event, value) => setCurrentPage(value)} />
                </div>
            </div>
        </HelmetProvider>
    );
}