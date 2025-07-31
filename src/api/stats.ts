// src/api/stats.ts
import { supabase } from "../lib/api/supabaseClient";

// Traer conteo de filas para Dashboard
export async function fetchStats() {
  const [
    { count: usuarios },
    { count: clientes },
    { count: rutinas },
    { count: pagos },
  ] = await Promise.all([
    supabase.from("usuarios").select("*", { count: "exact", head: true }),
    supabase.from("clientes").select("*", { count: "exact", head: true }),
    supabase.from("rutinas").select("*", { count: "exact", head: true }),
    supabase.from("pagos").select("*", { count: "exact", head: true }),
  ]);
  return { usuarios, clientes, rutinas, pagos };
}
