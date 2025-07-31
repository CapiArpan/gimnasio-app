// lib/api/clientes.js
import { supabase } from "./supabaseClient";

export async function obtenerClientes() {
  const { data, error } = await supabase.from("clientes").select("*");
  if (error) throw error;
  return data;
}

export async function crearCliente(cliente) {
  const { data, error } = await supabase.from("clientes").insert([cliente]);
  if (error) throw error;
  return data[0];
}

export async function actualizarCliente(id, cliente) {
  const { data, error } = await supabase.from("clientes").update(cliente).eq("id", id);
  if (error) throw error;
  return data[0];
}

export async function eliminarCliente(id) {
  const { error } = await supabase.from("clientes").delete().eq("id", id);
  if (error) throw error;
}
