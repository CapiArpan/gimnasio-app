import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import AuthRoutes from '../features/auth/auth.routes';
import { useAuth } from '../context/AuthContext';

// IMPORTAR páginas organizadas en features
import DashboardAdmin from '../features/dashboard/DashboardAdmin';
import ClientesPage from '../features/clientes/ClientesPage';
import EjerciciosPage from '../features/ejercicios/EjerciciosPage';
import RutinasPage from '../features/rutinas/RutinasPage';
import PagosAdminPage from '../features/pagos/PagosAdminPage';
// si luego tienes MisPagosPage o MisRutinasPage también las importarás

function ProtectedRoute({ element, allowed }) {
  const { user, role, loading } = useAuth();

  if (loading) return <div>Cargando...</div>;
  if (!user) return <Navigate to="/login" replace />;
  if (!allowed.includes(role)) return <Navigate to="/" replace />;
  return element;
}

export default function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Rutas de autenticación (corregidas con /* para permitir subrutas) */}
        <Route path="/login/*" element={<AuthRoutes />} />
        <Route path="/register/*" element={<AuthRoutes />} />

        {/* Rutas ADMIN */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute
              allowed={['admin']}
              element={<DashboardAdmin />}
            />
          }
        />
        <Route
          path="/admin/clientes"
          element={
            <ProtectedRoute
              allowed={['admin']}
              element={<ClientesPage />}
            />
          }
        />
        <Route
          path="/admin/ejercicios"
          element={
            <ProtectedRoute
              allowed={['admin']}
              element={<EjerciciosPage />}
            />
          }
        />
        <Route
          path="/admin/rutinas"
          element={
            <ProtectedRoute
              allowed={['admin']}
              element={<RutinasPage />}
            />
          }
        />
        <Route
          path="/admin/pagos"
          element={
            <ProtectedRoute
              allowed={['admin']}
              element={<PagosAdminPage />}
            />
          }
        />

        {/* Si en el futuro hay rutas para clientes o profesores, las agregamos aquí */}

        {/* Cualquier ruta desconocida redirige al login */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
