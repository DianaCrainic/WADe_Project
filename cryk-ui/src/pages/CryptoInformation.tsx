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
import { Alert, Pagination } from "@mui/material";
import { GetPaginatedCryptoNewsInput } from "../models/GetPaginatedCryptoNewsInput";

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

const NEWS_PER_PAGE = 2;

const GET_PAGINATED_CRYPTONEWS_FOR_CRYPTOCURRENCY = gql`
    query GetCryptoNewsForCryptocurrency($cryptocurrencyId: ID!, $limit: Int = 10, $offset: Int = 0) {
        cryptoNews(cryptocurrencyId: $cryptocurrencyId, limit: $limit, offset: $offset) {
            id
            title
            body
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
        }
    }
`;

const UPDATE_CRYPTONEWS_FOR_CRYPTOCURRENCY = gql`
    mutation UpdateCryptoNews($updateCryptoNewsInput: UpdateCryptoNewsInput!) {
        updateCryptoNews(updateCryptoNewsInput: $updateCryptoNewsInput) {
            id
            title
            body
        }
    }
`;

const DELETE_CRYPTONEWS_FOR_CRYPTOCURRENCY = gql`
    mutation DeleteCryptoNews($id: ID!) {
        removeCryptoNews(id: $id) {
            id
            title
        }
    }
`;

export default function CryptoInformation(props: any) {
    const title = "Cryptocurrency information";
    const [currentPage, setCurrentPage] = useState(1);
    const [totalNumberOfCryptoNews, setTotalNumberOfCryptoNews] = useState(Number);

    const { id } = useParams<string>();
    const ownerId = `http://purl.org/net/bel-epa/doacc#${id}`;

    const { data: currencyData, loading: currencyLoading, error: currencyError } = useQuery(GET_CRYPTOCURRENCY_BY_ID_QUERY, {
        variables: {
            id: `http://purl.org/net/bel-epa/doacc#${id}`
        },
        context: {clientName: 'endpoint1'}
    });

    const getPaginatedNewsInput: GetPaginatedCryptoNewsInput = {
        cryptocurrencyId: `http://purl.org/net/bel-epa/doacc#${id}`,
        limit: NEWS_PER_PAGE,
        offset: (currentPage - 1) * NEWS_PER_PAGE
    }

    const { data: newsData, loading: newsLoading, error: newsError } = useQuery(GET_PAGINATED_CRYPTONEWS_FOR_CRYPTOCURRENCY, {
        variables: getPaginatedNewsInput,
        context: {clientName: 'endpoint2'}
    });

    const [cryptocurrency, setCryptocurrency] = useState<Cryptocurrency>();
    const [news, setNews] = useState<News[]>([]);

    useEffect(() => {
        if (currencyData) {
            setCryptocurrency(currencyData.cryptocurrency);
        }
    }, [currencyLoading, currencyData]);
    useEffect(() => {
        if (newsData) {
            console.log(newsData.cryptoNews)
            setNews(newsData.cryptoNews);
            setTotalNumberOfCryptoNews(Math.ceil(newsData.cryptoNewsInfo.totalCount / NEWS_PER_PAGE));
        }
    }, [newsLoading, newsData]);

    if (currencyLoading) {
        return (
            <div className="page-container">
                <CircularProgress color="inherit" />
            </div>
        )
    }

    if (currencyError) {
        return (
            <div className="page-container">
                <Alert severity="error">{currencyError.message}</Alert>
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
                        {news ?
                        (news.map((oneNews: News, index: number) => (
                            <NewsCard news={oneNews} cryptocurrencyId={ownerId}
                            queryUpdate={UPDATE_CRYPTONEWS_FOR_CRYPTOCURRENCY} 
                            queryDelete={DELETE_CRYPTONEWS_FOR_CRYPTOCURRENCY}
                            refetchQuery={GET_PAGINATED_CRYPTONEWS_FOR_CRYPTOCURRENCY}
                            refetchVars={getPaginatedNewsInput} 
                            queryEndpoint="endpoint2" key={index} />)))
                        : null
                        }
                    </div>
                    <Pagination className="pagination"
                        count={totalNumberOfCryptoNews}
                        color="primary"
                        size="large"
                        page={currentPage}
                        variant="outlined"
                        onChange={(event, value) => setCurrentPage(value)} />
                    <CreateUpdateNewsCardDialog 
                        operationType="create" dialogQuery={CREATE_CRYPTONEWS_FOR_CRYPTOCURRENCY} 
                        refetchQuery={GET_PAGINATED_CRYPTONEWS_FOR_CRYPTOCURRENCY}
                        refetchVars={getPaginatedNewsInput} cryptocurrencyId={ownerId}
                    />
                </div>
            </div>
        </HelmetProvider>
    )
}
