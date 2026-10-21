import React from 'react'
import { Link } from 'react-router-dom'
import { LogOut, CarFront, Users, Building2, Wrench } from 'lucide-react'
import { useAuth } from '../context/useAuth'

export const AdminPanelPage: React.FC = () => {
  const { user, logout } = useAuth()

  return (
    <div className="home-container" role="region" aria-labelledby="admin-title">
      <header className="page-header">
        <div>
          <h1 id="admin-title" className="page-title">
            Panel de Administración
          </h1>
          <p className="page-subtitle">
            Área protegida exclusivamente para usuarios con rol <strong>Admin</strong>.
          </p>
        </div>
        <button
          type="button"
          className="btn btn-danger"
          onClick={logout}
          aria-label="Cerrar sesión actual"
        >
          <LogOut size={16} aria-hidden="true" style={{ marginRight: '0.4rem' }} />
          <span>Cerrar Sesión</span>
        </button>
      </header>

      {/* Tarjeta de Sesión Activa */}
      <section className="connectivity-card" aria-labelledby="session-title">
        <h2 id="session-title" className="card-title">
          Información de la Cuenta
        </h2>
        <p className="info-text">
          Datos de acceso y perfil del usuario actualmente en sesión:
        </p>

        <div className="connectivity-details" style={{ lineHeight: '1.8' }}>
          <p>
            <strong>Nombre:</strong> {user?.name}
          </p>
          <p>
            <strong>Correo Electrónico:</strong> {user?.email}
          </p>
          <p>
            <strong>Rol en Sistema:</strong>{' '}
            <span className="status-pill badge-disponible">{user?.role}</span>
          </p>
          <p>
            <strong>Estado de Sesión:</strong> <span style={{ color: '#6ee7b7' }}>Activa</span>
          </p>
        </div>
      </section>

      {/* Opciones y Recursos Administrativos */}
      <section className="grid-section" aria-labelledby="admin-features-title">
        <h2 id="admin-features-title" className="section-title">
          Módulos Administrativos
        </h2>

        <div className="cards-grid">
          <article className="info-card">
            <h3 className="info-title" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <CarFront size={18} color="#60a5fa" aria-hidden="true" />
              <span>Gestión de Vehículos</span>
            </h3>
            <p className="info-text">
              Administración completa del catálogo de vehículos, inventario, precios y disponibilidad de flota.
            </p>
            <Link to="/vehiculos" className="btn btn-primary" style={{ marginTop: 'auto' }}>
              Ir a Vehículos
            </Link>
          </article>

          <article className="info-card">
            <h3 className="info-title" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Users size={18} color="#60a5fa" aria-hidden="true" />
              <span>Gestión de Usuarios y Roles</span>
            </h3>
            <p className="info-text">
              Administración de cuentas de usuarios, personal de ventas, mecánicos y asignación de perfiles.
            </p>
            <Link to="/usuarios" className="btn btn-primary" style={{ marginTop: 'auto' }}>
              Ir a Usuarios
            </Link>
          </article>

          <article className="info-card">
            <h3 className="info-title" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Building2 size={18} color="#60a5fa" aria-hidden="true" />
              <span>Gestión de Sucursales</span>
            </h3>
            <p className="info-text">
              Administración de sedes físicas, puntos de atención al cliente y talleres del concesionario.
            </p>
            <Link to="/sucursales" className="btn btn-primary" style={{ marginTop: 'auto' }}>
              Ir a Sucursales
            </Link>
          </article>

          <article className="info-card">
            <h3 className="info-title" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Wrench size={18} color="#60a5fa" aria-hidden="true" />
              <span>Gestión de Repuestos</span>
            </h3>
            <p className="info-text">
              Catálogo de partes, piezas mecánicas y control de stock e inventario en bodega.
            </p>
            <Link to="/repuestos" className="btn btn-primary" style={{ marginTop: 'auto' }}>
              Ir a Repuestos
            </Link>
          </article>
        </div>
      </section>
    </div>
  )
}
