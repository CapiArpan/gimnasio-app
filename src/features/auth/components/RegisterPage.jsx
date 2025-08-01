import React, { useState } from 'react';
import { useAuth } from '../../../context/AuthContext';
import { useNavigate } from 'react-router-dom';

export default function RegisterPage() {
  const navigate = useNavigate();
  const { setUserAndRole } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [loading, setLoading] = useState(false);

  const handleRegister = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setLoading(true);

    // Paso 1: Registro
    const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
      email,
      password,
    });

    if (signUpError) {
      setErrorMsg(signUpError.message || 'No se pudo registrar.');
      setLoading(false);
      return;
    }

    const user = signUpData.user;

    // Paso 2: Si no hay user, probablemente requiere confirmación
    if (!user) {
      setErrorMsg('Revisa tu correo para confirmar la cuenta antes de continuar.');
      setLoading(false);
      return;
    }

    // Paso 3: Insertar rol en tabla usuarios
    const { error: insertError } = await supabase
      .from('usuarios')
      .insert([{ id_auth: user.id, rol: 'admin' }]);

    if (insertError) {
      setErrorMsg('Usuario creado, pero no se pudo asignar el rol.');
      setLoading(false);
      return;
    }

    // Paso 4: Guardar en contexto y redirigir
    setUserAndRole(user, 'admin');
    navigate('/admin');
    setLoading(false);
  };

  return (
    <div style={{ padding: 30 }}>
      <h2>Registrarse</h2>
      <form onSubmit={handleRegister} style={{ display: 'flex', flexDirection: 'column', maxWidth: 300 }}>
        <input
          type="email"
          placeholder="Correo"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          style={{ marginBottom: 10 }}
        />
        <input
          type="password"
          placeholder="Contraseña"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          style={{ marginBottom: 10 }}
        />
        <button type="submit" disabled={loading}>
          {loading ? 'Registrando...' : 'Registrarse'}
        </button>
      </form>
      {errorMsg && <p style={{ color: 'red', marginTop: 10 }}>{errorMsg}</p>}
    </div>
  );
}
