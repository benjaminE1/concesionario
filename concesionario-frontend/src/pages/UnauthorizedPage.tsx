import React from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../context/useAuth'

export const UnauthorizedPage: React.FC = () => {
  const { user } = useAuth()

  return (
    <div className="not-found-container" role="region" aria-labelledby="unauthorized-title">
      <span className="empty-icon" aria-hidden="true" style={{ fontSize: '4rem' }}>
        🚫
      </span>
      <h1 id="unauthorized-title" className="not-found-code" style={{ color: '#b91c1c' }}>
        403
      </h1>
      <h2 className="not-found-heading">Acceso Denegado</h2>
      <p className="not-found-text">
        No cuentas con los permisos requeridos para ver este módulo administrativo.
      </p>

      {user && (
        <div
          className="connectivity-details"
          style={{ maxWidth: '480px', margin: '0 auto 1.5rem', textAlign: 'left' }}
        >
          <p>
            <strong>Usuario conectado:</strong> {user.name} ({user.email})
          </p>
          <p>
            <strong>Rol asignado:</strong> <span className="status-pill badge-otro">{user.role}</span>
          </p>
        </div>
      )}

      <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
        <Link to="/" className="btn btn-primary">
          Volver al Inicio
        </Link>
        <Link to="/vehiculos" className="btn btn-primary" style={{ backgroundColor: '#475569' }}>
          Ver Catálogo de Vehículos
        </Link>
      </div>
    </div>
  )
}
