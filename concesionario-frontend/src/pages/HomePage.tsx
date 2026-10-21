import React, { useEffect, useState } from 'react'
import {
  Loader2,
  CheckCircle2,
  XCircle,
  CircleDot,
  RefreshCw,
  CarFront,
  Building2,
  Wrench,
  ShieldCheck,
} from 'lucide-react'
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
          Plataforma centralizada para la administración integral de vehículos, repuestos mecánicos, sedes y control de accesos del concesionario.
        </p>
      </section>

      {/* Monitor de Estado del Servicio */}
      <section className="connectivity-card" aria-labelledby="connectivity-title">
        <div className="card-header">
          <h2 id="connectivity-title" className="card-title">
            Estado del Sistema
          </h2>
          <span
            className={`status-badge status-${connectivity.status}`}
            role="status"
            aria-live="polite"
          >
            {connectivity.status === 'checking' && (
              <>
                <Loader2 size={14} className="spin" aria-hidden="true" style={{ marginRight: '0.35rem' }} />
                <span>Verificando...</span>
              </>
            )}
            {connectivity.status === 'connected' && (
              <>
                <CheckCircle2 size={14} aria-hidden="true" style={{ marginRight: '0.35rem' }} />
                <span>En Línea</span>
              </>
            )}
            {connectivity.status === 'disconnected' && (
              <>
                <XCircle size={14} aria-hidden="true" style={{ marginRight: '0.35rem' }} />
                <span>Sin Conexión</span>
              </>
            )}
            {connectivity.status === 'idle' && (
              <>
                <CircleDot size={14} aria-hidden="true" style={{ marginRight: '0.35rem' }} />
                <span>En Espera</span>
              </>
            )}
          </span>
        </div>

        <p className="connectivity-message">{connectivity.message}</p>

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
            <RefreshCw
              size={15}
              className={connectivity.status === 'checking' ? 'spin' : ''}
              aria-hidden="true"
              style={{ marginRight: '0.4rem' }}
            />
            <span>{connectivity.status === 'checking' ? 'Comprobando...' : 'Verificar Conexión'}</span>
          </button>
        </div>
      </section>

      {/* Módulos Principales de la Plataforma */}
      <section className="grid-section" aria-labelledby="modules-title">
        <h2 id="modules-title" className="section-title">
          Módulos del Sistema
        </h2>

        <div className="cards-grid">
          <article className="info-card">
            <h3 className="info-title" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <CarFront size={18} color="#60a5fa" aria-hidden="true" />
              <span>Inventario de Vehículos</span>
            </h3>
            <p className="info-text">
              Control exhaustivo del catálogo vehicular, marcas, modelos, precios, estados de venta y arriendo de flota.
            </p>
          </article>

          <article className="info-card">
            <h3 className="info-title" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Building2 size={18} color="#60a5fa" aria-hidden="true" />
              <span>Sedes y Sucursales</span>
            </h3>
            <p className="info-text">
              Administración de puntos de venta y talleres distribuidos geográficamente con registro de ubicaciones y contactos.
            </p>
          </article>

          <article className="info-card">
            <h3 className="info-title" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Wrench size={18} color="#60a5fa" aria-hidden="true" />
              <span>Repuestos y Bodega</span>
            </h3>
            <p className="info-text">
              Registro de piezas mecánicas, repuestos de mantenimiento, códigos SKU y supervisión de niveles de stock.
            </p>
          </article>

          <article className="info-card">
            <h3 className="info-title" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <ShieldCheck size={18} color="#60a5fa" aria-hidden="true" />
              <span>Seguridad y Usuarios</span>
            </h3>
            <p className="info-text">
              Administración de cuentas del personal, control de accesos por rol y sesiones seguras en la plataforma.
            </p>
          </article>
        </div>
      </section>
    </div>
  )
}
