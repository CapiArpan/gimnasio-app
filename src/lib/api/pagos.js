// src/lib/api/pagos.js
import { useEffect, useState } from "react";
import { supabase } from "../supabaseClient";

// Hook personalizado para obtener pagos desde el admin
export function usePagosAdmin() {
  const [pagos, setPagos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const cargarPagos = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from("pagos")
        .select("*")
        .order("fecha_pago", { ascending: false });

      if (error) {
        console.error("Error al cargar pagos:", error);
        setError(error);
      } else {
        setPagos(data);
      }
      setLoading(false);
    };

    cargarPagos();
  }, []);

  return { pagos, loading, error };
}

// Obtener pagos por cliente
export const getPagosPorCliente = async (id_cliente) => {
  const { data, error } = await supabase
    .from("pagos")
    .select("*")
    .eq("id_cliente", id_cliente)
    .order("fecha_pago", { ascending: false });

  if (error) throw error;
  return data;
};

// Crear nuevo pago
export const createPago = async (nuevoPago) => {
  const { data, error } = await supabase
    .from("pagos")
    .insert([nuevoPago]);

  if (error) throw error;
  return data;
};

// Eliminar pago por ID
export const deletePago = async (id) => {
  const { data, error } = await supabase
    .from("pagos")
    .delete()
    .eq("id", id);

  if (error) throw error;
  return data;
};
