import React, { useEffect, useState } from "react";
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';

import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import { Alert, Box, CircularProgress } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import Slide from '@mui/material/Slide';
import { TransitionProps } from '@mui/material/transitions';
import { useForm, SubmitHandler, FormProvider } from 'react-hook-form';
import { object, string, TypeOf } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import FormInput from "./FormInput";
import { DocumentNode } from "graphql";
import { News } from "../models/News";
import { CreateCryptoNewsInput } from "../models/CreateCryptoNewsInput";
import { UpdateCryptoNewsInput } from "../models/UpdateCryptoNewsInput";
import { useMutation } from "@apollo/client";

const newsCardSchema = object({
    title: string().min(1, {message: "News card title is required"}),
    body: string().min(1, {message: "News card body is required"})
});

type NewsCardInput = TypeOf<typeof newsCardSchema>;

const Transition = React.forwardRef(function Transition(
  props: TransitionProps & {
    children: React.ReactElement;
  },
  ref: React.Ref<unknown>,
) {
  return <Slide direction="up" ref={ref} {...props} />;
});
  
export default function CreateUpdateNewsCardDialog(props: {operationType: string, dialogGql: DocumentNode, ownerId: string, news?: News}) {
  const [open, setOpen] = React.useState(false);
  
  const methods = useForm<NewsCardInput>({
    resolver: zodResolver(newsCardSchema),
  });

  const {
    reset,
    handleSubmit,
    formState: { isSubmitSuccessful, errors },
  } = methods;

  useEffect(() => {
    if (isSubmitSuccessful) {
      reset();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isSubmitSuccessful]);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const [ createUpdateNewsEntry, { data, loading, error } ] = useMutation(props.dialogGql, {
    context: {clientName: 'endpoint2'}
  });

  const onSubmitHandler: SubmitHandler<NewsCardInput> = (values) => {
    // console.log(values);
    if (props.operationType === "create"){
      const operationInput: CreateCryptoNewsInput = {title: values.title, body: values.body, about: [ props.ownerId ]};
      createUpdateNewsEntry({
        variables: {createCryptoNewsInput: operationInput}
      }).then(() => {
        window.location.reload();
      }).catch((e) => {console.log(JSON.stringify(e, null, 2))});
    }
    else {
      const operationInput: UpdateCryptoNewsInput = {id: (props.news ? props.news.id : ""), title: values.title, body: values.body};
      createUpdateNewsEntry({
        variables: {updateCryptoNewsInput: operationInput}
      }).then(() => {
        window.location.reload();
      }).catch((e) => {console.log(JSON.stringify(e, null, 2))});
    }
    setOpen(false);
  };

  // if (loading) {
  //   return (
  //       <div className="page-container">
  //           <CircularProgress color="inherit" />
  //       </div>
  //   )
  // }

  // if (error) {
  //   return (
  //       <div className="page-container">
  //           <Alert severity="error">{error.message}</Alert>
  //       </div>
  //   )
  // }

  return (
    <div>
      <Button variant="outlined" onClick={handleClickOpen}>
        {props.operationType === "create" ? "Create News Card" : "Update"}
      </Button>
      <Dialog
        fullScreen
        open={open}
        onClose={handleClose}
        TransitionComponent={Transition}
      >
        <AppBar sx={{ position: 'relative' }}>
          <Toolbar sx={{ display: "flex", justifyContent: "center" }}>
            <IconButton
              edge="start"
              color="inherit"
              onClick={handleClose}
              aria-label="close"
            >
              <CloseIcon />
            </IconButton>
            <DialogTitle>
              {props.operationType === "create" ? "Create News Card" : "Update News Card"}
            </DialogTitle>
          </Toolbar>
        </AppBar>
        <DialogContent>
          <FormProvider {...methods}>
            <Box
              component='form'
              noValidate
              autoComplete='off'
              onSubmit={handleSubmit(onSubmitHandler)}
            >
              <FormInput
                name='title'
                required
                fullWidth
                label='Title'
                type='text'
                value={props.operationType === "create" ? null : props.news?.title}
                // sx={{ mb: 2 }}
              />

              <FormInput
                name='body'
                required
                fullWidth
                multiline
                rows={10}
                label='Body'
                type='text'
                value={props.operationType === "create" ? null : props.news?.body}
                // sx={{ mb: 2 }}
              />

              <Button
                type="submit"
                className="learn-more-button"
                size="large"
                variant="outlined"
                // variant='contained'
                // fullWidth
                // type='submit'
                // loading={loading}
                // sx={{ py: '0.8rem', mt: '1rem' }}
              >
                Save
              </Button>
            </Box>
          </FormProvider>
        </DialogContent>          
      </Dialog>
    </div>
  );
}
