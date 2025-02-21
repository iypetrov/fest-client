import { useState, useEffect } from 'react';
import { Container, Typography, Button, AppBar, Toolbar, Box, IconButton } from '@mui/material';
import { Link } from 'react-router-dom';

export function Home() {
  const [userData, setUserData] = useState<{ email: string | null; id: string | null }>({ email: null, id: null });

  useEffect(() => {
      const userId = '67b7474d2e58c9b8615e4620';

      fetch(`http://localhost:8080/api/v0/users/${userId}`)
          .then(response => {
          if (!response.ok) {
              throw new Error('Failed to fetch user data');
          }
          return response.json();
      })
      .then(data => {
          setUserData({ email: data.email, id: data.id });
      })
      .catch(error => {
          console.error('Error fetching user data', error);
      });
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
              {userData.email}
            </Typography>
            <IconButton
              component={Link}
              to="/home"
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
                src={`https://robohash.org/${userData.id}`}
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

