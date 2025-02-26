import { useStripe, useElements, CardElement } from "@stripe/react-stripe-js";
import { enqueueSnackbar } from "notistack";
import { useNavigate } from "react-router-dom";
import { Box, Button } from "@mui/material";
import { useSelector } from 'react-redux';

import { RootState } from '../store';

async function fetchPaymentIntent(token: string | undefined, userId: string, ticketId: string) {
  const response = await fetch("http://localhost:8080/api/v0/payments", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        credentials: "include",
        mode: "cors",
        body: JSON.stringify({ userId, ticketId }),
    });

  if (!response.ok) {
    throw new Error("Failed to fetch payment intent");
  }

  return response.json();
}

export function PaymentForm({ price, userId, ticketId }: { price: number, userId: string; ticketId: string }) {
  const stripe = useStripe();
  const elements = useElements();
  const navigate = useNavigate();
  const user = useSelector((state: RootState) => state.user.user);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!stripe || !elements) {
      return;
    }

    try {
      const payment = await fetchPaymentIntent(user?.token, userId, ticketId);
      const cardElement = elements.getElement(CardElement);
      if (!cardElement) {
        enqueueSnackbar("Card details are required", { variant: "error" });
        return;
      }

      const { paymentIntent, error } = await stripe.confirmCardPayment(payment.clientSecret, {
        payment_method: { card: cardElement },
      });

      if (error) {
        enqueueSnackbar(error.message, { variant: "error" });
      } else if (paymentIntent.status === "succeeded") {
        enqueueSnackbar("Payment successful!", { variant: "success" });
        navigate(`/payment/${ticketId}`);
      }
    } catch (error: any) {
      enqueueSnackbar(error.message || "Payment failed", { variant: "error" });
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <Box sx={{ mt: 2, p: 2, border: "1px solid #ccc", borderRadius: 1 }}>
        <CardElement options={{ hidePostalCode: true }} />
      </Box>
      <Button type="submit" variant="contained" color="primary" sx={{ mt: 3 }} disabled={!stripe}>
        Pay ${price.toFixed(2)}
      </Button>
    </form>
  );
}

