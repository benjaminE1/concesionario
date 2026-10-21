import React, { useEffect } from 'react'
import { X, Building2, MapPin, Phone, Globe } from 'lucide-react'
import type { Sucursal } from '../types'

interface SucursalDetailModalProps {
  sucursal: Sucursal | null
  onClose: () => void
}

export const SucursalDetailModal: React.FC<SucursalDetailModalProps> = ({
  sucursal,
  onClose,
}) => {
  // Cerrar con la tecla Escape (WCAG 2.1)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose()
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [onClose])

  if (!sucursal) return null

  return (
    <div
      className="modal-backdrop"
      role="presentation"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose()
      }}
    >
      <div
        className="modal-dialog modal-md"
        role="dialog"
        aria-modal="true"
        aria-labelledby="sucursal-detail-title"
      >
        <header className="modal-header">
          <div>
            <span className="modal-badge">Ficha de Sucursal</span>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '0.25rem' }}>
              <Building2 size={22} color="#60a5fa" aria-hidden="true" />
              <h2 id="sucursal-detail-title" className="modal-title">
                {sucursal.nombre}
              </h2>
            </div>
          </div>
          <button
            type="button"
            className="modal-close-btn"
            onClick={onClose}
            aria-label="Cerrar modal de detalles"
          >
            <X size={20} aria-hidden="true" />
          </button>
        </header>

        <div className="modal-body">
          <div className="detail-grid">
            <div className="detail-item" style={{ gridColumn: '1 / -1' }}>
              <span className="detail-label" style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                <Globe size={15} color="#94a3b8" aria-hidden="true" />
                <span>Ciudad:</span>
              </span>
              <span className="detail-value">
                <span className="status-pill badge-disponible">{sucursal.ciudad}</span>
              </span>
            </div>

            <div className="detail-item" style={{ gridColumn: '1 / -1' }}>
              <span className="detail-label" style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                <MapPin size={15} color="#94a3b8" aria-hidden="true" />
                <span>Dirección Completa:</span>
              </span>
              <span className="detail-value">{sucursal.direccion}</span>
            </div>

            <div className="detail-item" style={{ gridColumn: '1 / -1' }}>
              <span className="detail-label" style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                <Phone size={15} color="#94a3b8" aria-hidden="true" />
                <span>Teléfono de Contacto:</span>
              </span>
              <span className="detail-value">
                {sucursal.telefono ? (
                  <a
                    href={`tel:${sucursal.telefono}`}
                    style={{ color: '#60a5fa', textDecoration: 'none' }}
                  >
                    {sucursal.telefono}
                  </a>
                ) : (
                  <span style={{ color: '#64748b' }}>No registrado</span>
                )}
              </span>
            </div>
          </div>
        </div>

        <footer className="modal-footer">
          <button type="button" className="btn btn-secondary" onClick={onClose}>
            Cerrar
          </button>
        </footer>
      </div>
    </div>
  )
}
