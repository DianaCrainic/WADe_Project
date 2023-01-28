import * as React from "react";
import { useNavigate } from "react-router-dom";
import "./css/CryptoCard.css";
import { Cryptocurrency } from "../models/Cryptocurrency";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import CardActions from "@mui/material/CardActions";
import Button from "@mui/material/Button";

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
        <Button
          className="learn-more-button"
          size="medium"
          variant="outlined"
          onClick={() => { navigate(`/cryptos/${cryptocurrency.id.split("#")[1]}`) }}
        >
          Learn More
        </Button>
      </CardActions>
    </Card>
  );
}