import { useState, useEffect } from "react";
import { supabase } from "../lib/api/supabaseClient";

export default function Perfil() {
  const [perfil, setPerfil] = useState(null);

  const cargar = async () => {
    const user = (await supabase.auth.getUser()).data.user;
    const { data } = await supabase.from("usuarios").select("*").eq("id", user.id).single();
    setPerfil(data);
  };

  useEffect(() => { cargar(); }, []);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Mi Perfil</h1>
      {perfil && (
        <div>
          <p><b>Nombre:</b> {perfil.nombre}</p>
          <p><b>Email:</b> {perfil.email}</p>
          <p><b>Rol:</b> {perfil.rol}</p>
        </div>
      )}
    </div>
  );
}
