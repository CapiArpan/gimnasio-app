import { useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient";

export default function AdminUsuarios() {
  const [usuarios, setUsuarios] = useState([]);
  const [loading, setLoading] = useState(true);

  const cargarUsuarios = async () => {
    setLoading(true);
    const { data, error } = await supabase.from("usuarios").select("*");
    if (error) console.error(error);
    else setUsuarios(data);
    setLoading(false);
  };

  useEffect(() => {
    cargarUsuarios();
  }, []);

  const cambiarRol = async (id, nuevoRol) => {
    const { error } = await supabase
      .from("usuarios")
      .update({ rol: nuevoRol })
      .eq("id", id);

    if (error) {
      alert("Error al cambiar el rol");
    } else {
      cargarUsuarios();
    }
  };

  if (loading) return <p>Cargando usuarios...</p>;

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">Usuarios</h2>
      <table className="table-auto border-collapse border border-gray-400">
        <thead>
          <tr>
            <th className="border px-4 py-2">Email</th>
            <th className="border px-4 py-2">Rol</th>
            <th className="border px-4 py-2">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {usuarios.map((u) => (
            <tr key={u.id}>
              <td className="border px-4 py-2">{u.email}</td>
              <td className="border px-4 py-2">{u.rol}</td>
              <td className="border px-4 py-2">
                {u.rol !== "admin" && (
                  <>
                    <button
                      onClick={() => cambiarRol(u.id, "profesor")}
                      className="bg-yellow-500 text-white px-2 py-1 rounded mr-2"
                    >
                      Profesor
                    </button>
                    <button
                      onClick={() => cambiarRol(u.id, "cliente")}
                      className="bg-green-500 text-white px-2 py-1 rounded"
                    >
                      Cliente
                    </button>
                  </>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
