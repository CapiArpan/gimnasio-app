// src/lib/api/clientes.js
import { supabase } from "../supabaseClient";

/**
 * Obtener todos los clientes
 */
export async function obtenerClientes() {
  const { data, error } = await supabase
    .from('clientes')
    .select('*')
    .order('fecha_inscripcion', { ascending: false });

  if (error) throw error;
  return data;
}

/**
 * Crear un nuevo cliente
 * @param {object} clienteData - { id_usuario, plan_actual, descuento, notas }
 */
export async function crearCliente(clienteData) {
  const { data, error } = await supabase
    .from('clientes')
    .insert([clienteData]);

  if (error) throw error;
  return data;
}

export async function actualizarCliente(id, datos) {
  const { error } = await supabase
    .from("clientes")
    .update(datos)
    .eq("id_auth", id);

  if (error) {
    console.error("Error actualizando cliente:", error);
    throw error;
  }
}


/**
 * Eliminar cliente por ID
 * @param {number} id - ID del cliente
 */
export async function eliminarCliente(id) {
  const { error } = await supabase
    .from('clientes')
    .delete()
    .eq('id', id);

  if (error) throw error;
}
