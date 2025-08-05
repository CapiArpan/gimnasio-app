// src/features/dashboard/DashboardAdmin.jsx
import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabaseClient";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";

// 🎨 Colores personalizados para los gráficos
const COLORS = ["#10b981", "#ef4444", "#facc15", "#3b82f6", "#8b5cf6"];

export default function DashboardAdmin() {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalUsuarios: 0,
    totalClientes: 0,
    ingresosTotales: 0,
    clientesMorosos: 0,
    pagosPorMes: [],
    estadoPagoDistribucion: [],
  });

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);

      // 🧠 Llamadas paralelas a la base de datos
      const [
        { count: totalUsuarios },
        { count: totalClientes },
        { data: pagosData },
        { data: estadoPagoData },
      ] = await Promise.all([
        supabase.from("usuarios").select("id", { count: "exact", head: true }),
        supabase.from("clientes").select("id", { count: "exact", head: true }),
        supabase
          .from("pagos")
          .select("id, monto, fecha_pago")
          .order("fecha_pago", { ascending: true }),
        supabase.from("clientes").select("estado_pago"),
      ]);

      // 💰 Total de ingresos acumulados
      const ingresosTotales = pagosData.reduce(
        (acc, pago) => acc + parseFloat(pago.monto || 0),
        0
      );

      // 📆 Agrupar pagos por mes
      const pagosPorMes = pagosData.reduce((acc, pago) => {
        const mes = new Date(pago.fecha_pago).toLocaleString("default", {
          month: "short",
          year: "numeric",
        });
        acc[mes] = (acc[mes] || 0) + parseFloat(pago.monto || 0);
        return acc;
      }, {});
      const pagosPorMesArr = Object.entries(pagosPorMes).map(([mes, monto]) => ({
        mes,
        monto: parseFloat(monto.toFixed(2)),
      }));

      // 📊 Distribución de estado de pago
      const estadoPagoDistribucion = estadoPagoData.reduce((acc, cliente) => {
        const estado = cliente.estado_pago || "desconocido";
        acc[estado] = (acc[estado] || 0) + 1;
        return acc;
      }, {});
      const estadoPagoDistribucionArr = Object.entries(estadoPagoDistribucion).map(
        ([estado, cantidad]) => ({ estado, cantidad })
      );

      // 😬 Clientes morosos
      const clientesMorosos = estadoPagoDistribucion["moroso"] || 0;

      setStats({
        totalUsuarios,
        totalClientes,
        ingresosTotales,
        clientesMorosos,
        pagosPorMes: pagosPorMesArr,
        estadoPagoDistribucion: estadoPagoDistribucionArr,
      });
      setLoading(false);
    };

    fetchData();
  }, []);

  if (loading) return <p className="text-center text-gray-500">Cargando estadísticas...</p>;

  return (
    <div className="space-y-8">
      <h2 className="text-2xl font-bold text-gray-800">📊 Panel de Control del Administrador</h2>

      {/* 🟩 KPIs de resumen */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card title="Usuarios registrados" value={stats.totalUsuarios} />
        <Card title="Clientes activos" value={stats.totalClientes} />
        <Card title="Ingresos totales ($)" value={`$${stats.ingresosTotales.toLocaleString()}`} />
        <Card title="Clientes morosos" value={stats.clientesMorosos} />
      </div>

      {/* 🧱 Gráficos de barras y pastel */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Ingresos por mes */}
        <div className="bg-white shadow p-4 rounded-xl">
          <h3 className="text-lg font-semibold mb-2 text-gray-700">Ingresos por Mes</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={stats.pagosPorMes}>
              <XAxis dataKey="mes" />
              <YAxis />
              <Tooltip formatter={(value) => `$${value}`} />
              <Bar dataKey="monto" fill="#3b82f6" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Distribución de estado de pago */}
        <div className="bg-white shadow p-4 rounded-xl">
          <h3 className="text-lg font-semibold mb-2 text-gray-700">Distribución de Estado de Pago</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={stats.estadoPagoDistribucion}
                dataKey="cantidad"
                nameKey="estado"
                cx="50%"
                cy="50%"
                outerRadius={100}
                label
              >
                {stats.estadoPagoDistribucion.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}

// 🧱 Tarjeta reutilizable para KPIs
function Card({ title, value }) {
  return (
    <div className="bg-white shadow p-4 rounded-xl text-center">
      <p className="text-sm text-gray-500">{title}</p>
      <p className="text-2xl font-bold text-gray-800">{value}</p>
    </div>
  );
}
