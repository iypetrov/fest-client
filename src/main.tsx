import { createRoot } from 'react-dom/client'
import { BrowserRouter } from "react-router";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";

import App from './App.tsx'

const theme = createTheme({
    palette: {
        primary: {
            main: "#9c27b0", 
        },
    },
});

createRoot(document.getElementById('root')!).render(
    <ThemeProvider theme={theme}>
        <CssBaseline />
        <BrowserRouter>
            <App />
        </BrowserRouter>
    </ThemeProvider>
)

