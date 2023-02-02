import React, { useEffect, useState } from "react";
import { gql, useQuery } from "@apollo/client";
import { HelmetProvider, Helmet } from "react-helmet-async";
import { Cryptocurrency } from "../models/Cryptocurrency";
import CircularProgress from "@mui/material/CircularProgress";
import Alert from "@mui/material/Alert";
import { PieChart, Pie, Tooltip, CartesianGrid, Legend, ResponsiveContainer, XAxis, YAxis, LineChart, Line, Cell } from "recharts";
import "./css/CryptocurrenciesVisualizations.css";

const COLORS = ["#0088FE", "#00C49F", "#FF8042"];
const MAX_INT = Math.pow(2, 31) - 1;
const GET_PAGINATED_CRYPTOCURRENCIES_QUERY = gql`
    query GetPaginatedCryptocurrencies($limit: Int = 10, $offset: Int = 0) {
        cryptocurrencies(limit: $limit, offset: $offset) {
            id
            symbol
            dateFounded
            protectionScheme {
                description
            }
        }
    }
`;

const getProtectionSchemeStatsForCryptocurrencies = (cryptocurrencies: Cryptocurrency[]): { name: string, value: number }[] => {
    const groupedCryptocurrenciesByProtectionScheme = cryptocurrencies.reduce((previousValue, currentValue: Cryptocurrency) => {
        const currentProtectionSchemeDescription = currentValue.protectionScheme?.description;
        if (currentProtectionSchemeDescription) {
            previousValue[currentProtectionSchemeDescription] = previousValue[currentProtectionSchemeDescription] || [];
            previousValue[currentProtectionSchemeDescription].push(currentValue);
        }
        return previousValue;
    }, Object.create(null));
    const countedCryptocurrenciesByProtectionScheme = Object.keys(groupedCryptocurrenciesByProtectionScheme).map((key: string) => {
        return { name: key, value: groupedCryptocurrenciesByProtectionScheme[key].length };
    });
    return countedCryptocurrenciesByProtectionScheme.filter(element => element.value > 10);
}

const getDateFoundedStatsForCryptocurrencies = (cryptocurrencies: Cryptocurrency[]): { name: string, value: number }[] => {
    const groupedCryptocurrenciesByDateFounded = cryptocurrencies.reduce((previousValue, currentValue: Cryptocurrency) => {
        if (currentValue.dateFounded) {
            const dateFounded = currentValue.dateFounded.substring(0, 7); // YYYY-MM
            previousValue[dateFounded] = previousValue[dateFounded] || [];
            previousValue[dateFounded].push(currentValue);
        }
        return previousValue;
    }, Object.create(null));

    return Object.keys(groupedCryptocurrenciesByDateFounded).sort().map((key: string) => {
        return { name: key, value: groupedCryptocurrenciesByDateFounded[key].length };
    });
}

export default function CryptocurrenciesVisualizations() {
    const title = "Visualizations";

    // TODO: implement a caching mechanism for this query
    const { data, loading, error } = useQuery(GET_PAGINATED_CRYPTOCURRENCIES_QUERY, {
        variables: {
            limit: MAX_INT,
        },
        context: { clientName: "cryptocurrenciesGraphqlEndpoint" }
    });

    const [protectionSchemeStats, setProtectionSchemeStats] = useState<{ name: string, value: number }[]>();
    const [dateFoundedStats, setDateFoundedStats] = useState<{ name: string, value: number }[]>([]);

    const setCryptocurrenciesStats = (cryptocurrencies: Cryptocurrency[]) => {
        setProtectionSchemeStats(getProtectionSchemeStatsForCryptocurrencies(cryptocurrencies));
        setDateFoundedStats(getDateFoundedStatsForCryptocurrencies(cryptocurrencies));
    };

    useEffect(() => {
        if (data) {
            setCryptocurrenciesStats(data.cryptocurrencies);
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
            <>
                <Helmet>
                    <title>{title}</title>
                </Helmet>
                <div className="page-container">
                    <div className="title">
                        <h1>Visualizations</h1>
                    </div>
                    <h2>Number of cryptocurrencies by protection scheme</h2>
                    <PieChart
                        width={2000}
                        height={300}
                        margin={{
                            top: 40,
                            bottom: 40,
                        }}
                    >
                        <Pie
                            dataKey="value"
                            isAnimationActive={true}
                            data={protectionSchemeStats}
                            outerRadius={100}
                            fill="#9E9E9E"
                            label
                        >
                            {protectionSchemeStats?.map((_entry: { name: string, value: number }, index: number) => (
                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                        </Pie>
                        <Tooltip />
                    </PieChart>
                    <h2>Number of cryptocurrencies by founded date</h2>
                    <ResponsiveContainer width="90%" height={500}>
                        <LineChart
                            width={500}
                            height={300}
                            data={dateFoundedStats}
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
                            <Line
                                dataKey="value"
                                stroke="white"
                                type="monotone"
                                activeDot={{ r: 8 }}
                            />
                        </LineChart>
                    </ResponsiveContainer>
                </div>
            </>
        </HelmetProvider>
    );
}