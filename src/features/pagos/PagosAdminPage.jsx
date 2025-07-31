// src/pages/PagosAdmin.jsx
import { useState } from "react";
import { usePagosAdmin } from "../../lib/api/pagos";
import { z } from "zod";

const PagoSchema = z.object({
  id_cliente: z.string().uuid(),
  monto: z.number().positive(),
  metodo_pago: z.string().min(3),
  observaciones: z.string().max(250).optional(),
});

export default function PagosAdmin() {
  const { pagos, loading, reload, createPagoAdmin, deletePagoAdmin } =
    usePagosAdmin();
  const [form, setForm] = useState({
    id_cliente: "",
    monto: "",
    metodo_pago: "",
    observaciones: "",
  });
  const [errors, setErrors] = useState({});

  const handleSubmit = async (e) => {
    e.preventDefault();
    const parseResult = PagoSchema.safeParse({
      ...form,
      monto: parseFloat(form.monto),
    });
    if (!parseResult.success) {
      setErrors(parseResult.error.flatten().fieldErrors);
      return;
    }
    try {
      await createPagoAdmin(parseResult.data);
      setForm({ id_cliente: "", monto: "", metodo_pago: "", observaciones: "" });
      setErrors({});
      await reload();
    } catch {
      alert("Error registrando pago");
    }
  };

  if (loading) return <p>Cargando pagos...</p>;

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">Gestión de Pagos</h2>

      <form onSubmit={handleSubmit} className="mb-6 space-y-2 max-w-md">
        <input
          placeholder="ID Cliente (UUID)"
          className="border p-2 w-full"
          value={form.id_cliente}
          onChange={(e) =>
            setForm({ ...form, id_cliente: e.target.value })
          }
        />
        {errors.id_cliente && (
          <p className="text-red-500">{errors.id_cliente}</p>
        )}

        <input
          placeholder="Monto"
          type="number"
          className="border p-2 w-full"
          value={form.monto}
          onChange={(e) =>
            setForm({ ...form, monto: e.target.value })
          }
        />
        {errors.monto && <p className="text-red-500">{errors.monto}</p>}

        <input
          placeholder="Método de pago"
          className="border p-2 w-full"
          value={form.metodo_pago}
          onChange={(e) =>
            setForm({ ...form, metodo_pago: e.target.value })
          }
        />
        {errors.metodo_pago && (
          <p className="text-red-500">{errors.metodo_pago}</p>
        )}

        <textarea
          placeholder="Observaciones (opcional)"
          className="border p-2 w-full"
          value={form.observaciones}
          onChange={(e) =>
            setForm({ ...form, observaciones: e.target.value })
          }
        />

        <button
          type="submit"
          className="bg-green-600 text-white px-4 py-2 rounded"
        >
          Registrar Pago
        </button>
      </form>

      <ul className="space-y-2">
        {pagos.map((p) => (
          <li
            key={p.id}
            className="flex justify-between border p-2 rounded"
          >
            <span>
              #{p.id_cliente} – ${p.monto} – {p.metodo_pago} – {p.fecha_pago}
            </span>
            <button
              onClick={() => deletePagoAdmin(p.id).then(reload)}
              className="bg-red-500 text-white px-2 py-1 rounded"
            >
              Eliminar
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
