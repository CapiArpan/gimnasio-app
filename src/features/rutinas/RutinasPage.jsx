import { useEffect, useState } from "react";
import { supabase } from "../lib/api/supabaseClient";

export default function Rutinas() {
  const [clientes, setClientes] = useState([]);
  const [ejercicios, setEjercicios] = useState([]);
  const [rutinas, setRutinas] = useState([]);
  const [loading, setLoading] = useState(true);

  const [clienteSeleccionado, setClienteSeleccionado] = useState("");
  const [descripcion, setDescripcion] = useState("");

  const [ejerciciosSeleccionados, setEjerciciosSeleccionados] = useState([]);

  const cargarDatos = async () => {
    setLoading(true);

    const { data: dataClientes } = await supabase
      .from("clientes")
      .select("id, id_usuario, plan_actual")
      .order("id");

    const { data: dataEjercicios } = await supabase
      .from("ejercicios")
      .select("*")
      .order("id");

    const { data: dataRutinas } = await supabase
      .from("rutinas")
      .select("id, id_cliente, fecha, descripcion")
      .order("id", { ascending: false });

    setClientes(dataClientes || []);
    setEjercicios(dataEjercicios || []);
    setRutinas(dataRutinas || []);

    setLoading(false);
  };

  useEffect(() => {
    cargarDatos();
  }, []);

  const toggleEjercicio = (ejercicioId) => {
    if (ejerciciosSeleccionados.includes(ejercicioId)) {
      setEjerciciosSeleccionados(ejerciciosSeleccionados.filter((id) => id !== ejercicioId));
    } else {
      setEjerciciosSeleccionados([...ejerciciosSeleccionados, ejercicioId]);
    }
  };

  const crearRutina = async (e) => {
    e.preventDefault();
    if (!clienteSeleccionado || !descripcion) {
      alert("Seleccione cliente y escriba descripción");
      return;
    }

    // 1. Insertar la rutina
    const { data: nuevaRutina, error } = await supabase
      .from("rutinas")
      .insert([{ id_cliente: clienteSeleccionado, descripcion }])
      .select()
      .single();

    if (error) {
      alert("Error creando rutina");
      console.error(error);
      return;
    }

    // 2. Insertar ejercicios asociados
    for (const id_ejercicio of ejerciciosSeleccionados) {
      await supabase.from("ejercicios_por_rutina").insert([
        { id_rutina: nuevaRutina.id, id_ejercicio, repeticiones: "10", series: 3 },
      ]);
    }

    alert("Rutina creada con éxito");
    setClienteSeleccionado("");
    setDescripcion("");
    setEjerciciosSeleccionados([]);
    cargarDatos();
  };

  const eliminarRutina = async (id) => {
    if (!confirm("¿Eliminar esta rutina?")) return;
    await supabase.from("rutinas").delete().eq("id", id);
    cargarDatos();
  };

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">Gestión de Rutinas</h2>

      {/* FORMULARIO NUEVA RUTINA */}
      <form
        onSubmit={crearRutina}
        className="bg-gray-100 p-4 rounded mb-6 flex flex-col gap-3 max-w-xl"
      >
        <select
          value={clienteSeleccionado}
          onChange={(e) => setClienteSeleccionado(e.target.value)}
          className="border p-2 rounded"
        >
          <option value="">-- Seleccionar Cliente --</option>
          {clientes.map((c) => (
            <option key={c.id} value={c.id}>
              Cliente #{c.id} (Plan: {c.plan_actual})
            </option>
          ))}
        </select>

        <input
          type="text"
          placeholder="Descripción de la rutina"
          value={descripcion}
          onChange={(e) => setDescripcion(e.target.value)}
          className="border p-2 rounded"
        />

        <div>
          <p className="font-bold mb-2">Seleccionar Ejercicios:</p>
          <div className="grid grid-cols-2 gap-2">
            {ejercicios.map((ej) => (
              <label key={ej.id} className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={ejerciciosSeleccionados.includes(ej.id)}
                  onChange={() => toggleEjercicio(ej.id)}
                />
                {ej.nombre}
              </label>
            ))}
          </div>
        </div>

        <button
          type="submit"
          className="bg-green-600 text-white px-4 py-2 rounded"
        >
          Crear Rutina
        </button>
      </form>

      {/* LISTADO DE RUTINAS */}
      {loading ? (
        <p>Cargando rutinas...</p>
      ) : (
        <table className="table-auto border-collapse border border-gray-400">
          <thead>
            <tr>
              <th className="border px-4 py-2">Cliente</th>
              <th className="border px-4 py-2">Descripción</th>
              <th className="border px-4 py-2">Fecha</th>
              <th className="border px-4 py-2">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {rutinas.map((r) => (
              <tr key={r.id}>
                <td className="border px-4 py-2">#{r.id_cliente}</td>
                <td className="border px-4 py-2">{r.descripcion}</td>
                <td className="border px-4 py-2">{r.fecha}</td>
                <td className="border px-4 py-2">
                  <button
                    onClick={() => eliminarRutina(r.id)}
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
