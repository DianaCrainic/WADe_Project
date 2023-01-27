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
import { RefetchInput } from "../models/RefetchInput";
import { UNKNOWN_MESSAGE } from "../constants/cryptocurrencies-messages";

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

const NEWS_PER_PAGE = 5;

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
        }
    }
`;

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

    const refetchInput: RefetchInput<GetPaginatedCryptoNewsInput> = {
        context: "newsGraphqlEndpoint",
        query: GET_PAGINATED_CRYPTONEWS_FOR_CRYPTOCURRENCY,
        variables: getPaginatedNewsInput
    }

    const { data: newsData, loading: newsLoading, error: newsError } = useQuery(GET_PAGINATED_CRYPTONEWS_FOR_CRYPTOCURRENCY, {
        variables: getPaginatedNewsInput,
        context: { clientName: "newsGraphqlEndpoint" }
    });

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
    const reward = Number(cryptocurrency?.blockReward) < 0 ? null: Number(cryptocurrency?.blockReward);
    const coins = Number(cryptocurrency?.totalCoins) < 0 ? null: Number(cryptocurrency?.totalCoins);

    return (
        <HelmetProvider>
            <div>
                <Helmet>
                    <title>{title}</title>
                </Helmet>
                <div className="page-container" vocab="http://purl.org/net/bel-epa/doacc#" typeof="Cryptocurrency">
                    <div className="title" property="http://purl.org/net/bel-epa/doacc#title" 
                    about="http://purl.org/net/bel-epa/doacc#{id}">
                        <h1 property="http://purl.org/net/bel-epa/doacc#symbol">{symbol}</h1>
                    </div>
                    <p className="crypto-description" property="http://purl.org/net/bel-epa/doacc#description"
                        typeof="http://purl.org/net/bel-epa/doacc#description">
                        {description}
                    </p>
                    <p className="crypto-website" property="http://purl.org/net/bel-epa/doacc#website"
                        typeof="http://purl.org/net/bel-epa/doacc#WebSite">
                        <span property="http://purl.org/net/bel-epa/doacc#name">Official website: </span>
                        {website ? <a href={website} property="http://purl.org/net/bel-epa/doacc#url">{website}</a> : UNKNOWN_MESSAGE}
                    </p>
                    <p className="crypto-source" property="http://purl.org/net/bel-epa/doacc#source">
                        <span property="http://purl.org/net/bel-epa/doacc#name">Source: </span>
                        {source ? <a href={source} property="http://purl.org/net/bel-epa/doacc#url">{source}</a> : UNKNOWN_MESSAGE}
                    </p>
                    <p className="crypto-reward" property="http://purl.org/net/bel-epa/doacc#reward"
                        typeof="http://purl.org/net/bel-epa/doacc#MonetaryAmount">
                        <span property="http://purl.org/net/bel-epa/doacc#name">Reward: </span>
                        {reward ? <span property="http://purl.org/net/bel-epa/doacc#value">{reward}</span> : UNKNOWN_MESSAGE}
                    </p>
                    <p className="crypto-coins" property="http://purl.org/net/bel-epa/doacc#coins"
                        typeof="http://purl.org/net/bel-epa/doacc#QuantitativeValue">
                        <span property="http://purl.org/net/bel-epa/doacc#name">Total Coins: </span>
                        {coins ? <span property="http://purl.org/net/bel-epa/doacc#value">{coins}</span> : UNKNOWN_MESSAGE}
                    </p>

                    <h2 className="news-title">News</h2>
                    <div className="news-cards-container">
                        {news ?
                            (news.map((oneNews: News, index: number) => (
                                <NewsCard news={oneNews} cryptocurrencyId={cryptocurrencyId}
                                    queryUpdate={UPDATE_CRYPTONEWS_FOR_CRYPTOCURRENCY}
                                    queryDelete={DELETE_CRYPTONEWS_FOR_CRYPTOCURRENCY}
                                    refetchInput={refetchInput} key={index} />)))
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
                        refetchInput={refetchInput} cryptocurrencyId={cryptocurrencyId}
                    />
                </div>
            </div>
        </HelmetProvider>
    )
}