import React, { useEffect } from "react";
import { DocumentNode } from "graphql";
import "./css/CreateUpdateCryptocurrencyCardDialog.css";
import { useMutation } from "@apollo/client";
import { object, string, TypeOf } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { RefetchInput } from "../models/RefetchInput";
import { useForm, SubmitHandler } from "react-hook-form";
import CloseIcon from "@mui/icons-material/Close";
import { TransitionProps } from "@mui/material/transitions";
import { CreateCryptocurrencyInput } from "../models/CreateCryptocurrencyInput";
import { UpdateCryptocurrencyInput } from "../models/UpdateCryptocurrencyInput";
import { GetPaginatedCryptocurrenciesInput } from "../models/GetPaginatedCryptocurrenciesInput";
import { AppBar, Box, Button, Dialog, DialogContent, DialogTitle, IconButton, Slide, TextField, Toolbar } from "@mui/material";
import { Cryptocurrency } from "../models/Cryptocurrency";

const cryptocurrencyCardSchema = object({
    symbol: string({
        required_error: "Cryptocurrency card symbol is required"
    }).min(1, { message: "Cryptocurrency card symbol is required" }),
    description: string({
        required_error: "Cryptocurrency card description is required"
    }).min(1, { message: "Cryptocurrency card description is required" }),
    blockReward: string(),
    totalCoins: string(),
    source: string(),
    website: string()
});

type CryptocurrencyCardInput = TypeOf<typeof cryptocurrencyCardSchema>;

const Transition = React.forwardRef((
    props: TransitionProps & {
        children: React.ReactElement;
    },
    ref: React.Ref<unknown>,
) => {
    return <Slide direction="up" ref={ref} {...props} />;
});

export default function CreateUpdateCryptocurrencyCardDialog(props: {
    operationType: string,
    dialogQuery: DocumentNode,
    refetchInput: RefetchInput<GetPaginatedCryptocurrenciesInput>,
    cryptocurrency?: Cryptocurrency
}) {
    const [isOpen, setIsOpen] = React.useState(false);

    const operationPropertiesMap = new Map();
    operationPropertiesMap.set("create", {
        "button-class": "cryptocurrency-card-create-button",
        "button-size": "large",
        "button-text": "Create Cryptocurrency",
        "dialog-symbol": "Create Cryptocurrency",
        "disable-symbol-filling": false,
        "symbol-default-value": null,
        "description-default-value": null,
        "blockReward-default-value": null,
        "totalCoins-default-value": null,
        "source-default-value": null,
        "website-default-value": null
    });
    operationPropertiesMap.set("update", {
        "button-class": "cryptocurrency-card-update-button",
        "button-size": "medium",
        "button-text": "Update",
        "dialog-symbol": "Update Cryptocurrency",
        "disable-symbol-filling": true,
        "symbol-default-value": props.cryptocurrency?.symbol,
        "description-default-value": props.cryptocurrency?.description,
        "blockReward-default-value": props.cryptocurrency?.blockReward,
        "totalCoins-default-value": props.cryptocurrency?.totalCoins,
        "source-default-value": props.cryptocurrency?.source,
        "website-default-value": props.cryptocurrency?.website,
    });
    
    const {
        reset,
        register,
        handleSubmit,
        formState: { isSubmitSuccessful, errors },
    } = useForm<CryptocurrencyCardInput>({
        resolver: zodResolver(cryptocurrencyCardSchema),
    });

    useEffect(() => {
        if (isSubmitSuccessful) {
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

    const [createUpdateCryptocurrencyEntry] = useMutation(props.dialogQuery, {
        context: { clientName: refetchInput.context },
        refetchQueries: [{ query: refetchInput.query, context: { clientName: refetchInput.context }, variables: refetchInput.variables }]
    });

    const onSubmitHandler: SubmitHandler<CryptocurrencyCardInput> = (values) => {
        if (props.operationType === "create") {
            const operationInput: CreateCryptocurrencyInput = {
                symbol: values.symbol,
                description: values.description,
                blockReward: values.blockReward,
                totalCoins: values.totalCoins,
                source: values.source,
                website: values.website
            };
            createUpdateCryptocurrencyEntry({
                variables: { createCryptocurrencyInput: operationInput }
            }).catch((error) => { console.error(JSON.stringify(error, null, 2)) });
        }
        else {
            const operationInput: UpdateCryptocurrencyInput = {
                id: (props.cryptocurrency ? props.cryptocurrency.id : ""),
                description: values.description,
                blockReward: values.blockReward,
                totalCoins: values.totalCoins,
                source: values.source,
                website: values.website
            };
            createUpdateCryptocurrencyEntry({
                variables: { updateCryptocurrencyInput: operationInput }
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
                        <DialogTitle className="cryptocurrency-dialog-title">
                            {operationPropertiesMap.get(props.operationType)["dialog-symbol"]}
                        </DialogTitle>
                    </Toolbar>
                </AppBar>
                <DialogContent className="cryptocurrency-dialog-content">
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
                            label="Symbol"
                            type="text"
                            defaultValue={operationPropertiesMap.get(props.operationType)["symbol-default-value"]}
                            error={!!errors["symbol"]}
                            helperText={errors["symbol"] ? errors["symbol"].message : ""}
                            {...register("symbol")}
                            InputProps={{
                                readOnly: operationPropertiesMap.get(props.operationType)["disable-symbol-filling"]
                            }}
                        />

                        <TextField
                            required
                            fullWidth
                            multiline
                            rows={10}
                            label="Description"
                            type="text"
                            defaultValue={operationPropertiesMap.get(props.operationType)["description-default-value"]}
                            error={!!errors["description"]}
                            helperText={errors["description"] ? errors["description"].message : ""}
                            {...register("description")}
                        />

                        <TextField
                            fullWidth
                            label="Block Reward"
                            type="text"
                            defaultValue={operationPropertiesMap.get(props.operationType)["blockReward-default-value"]}
                            error={!!errors["blockReward"]}
                            helperText={errors["blockReward"] ? errors["blockReward"].message : ""}
                            {...register("blockReward")}
                        />

                        <TextField
                            fullWidth
                            label="Total Coins"
                            type="text"
                            defaultValue={operationPropertiesMap.get(props.operationType)["totalCoins-default-value"]}
                            error={!!errors["totalCoins"]}
                            helperText={errors["totalCoins"] ? errors["totalCoins"].message : ""}
                            {...register("totalCoins")}
                        />

                        <TextField
                            fullWidth
                            label="Source"
                            type="text"
                            defaultValue={operationPropertiesMap.get(props.operationType)["source-default-value"]}
                            error={!!errors["source"]}
                            helperText={errors["source"] ? errors["source"].message : ""}
                            {...register("source")}
                        />

                        <TextField
                            fullWidth
                            label="Website"
                            type="text"
                            defaultValue={operationPropertiesMap.get(props.operationType)["website-default-value"]}
                            error={!!errors["website"]}
                            helperText={errors["website"] ? errors["website"].message : ""}
                            {...register("website")}
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
