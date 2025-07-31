// pages/Clientes.jsx
import { useEffect, useState } from "react";
import {
  obtenerClientes,
  crearCliente,
  actualizarCliente,
  eliminarCliente,
} from "../lib/api/clientes";

export default function Clientes() {
  const [clientes, setClientes] = useState([]);
  const [form, setForm] = useState({ nombre: "", plan_actual: "", estado_pago: "al dia" });
  const [editandoId, setEditandoId] = useState(null);
  const [cargando, setCargando] = useState(true);

  const cargar = async () => {
    setCargando(true);
    try {
      const data = await obtenerClientes();
      setClientes(data);
    } catch (err) {
      console.error("Error cargando clientes:", err.message);
    }
    setCargando(false);
  };

  useEffect(() => {
    cargar();
  }, []);

  const manejarSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editandoId) {
        await actualizarCliente(editandoId, form);
      } else {
        await crearCliente(form);
      }
      setForm({ nombre: "", plan_actual: "", estado_pago: "al dia" });
      setEditandoId(null);
      cargar();
    } catch (err) {
      alert("Error: " + err.message);
    }
  };

  const manejarEditar = (cliente) => {
    setForm({ nombre: cliente.nombre, plan_actual: cliente.plan_actual || "", estado_pago: cliente.estado_pago || "al dia" });
    setEditandoId(cliente.id);
  };

  const manejarEliminar = async (id) => {
    if (!confirm("¿Seguro que deseas eliminar este cliente?")) return;
    try {
      await eliminarCliente(id);
      cargar();
    } catch (err) {
      alert("Error: " + err.message);
    }
  };

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Gestión de Clientes</h2>

      <form onSubmit={manejarSubmit} className="mb-6 bg-white shadow p-4 rounded">
        <div className="flex flex-col md:flex-row gap-2">
          <input
            className="border p-2 w-full"
            placeholder="Nombre"
            value={form.nombre}
            onChange={(e) => setForm({ ...form, nombre: e.target.value })}
            required
          />
          <input
            className="border p-2 w-full"
            placeholder="Plan actual"
            value={form.plan_actual}
            onChange={(e) => setForm({ ...form, plan_actual: e.target.value })}
          />
          <select
            className="border p-2 w-full"
            value={form.estado_pago}
            onChange={(e) => setForm({ ...form, estado_pago: e.target.value })}
          >
            <option value="al dia">Al día</option>
            <option value="moroso">Moroso</option>
          </select>
          <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded">
            {editandoId ? "Actualizar" : "Agregar"}
          </button>
        </div>
      </form>

      {cargando ? (
        <p>Cargando clientes...</p>
      ) : (
        <table className="min-w-full table-auto border shadow bg-white">
          <thead>
            <tr className="bg-gray-200">
              <th className="px-4 py-2 text-left">Nombre</th>
              <th className="px-4 py-2 text-left">Plan</th>
              <th className="px-4 py-2 text-left">Estado de Pago</th>
              <th className="px-4 py-2">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {clientes.map((cliente) => (
              <tr key={cliente.id} className="border-t">
                <td className="px-4 py-2">{cliente.nombre}</td>
                <td className="px-4 py-2">{cliente.plan_actual}</td>
                <td className="px-4 py-2">{cliente.estado_pago}</td>
                <td className="px-4 py-2 space-x-2 text-center">
                  <button
                    onClick={() => manejarEditar(cliente)}
                    className="bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1 rounded"
                  >
                    Editar
                  </button>
                  <button
                    onClick={() => manejarEliminar(cliente.id)}
                    className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded"
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
