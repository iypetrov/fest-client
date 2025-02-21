import { useState, ChangeEvent, FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Container, Typography, Button, TextField, Stack, Box } from "@mui/material";
import { enqueueSnackbar } from "notistack";
import { useDispatch } from 'react-redux';

import { AppDispatch } from '../store';
import { User, setUser } from '../store/slices/userSlice';

export function Register() {
    const dispatch = useDispatch<AppDispatch>();
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        email: "",
        password: "",
    });

    const handleChangeFormData = (e: ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleRegister = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        fetch("http://localhost:8080/api/v0/register", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            credentials: "include", 
            mode: "cors",
            body: JSON.stringify(formData)
        })
        .then((response) => {
            if (!response.ok) {
                return response.text().then((errorText) => {
                    throw new Error(errorText);
                });
            }

            const token = response.headers.get("Authorization")?.replace("Bearer ", "");
            if (!token) {
                throw new Error("Missing authentication token");
            }

            return response.json().then((data) => ({
                data: data,
                token: token, 
            }));
        })
        .then(({ data, token }) => {
            const user: User = {
                id: data.id,
                email: data.email,
                role: data.role,
                token: token, 
            };

            dispatch(setUser(user));
            enqueueSnackbar("Registration was successful!", { variant: "success" });
            navigate("/home");
        })
        .catch((error) => {
            enqueueSnackbar(error.message, { variant: "error" });
        });
    };

    return (
        <Box
        sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            minHeight: "100vh",
        }}
        >
            <Container maxWidth="xs">
                <Box sx={{ display: "flex", justifyContent: "center", mb: 2 }}>
                    <img src="https://festteam.bg/wp-content/uploads/2019/11/ft-icon.png" alt="Logo" width={80} height={80} />
                </Box>
                <form onSubmit={handleRegister}>
                    <Typography variant="h5" align="center" gutterBottom>
                       Registration 
                    </Typography>
                    <Stack spacing={2}>
                        <TextField
                            fullWidth
                            label="Email"
                            name="email"
                            value={formData.email}
                            onChange={handleChangeFormData}
                            margin="normal"
                        />
                        <TextField
                            fullWidth
                            label="Password"
                            name="password"
                            type="password"
                            value={formData.password}
                            onChange={handleChangeFormData}
                            margin="normal"
                        />
                        <Typography variant="body2" align="center">
                            Already have an account? <Link to="/login">Login here</Link>
                        </Typography>
                        <Button type="submit" variant="contained" color="primary" fullWidth>
                            Sign Up 
                        </Button>
                    </Stack>
                </form>
            </Container>
        </Box>
    );
}

