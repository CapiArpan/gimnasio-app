import { useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient";

export default function MisRutinas() {
  const [rutinas, setRutinas] = useState([]);
  const [ejerciciosPorRutina, setEjerciciosPorRutina] = useState([]);
  const [loading, setLoading] = useState(true);

  const cargarMisRutinas = async () => {
    setLoading(true);

    const { data: cliente } = await supabase
      .from("clientes")
      .select("id")
      .eq("id_usuario", (await supabase.auth.getUser()).data.user.id)
      .single();

    const { data: dataRutinas } = await supabase
      .from("rutinas")
      .select("*")
      .eq("id_cliente", cliente.id);

    const { data: dataEPR } = await supabase
      .from("ejercicios_por_rutina")
      .select("*, ejercicios(nombre)")
      .order("id_rutina");

    setRutinas(dataRutinas || []);
    setEjerciciosPorRutina(dataEPR || []);
    setLoading(false);
  };

  useEffect(() => {
    cargarMisRutinas();
  }, []);

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">Mis Rutinas</h2>
      {loading ? (
        <p>Cargando...</p>
      ) : rutinas.length === 0 ? (
        <p>No tienes rutinas asignadas.</p>
      ) : (
        rutinas.map((r) => (
          <div key={r.id} className="mb-4 p-4 border rounded">
            <h3 className="font-bold">{r.descripcion}</h3>
            <p className="text-sm">Fecha: {r.fecha}</p>
            <ul className="list-disc ml-5 mt-2">
              {ejerciciosPorRutina
                .filter((e) => e.id_rutina === r.id)
                .map((e) => (
                  <li key={e.id}>
                    {e.ejercicios.nombre} - {e.series} x {e.repeticiones}
                  </li>
                ))}
            </ul>
          </div>
        ))
      )}
    </div>
  );
}
