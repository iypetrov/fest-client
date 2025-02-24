import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Container, Typography, Box, Button, TextField } from "@mui/material";
import { enqueueSnackbar } from "notistack";

export function Checkout() {
  const navigate = useNavigate();
  const location = useLocation();
  const [ticketDetails, setTicketDetails] = useState({
    eventId: "",
    ticketType: "",
    price: 0,
    quantity: 1,
    totalPrice: 0,
  });

  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const eventId = searchParams.get("eventId");
    const ticketType = searchParams.get("ticketType");
    const price = parseFloat(searchParams.get("price") || "0");

    if (eventId && ticketType && price) {
      setTicketDetails((prev) => ({
        ...prev,
        eventId,
        ticketType,
        price,
        totalPrice: price,
      }));
    } else {
      navigate("/home"); 
    }
  }, [location.search, navigate]);

  const handleQuantityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const quantity = parseInt(e.target.value, 10) || 1;
    setTicketDetails((prev) => ({
      ...prev,
      quantity,
      totalPrice: prev.price * quantity,
    }));
  };

  const handleCheckoutSubmit = () => {
    // Placeholder for actual payment logic
    // You would make an API call here to process the payment and handle success/failure

    enqueueSnackbar("Checkout successful!", { variant: "success" });
    // TODO: pass the payment's id
    navigate(`/confirmation/${ticketDetails.eventId}`); 
  };

  return (
    <Container maxWidth="md" sx={{ display: "flex", flexDirection: "column", alignItems: "center", mt: 4 }}>
      <Typography variant="h4" gutterBottom>Checkout</Typography>
      <Box sx={{ width: "100%", p: 3, border: "1px solid #ddd", borderRadius: 2, boxShadow: 2 }}>
        <Typography variant="h6">{ticketDetails.ticketType} Ticket</Typography>
        <Typography variant="body1">Price per Ticket: ${ticketDetails.price.toFixed(2)}</Typography>
        <TextField
          label="Quantity"
          type="number"
          value={ticketDetails.quantity}
          onChange={handleQuantityChange}
          fullWidth
          sx={{ mt: 2 }}
          InputProps={{ inputProps: { min: 1 } }}
        />
        <Typography variant="h6" sx={{ mt: 2 }}>
          Total Price: ${ticketDetails.totalPrice.toFixed(2)}
        </Typography>
        <Button
          variant="contained"
          color="primary"
          sx={{ mt: 3 }}
          onClick={handleCheckoutSubmit}
        >
          Complete Checkout
        </Button>
      </Box>
    </Container>
  );
}

