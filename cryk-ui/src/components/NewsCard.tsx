import * as React from 'react';
import "./css/NewsCard.css";
import { News } from '../models/News';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import Card from '@mui/material/Card';
import AlertDialog from './AlertDialog';
import { DocumentNode } from 'graphql';
import CreateUpdateNewsCardDialog from './CreateUpdateNewsCardDialog';
import { GetPaginatedCryptoNewsInput } from '../models/GetPaginatedCryptoNewsInput';
import { GetPaginatedCryptocurrenciesInput } from '../models/GetPaginatedCryptocurrenciesInput';
import { RefetchInput } from '../models/RefetchInput';

export default function NewsCard(props: { news: News, cryptocurrencyId: string, queryUpdate: DocumentNode, queryDelete: DocumentNode, refetchInput: RefetchInput<GetPaginatedCryptoNewsInput|GetPaginatedCryptocurrenciesInput> }) {
    const news = props.news;

    const alertParams = { id: news.id, alertQuery: props.queryDelete, refetchInput: props.refetchInput };

    return (
        <Card className="news-card">
            <CardContent vocab="http://schema.org/" typeof="NewsArticle" resource={news.id}>
                <Typography className="card-title" color="textSecondary" gutterBottom property="http://schema.org/headline">
                    {news.title}
                </Typography>
                <Typography variant="body1" property="http://schema.org/articleBody">
                    {news.body}
                </Typography>
            </CardContent>
            <CardContent className="news-card-buttons-container">
                <CreateUpdateNewsCardDialog 
                    operationType="update" dialogQuery={props.queryUpdate} 
                    refetchInput={props.refetchInput}
                    cryptocurrencyId={props.cryptocurrencyId} news={news}
                />
                <AlertDialog {...alertParams}/>
            </CardContent>
        </Card>
    );
}