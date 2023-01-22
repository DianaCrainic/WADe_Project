import React, { useEffect, useState } from "react";
import { gql, useQuery } from "@apollo/client";
import { HelmetProvider, Helmet } from "react-helmet-async";
import { Cryptocurrency } from "../models/Cryptocurrency";
import CircularProgress from "@mui/material/CircularProgress";
import Alert from "@mui/material/Alert";
import { PieChart, Pie, Tooltip } from "recharts";
import "./css/CryptocurrenciesVisualizations.css";

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
    const otherCountedCryptocurrenciesByProtectionScheme =
        countedCryptocurrenciesByProtectionScheme.filter(element => element.value <= 10);
    const numberOfOtherCryptocurrenciesByProtectionScheme = otherCountedCryptocurrenciesByProtectionScheme.reduce((accumulator, object) => {
        return accumulator + object.value;
    }, 0);
    const filtertedCountedCryptocurrenciesByProtectionScheme =
        countedCryptocurrenciesByProtectionScheme.filter(element => element.value > 10);
    filtertedCountedCryptocurrenciesByProtectionScheme.splice(1, 0, { name: "Other", value: numberOfOtherCryptocurrenciesByProtectionScheme });
    return filtertedCountedCryptocurrenciesByProtectionScheme;
}

export default function CryptocurrenciesVisualizations() {
    const title = "Visualizations";

    // TODO: implement a caching mechanism for this query
    const { data, loading, error } = useQuery(GET_PAGINATED_CRYPTOCURRENCIES_QUERY, {
        variables: {
            limit: MAX_INT,
        }
    });

    const [cryptocurrencies, _setCryptocurrencies] = useState<Cryptocurrency[]>([]);
    const [protectionSchemeStats, setProtectionSchemeStats] = useState<{ name: string, value: number }[]>();

    const setCryptocurrencies = (cryptocurrencies: Cryptocurrency[]) => {
        _setCryptocurrencies(cryptocurrencies);
        setProtectionSchemeStats(getProtectionSchemeStatsForCryptocurrencies(cryptocurrencies));
    };

    useEffect(() => {
        if (data) {
            setCryptocurrencies(data.cryptocurrencies);
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
                        <h1>Visualizations</h1>
                    </div>
                    <h2>Number of cryptocurrencies by protection scheme</h2>
                    <PieChart width={2000} height={300}>
                        <Pie
                            dataKey="value"
                            isAnimationActive={true}
                            data={protectionSchemeStats}
                            outerRadius={100}
                            fill="#9E9E9E"
                            label
                        />
                        <Tooltip />
                    </PieChart>
                </div>
            </div>
        </HelmetProvider>
    );
}