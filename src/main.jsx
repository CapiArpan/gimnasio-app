// src/main.jsx
import React from "react";
import ReactDOM from "react-dom/client";
import AppRouter from "./routes/AppRouter";
import { AuthProvider } from "./context/AuthContext";
import "./styles/index.css";

// 🔍 Verificar variables de entorno cargadas
console.log("Variables cargadas desde .env (Vite):", import.meta.env);

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <AuthProvider>
      <AppRouter />
    </AuthProvider>
  </React.StrictMode>
);
