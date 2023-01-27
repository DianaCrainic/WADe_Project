import React, { useEffect } from "react";
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import { Box, TextField } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import Slide from '@mui/material/Slide';
import { TransitionProps } from '@mui/material/transitions';
import { useForm, SubmitHandler } from 'react-hook-form';
import { object, string, TypeOf } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { DocumentNode } from "graphql";
import { News } from "../models/News";
import { CreateCryptoNewsInput } from "../models/CreateCryptoNewsInput";
import { UpdateCryptoNewsInput } from "../models/UpdateCryptoNewsInput";
import { useMutation } from "@apollo/client";
import "./css/CreateUpdateNewsCardDialog.css";
import { GetPaginatedCryptoNewsInput } from "../models/GetPaginatedCryptoNewsInput";

const newsCardSchema = object({
    title: string({
      required_error: "News card title is required"
    }).min(1, { message: "News card title is required" }),
    body: string({
      required_error: "News card body is required"
    }).min(1, { message: "News card body is required" })
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
  
export default function CreateUpdateNewsCardDialog(props: {operationType: string, dialogQuery: DocumentNode, refetchQuery: DocumentNode,  refetchVars: GetPaginatedCryptoNewsInput, cryptocurrencyId: string, news?: News}) {
  const [open, setOpen] = React.useState(false);

  const {
    reset,
    register,
    handleSubmit,
    formState: { isSubmitSuccessful, errors },
  } = useForm<NewsCardInput>({
    resolver: zodResolver(newsCardSchema),
  });

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

  const [ createUpdateNewsEntry ] = useMutation(props.dialogQuery, {
    context: {clientName: 'endpoint2'},
    refetchQueries: [ {query: props.refetchQuery, context: {clientName: 'endpoint2'}, variables: props.refetchVars} ]
  });

  const onSubmitHandler: SubmitHandler<NewsCardInput> = (values) => {
    if (props.operationType === "create"){
      const operationInput: CreateCryptoNewsInput = {title: values.title, body: values.body, about: [ props.cryptocurrencyId ]};
      createUpdateNewsEntry({
        variables: {createCryptoNewsInput: operationInput}
      }).catch((e) => {console.log(JSON.stringify(e, null, 2))});
    }
    else {
      const operationInput: UpdateCryptoNewsInput = {id: (props.news ? props.news.id : ""), title: values.title, body: values.body};
      createUpdateNewsEntry({
        variables: {updateCryptoNewsInput: operationInput}
      }).catch((e) => {console.log(JSON.stringify(e, null, 2))});
    }
    setOpen(false);
  };

  return (
    <div>
      <Button 
        className={props.operationType === "create" ? "news-card-create-button" : "news-card-update-button"}
        variant="outlined"
        size={props.operationType === "create" ? "large" : "medium"}
        onClick={handleClickOpen}
      >
        {props.operationType === "create" ? "Create News Card" : "Update"}
      </Button>
      <Dialog
        fullScreen
        open={open}
        onClose={handleClose}
        TransitionComponent={Transition}
      >
        <AppBar sx={{ position: "relative" }}>
          <Toolbar className="toolbar-style">
            <IconButton
              edge="start"
              color="inherit"
              onClick={handleClose}
              aria-label="close"
              size="medium"
            >
              <CloseIcon fontSize="large"/>
            </IconButton>
            <DialogTitle className="news-dialog-title">
              {props.operationType === "create" ? "Create News Card" : "Update News Card"}
            </DialogTitle>
          </Toolbar>
        </AppBar>
        <DialogContent className="news-dialog-content">
          <Box
            className='form-wrapper'
            component='form'
            noValidate
            autoComplete='off'
            onSubmit={handleSubmit(onSubmitHandler)}
          >
            <TextField
              required
              fullWidth
              label='Title'
              type='text'
              defaultValue={props.operationType === "create" ? null : props.news?.title}
              error={!!errors['title']}
              helperText={errors['title'] ? errors['title'].message : ''}
              {...register('title')}
            />

            <TextField
              required
              fullWidth
              multiline
              rows={10}
              label='Body'
              type='text'
              defaultValue={props.operationType === "create" ? null : props.news?.body}
              error={!!errors['body']}
              helperText={errors['body'] ? errors['body'].message : ''}
              {...register('body')}
            />

            <Button
              type="submit"
              className="submit-form-button"
              size="large"
              variant="outlined"
            >
              Save
            </Button>
          </Box>
        </DialogContent>          
      </Dialog>
    </div>
  );
}
