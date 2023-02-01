import React, { useEffect } from "react";
import { DocumentNode } from "graphql";
import { News } from "../models/News";
import "./css/CreateUpdateNewsCardDialog.css";
import { useMutation } from "@apollo/client";
import { object, string, TypeOf } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { RefetchInput } from "../models/RefetchInput";
import { useForm, SubmitHandler } from "react-hook-form";
import CloseIcon from "@mui/icons-material/Close";
import { TransitionProps } from "@mui/material/transitions";
import { CreateCryptoNewsInput } from "../models/CreateCryptoNewsInput";
import { UpdateCryptoNewsInput } from "../models/UpdateCryptoNewsInput";
import { GetPaginatedCryptoNewsInput } from "../models/GetPaginatedCryptoNewsInput";
import { GetPaginatedCryptocurrenciesInput } from "../models/GetPaginatedCryptocurrenciesInput";
import { AppBar, Box, Button, Dialog, DialogContent, DialogTitle, IconButton, Slide, TextField, Toolbar } from "@mui/material";

const newsCardSchema = object({
  title: string({
    required_error: "News card title is required"
  }).min(1, { message: "News card title is required" }),
  body: string({
    required_error: "News card body is required"
  }).min(1, { message: "News card body is required" })
});

type NewsCardInput = TypeOf<typeof newsCardSchema>;

const Transition = React.forwardRef((
  props: TransitionProps & {
    children: React.ReactElement;
  },
  ref: React.Ref<unknown>,
) => {
  return <Slide direction="up" ref={ref} {...props} />;
});

export default function CreateUpdateNewsCardDialog(props: { operationType: string, dialogQuery: DocumentNode, refetchInput: RefetchInput<GetPaginatedCryptoNewsInput | GetPaginatedCryptocurrenciesInput>, cryptocurrencyId: string, news?: News }) {
  const [isOpen, setIsOpen] = React.useState(false);

  const operationPropertiesMap = new Map();
  operationPropertiesMap.set("create", {
    "button-class": "news-card-create-button",
    "button-size": "large",
    "button-text": "Create News",
    "dialog-title": "Create News",
    "title-default-value": null,
    "body-default-value": null
  });
  operationPropertiesMap.set("update", {
    "button-class": "news-card-update-button",
    "button-size": "medium",
    "button-text": "Update",
    "dialog-title": "Update News",
    "title-default-value": props.news?.title,
    "body-default-value": props.news?.body
  });

  const {
    reset,
    register,
    handleSubmit,
    formState: { isSubmitSuccessful, errors },
  } = useForm<NewsCardInput>({
    resolver: zodResolver(newsCardSchema),
  });

  useEffect(() => {
    if (props.operationType === "create" && isSubmitSuccessful) {
      reset();
    }
  }, [isSubmitSuccessful, reset]);

  const handleClickOpen = () => {
    setIsOpen(true);
  };

  const handleClose = () => {
    setIsOpen(false);
  };

  const refetchInput = props.refetchInput

  const [createUpdateNewsEntry] = useMutation(props.dialogQuery, {
    context: { clientName: refetchInput.context },
    refetchQueries: [{ query: refetchInput.query, context: { clientName: refetchInput.context }, variables: refetchInput.variables }]
  });

  const onSubmitHandler: SubmitHandler<NewsCardInput> = (values) => {
    if (props.operationType === "create") {
      const operationInput: CreateCryptoNewsInput = { title: values.title, body: values.body, about: [props.cryptocurrencyId] };
      createUpdateNewsEntry({
        variables: { createCryptoNewsInput: operationInput }
      }).catch((error) => { console.error(JSON.stringify(error, null, 2)) });
    }
    else {
      const operationInput: UpdateCryptoNewsInput = { id: (props.news ? props.news.id : ""), title: values.title, body: values.body };
      createUpdateNewsEntry({
        variables: { updateCryptoNewsInput: operationInput }
      }).catch((error) => { console.error(JSON.stringify(error, null, 2)) });
    }

    setIsOpen(false);
  };

  return (
    <div>
      <Button
        className={operationPropertiesMap.get(props.operationType)["button-class"]}
        variant="outlined"
        size={operationPropertiesMap.get(props.operationType)["button-size"]}
        onClick={handleClickOpen}
      >
        {operationPropertiesMap.get(props.operationType)["button-text"]}
      </Button>
      <Dialog
        fullScreen
        open={isOpen}
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
              <CloseIcon fontSize="large" />
            </IconButton>
            <DialogTitle className="news-dialog-title">
              {operationPropertiesMap.get(props.operationType)["dialog-title"]}
            </DialogTitle>
          </Toolbar>
        </AppBar>
        <DialogContent className="news-dialog-content">
          <Box
            className="form-wrapper"
            component="form"
            noValidate
            autoComplete="off"
            onSubmit={handleSubmit(onSubmitHandler)}
          >
            <TextField
              required
              fullWidth
              label="Title"
              type="text"
              defaultValue={operationPropertiesMap.get(props.operationType)["title-default-value"]}
              error={!!errors["title"]}
              helperText={errors["title"] ? errors["title"].message : ""}
              {...register("title")}
            />

            <TextField
              required
              fullWidth
              multiline
              rows={10}
              label="Body"
              type="text"
              defaultValue={operationPropertiesMap.get(props.operationType)["body-default-value"]}
              error={!!errors["body"]}
              helperText={errors["body"] ? errors["body"].message : ""}
              {...register("body")}
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
