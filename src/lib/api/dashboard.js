// src/lib/api/clientes.js 
import { supabase } from "./supabaseClient"

export async function obtenerDatosDashboard() {
  const { data: clientes } = await supabase.from("clientes").select("*")
  if (!clientes) return { total: 0, al_dia: 0, morosos: 0, porPlan: {}, mensual: {} }

  const total = clientes.length
  const al_dia = clientes.filter(c => c.estado_pago === "al dia").length
  const morosos = total - al_dia

  const porPlan = clientes.reduce((acc, cliente) => {
    const plan = cliente.plan_actual || "Sin plan"
    acc[plan] = (acc[plan] || 0) + 1
    return acc
  }, {})

  return { total, al_dia, morosos, porPlan }
}
