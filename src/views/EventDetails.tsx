import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Container, Typography, Card, CardMedia, CardContent, Box } from "@mui/material";
import { enqueueSnackbar } from "notistack";
import { useSelector } from "react-redux";

import { RootState } from "../store";

interface Event {
  id: string;
  name: string;
  description: string;
  thumbnailUrl: string;
  location: string;
  startTime: string;
  endTime: string;
}

interface TicketsSummary {
  standardTicketsPrice: number;
  standardTicketsCount: number;
  vipTicketsPrice: number;
  vipTicketsCount: number;
}

export function EventDetails() {
  const user = useSelector((state: RootState) => state.user.user);
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [event, setEvent] = useState<Event | null>(null);
  const [ticketsSummary, setTicketsSummary] = useState<TicketsSummary>({
    standardTicketsPrice: 0,
    standardTicketsCount: 0,
    vipTicketsPrice: 0,
    vipTicketsCount: 0,
  });

  useEffect(() => {
    fetch(`http://localhost:8080/api/v0/events/${id}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${user?.token}`,
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
      .then((data) => setEvent(data))
      .catch((err) => {
        console.error("Error fetching event:", err);
        enqueueSnackbar("Failed to load event", { variant: "error" });
      });

    fetch(`http://localhost:8080/api/v0/tickets/events/summary/${id}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${user?.token}`,
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
      .then((data) => {
        const summary: TicketsSummary = {
          standardTicketsPrice: 0,
          standardTicketsCount: 0,
          vipTicketsPrice: 0,
          vipTicketsCount: 0,
        };

        data.forEach((ticket: { type: string; price: number; availableCount: number }) => {
          if (ticket.type === "STANDARD") {
            summary.standardTicketsPrice = ticket.price;
            summary.standardTicketsCount = ticket.availableCount;
          } else if (ticket.type === "VIP") {
            summary.vipTicketsPrice = ticket.price;
            summary.vipTicketsCount = ticket.availableCount;
          }
        });

        setTicketsSummary(summary);
      })
      .catch((err) => {
        console.error("Error fetching tickets summary:", err);
        enqueueSnackbar("Failed to load tickets summary", { variant: "error" });
      });
  }, [id]);

  const handleCheckout = (ticketType: string, price: number) => {
    navigate(`/checkout?eventId=${id}&type=${ticketType}&price=${price}`);
  };

  if (!event) {
    return <Typography align="center">Event not found.</Typography>;
  }

  return (
    <Container maxWidth="md" sx={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "100vh" }}>
      <Card sx={{ width: "100%", textAlign: "center", p: 2, boxShadow: 3 }}>
        <CardMedia component="img" height="300" image={event.thumbnailUrl} alt={event.name} sx={{ borderRadius: 2 }} />
        <CardContent>
          <Typography variant="h4" gutterBottom>{event.name}</Typography>
          <Typography variant="body1" paragraph>{event.description}</Typography>
          <Typography variant="subtitle1"><strong>Location:</strong> {event.location}</Typography>
          <Typography variant="subtitle2"><strong>Time:</strong> {event.startTime} - {event.endTime}</Typography>

          <Box sx={{ mt: 3 }}>
            <Typography variant="h5" gutterBottom>Available Tickets</Typography>
            {ticketsSummary.standardTicketsCount > 0 || ticketsSummary.vipTicketsCount > 0 ? (
              <>
                {ticketsSummary.standardTicketsCount > 0 && (
                  <Box sx={{ mb: 2, p: 3, border: "1px solid #ddd", borderRadius: 2, cursor: "pointer", "&:hover": { backgroundColor: "#f0f0f0" } }}
                    onClick={() => handleCheckout("STANDARD", ticketsSummary.standardTicketsPrice)}>
                    <Typography variant="h6"><strong>STANDARD Ticket</strong></Typography>
                    <Typography variant="body1">Price: ${ticketsSummary.standardTicketsPrice.toFixed(2)}</Typography>
                    <Typography variant="body2">Available: {ticketsSummary.standardTicketsCount}</Typography>
                  </Box>
                )}
                {ticketsSummary.vipTicketsCount > 0 && (
                  <Box sx={{ mb: 2, p: 3, border: "1px solid #ddd", borderRadius: 2, cursor: "pointer", "&:hover": { backgroundColor: "#f0f0f0" } }}
                    onClick={() => handleCheckout("VIP", ticketsSummary.vipTicketsPrice)}>
                    <Typography variant="h6"><strong>VIP Ticket</strong></Typography>
                    <Typography variant="body1">Price: ${ticketsSummary.vipTicketsPrice.toFixed(2)}</Typography>
                    <Typography variant="body2">Available: {ticketsSummary.vipTicketsCount}</Typography>
                  </Box>
                )}
              </>
            ) : (
              <Typography>No tickets available.</Typography>
            )}
          </Box>
        </CardContent>
      </Card>
    </Container>
  );
}

