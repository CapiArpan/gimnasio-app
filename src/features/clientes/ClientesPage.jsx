// src/features/clientes/ClientesPage.jsx
import React, { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";   // ← ruta corregida
import {
  obtenerClientes,
  crearCliente,
  actualizarCliente,
  eliminarCliente,
} from "../../lib/api/clientes";

export default function ClientesPage() {
  const { user, loading: authLoading } = useAuth();
  const [clientes, setClientes] = useState([]);
  const [form, setForm] = useState({
    nombre: "",
    plan_actual: "",
    estado_pago: "al dia",
  });
  const [editandoId, setEditandoId] = useState(null);
  const [cargando, setCargando] = useState(false);

  // Función para cargar clientes
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

  // Solo llamamos a cargar() cuando la autenticación ya terminó y hay usuario
  useEffect(() => {
    if (!authLoading) {
      if (user) {
        cargar();
      } else {
        console.warn("No autenticado, no se cargan clientes");
      }
    }
  }, [authLoading, user]);

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
    setForm({
      nombre: cliente.nombre,
      plan_actual: cliente.plan_actual || "",
      estado_pago: cliente.estado_pago || "al dia",
    });
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

  if (authLoading) {
    return <p>Verificando sesión…</p>;
  }

  if (!user) {
    return <p>No estás autenticado.</p>;
  }

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
