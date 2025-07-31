// src/pages/MisPagos.jsx
import { useMisPagos } from "../../lib/api/pagos";

export default function MisPagos() {
  const { pagos, loading } = useMisPagos();

  if (loading) return <p>Cargando tus pagos…</p>;
  if (pagos.length === 0) return <p>No tienes pagos registrados.</p>;

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">Mis Pagos</h2>
      <ul className="space-y-2">
        {pagos.map((p) => (
          <li
            key={p.id}
            className="border p-2 rounded flex justify-between"
          >
            <span>{p.fecha_pago}</span>
            <span>${p.monto}</span>
            <span>{p.metodo_pago}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
