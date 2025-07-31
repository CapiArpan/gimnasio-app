// src/features/ejercicios/EjerciciosPage.jsx
import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabaseClient";

export default function EjerciciosPage() {
  const [ejercicios, setEjercicios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [nuevo, setNuevo] = useState({
    nombre: "",
    musculo_objetivo: "",
    descripcion: "",
    video_url: "",
  });

  const cargarEjercicios = async () => {
    setLoading(true);
    const { data, error } = await supabase.from("ejercicios").select("*");
    if (error) {
      console.error(error);
    } else {
      setEjercicios(data);
    }
    setLoading(false);
  };

  useEffect(() => {
    cargarEjercicios();
  }, []);

  const agregarEjercicio = async (e) => {
    e.preventDefault();
    const { error } = await supabase.from("ejercicios").insert([nuevo]);
    if (error) {
      alert("Error al agregar ejercicio");
    } else {
      alert("Ejercicio agregado");
      setNuevo({
        nombre: "",
        musculo_objetivo: "",
        descripcion: "",
        video_url: "",
      });
      cargarEjercicios();
    }
  };

  const eliminarEjercicio = async (id) => {
    if (!confirm("¿Eliminar ejercicio?")) return;
    const { error } = await supabase.from("ejercicios").delete().eq("id", id);
    if (error) {
      alert("Error eliminando ejercicio");
    } else {
      cargarEjercicios();
    }
  };

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">Ejercicios Base</h2>

      {/* Formulario */}
      <form
        onSubmit={agregarEjercicio}
        className="bg-gray-100 p-4 rounded mb-6 flex flex-wrap gap-2"
      >
        <input
          type="text"
          placeholder="Nombre"
          value={nuevo.nombre}
          onChange={(e) => setNuevo({ ...nuevo, nombre: e.target.value })}
          className="border p-2 rounded w-48"
          required
        />

        <input
          type="text"
          placeholder="Músculo objetivo"
          value={nuevo.musculo_objetivo}
          onChange={(e) =>
            setNuevo({ ...nuevo, musculo_objetivo: e.target.value })
          }
          className="border p-2 rounded w-48"
        />

        <input
          type="text"
          placeholder="Descripción"
          value={nuevo.descripcion}
          onChange={(e) =>
            setNuevo({ ...nuevo, descripcion: e.target.value })
          }
          className="border p-2 rounded w-64"
        />

        <input
          type="text"
          placeholder="Video URL"
          value={nuevo.video_url}
          onChange={(e) =>
            setNuevo({ ...nuevo, video_url: e.target.value })
          }
          className="border p-2 rounded w-64"
        />

        <button
          type="submit"
          className="bg-green-600 text-white px-4 py-2 rounded"
        >
          Agregar
        </button>
      </form>

      {/* Tabla */}
      {loading ? (
        <p>Cargando ejercicios...</p>
      ) : (
        <table className="table-auto border-collapse border border-gray-400">
          <thead>
            <tr>
              <th className="border px-4 py-2">Nombre</th>
              <th className="border px-4 py-2">Músculo</th>
              <th className="border px-4 py-2">Descripción</th>
              <th className="border px-4 py-2">Video</th>
              <th className="border px-4 py-2">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {ejercicios.map((eje) => (
              <tr key={eje.id}>
                <td className="border px-4 py-2">{eje.nombre}</td>
                <td className="border px-4 py-2">{eje.musculo_objetivo}</td>
                <td className="border px-4 py-2">{eje.descripcion}</td>
                <td className="border px-4 py-2">
                  {eje.video_url && (
                    <a
                      href={eje.video_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 underline"
                    >
                      Ver video
                    </a>
                  )}
                </td>
                <td className="border px-4 py-2">
                  <button
                    onClick={() => eliminarEjercicio(eje.id)}
                    className="bg-red-500 text-white px-2 py-1 rounded"
                  >
                    Eliminar
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
