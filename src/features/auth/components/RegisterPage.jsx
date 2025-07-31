// src/features/auth/components/RegisterPage.jsx
import React, { useState } from 'react';
import { useAuth } from '../../../context/AuthContext';
import { useNavigate } from 'react-router-dom';

export default function RegisterPage() {
  const [email, setEmail]       = useState('');
  const [password, setPassword] = useState('');
  const { signup }              = useAuth();
  const navigate                = useNavigate();
  const [error, setError]       = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { error } = await signup(email, password);
    if (error) {
      setError(error.message);
    } else {
      navigate('/login');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-md mx-auto p-4">
      <h1 className="text-2xl mb-4">Registro</h1>
      {error && <p className="text-red-500">{error}</p>}
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={e => setEmail(e.target.value)}
        className="w-full mb-2 p-2 border rounded"
      />
      <input
        type="password"
        placeholder="Contraseña"
        value={password}
        onChange={e => setPassword(e.target.value)}
        className="w-full mb-4 p-2 border rounded"
      />
      <button type="submit" className="w-full py-2 bg-green-600 text-white rounded">
        Crear cuenta
      </button>
      <p className="mt-4 text-center">
        ¿Ya tienes cuenta? <a href="/login" className="text-green-600">Inicia Sesión</a>
      </p>
    </form>
  );
}
