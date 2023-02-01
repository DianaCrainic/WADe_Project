import * as React from "react";
import { useNavigate } from "react-router-dom";
import "./css/CryptoCard.css";
import { Cryptocurrency } from "../models/Cryptocurrency";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import CardActions from "@mui/material/CardActions";
import Button from "@mui/material/Button";
import { DocumentNode } from "graphql";
import { RefetchInput } from "../models/RefetchInput";
import AlertDialog from "./AlertDialog";
import { GetPaginatedCryptocurrenciesInput } from "../models/GetPaginatedCryptocurrenciesInput";
import { AuthContext } from "../App";
import { useContext } from "react";

export default function CryptoCard(props: { cryptocurrency: Cryptocurrency, queryDelete: DocumentNode, refetchInput: RefetchInput<GetPaginatedCryptocurrenciesInput> }) {
  const cryptocurrency = props.cryptocurrency;

  const alertParams = { id: cryptocurrency.id, alertQuery: props.queryDelete, refetchInput: props.refetchInput };

  const isAdminAuth = useContext(AuthContext);

  const navigate = useNavigate();

  return (
    <Card className="crypto-card">
      <CardContent vocab="http://purl.org/net/bel-epa/doacc#" typeof="Cryptocurrency" resource={cryptocurrency.id}>
        <Typography className="card-title" color="textSecondary" gutterBottom
          property="http://purl.org/net/bel-epa/doacc#symbol">
          {cryptocurrency.symbol}
        </Typography>

        <Typography
          variant="body2"
          className="card-date-founded"
          property="http://www.w3.org/2001/XMLSchema#date"
        >
          Date founded: {cryptocurrency?.dateFounded ? cryptocurrency.dateFounded : "unknown"}
        </Typography>

        {cryptocurrency?.description && <Typography variant="body2" className="card-content"
          property="http://purl.org/dc/elements/1.1/description">
          {cryptocurrency.description}
        </Typography>}
      </CardContent>
      <CardActions className="cryptocurrency-card-buttons-container">
        <Button
          className="learn-more-button"
          size="medium"
          variant="outlined"
          onClick={() => { navigate(`/cryptos/${cryptocurrency.id.split("#")[1]}`) }}
        >
          Learn More
        </Button>
        {isAdminAuth && <AlertDialog {...alertParams} />}
      </CardActions>
    </Card>
  );
}