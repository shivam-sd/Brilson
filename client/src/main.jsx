import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import {BrowserRouter} from "react-router-dom";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import {CartProvider} from "./Pages/ContaxtAPI/CartContext.jsx";
import {GoogleOAuthProvider} from "@react-oauth/google"

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}>
    <BrowserRouter>
    <ToastContainer position="top-right" />
    <CartProvider>
      <App />
    </CartProvider>
    </BrowserRouter>
    </GoogleOAuthProvider>
  </StrictMode>,
)
