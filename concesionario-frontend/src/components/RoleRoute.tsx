import React from 'react'
import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { useAuth } from '../context/useAuth'

interface RoleRouteProps {
  allowedRoles: string[]
}

export const RoleRoute: React.FC<RoleRouteProps> = ({ allowedRoles }) => {
  const { user, isAuthenticated, loading } = useAuth()
  const location = useLocation()

  if (loading) {
    return (
      <div className="loading-state" role="status" aria-live="polite">
        <div className="spinner" aria-hidden="true" />
        <p>Comprobando permisos de usuario...</p>
      </div>
    )
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />
  }

  const userRole = user?.role || ''
  const hasPermission = allowedRoles.some(
    (role) => role.toLowerCase() === userRole.toLowerCase(),
  )

  if (!hasPermission) {
    // Redirige a página de no autorizado (HTTP 403)
    return <Navigate to="/unauthorized" replace />
  }

  return <Outlet />
}
