import { zodResolver } from "@hookform/resolvers/zod";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import TextField from "@mui/material/TextField";
import React, { useContext, useEffect, useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { object, string, TypeOf } from "zod";
import "./css/Footer.css";
import { Amplify, Auth } from "aws-amplify";
import Alert from "@mui/material/Alert";
import { AuthContext } from "../App";

Amplify.configure({
    Auth: {
        userPoolId: "",
        region: "",
        userPoolWebClientId: "",
    }
});

const loginSchema = object({
    email: string({
        required_error: "Email is required"
    }).min(1, { message: "Email is required" }),
    password: string({
        required_error: "Password is required"
    }).min(1, { message: "Password is required" })
});

type LoginInput = TypeOf<typeof loginSchema>;

export default function Footer(props: { setIsAdminAuth: any }) {
    const [isLoginDialogOpen, setIsLoginDialogOpen] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");

    const isAdminAuth = useContext(AuthContext);

    const {
        reset,
        register,
        handleSubmit,
        formState: { isSubmitSuccessful, errors },
    } = useForm<LoginInput>({
        resolver: zodResolver(loginSchema),
    });

    useEffect(() => {
        if (isSubmitSuccessful) {
            reset();
        }
    }, [isSubmitSuccessful, reset]);

    const handleLoginDialogClose = () => {
        setErrorMessage("");
        setIsLoginDialogOpen(false);
    }

    const onSubmitHandler: SubmitHandler<LoginInput> = async (values) => {
        try {
            await Auth.signIn(values.email, values.password);
            setErrorMessage("");
            props.setIsAdminAuth(true);
            setIsLoginDialogOpen(false);
        } catch (error: any) {
            setErrorMessage(error.message);
        }
    };

    return (
        <>
            <div className="footer">
                {isAdminAuth ?
                    <p className="logout-text" onClick={() => props.setIsAdminAuth(false)}>Logout</p> :
                    <p className="login-text" onClick={() => setIsLoginDialogOpen(true)}>Login as administrator</p>}
            </div>
            <Dialog open={isLoginDialogOpen} onClose={handleLoginDialogClose}>
                <DialogTitle>Login as administrator</DialogTitle>
                <DialogContent>
                    <Box
                        component="form"
                        noValidate
                        autoComplete="off"
                        onSubmit={handleSubmit(onSubmitHandler)}
                    >
                        <TextField
                            required
                            margin="dense"
                            id="email-inpur"
                            label="Email"
                            type="email"
                            fullWidth
                            variant="standard"
                            error={!!errors["email"]}
                            helperText={errors["email"] ? errors["email"].message : ""}
                            {...register("email")}
                        />
                        <TextField
                            required
                            margin="dense"
                            id="password-input"
                            label="Password"
                            type="password"
                            fullWidth
                            variant="standard"
                            error={!!errors["password"]}
                            helperText={errors["password"] ? errors["password"].message : ""}
                            {...register("password")}
                        />
                        {errorMessage !== "" && <Alert severity="error">{errorMessage}</Alert>}
                        <div className="action-buttons-group">
                            <Button className="cancel-button" onClick={handleLoginDialogClose}>Cancel</Button>
                            <Button className="login-button" type="submit">Login</Button>
                        </div>
                    </Box>
                </DialogContent>
            </Dialog>
        </>
    );
}