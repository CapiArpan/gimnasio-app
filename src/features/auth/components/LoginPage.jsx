// src/features/auth/components/LoginPage.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../../../lib/supabaseClient';
import { useAuth } from '../../../context/AuthContext';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { setUserAndRole } = useAuth();

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

    // 2. Buscar el rol en la tabla usuarios
    const userId = loginData.user.id;
    const { data: usuarioData, error: userError } = await supabase
      .from('usuarios')
      .select('rol')
      .eq('id', userId)
      .single();

    if (userError || !usuarioData) {
      setErrorMsg('No se pudo obtener el rol del usuario.');
      setLoading(false);
      return;
    }

    // 3. Guardar en contexto
    setUserAndRole(loginData.user, usuarioData.rol);

    // 4. Redirigir según el rol
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
    <div className="flex items-center justify-center min-h-screen bg-gray-900 text-white px-4">
      <form onSubmit={handleLogin} className="bg-gray-800 p-8 rounded-lg shadow-md w-full max-w-sm">
        <h2 className="text-2xl font-bold mb-6 text-center">Iniciar Sesión</h2>

        <label className="block mb-2 text-sm">Correo electrónico</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="w-full px-4 py-2 mb-4 rounded bg-gray-700 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        <label className="block mb-2 text-sm">Contraseña</label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className="w-full px-4 py-2 mb-4 rounded bg-gray-700 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        {errorMsg && <p className="text-red-500 text-sm mb-4">{errorMsg}</p>}

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded"
        >
          {loading ? 'Ingresando...' : 'Ingresar'}
        </button>
        <div className="text-sm mt-4 text-center">
  ¿No tienes cuenta?{' '}
  <a href="/login/register" className="text-blue-400 hover:underline">
    Regístrate aquí
  </a>
</div>

      </form>
    </div>
  );
}
