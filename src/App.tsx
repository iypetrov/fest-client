import { Routes, Route, Navigate } from 'react-router-dom';
import { Provider } from 'react-redux';
import { SnackbarProvider } from 'notistack'
import { ThemeProvider, createTheme } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";

import { store } from './store';
import { Register } from './views/Register';
import { Login } from './views/Login';
import { Home } from './views/Home';
import { EventDetails } from './views/EventDetails';
import { Checkout } from './views/Checkout';
import { Confirmation } from './views/Confirmation';

function App() {
    const theme = createTheme();

    return (
        <ThemeProvider theme={theme}>
            <CssBaseline />
            <SnackbarProvider maxSnack={3} autoHideDuration={3000} anchorOrigin={{ vertical: "bottom", horizontal: "center" }}>
                <Provider store={store}>
                    <Routes>
                        <Route path="/home" element={<Home />} />
                        <Route path="/login" element={<Login />} />
                        <Route path="/register" element={<Register />} />
                        <Route path="/events/:id" element={<EventDetails />} />
                        <Route path="/checkout" element={<Checkout />} />
                        <Route path="/confirmation/:id" element={<Confirmation />} />
                        <Route path="*" element={<Navigate to="/login" />} />
                    </Routes>
                </Provider>
            </SnackbarProvider>
        </ThemeProvider>
    )
}

export default App

