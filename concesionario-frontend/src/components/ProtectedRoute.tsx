import React from 'react'
import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { useAuth } from '../context/useAuth'

export const ProtectedRoute: React.FC = () => {
  const { isAuthenticated, loading } = useAuth()
  const location = useLocation()

  if (loading) {
    return (
      <div className="loading-state" role="status" aria-live="polite">
        <div className="spinner" aria-hidden="true" />
        <p>Verificando credenciales de acceso...</p>
      </div>
    )
  }

  if (!isAuthenticated) {
    // Redirige al login guardando la ruta intentada en el estado de navegación
    return <Navigate to="/login" state={{ from: location }} replace />
  }

  return <Outlet />
}
