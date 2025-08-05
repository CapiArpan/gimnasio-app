// src/features/auth/components/LoginPage.jsx
import React, { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { supabase } from '../../../lib/supabaseClient.js';  // << ruta corregida
import { useAuth } from '../../../context/AuthContext';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { setUserAndRole } = useAuth();
  const [searchParams] = useSearchParams();
  const justRegistered = searchParams.get('registered') === '1';

  const handleLogin = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setLoading(true);

    // 1. Login con Supabase
    const { data: loginData, error: loginError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (loginError) {
      setErrorMsg('Credenciales incorrectas.');
      setLoading(false);
      return;
    }

    const userId = loginData.user.id;
    const { data: usuarioData, error: userError } = await supabase
      .from('usuarios')
      .select('rol')
      .eq('id_auth', userId)
      .single();

    if (userError || !usuarioData) {
      setErrorMsg('No se pudo obtener el rol del usuario.');
      setLoading(false);
      return;
    }

    setUserAndRole(loginData.user, usuarioData.rol);
    switch (usuarioData.rol) {
      case 'admin':
        navigate('/admin');
        break;
      case 'cliente':
        navigate('/cliente');
        break;
      case 'profesor':
        navigate('/profesor');
        break;
      default:
        navigate('/');
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900 px-4">
      <form onSubmit={handleLogin} className="bg-gray-800 p-8 rounded shadow w-full max-w-sm">
        <h2 className="text-2xl font-bold text-white mb-6 text-center">Iniciar Sesión</h2>
        {justRegistered && (
          <p className="mb-4 text-green-400 text-center">
            Registro exitoso. Por favor, inicia sesión.
          </p>
        )}
        <input
          type="email"
          placeholder="Correo electrónico"
          value={email}
          onChange={e => setEmail(e.target.value)}
          required
          className="w-full mb-4 p-2 rounded bg-gray-700 text-white"
        />
        <input
          type="password"
          placeholder="Contraseña"
          value={password}
          onChange={e => setPassword(e.target.value)}
          required
          className="w-full mb-4 p-2 rounded bg-gray-700 text-white"
        />
        {errorMsg && <p className="text-red-400 mb-4">{errorMsg}</p>}
        <button
          type="submit"
          disabled={loading}
          className="w-full py-2 bg-blue-600 rounded hover:bg-blue-700 text-white"
        >
          {loading ? 'Ingresando...' : 'Ingresar'}
        </button>
        <p className="mt-4 text-center text-gray-400">
          ¿No tienes cuenta?{' '}
          <a href="/register" className="text-blue-400 hover:underline">
            Regístrate
          </a>
        </p>
      </form>
    </div>
  );
}
