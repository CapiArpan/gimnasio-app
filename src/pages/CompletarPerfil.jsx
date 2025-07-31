import { useState } from "react";
import { supabase } from "../lib/supabaseClient";

export default function CompletarPerfil({ usuario, onComplete }) {
  const [nombre, setNombre] = useState("");
  const [guardando, setGuardando] = useState(false);
  const [error, setError] = useState("");

  const guardarNombre = async (e) => {
    e.preventDefault();
    setError("");
    setGuardando(true);

    const { error } = await supabase
      .from("usuarios")
      .update({ nombre })
      .eq("id", usuario.id);

    setGuardando(false);
    if (error) {
      console.error(error);
      setError("No se pudo guardar.");
    } else {
      alert("Perfil actualizado");
      onComplete();
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <form onSubmit={guardarNombre} className="bg-white p-6 rounded shadow w-80">
        <h2 className="text-xl font-bold mb-4">Completar Perfil</h2>
        {error && <p className="text-red-500">{error}</p>}
        <input
          className="border p-2 w-full mb-3"
          type="text"
          placeholder="Tu nombre"
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
        />
        <button
          type="submit"
          disabled={guardando}
          className="bg-blue-600 text-white px-4 py-2 w-full"
        >
          Guardar
        </button>
      </form>
    </div>
  );
}

