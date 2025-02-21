import { useState, ChangeEvent, FormEvent, KeyboardEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Container, Typography, Button, TextField, Stack, Box } from "@mui/material";
import { enqueueSnackbar } from "notistack";

export function Register() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleChangeFormData = (e: ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleRegistration = async (e?: FormEvent<HTMLFormElement>) => {
    if (e) e.preventDefault();

    try {
      const response = await fetch("http://localhost:8080/api/v0/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error("Registration failed");
      }

      const data = await response.json();
      console.log(data);
      enqueueSnackbar("Registration successful!", { variant: "success" });
      navigate("/");
    } catch (error: any) {
      console.error(error);
      enqueueSnackbar(error.message, { variant: "error" });
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLFormElement>) => {
    if ((e.metaKey || e.ctrlKey) && e.key === "Enter") {
      handleRegistration();
    }
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
        <form onSubmit={handleRegistration} onKeyDown={handleKeyDown}>
          <Typography variant="h5" align="center" gutterBottom>
            Register
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

