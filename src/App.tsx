import { Routes, Route, Navigate } from 'react-router-dom';
import { SnackbarProvider } from 'notistack'

import { Register } from './views/Register';
import { Login } from './views/Login';
import { Home } from './views/Home';

function App() {
    return (
        <>
            <SnackbarProvider
              anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
            >
                <Routes>
                    <Route path="/home" element={<Home />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />
                    <Route path="*" element={<Navigate to="/home" />} />
                </Routes>
            </SnackbarProvider>
        </>
    )
}

export default App

