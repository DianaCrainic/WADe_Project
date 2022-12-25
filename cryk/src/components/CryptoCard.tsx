import * as React from 'react';
import Card from '@material-ui/core/Card';
import { CardMedia } from '@material-ui/core';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import "./css/CryptoCard.css";
import bitcoinImage from "../static/images/bitcoin.png";


export default function CryptoCard() {
  return (
    <Card className="crypto-card">
      <CardMedia
        className="card-media" component="img" image={bitcoinImage} title="Bitcoin" alt="Bitcoin" />
      <CardContent>
        <Typography className="card-title" color="textSecondary" gutterBottom>
          Cryptocurrency name
        </Typography>
        <Typography variant="body2">
          The description of the cryptocurrency.
        </Typography>
      </CardContent>
      <CardActions>
        <Button size="small">Learn More</Button>
      </CardActions>
    </Card>
  );
}