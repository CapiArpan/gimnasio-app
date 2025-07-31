// src/features/rutinas/RutinasPage.jsx
import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabaseClient";

export default function RutinasPage() {
  const [rutinas, setRutinas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [nuevo, setNuevo] = useState({
    descripcion: "",
  });

  const cargarRutinas = async () => {
    setLoading(true);
    const { data, error } = await supabase.from("rutinas").select("*");
    if (error) {
      console.error(error);
    } else {
      setRutinas(data);
    }
    setLoading(false);
  };

  useEffect(() => {
    cargarRutinas();
  }, []);

  const agregarRutina = async (e) => {
    e.preventDefault();
    const { error } = await supabase.from("rutinas").insert([nuevo]);
    if (error) {
      alert("Error al agregar rutina");
    } else {
      alert("Rutina agregada");
      setNuevo({ descripcion: "" });
      cargarRutinas();
    }
  };

  const eliminarRutina = async (id) => {
    if (!confirm("¿Eliminar rutina?")) return;
    const { error } = await supabase.from("rutinas").delete().eq("id", id);
    if (error) {
      alert("Error eliminando rutina");
    } else {
      cargarRutinas();
    }
  };

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">Rutinas</h2>

      <form
        onSubmit={agregarRutina}
        className="bg-gray-100 p-4 rounded mb-6 flex items-center gap-2"
      >
        <input
          type="text"
          placeholder="Descripción"
          value={nuevo.descripcion}
          onChange={(e) => setNuevo({ descripcion: e.target.value })}
          className="border p-2 rounded flex-grow"
          required
        />
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          Agregar
        </button>
      </form>

      {loading ? (
        <p>Cargando rutinas...</p>
      ) : (
        <ul className="space-y-2">
          {rutinas.map((rt) => (
            <li
              key={rt.id}
              className="flex justify-between items-center bg-white p-4 rounded shadow"
            >
              <span>{rt.descripcion}</span>
              <button
                onClick={() => eliminarRutina(rt.id)}
                className="bg-red-500 text-white px-2 py-1 rounded"
              >
                Eliminar
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
