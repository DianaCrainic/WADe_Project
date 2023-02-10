import React, { useEffect } from "react";
import { DocumentNode } from "graphql";
import "./css/CreateUpdateCryptocurrencyCardDialog.css";
import { useMutation } from "@apollo/client";
import { object, string, TypeOf, literal } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { RefetchInput } from "../models/RefetchInput";
import { useForm, SubmitHandler } from "react-hook-form";
import CloseIcon from "@mui/icons-material/Close";
import { TransitionProps } from "@mui/material/transitions";
import { CreateCryptocurrencyInput } from "../models/CreateCryptocurrencyInput";
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
    source: string().url().optional().or(literal("")),
    website: string().url().optional().or(literal(""))
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

export default function CreateCryptocurrencyCardDialog(props: {
    dialogQuery: DocumentNode,
    refetchInput: RefetchInput<GetPaginatedCryptocurrenciesInput>,
    cryptocurrency?: Cryptocurrency
}) {
    const [isOpen, setIsOpen] = React.useState(false);

    const operationProperties = {
        "button-class": "cryptocurrency-card-create-button",
        "button-size": "large" as const,
        "button-text": "Create Cryptocurrency",
        "dialog-symbol": "Create Cryptocurrency",
        "disable-symbol-filling": false,
        "symbol-default-value": null,
        "description-default-value": null,
        "blockReward-default-value": null,
        "totalCoins-default-value": null,
        "source-default-value": undefined,
        "website-default-value": undefined
    };

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

    const [createCryptocurrencyEntry] = useMutation(props.dialogQuery, {
        context: { clientName: refetchInput.context },
        refetchQueries: [{ query: refetchInput.query, context: { clientName: refetchInput.context }, variables: refetchInput.variables }]
    });

    const onSubmitHandler: SubmitHandler<CryptocurrencyCardInput> = (values) => {
        const date = new Date();
        const year = date.getFullYear();
        const month = date.getMonth() + 1;
        const day = date.getDate();
        const dateFoundedValue: string = `${year}-${month > 9 ? month : `0${month}`}-${day > 9 ? day : `0${day}`}`;

        const operationInput: CreateCryptocurrencyInput = {
            symbol: values.symbol,
            description: values.description,
            blockReward: values.blockReward,
            totalCoins: values.totalCoins,
            source: values.source,
            website: values.website,
            dateFounded: dateFoundedValue
        };
        createCryptocurrencyEntry({
            variables: { createCryptocurrencyInput: operationInput }
        }).catch((error) => { console.error(JSON.stringify(error, null, 2)) });

        setIsOpen(false);
    };

    return (
        <div>
            <Button
                className={operationProperties["button-class"]}
                variant="outlined"
                size={operationProperties["button-size"]}
                onClick={handleClickOpen}
            >
                {operationProperties["button-text"]}
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
                            {operationProperties["dialog-symbol"]}
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
                            defaultValue={operationProperties["symbol-default-value"]}
                            error={!!errors["symbol"]}
                            helperText={errors["symbol"] ? errors["symbol"].message : ""}
                            {...register("symbol")}
                            InputProps={{
                                readOnly: operationProperties["disable-symbol-filling"]
                            }}
                        />

                        <TextField
                            required
                            fullWidth
                            multiline
                            rows={10}
                            label="Description"
                            type="text"
                            defaultValue={operationProperties["description-default-value"]}
                            error={!!errors["description"]}
                            helperText={errors["description"] ? errors["description"].message : ""}
                            {...register("description")}
                        />

                        <TextField
                            fullWidth
                            label="Website"
                            type="text"
                            defaultValue={operationProperties["website-default-value"]}
                            error={!!errors["website"]}
                            helperText={errors["website"] ? errors["website"].message : ""}
                            {...register("website")}
                        />

                        <TextField
                            fullWidth
                            label="Source"
                            type="text"
                            defaultValue={operationProperties["source-default-value"]}
                            error={!!errors["source"]}
                            helperText={errors["source"] ? errors["source"].message : ""}
                            {...register("source")}
                        />

                        <TextField
                            fullWidth
                            label="Block Reward"
                            type="text"
                            defaultValue={operationProperties["blockReward-default-value"]}
                            error={!!errors["blockReward"]}
                            helperText={errors["blockReward"] ? errors["blockReward"].message : ""}
                            {...register("blockReward")}
                        />

                        <TextField
                            fullWidth
                            label="Total Coins"
                            type="text"
                            defaultValue={operationProperties["totalCoins-default-value"]}
                            error={!!errors["totalCoins"]}
                            helperText={errors["totalCoins"] ? errors["totalCoins"].message : ""}
                            {...register("totalCoins")}
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
