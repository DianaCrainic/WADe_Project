import * as React from 'react';
import Card from '@material-ui/core/Card';
import { CardMedia } from '@material-ui/core';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import "./css/CryptoCard.css";
import bitcoinImage from "../static/images/bitcoin.png";
import { Crypto } from '../models/Crypto';


export default function CryptoCard(props: any) {
  var cryptoData = props.cryptoData.crypto;
  // console.log("crypto: ", cryptoData);
  var name = cryptoData.name.first;
  var description = cryptoData.email;
  var picture = cryptoData.picture.large;

  return (
    <Card className="crypto-card">
      <CardMedia
        className="card-media" component="img" image={picture} title="Bitcoin" alt="Bitcoin" />
      <CardContent>
        <Typography className="card-title" color="textSecondary" gutterBottom>
          {name}
        </Typography>
        <Typography variant="body2">
          {description}
        </Typography>
      </CardContent>
      <CardActions>
        <Button size="small">Learn More</Button>
      </CardActions>
    </Card>
  );
}