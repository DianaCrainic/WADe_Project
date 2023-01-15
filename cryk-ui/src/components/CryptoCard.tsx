import * as React from 'react';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import { useNavigate } from "react-router-dom";
import "./css/CryptoCard.css";
import { Cryptocurrency } from '../models/Cryptocurrency';

export default function CryptoCard(props: { cryptocurrency: Cryptocurrency }) {
  const cryptocurrency = props.cryptocurrency;

  const navigate = useNavigate();

  return (
    <Card className="crypto-card">
      <CardContent>
        <Typography className="card-title" color="textSecondary" gutterBottom>
          {cryptocurrency.symbol}
        </Typography>
        {cryptocurrency?.description && <Typography variant="body2">
          {cryptocurrency.description}
        </Typography>}
      </CardContent>
      <CardActions>
        <Button className="button-learn-more-crypto" size="large" onClick={() => { navigate(`/cryptos/${cryptocurrency.id.split("#")[1]}`) }}>Learn More</Button>
      </CardActions>
    </Card>
  );
}