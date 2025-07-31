// src/context/AuthContext.jsx
import { createContext, useContext, useEffect, useState } from "react";
import { supabase } from '../lib/supabaseClient';


const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);         // Sesión Supabase
  const [role, setRole] = useState(null);         // Rol: admin, profesor, cliente
  const [loading, setLoading] = useState(true);   // Estado de carga

  useEffect(() => {
    const getSessionAndUser = async () => {
      setLoading(true);
      const {
        data: { session },
        error,
      } = await supabase.auth.getSession();

      if (error || !session) {
        setUser(null);
        setRole(null);
        setLoading(false);
        return;
      }

      const currentUser = session.user;
      setUser(currentUser);

      // Obtener rol desde la tabla usuarios
      const { data, error: userError } = await supabase
        .from("usuarios")
        .select("rol")
        .eq("id_auth", currentUser.id)
        .single();

      if (userError) {
        console.error("Error al obtener rol:", userError.message);
        setRole(null);
      } else {
        setRole(data.rol);
      }

      setLoading(false);
    };

    getSessionAndUser();

    const { data: listener } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (session?.user) {
          setUser(session.user);

          const { data, error: roleError } = await supabase
            .from("usuarios")
            .select("rol")
            .eq("id_auth", session.user.id)
            .single();

          setRole(roleError ? null : data.rol);
        } else {
          setUser(null);
          setRole(null);
        }
      }
    );

    return () => {
      listener.subscription.unsubscribe();
    };
  }, []);

  const logout = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setRole(null);
  };

  return (
    <AuthContext.Provider value={{ user, role, loading, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
