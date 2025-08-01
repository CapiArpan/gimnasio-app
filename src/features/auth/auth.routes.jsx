// src/features/auth/auth.routes.jsx
import { Routes, Route } from 'react-router-dom';
import LoginPage from './components/LoginPage';
import RegisterPage from './components/RegisterPage';

export default function AuthRoutes() {
  return (
    <Routes>
      <Route path="" element={<LoginPage />} /> {/* Coincide con /login */}
      <Route path="register" element={<RegisterPage />} /> {/* Coincide con /login/register */}
    </Routes>
  );
}
