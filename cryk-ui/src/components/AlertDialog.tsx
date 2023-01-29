import React from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import { DocumentNode } from "graphql";
import { useMutation } from "@apollo/client";
import "./css/AlertDialog.css";
import { GetPaginatedCryptoNewsInput } from "../models/GetPaginatedCryptoNewsInput";
import { GetPaginatedCryptocurrenciesInput } from "../models/GetPaginatedCryptocurrenciesInput";
import { CryptocurrencyInput } from "../models/CryptocurrencyInput";
import { RefetchInput } from "../models/RefetchInput";

export default function AlertDialog(props: { id: string, alertQuery: DocumentNode, refetchInput: RefetchInput<GetPaginatedCryptoNewsInput | GetPaginatedCryptocurrenciesInput | CryptocurrencyInput> }) {
  const [isOpen, setIsOpen] = React.useState(false);
  const refetchInput = props.refetchInput

  const [removeEntry] = useMutation(props.alertQuery, {
    refetchQueries: [{ query: refetchInput.query, variables: refetchInput.variables }]
  });

  const handleClickOpen = () => {
    setIsOpen(true);
  };

  const handleClose = () => {
    setIsOpen(false);
  };

  const handleAgree = (event: React.MouseEvent) => {
    event.preventDefault();
    event.stopPropagation();
    removeEntry({
      variables: { id: props.id }
    });
    setIsOpen(false);
  }

  return (
    <div>
      <Button className="alert-dialog-button" variant="outlined" onClick={handleClickOpen}>
        Delete
      </Button>
      <Dialog
        open={isOpen}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title" className="alert-title">
          {"Are you sure?"}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description" className="alert-text">
            This action is irreversible. Do you wish to continue?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button className="alert-option-button" onClick={handleClose}>Disagree</Button>
          <Button className="alert-option-button" onClick={handleAgree} autoFocus>
            Agree
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}