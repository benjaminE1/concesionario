import React, { useEffect, useState } from 'react'
import { checkApiConnectivity } from '../api/client'

interface ConnectivityState {
  status: 'idle' | 'checking' | 'connected' | 'disconnected'
  message: string
  details?: unknown
  lastChecked?: string
}

export const HomePage: React.FC = () => {
  const [connectivity, setConnectivity] = useState<ConnectivityState>({
    status: 'checking',
    message: 'Comprobando conectividad con el endpoint del backend...',
  })

  const runConnectivityCheck = async () => {
    setConnectivity({
      status: 'checking',
      message: 'Comprobando conectividad con el endpoint del backend...',
    })

    const result = await checkApiConnectivity()
    const now = new Date().toLocaleTimeString()

    setConnectivity({
      status: result.connected ? 'connected' : 'disconnected',
      message: result.message,
      details: result.details,
      lastChecked: now,
    })
  }

  // Comprueba la conectividad al montar sin provocar renders en cascada síncronos
  useEffect(() => {
    let isMounted = true

    void checkApiConnectivity().then((result) => {
      if (!isMounted) return
      const now = new Date().toLocaleTimeString()
      setConnectivity({
        status: result.connected ? 'connected' : 'disconnected',
        message: result.message,
        details: result.details,
        lastChecked: now,
      })
    })

    return () => {
      isMounted = false
    }
  }, [])

  return (
    <div className="home-container">
      {/* Banner Principal */}
      <section className="hero-section" aria-labelledby="hero-title">
        <h1 id="hero-title" className="hero-title">
          Sistema de Gestión de Concesionario
        </h1>
        <p className="hero-description">
          Frontend moderno en React con Vite y TypeScript, diseñado para el consumo seguro de la API REST ASP.NET Core, con soporte para autenticación JWT, operaciones CRUD y accesibilidad WCAG 2.2 nivel AA.
        </p>
      </section>

      {/* Monitor de Conectividad con la API */}
      <section className="connectivity-card" aria-labelledby="connectivity-title">
        <div className="card-header">
          <h2 id="connectivity-title" className="card-title">
            Estado de Conexión con el Backend
          </h2>
          <span
            className={`status-badge status-${connectivity.status}`}
            role="status"
            aria-live="polite"
          >
            {connectivity.status === 'checking' && '⏳ Verificando...'}
            {connectivity.status === 'connected' && '✓ En Línea'}
            {connectivity.status === 'disconnected' && '✕ Sin Conexión'}
            {connectivity.status === 'idle' && '⚪ En Espera'}
          </span>
        </div>

        <p className="connectivity-message">{connectivity.message}</p>

        {connectivity.details !== undefined && (
          <div className="connectivity-details">
            <strong>Detalle técnico:</strong> {String(connectivity.details)}
          </div>
        )}

        {connectivity.lastChecked && (
          <p className="last-checked">Última comprobación: {connectivity.lastChecked}</p>
        )}

        <div className="card-actions">
          <button
            type="button"
            className="btn btn-primary"
            onClick={() => void runConnectivityCheck()}
            disabled={connectivity.status === 'checking'}
            aria-busy={connectivity.status === 'checking'}
          >
            {connectivity.status === 'checking' ? 'Comprobando...' : 'Reintentar comprobación'}
          </button>
        </div>
      </section>

      {/* Módulos y Arquitectura del Sistema */}
      <section className="grid-section" aria-labelledby="architecture-title">
        <h2 id="architecture-title" className="section-title">
          Configuración y Módulos de la Aplicación
        </h2>

        <div className="cards-grid">
          <article className="info-card">
            <h3 className="info-title">🌐 Conectividad y Proxy</h3>
            <p className="info-text">
              Peticiones dirigidas a <code>/api</code> reenviadas automáticamente por el proxy de desarrollo Vite hacia <code>http://localhost:5145</code> para evitar bloqueos por CORS.
            </p>
            <ul className="info-list">
              <li>Proxy Vite: Activado en puerto 5173</li>
              <li>Backend objetivo: http://localhost:5145</li>
              <li>Timeout configurado: 10 segundos</li>
            </ul>
          </article>

          <article className="info-card">
            <h3 className="info-title">🛡️ Cliente HTTP Seguro</h3>
            <p className="info-text">
              Axios configurado con interceptores inteligentes adaptados al backend ASP.NET Core:
            </p>
            <ul className="info-list">
              <li>Manejo transparente de <code>204 No Content</code></li>
              <li>Soporte de respuestas en texto plano y JSON</li>
              <li>Inyector automático de token <code>Bearer</code></li>
            </ul>
          </article>

          <article className="info-card">
            <h3 className="info-title">♿ Accesibilidad y UX (WCAG 2.2 AA)</h3>
            <p className="info-text">
              Estructura semántica HTML5, ratios de contraste superiores a 4.5:1, enlace de salto al contenido principal, navegación por teclado y foco visible en todos los elementos interactivos.
            </p>
            <ul className="info-list">
              <li>Etiquetas y roles ARIA semánticos</li>
              <li>Foco visible de alto contraste</li>
              <li>Diseño 100% responsivo para móviles y escritorio</li>
            </ul>
          </article>

          <article className="info-card">
            <h3 className="info-title">📋 Próxima Etapa: Autenticación JWT</h3>
            <p className="info-text">
              Integración del formulario de inicio de sesión con <code>admin@gmail.com</code>, decodificación de claims del token y protección de rutas privadas por rol.
            </p>
            <ul className="info-list">
              <li>Endpoint: <code>POST /api/Usuario/login</code></li>
              <li>Roles: Admin y usuarios autenticados</li>
              <li>Rutas privadas con React Router</li>
            </ul>
          </article>
        </div>
      </section>
    </div>
  )
}
