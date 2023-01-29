import React, { useEffect, useState } from "react";
import { Helmet, HelmetProvider } from "react-helmet-async";
import CryptoCard from "../components/CryptoCard"
import "./css/Cryptocurrencies.css";
import { gql, useQuery } from "@apollo/client";
import { Cryptocurrency } from "../models/Cryptocurrency";
import { useNavigate } from "react-router-dom";
import { Alert, Button, CircularProgress, Pagination } from "@mui/material";
import { Bar, BarChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import CreateUpdateCryptocurrencyCardDialog from "../components/CreateUpdateCryptocurrencyCardDialog";
import { GetPaginatedCryptocurrenciesInput } from "../models/GetPaginatedCryptocurrenciesInput";
import { RefetchInput } from "../models/RefetchInput";

const GET_PAGINATED_CRYPTOCURRENCIES_QUERY = gql`
    query GetPaginatedCryptocurrencies($limit: Int = 10, $offset: Int = 0) {
        cryptocurrencies(limit: $limit, offset: $offset) {
            id
            symbol
            description
            blockTime
            totalCoins
        }
        cryptocurrenciesInfo {
            totalCount
        }
    }
`;

const CREATE_CRYPTOCURRENCY = gql`
mutation CreateCryptocurrency($createCryptocurrencyInput: CreateCryptocurrencyInput!) {
    createCryptocurrency(createCryptocurrencyInput: $createCryptocurrencyInput) {
        id
        symbol
        description
        blockReward
        totalCoins
        source
        website
    }
}
`;

const UPDATE_CRYPTOCURRENCY = gql`
mutation UpdateCryptocurrency($updateCryptocurrencyInput: UpdateCryptocurrencyInput!) {
    updateCryptocurrency(updateCryptocurrencyInput: $updateCryptocurrencyInput) {
        id
        symbol
        description
        blockReward
        totalCoins
        source
        website
    }
}
`;

const DELETE_CRYPTOCURRENCY = gql`
mutation RemoveCryptocurrencyById($id: ID!) {
    removeCryptocurrency(id: $id) {
        id
        symbol
    }
}
`;

const CRYPTOS_PER_PAGE = 12;

const getTotalCoinsStats = (cryptocurrencies: Cryptocurrency[]): { name: string, value: number }[] => {
    const mappedCryptocurrencies = cryptocurrencies.map(cryptocurrency => {
        return {
            name: cryptocurrency.symbol,
            value: cryptocurrency.totalCoins ? Number.parseFloat(cryptocurrency.totalCoins) : -1,
        };
    });

    return mappedCryptocurrencies.filter(element => element.value !== -1);
}

const getBlockTimeStats = (cryptocurrencies: Cryptocurrency[]): { name: string, value: number }[] => {
    const mappedCryptocurrencies = cryptocurrencies.map(cryptocurrency => {
        return {
            name: cryptocurrency.symbol,
            value: cryptocurrency.blockTime ? cryptocurrency.blockTime : -1,
        };
    });

    return mappedCryptocurrencies.filter(element => element.value !== -1);
}

const getBarChart = (data: { name: string, value: number }[]): any => {
    return (<ResponsiveContainer width="90%" height={500} >
        <BarChart
            width={500}
            height={300}
            data={data}
            margin={{
                top: 40,
                right: 30,
                left: 30,
                bottom: 40,
            }}
        >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip
                contentStyle={{
                    color: "black",
                }}
                itemStyle={{
                    color: "black",
                }}
            />
            <Legend />
            <Bar
                dataKey="value"
                fill="white"
            />
        </BarChart>
    </ResponsiveContainer>);
}

export default function Cryptocurrencies() {
    const title = "Cryptocurrencies";
    const [currentPage, setCurrentPage] = useState(1);
    const [totalNumberOfCryptocurrencies, setTotalNumberOfCryptocurrencies] = useState(Number);

    const navigate = useNavigate();

    const getPaginatedCryptocurrenciesInput: GetPaginatedCryptocurrenciesInput = {
        limit: CRYPTOS_PER_PAGE,
        offset: (currentPage - 1) * CRYPTOS_PER_PAGE
    }

    const { data, loading, error } = useQuery(GET_PAGINATED_CRYPTOCURRENCIES_QUERY, {
        variables: getPaginatedCryptocurrenciesInput,
        context: { clientName: "cryptocurrenciesGraphqlEndpoint" }
    });

    const refetchInput: RefetchInput<GetPaginatedCryptocurrenciesInput> = {
        context: "cryptocurrenciesGraphqlEndpoint",
        query: GET_PAGINATED_CRYPTOCURRENCIES_QUERY,
        variables: getPaginatedCryptocurrenciesInput
    }

    const [cryptocurrencies, setCryptocurrencies] = useState<Cryptocurrency[]>([]);
    const [totalCoinsStats, setTotalCoinsStats] = useState<{ name: string, value: number }[]>([]);
    const [blockTimeStats, setBlockTimeStats] = useState<{ name: string, value: number }[]>([]);

    useEffect(() => {
        if (data) {
            setCryptocurrencies(data.cryptocurrencies);
            setTotalNumberOfCryptocurrencies(Math.ceil(data.cryptocurrenciesInfo.totalCount / CRYPTOS_PER_PAGE));
            setTotalCoinsStats(getTotalCoinsStats(data.cryptocurrencies));
            setBlockTimeStats(getBlockTimeStats(data.cryptocurrencies));
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
                        {cryptocurrencies ?
                            cryptocurrencies.map((cryptocurrency: Cryptocurrency, index: number) => (
                                <CryptoCard cryptocurrency={cryptocurrency}
                                    queryUpdate={UPDATE_CRYPTOCURRENCY}
                                    queryDelete={DELETE_CRYPTOCURRENCY}
                                    refetchInput={refetchInput} key={index} />))
                            : null
                        }
                    </div>

                    <CreateUpdateCryptocurrencyCardDialog
                        operationType="create" dialogQuery={CREATE_CRYPTOCURRENCY}
                        refetchInput={refetchInput}
                    />

                    <Pagination className="pagination"
                        count={totalNumberOfCryptocurrencies}
                        color="primary"
                        size="large"
                        page={currentPage}
                        variant="outlined"
                        onChange={(event, value) => setCurrentPage(value)} />
                    {totalCoinsStats.length > 0 &&
                        <>
                            <h2>Total coins</h2>
                            {getBarChart(totalCoinsStats)}
                        </>}
                    {blockTimeStats.length > 0 &&
                        <>
                            <h2>Block time</h2>
                            {getBarChart(blockTimeStats)}
                        </>}
                </div>
            </div>
        </HelmetProvider>
    );
}