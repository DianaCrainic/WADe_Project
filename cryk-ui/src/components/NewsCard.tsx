import * as React from 'react';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';
import "./css/NewsCard.css";

export default function CryptoCard(props: any) {
    const newsName = "2 Bitcoin Mining Pools Command More Than 53% of BTC's Total Hashrate";
    const contentPart = "Bitcoin's hashrate has jumped from the low 170 exahash per second (EH/s) recorded this week, to above the 300 exahash range after a number of bitcoin mining operations from Texas temporarily went offline on Dec. 25, 2022. Furthermore, three-day hashrate distribution statistics recorded on Dec. 29, 2022 indicate that two mining pools command more than 50% of the global hashrate."

    return (
        <Card className="news-card">
            <CardContent>
                <Typography className="card-title" color="textSecondary" gutterBottom>
                    {newsName}
                </Typography>
                <Typography variant="body1">
                    {contentPart}
                </Typography>
            </CardContent>
        </Card>
    );
}