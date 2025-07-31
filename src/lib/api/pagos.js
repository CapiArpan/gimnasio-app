// src/lib/api/pagos.js
import { supabase } from "./supabaseClient";

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
