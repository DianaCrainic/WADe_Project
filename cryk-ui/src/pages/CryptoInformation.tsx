import React, { useState, useEffect } from "react";
import { Helmet, HelmetProvider } from "react-helmet-async";
import NewsCard from "../components/NewsCard";
import CreateUpdateNewsCardDialog from "../components/CreateUpdateNewsCardDialog";
import "./css/CryptoInformation.css";
import { useParams } from "react-router-dom";
import { gql, useQuery } from "@apollo/client";
import { Cryptocurrency } from "../models/Cryptocurrency";
import { News } from "../models/News";
import CircularProgress from "@mui/material/CircularProgress";
import { Alert, Button, Pagination } from "@mui/material";
import { GetPaginatedCryptoNewsInput } from "../models/GetPaginatedCryptoNewsInput";
import { RefetchInput } from "../models/RefetchInput";
import { UNKNOWN_MESSAGE } from "../constants/cryptocurrencies-messages";
import UpdateCryptocurrencyCardDialog from "../components/UpdateCryptocurrencyCardDialog";
import { CryptocurrencyInput } from "../models/CryptocurrencyInput";
import DCAChart from "../components/DCAChart";
import { PriceData } from "../models/PriceData";

const GET_CRYPTOCURRENCY_BY_ID_QUERY = gql`
    query GetSomeDetailsAboutCryptocurrency($id: ID!) {
        cryptocurrency(id: $id) {
            id
            symbol
            description
            blockReward
            blockTime
            totalCoins
            dateFounded
            source
            website
            priceHistory {
                timestamp
                value
            }
            distributionScheme {
                description
            }
            protectionScheme {
                description
            }
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

const NEWS_PER_PAGE = 5;

const GET_PAGINATED_CRYPTONEWS_FOR_CRYPTOCURRENCY = gql`
    query GetCryptoNewsForCryptocurrency($cryptocurrencyId: ID!, $limit: Int = 10, $offset: Int = 0) {
        cryptoNews(cryptocurrencyId: $cryptocurrencyId, limit: $limit, offset: $offset) {
            id
            title
            body
            publishedAt
            source
        }
        cryptoNewsInfo(cryptocurrencyId: $cryptocurrencyId) {
            totalCount
        }
    }
`;

const CREATE_CRYPTONEWS_FOR_CRYPTOCURRENCY = gql`
    mutation CreateCryptoNews($createCryptoNewsInput: CreateCryptoNewsInput!) {
        createCryptoNews(createCryptoNewsInput: $createCryptoNewsInput) {
            id
            title
            body
            publishedAt
            source
        }
    }
`;

const UPDATE_CRYPTONEWS_FOR_CRYPTOCURRENCY = gql`
    mutation UpdateCryptoNews($updateCryptoNewsInput: UpdateCryptoNewsInput!) {
        updateCryptoNews(updateCryptoNewsInput: $updateCryptoNewsInput) {
            id
            title
            body
            publishedAt
            source
        }
    }
`;

const DELETE_CRYPTONEWS_FOR_CRYPTOCURRENCY = gql`
    mutation DeleteCryptoNews($id: ID!) {
        removeCryptoNews(id: $id) {
            id
        }
    }
`;

const convertCryptocurrencyInformationToJsonLd = (cryptocurrency: Cryptocurrency | undefined): object => {
    return {
        "@context": {
            symbol: "http://purl.org/net/bel-epa/doacc#symbol",
            description: "http://purl.org/dc/elements/1.1/description",
            blockReward: "http://purl.org/net/bel-epa/doacc#block-reward",
            blockTime: "http://purl.org/net/bel-epa/doacc#block-time",
            totalCoins: "http://purl.org/net/bel-epa/doacc#total-coins",
            dateFounded: "http://purl.org/net/bel-epa/doacc#date-founded",
            source: "http://purl.org/net/bel-epa/doacc#source",
            website: "http://purl.org/net/bel-epa/doacc#website",
            distributionScheme: {
                "@type": "http://purl.org/net/bel-epa/doacc#DistributionScheme",
            },
            protectionScheme: {
                "@type": "http://purl.org/net/bel-epa/doacc#ProtectionScheme",
            },
            priceHistory: {
                "@type": "http://purl.org/net/bel-epa/doacc#PriceData",
            }
        },
        "@type": "http://purl.org/net/bel-epa/doacc#Cryptocurrency",
        "@id": cryptocurrency?.id,
        symbol: cryptocurrency?.symbol,
        description: cryptocurrency?.description,
        blockReward: cryptocurrency?.blockReward,
        blockTime: cryptocurrency?.blockTime,
        totalCoins: cryptocurrency?.totalCoins,
        dateFounded: cryptocurrency?.dateFounded,
        source: cryptocurrency?.source,
        website: cryptocurrency?.website,
        distributionScheme: {
            "@type": "http://purl.org/net/bel-epa/doacc#DistributionScheme",
            description: cryptocurrency?.distributionScheme?.description,
        },
        protectionScheme: {
            "@type": "http://purl.org/net/bel-epa/doacc#ProtectionScheme",
            description: cryptocurrency?.protectionScheme?.description,
        },
        priceHistory: cryptocurrency?.priceHistory?.map((priceData: PriceData) => {
            return {
                "@type": "http://purl.org/net/bel-epa/doacc#PriceData",
                "timestamp": priceData.timestamp,
                "value": priceData.value,
                "currency": priceData.currency,
            }
        }),
    };
}

const downloadJsonLdFile = (filename: string, jsonLdContent: object): void => {
    const fileData = JSON.stringify(jsonLdContent, null, 2);
    const blob = new Blob([fileData], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.download = filename;
    link.href = url;
    link.click();
}

export default function CryptoInformation(props: any) {
    const title = "Cryptocurrency information";
    const [currentPage, setCurrentPage] = useState(1);
    const [totalNumberOfCryptoNews, setTotalNumberOfCryptoNews] = useState(Number);

    const { id } = useParams<string>();
    const cryptocurrencyId = `http://purl.org/net/bel-epa/doacc#${id}`;

    const { data: cryptocurrencyData, loading: cryptocurrencyLoading, error: cryptocurrencyError } = useQuery(GET_CRYPTOCURRENCY_BY_ID_QUERY, {
        variables: {
            id: `http://purl.org/net/bel-epa/doacc#${id}`
        },
        context: { clientName: "cryptocurrenciesGraphqlEndpoint" }
    });

    const getPaginatedNewsInput: GetPaginatedCryptoNewsInput = {
        cryptocurrencyId: cryptocurrencyId,
        limit: NEWS_PER_PAGE,
        offset: (currentPage - 1) * NEWS_PER_PAGE
    }

    const getPaginatedNewsRefetchInput: RefetchInput<GetPaginatedCryptoNewsInput> = {
        context: "newsGraphqlEndpoint",
        query: GET_PAGINATED_CRYPTONEWS_FOR_CRYPTOCURRENCY,
        variables: getPaginatedNewsInput
    }

    const { data: newsData, loading: newsLoading, error: newsError } = useQuery(GET_PAGINATED_CRYPTONEWS_FOR_CRYPTOCURRENCY, {
        variables: getPaginatedNewsInput,
        context: { clientName: "newsGraphqlEndpoint" }
    });

    const getCryptoByIdRefetchInput: RefetchInput<CryptocurrencyInput> = {
        context: "cryptocurrenciesGraphqlEndpoint",
        query: GET_CRYPTOCURRENCY_BY_ID_QUERY,
        variables: {
            id: cryptocurrencyId
        }
    };

    const [cryptocurrency, setCryptocurrency] = useState<Cryptocurrency>();
    const [news, setNews] = useState<News[]>([]);

    useEffect(() => {
        if (cryptocurrencyData) {
            setCryptocurrency(cryptocurrencyData.cryptocurrency);
        }
    }, [cryptocurrencyLoading, cryptocurrencyData]);
    useEffect(() => {
        if (newsData) {
            setNews(newsData.cryptoNews);
            setTotalNumberOfCryptoNews(Math.ceil(newsData.cryptoNewsInfo.totalCount / NEWS_PER_PAGE));
        }
    }, [newsLoading, newsData]);

    if (cryptocurrencyLoading) {
        return (
            <div className="page-container">
                <CircularProgress color="inherit" />
            </div>
        )
    }

    if (cryptocurrencyError) {
        return (
            <div className="page-container">
                <Alert severity="error">{cryptocurrencyError.message}</Alert>
            </div>
        )
    }

    if (newsLoading) {
        return (
            <div className="page-container">
                <CircularProgress color="inherit" />
            </div>
        )
    }

    if (newsError) {
        return (
            <div className="page-container">
                <Alert severity="error">{newsError.message}</Alert>
            </div>
        )
    }

    const symbol = cryptocurrency?.symbol;
    const description = cryptocurrency?.description;
    const website = cryptocurrency?.website;
    const source = cryptocurrency?.source;
    const dateFounded = cryptocurrency?.dateFounded;
    const reward = Number(cryptocurrency?.blockReward) < 0 ? -1 : Number(cryptocurrency?.blockReward);
    const coins = Number(cryptocurrency?.totalCoins) < 0 ? -1 : Number(cryptocurrency?.totalCoins);
    const priceHistory = cryptocurrency?.priceHistory || [];

    return (
        <HelmetProvider>
            <>
                <Helmet>
                    <title>{title}</title>
                </Helmet>
                <div className="page-container" vocab="http://purl.org/net/bel-epa/doacc#" typeof="Cryptocurrency" resource={cryptocurrencyId}>
                    <div className="title">
                        <h1 property="http://purl.org/net/bel-epa/doacc#symbol">{symbol}</h1>
                    </div>
                    <p className="crypto-description"
                        property="http://purl.org/dc/elements/1.1/description">
                        {description}
                    </p>
                    <p className="crypto-website">
                        <span>Official website: </span>
                        {website ? <a href={website} property="http://purl.org/net/bel-epa/doacc#website">{website}</a> : UNKNOWN_MESSAGE}
                    </p>
                    <p className="crypto-source">
                        <span>Source: </span>
                        {source ? <a href={source} property="http://purl.org/net/bel-epa/doacc#source">{source}</a> : UNKNOWN_MESSAGE}
                    </p>
                    <p className="crypto-date-founded">
                        <span>Date founded: </span>
                        {dateFounded ? <span property="http://www.w3.org/2001/XMLSchema#date">{dateFounded}</span> : UNKNOWN_MESSAGE}
                    </p>
                    <p className="crypto-reward">
                        <span>Reward: </span>
                        {reward >= 0 ? <span property="http://purl.org/net/bel-epa/doacc#block-reward">{reward}</span> : UNKNOWN_MESSAGE}
                    </p>
                    <p className="crypto-coins">
                        <span>Total Coins: </span>
                        {coins >= 0 ? <span property="http://purl.org/net/bel-epa/doacc#total-coins">{coins}</span> : UNKNOWN_MESSAGE}
                    </p>
                    <UpdateCryptocurrencyCardDialog
                        queryUpdate={UPDATE_CRYPTOCURRENCY}
                        refetchInput={getCryptoByIdRefetchInput}
                        cryptocurrency={cryptocurrency}
                    />
                    <Button
                        className="export-button"
                        variant="outlined"
                        size="large"
                        onClick={() => { downloadJsonLdFile(`${cryptocurrency?.symbol}-ld.json`, convertCryptocurrencyInformationToJsonLd(cryptocurrency)) }}
                    >
                        Export as JSON-LD
                    </Button>
                    {priceHistory.length > 0 && <DCAChart priceHistory={priceHistory} cryptocurrencySymbol={symbol} />}
                    <h2 className="news-title">News</h2>
                    <div className="news-cards-container">
                        {news && news.length !== 0 ?
                            (news.map((oneNews: News, index: number) => (
                                <NewsCard cardId={`news-card${index}`} news={oneNews} cryptocurrencyId={cryptocurrencyId}
                                    queryUpdate={UPDATE_CRYPTONEWS_FOR_CRYPTOCURRENCY}
                                    queryDelete={DELETE_CRYPTONEWS_FOR_CRYPTOCURRENCY}
                                    refetchInput={getPaginatedNewsRefetchInput} key={index} />)))
                            : <h2 className="no-news">There are no news for this cryptocurrency.</h2>
                        }
                    </div>
                    {news && news.length !== 0 && 
                    <Pagination className="pagination"
                        count={totalNumberOfCryptoNews}
                        color="primary"
                        size="large"
                        page={currentPage}
                        variant="outlined"
                        onChange={(_event, value) => setCurrentPage(value)} />}                 
                    <CreateUpdateNewsCardDialog
                        operationType="create" dialogQuery={CREATE_CRYPTONEWS_FOR_CRYPTOCURRENCY}
                        refetchInput={getPaginatedNewsRefetchInput} cryptocurrencyId={cryptocurrencyId}
                    />
                </div>
            </>
        </HelmetProvider>
    )
}