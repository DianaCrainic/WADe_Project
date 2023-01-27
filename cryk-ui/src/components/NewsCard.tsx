import * as React from 'react';
import "./css/NewsCard.css";
import { News } from '../models/News';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import Card from '@mui/material/Card';
import AlertDialog from './AlertDialog';
import { DocumentNode } from 'graphql';
import CreateUpdateNewsCardDialog from './CreateUpdateNewsCardDialog';

export default function NewsCard(props: { news: News, ownerId: string, gqlUpdate: DocumentNode, gqlDelete: DocumentNode }) {
    const news = props.news;

    const alertParams = { newsId: news.id, alertGql: props.gqlDelete }

    return (
        <Card className="news-card">
            <CardContent>
                <Typography className="card-title" color="textSecondary" gutterBottom>
                    {news.title}
                </Typography>
                <Typography variant="body1">
                    {news.body}
                </Typography>
            </CardContent>
            <CardContent>
                <CreateUpdateNewsCardDialog operationType="update" dialogGql={props.gqlUpdate} ownerId={props.ownerId} news={news} />
                <AlertDialog {...alertParams}/>
            </CardContent>
        </Card>
    );
}