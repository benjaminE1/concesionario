import React from 'react'
import { Link } from 'react-router-dom'
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
          className="btn btn-primary"
          style={{ backgroundColor: '#b91c1c' }}
          onClick={logout}
          aria-label="Cerrar sesión actual"
        >
          Cerrar Sesión
        </button>
      </header>

      {/* Tarjeta de Sesión Activa */}
      <section className="connectivity-card" aria-labelledby="session-title">
        <h2 id="session-title" className="card-title">
          Credenciales y Claims Verificados (JWT)
        </h2>
        <p className="info-text">
          La siguiente información fue extraída y validada directamente desde el token JWT emitido por ASP.NET Core:
        </p>

        <div className="connectivity-details" style={{ lineHeight: '1.8' }}>
          <p>
            <strong>ID de Usuario:</strong> {user?.id}
          </p>
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
            <strong>Estado de Token:</strong> Válido y activo en cabecera HTTP Bearer
          </p>
        </div>
      </section>

      {/* Opciones y Recursos Administrativos */}
      <section className="grid-section" aria-labelledby="admin-features-title">
        <h2 id="admin-features-title" className="section-title">
          Privilegios de Administrador en la API
        </h2>

        <div className="cards-grid">
          <article className="info-card">
            <h3 className="info-title">🚗 Gestión de Vehículos</h3>
            <p className="info-text">
              Tu rol permite crear, editar y eliminar vehículos en el backend (rutas <code>POST</code>, <code>PUT</code>, <code>DELETE /api/vehiculos</code>).
            </p>
            <Link to="/vehiculos" className="btn btn-primary" style={{ marginTop: 'auto' }}>
              Ir a Vehículos
            </Link>
          </article>

          <article className="info-card">
            <h3 className="info-title">👥 Gestión de Usuarios y Roles</h3>
            <p className="info-text">
              Autorización completa sobre los endpoints administrativos <code>/api/Usuario</code> y <code>/api/rol</code> que exigen política <code>RequireRole(&quot;Admin&quot;)</code>.
            </p>
            <span className="status-pill badge-otro" style={{ marginTop: 'auto', alignSelf: 'flex-start' }}>
              Módulo Etapa posterior
            </span>
          </article>

          <article className="info-card">
            <h3 className="info-title">🏢 Sucursales y Facturas</h3>
            <p className="info-text">
              Control sobre sucursales (<code>/api/sucursal</code>) y registro contable de facturas (<code>/api/facturas</code>).
            </p>
            <span className="status-pill badge-otro" style={{ marginTop: 'auto', alignSelf: 'flex-start' }}>
              Módulo Etapa posterior
            </span>
          </article>
        </div>
      </section>
    </div>
  )
}
