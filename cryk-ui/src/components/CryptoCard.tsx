import * as React from 'react';
import Card from '@material-ui/core/Card';
import { CardMedia } from '@material-ui/core';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import { useNavigate } from "react-router-dom";
import "./css/CryptoCard.css";

export default function CryptoCard(props: any) {
  const cryptoData = props.cryptoData.crypto;
  const name = cryptoData.name.first;
  const description = cryptoData.email;
  const picture = cryptoData.picture.large;
  const id = cryptoData.id.value;

  const navigate = useNavigate();

  return (
    <Card className="crypto-card">
      <CardMedia
        className="card-media" component="img" image={picture} />
      <CardContent>
        <Typography className="card-title" color="textSecondary" gutterBottom>
          {name}
        </Typography>
        <Typography variant="body2">
          {description}
        </Typography>
      </CardContent>
      <CardActions>
        <Button className="button-learn-more-crypto" size="large" onClick={() => { navigate(`/cryptos/${id}`) }}>Learn More</Button>
      </CardActions>
    </Card>
  );
}