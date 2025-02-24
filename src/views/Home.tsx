import { useEffect, useState } from 'react';
import { Container, Typography, Grid, Box, AppBar, Toolbar, IconButton } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';

import { AppDispatch, RootState } from '../store';
import { clearUser } from '../store/slices/userSlice';
import { enqueueSnackbar } from 'notistack';
import { EventCard } from '../components/EventCard';

interface Event {
  id: string;
  name: string;
  thumbnailUrl: string;
}

export function Home() {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const user = useSelector((state: RootState) => state.user.user);
  const [events, setEvents] = useState<Event[]>([]);

  useEffect(() => {
    fetch("http://localhost:8080/api/v0/events/", {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${user?.token}`,
        },
        credentials: "include", 
        mode: "cors",
      })
      .then((response) => {
          if (!response.ok) {
              return response.text().then((errorText) => {
                  throw new Error(errorText);
              });
          }

          return response.json();
      })
      .then(data => setEvents(data))
      .catch(error => {
          console.error("Error fetching events:", error);
          enqueueSnackbar("Failed to load events", { variant: "error" });
      });
  }, []);

  const handleIconClick = (e: React.MouseEvent) => {
    if (e.shiftKey) {
      navigator.clipboard.writeText(user?.token || 'default');
      enqueueSnackbar("Token copied!", { variant: "success" });
    } else {
      dispatch(clearUser());
      enqueueSnackbar("Logged out!", { variant: "success" });
      navigate("/login");
    }
  };

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
            <IconButton onClick={handleIconClick} sx={{ width: 44, height: 44, borderRadius: '50%', backgroundColor: 'white' }}>
              <img src={`https://robohash.org/${user ? user.id : "default_id"}`} alt="User Icon" width={40} height={40} style={{ borderRadius: '50%' }} />
            </IconButton>
          </Box>
        </Toolbar>
      </AppBar>

      <Container sx={{ flexGrow: 1, mt: 3 }}>
        <Grid container spacing={2}>
          {events.map(event => (
            <Grid item key={event.id} xs={12} sm={6} md={4}>
              <EventCard id={event.id} name={event.name} thumbnailUrl={event.thumbnailUrl} />
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
}

