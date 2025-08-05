// src/features/auth/components/LoginPage.jsx
import React, { useState }            from 'react';
import { useNavigate }                from 'react-router-dom';
import { supabase }                   from '../../../lib/supabaseClient.js';
import { useAuth }                    from '../../../context/AuthContext';

export default function LoginPage() {
  const navigate         = useNavigate();
  const { setUserAndRole } = useAuth();

  const [email, setEmail]       = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [loading, setLoading]   = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setLoading(true);

    // 1) Autenticación
    const { data: signInData, error: signInError } =
      await supabase.auth.signInWithPassword({ email, password });

    console.log("→ Auth result:", { signInData, signInError });

    if (signInError) {
      setErrorMsg('Credenciales inválidas.');
      setLoading(false);
      return;
    }

    const user = signInData.user;
    console.log("→ Usuario supabase:", user);

    if (!user) {
      setErrorMsg('No se pudo iniciar sesión.');
      setLoading(false);
      return;
    }

    // 2) Leer rol de tabla 'usuarios' usando id_auth
    console.log("→ Buscando rol en usuarios con id_auth =", user.id);
    const { data: perfil, error: perfilError } = await supabase
      .from('usuarios')
      .select('rol')
      .eq('id_auth', user.id)
      .single();

    console.log("→ Resultado perfil:", { perfil, perfilError });

    if (perfilError || !perfil?.rol) {
      setErrorMsg('No se pudo obtener el rol del usuario.');
      setLoading(false);
      return;
    }

    const rol = perfil.rol;
    // 3) Guardar en contexto y navegar según rol
    setUserAndRole(user, rol);

    if (rol === 'admin')        navigate('/admin');
    else if (rol === 'profesor') navigate('/profesor');
    else                         navigate('/cliente');

    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900 px-4">
      <form onSubmit={handleLogin}
            className="bg-gray-800 p-8 rounded shadow w-full max-w-sm">
        <h2 className="text-2xl font-bold text-white mb-6 text-center">
          Iniciar Sesión
        </h2>

        <input
          type="email"
          placeholder="Correo electrónico"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="w-full mb-4 p-2 rounded bg-gray-700 text-white"
        />

        <input
          type="password"
          placeholder="Contraseña"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className="w-full mb-4 p-2 rounded bg-gray-700 text-white"
        />

        {errorMsg && (
          <p className="text-red-400 mb-4">{errorMsg}</p>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full py-2 bg-blue-600 rounded hover:bg-blue-700 text-white"
        >
          {loading ? 'Ingresando...' : 'Ingresar'}
        </button>
      </form>
    </div>
  );
}
