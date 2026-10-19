import React from 'react'
import { Link } from 'react-router-dom'
import { ShieldAlert, ArrowLeft, CarFront } from 'lucide-react'
import { useAuth } from '../context/useAuth'

export const UnauthorizedPage: React.FC = () => {
  const { user } = useAuth()

  return (
    <div className="not-found-container" role="region" aria-labelledby="unauthorized-title">
      <ShieldAlert size={64} color="#f87171" aria-hidden="true" style={{ margin: '0 auto 1rem', display: 'block' }} />
      <h1 id="unauthorized-title" className="not-found-code" style={{ color: '#f87171' }}>
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
        <Link to="/" className="btn btn-primary" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem' }}>
          <ArrowLeft size={16} aria-hidden="true" />
          <span>Volver al Inicio</span>
        </Link>
        <Link to="/vehiculos" className="btn btn-secondary" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem' }}>
          <CarFront size={16} aria-hidden="true" />
          <span>Ver Catálogo de Vehículos</span>
        </Link>
      </div>
    </div>
  )
}
