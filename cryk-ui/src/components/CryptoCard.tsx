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
import CreateUpdateCryptocurrencyCardDialog from "./CreateUpdateCryptocurrencyCardDialog";

export default function CryptoCard(props: { cryptocurrency: Cryptocurrency, queryUpdate: DocumentNode, queryDelete: DocumentNode, refetchInput: RefetchInput<GetPaginatedCryptocurrenciesInput> }) {
  const cryptocurrency = props.cryptocurrency;

  const alertParams = { id: cryptocurrency.id, alertQuery: props.queryDelete, refetchInput: props.refetchInput };

  const navigate = useNavigate();

  return (
    <Card className="crypto-card" vocab="http://purl.org/net/bel-epa/doacc#" typeof="Cryptocurrency">
      <CardContent>
        <Typography className="card-title" color="textSecondary" gutterBottom
          about={cryptocurrency.id}
          property="http://purl.org/net/bel-epa/doacc#symbol" typeof="http://www.w3.org/2001/XMLSchema#string">
          {cryptocurrency.symbol}
        </Typography>
        {cryptocurrency?.description && <Typography variant="body2"
          property="<http://purl.org/dc/elements/1.1/description"
          typeof="http://www.w3.org/2001/XMLSchema#string">
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
        <CreateUpdateCryptocurrencyCardDialog
          operationType="update" dialogQuery={props.queryUpdate}
          refetchInput={props.refetchInput}
          cryptocurrency={cryptocurrency}
        />
        <AlertDialog {...alertParams} />
      </CardActions>
    </Card>
  );
}