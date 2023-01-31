import React, { useState, useEffect, useLayoutEffect } from "react";
import * as DOMPurify from "dompurify";
import "./css/NewsCard.css";
import { News } from "../models/News";
import { Button, Card, CardContent, Typography } from "@mui/material";
import AlertDialog from "./AlertDialog";
import { DocumentNode } from "graphql";
import CreateUpdateNewsCardDialog from "./CreateUpdateNewsCardDialog";
import { GetPaginatedCryptoNewsInput } from "../models/GetPaginatedCryptoNewsInput";
import { GetPaginatedCryptocurrenciesInput } from "../models/GetPaginatedCryptocurrenciesInput";
import { RefetchInput } from "../models/RefetchInput";
import { AuthContext } from "../App";
import { useContext } from "react";

const DEFAULT_HEIGHT = 102;

export default function NewsCard(props: {cardId: string, news: News, cryptocurrencyId: string, queryUpdate: DocumentNode, queryDelete: DocumentNode, refetchInput: RefetchInput<GetPaginatedCryptoNewsInput | GetPaginatedCryptocurrenciesInput> }) {
    const news = props.news;

    const alertParams = { id: news.id, alertQuery: props.queryDelete, refetchInput: props.refetchInput };

    const [heightCurrent, setHeightCurrent] = useState(DEFAULT_HEIGHT);
    const [heightMax, setHeightMax] = useState(DEFAULT_HEIGHT);
    const [heightMin, setHeightMin] = useState(DEFAULT_HEIGHT);
    const [isExpanded, setIsExpanded] = useState(false);
    const [isOverflow, setIsOverflow] = useState(false);

    useLayoutEffect(() => {
        const element = document.querySelector(`#${props.cardId}`);
        const heightClient = element?.clientHeight || DEFAULT_HEIGHT;
        const scrollClient = element?.scrollHeight || DEFAULT_HEIGHT;
        if (heightClient !== scrollClient) {
            setIsOverflow(true);
            setHeightMax(scrollClient);
            setHeightMin(heightClient);
            setHeightCurrent(heightClient);
        } else {
            setIsOverflow(false);
            setHeightMax(DEFAULT_HEIGHT);
            setHeightMin(DEFAULT_HEIGHT);
            setHeightCurrent(DEFAULT_HEIGHT);
        }
    }, [news.body, props.cardId]);

    useEffect(() => {
        const element = document.querySelector(`#${props.cardId}`);
        const heightClient = element?.clientHeight || DEFAULT_HEIGHT;
        const scrollClient = element?.scrollHeight || DEFAULT_HEIGHT;
        if (heightClient !== scrollClient) {
            setIsOverflow(true);
            setHeightMax(scrollClient);
            setHeightMin(heightClient);
            setHeightCurrent(heightClient);
        } else {
            setIsOverflow(false);
            setHeightMax(DEFAULT_HEIGHT);
            setHeightMin(DEFAULT_HEIGHT);
            setHeightCurrent(DEFAULT_HEIGHT);
        }
    }, [news.body, props.cardId]);

    const handleClickButton = () => {
        setHeightCurrent(isExpanded ? heightMin : heightMax);
        setIsExpanded((prev) => !prev);
    };
    const isAdminAuth = useContext(AuthContext);

    return (
        <Card className="news-card">
            <CardContent vocab="http://schema.org/" typeof="NewsArticle" resource={news.id}>
                <Typography className="card-title" color="textSecondary" property="http://schema.org/headline">
                    {news.title}
                </Typography>
                <Typography className="card-publishedAt" color="textSecondary">
                    <span>Published at </span>
                    <span property="http://schema.org/datePublished">{(new Date(news.publishedAt)).toUTCString()}</span>
                </Typography>
                <div id={props.cardId} className={`${isExpanded ? "expanded" : "collapsed"} card-text`} style={{ height: `${heightCurrent}px` }}>
                    <Typography variant="body1" gutterBottom property="http://schema.org/articleBody" dangerouslySetInnerHTML={{__html: DOMPurify.sanitize(news.body)}}>
                    </Typography>
                </div>
                {isOverflow && <Button className="toggle-button" size="small" onClick={handleClickButton}>{isExpanded ? "Show Less" : "Show More"}</Button>}
                <Typography>
                    <span>Source: </span>
                    {news.source ? <a href={news.source} property="https://schema.org/url">{news.source}</a> : <span>Not stated</span>}
                </Typography>
            </CardContent>
            {isAdminAuth && <CardContent className="news-card-buttons-container">
                <CreateUpdateNewsCardDialog
                    operationType="update" dialogQuery={props.queryUpdate}
                    refetchInput={props.refetchInput}
                    cryptocurrencyId={props.cryptocurrencyId} news={news}
                />
                <AlertDialog {...alertParams} />
            </CardContent>}
        </Card>
    );
}