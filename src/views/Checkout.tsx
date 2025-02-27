import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Container, Typography, Box } from "@mui/material";
import { enqueueSnackbar } from "notistack";
import { useSelector } from "react-redux";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";

import { RootState } from "../store";
import { PaymentForm } from "../components/PaymentForm";

export function Checkout() {
  const navigate = useNavigate();
  const location = useLocation();
  const user = useSelector((state: RootState) => state.user.user);

  const searchParams = new URLSearchParams(location.search);
  const eventId = searchParams.get("eventId");
  const price = parseFloat(searchParams.get("price") || "0");
  const type = searchParams.get("type");

  const [ticketId, setTicketId] = useState("");
  const stripePromise = loadStripe("pk_test_51Q7K6uFb9GGnrUxlNysV5xIJHXvwVgSRHOSoSnPB6SAb7JBwPQfbX1ImeekURPYbcODf7Ht3MeppBRgtWvBHxaN500TremkxZ2");

  useEffect(() => {
      const urlAvailableTickets = new URL("http://localhost:8080/api/v0/tickets/available");
      urlAvailableTickets.searchParams.append("eventId", eventId!);
      urlAvailableTickets.searchParams.append("price", price!.toString());
      urlAvailableTickets.searchParams.append("type", type!);
      fetch(urlAvailableTickets.toString(), {
          method: "GET",
          headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${user?.token}`,
          },
          credentials: "include",
          mode: "cors",
      })
      .then((res) => res.json())
      .then((ticket) => {
          setTicketId(ticket.id);
      })
      .catch((err) => {
          console.error("Error fetching available ticket:", err);
          enqueueSnackbar("Failed to find available ticket", { variant: "error" });
      });
  }, [location.search, navigate, user?.token]);


  return (
    <Container maxWidth="md" sx={{ display: "flex", flexDirection: "column", alignItems: "center", mt: 4 }}>
      <Typography variant="h4" gutterBottom>Checkout</Typography>
      <Box sx={{ width: "100%", p: 3, border: "1px solid #ddd", borderRadius: 2, boxShadow: 2 }}>
        <Typography variant="h6">{ type } Ticket</Typography>
        <Typography variant="body1">Price per Ticket: ${price.toFixed(2)}</Typography>
        <Typography variant="h6" sx={{ mt: 2 }}>
          Total Price: ${price.toFixed(2)}
        </Typography>
        {stripePromise && (
          <Elements stripe={stripePromise}>
            <PaymentForm price= {price} userId={user!.id} ticketId={ticketId} />
          </Elements>
        )}
      </Box>
    </Container>
  );
}

