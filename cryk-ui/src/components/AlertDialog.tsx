import React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import { DocumentNode } from 'graphql';
import { useMutation } from '@apollo/client';
import CircularProgress from '@mui/material/CircularProgress';
import Alert from '@mui/material/Alert';

export default function AlertDialog(props: {newsId: string, alertGql: DocumentNode}) {
  const [open, setOpen] = React.useState(false);

  const [ removeNewsEntry, { data, loading, error } ] = useMutation(props.alertGql, {
    context: {clientName: 'endpoint2'}
  });

  if (loading) {
    return (
        <div className="page-container">
            <CircularProgress color="inherit" />
        </div>
    )
  }

  if (error) {
    return (
        <div className="page-container">
            <Alert severity="error">{error.message}</Alert>
        </div>
    )
  }

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
      variables: {id: props.newsId}
    }).then(() => {
      window.location.reload();
    });
    setOpen(false);
  }

  return (
    <div>
      <Button variant="outlined" onClick={handleClickOpen}>
        Delete
      </Button>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          {"Are you sure?"}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            This action is irreversible. Do you wish to continue?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Disagree</Button>
          <Button onClick={handleAgree} autoFocus>
            Agree
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}