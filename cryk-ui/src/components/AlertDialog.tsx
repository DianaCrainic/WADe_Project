import React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import { DocumentNode } from 'graphql';
import { useMutation } from '@apollo/client';
import "./css/AlertDialog.css";
import { GetPaginatedCryptoNewsInput } from '../models/GetPaginatedCryptoNewsInput';


export default function AlertDialog(props: {id: string, alertQuery: DocumentNode, refetchQuery: DocumentNode, refetchVars: GetPaginatedCryptoNewsInput, queryEndpoint: string}) {
  const [open, setOpen] = React.useState(false);

  const [ removeNewsEntry ] = useMutation(props.alertQuery, {
    context: {clientName: props.queryEndpoint},
    refetchQueries: [ {query: props.refetchQuery, context: {clientName: props.queryEndpoint}, variables: props.refetchVars} ]
  });

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleAgree = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    removeNewsEntry({
      variables: {id: props.id}
    });
    setOpen(false);
  }

  return (
    <div>
      <Button className='alert-dialog-button' variant="outlined" onClick={handleClickOpen}>
        Delete
      </Button>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title" className='alert-title'>
          {"Are you sure?"}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description" className='alert-text'>
            This action is irreversible. Do you wish to continue?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button className='alert-option-button' onClick={handleClose}>Disagree</Button>
          <Button className='alert-option-button' onClick={handleAgree} autoFocus>
            Agree
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}