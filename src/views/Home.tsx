import { useEffect } from 'react';
import { Container, Typography, Button, AppBar, Toolbar, Box, IconButton } from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';

import { AppDispatch, RootState } from '../store';
import { clearUser } from '../store/slices/userSlice';
import { enqueueSnackbar } from 'notistack';

export function Home() {
    const dispatch = useDispatch<AppDispatch>();
    const navigate = useNavigate();
    const user = useSelector((state: RootState) => state.user.user);

    const handleIconClick = (e: React.MouseEvent) => {
        const isShiftPressed = e.shiftKey;

        if (isShiftPressed) {
            const token = user ? user.token : 'default'; 
            navigator.clipboard.writeText(token)
            .catch((err) => {
                console.error("Failed to copy token: ", err);
            });

            enqueueSnackbar("Token was copied to the clipboard.", { variant: "success" });
        } else {
            fetch("http://localhost:8080/api/v0/logout", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${user?.token}`,
                },
                credentials: "include", 
                mode: "cors",
            })
            .then((response) => {
                if (!response.ok) {
                    throw new Error("Logout failed");
                }

                dispatch(clearUser());
                enqueueSnackbar("Logout was successful!", { variant: "success" });
                navigate("/login");
            })
            .catch((error) => {
                enqueueSnackbar(error.message, { variant: "error" });
            });
        }
    };

    useEffect(() => {
        // fetch(`http://localhost:8080/api/v0/users/${user?.id}`, {
        //     method: "GET",
        //     headers: {
        //         "Content-Type": "application/json",
        //         "Authorization": `Bearer ${user?.token}`,
        //     },
        //     credentials: "include", 
        //     mode: "cors",
        // })
        // .then((response) => {
        //     if (!response.ok) {
        //         return response.text().then((errorText) => {
        //             throw new Error(errorText);
        //         });
        //     }

        //     return response.json();
        // })
        // .then((data) => {
        //     console.log(data);
        //     enqueueSnackbar(data.id, { variant: "success" });
        // })
        // .catch((error) => {
        //     enqueueSnackbar(error.message, { variant: "error" });
        // });
    }, []);

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <AppBar position="sticky">
        <Toolbar>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            <Box sx={{ display: "flex", justifyContent: "left" }}>
              <img src="https://festteam.bg/wp-content/uploads/2019/11/ft-icon.png" alt="Logo" width={40} height={40} />
            </Box>
          </Typography>

          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Typography variant="body1" sx={{ mr: 2 }}>
                { user ? user.email : "default@gmail.com" }
            </Typography>
            <IconButton
              onClick={handleIconClick}
              sx={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                width: 44,
                height: 44,
                borderRadius: '50%',
                backgroundColor: 'white', 
                overflow: 'hidden',
              }}
            >
              <img
                src={`https://robohash.org/${user ? user.id : "default_id"}`}
                alt="User Icon"
                width={40}
                height={40}
                style={{ borderRadius: '50%' }}
              />
            </IconButton>
          </Box>
        </Toolbar>
      </AppBar>

      <Container sx={{ flexGrow: 1, mt: 3 }}>
        <Typography variant="h4" gutterBottom>
          Welcome to the Home Page
        </Typography>
        <Button component={Link} to="/login" variant="contained" color="primary" sx={{ mr: 2 }}>
          Login
        </Button>
        <Button component={Link} to="/register" variant="outlined" color="secondary">
          Register
        </Button>
      </Container>
    </Box>
  );
}

