import { useNavigate } from "react-router-dom";
import { Container, Typography, Box } from "@mui/material";

export function Confirmation() {
  const navigate = useNavigate();

  return (
    <Container
      maxWidth="sm"
      sx={{
        mt: 4,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        textAlign: "center",
      }}
    >
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          mb: 3,
          cursor: "pointer",
        }}
        onClick={() => navigate("/home")}
      >
        <img
          src="https://festteam.bg/wp-content/uploads/2019/11/ft-icon.png"
          alt="Logo"
          width={40}
          height={40}
        />
      </Box>

      <Typography variant="h4" gutterBottom>
        Thank You for Your Purchase!
      </Typography>
      <Typography variant="body1" paragraph>
        Your payment for the event has been accepted.
      </Typography>
      <Typography variant="body2">
        Check your email for the ticket PDF.
      </Typography>
    </Container>
  );
}

