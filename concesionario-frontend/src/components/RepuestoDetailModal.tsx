import React, { useEffect } from 'react'
import { X, Wrench, Barcode, DollarSign, Package, Building2 } from 'lucide-react'
import type { Repuesto } from '../types'

interface RepuestoDetailModalProps {
  repuesto: Repuesto | null
  sucursalesMap: Record<number, string>
  onClose: () => void
}

export const RepuestoDetailModal: React.FC<RepuestoDetailModalProps> = ({
  repuesto,
  sucursalesMap,
  onClose,
}) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose()
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [onClose])

  if (!repuesto) return null

  const formatPrecio = (precio: number) => {
    return new Intl.NumberFormat('es-CL', {
      style: 'currency',
      currency: 'CLP',
      maximumFractionDigits: 0,
    }).format(precio)
  }

  const nombreSucursal = repuesto.idSucursal
    ? sucursalesMap[repuesto.idSucursal] || `Sucursal #${repuesto.idSucursal}`
    : 'Sin sucursal asignada'

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
        aria-labelledby="repuesto-detail-title"
      >
        <header className="modal-header">
          <div>
            <span className="modal-badge">Ficha de Repuesto</span>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '0.25rem' }}>
              <Wrench size={22} color="#60a5fa" aria-hidden="true" />
              <h2 id="repuesto-detail-title" className="modal-title">
                {repuesto.nombre}
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
            <div className="detail-item">
              <span className="detail-label" style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                <Barcode size={15} color="#94a3b8" aria-hidden="true" />
                <span>Código de Referencia:</span>
              </span>
              <span className="detail-value cell-patente">
                {repuesto.codigoReferencia || 'Sin código'}
              </span>
            </div>

            <div className="detail-item">
              <span className="detail-label" style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                <DollarSign size={15} color="#94a3b8" aria-hidden="true" />
                <span>Precio Unitario:</span>
              </span>
              <span className="detail-value" style={{ color: '#6ee7b7', fontWeight: 700 }}>
                {formatPrecio(repuesto.precio)}
              </span>
            </div>

            <div className="detail-item">
              <span className="detail-label" style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                <Package size={15} color="#94a3b8" aria-hidden="true" />
                <span>Estado de Stock:</span>
              </span>
              <span className="detail-value">
                {repuesto.stock === 0 ? (
                  <span className="status-pill badge-vendido">Agotado (0 unid.)</span>
                ) : repuesto.stock <= 5 ? (
                  <span className="status-pill badge-otro">Bajo Stock ({repuesto.stock} unid.)</span>
                ) : (
                  <span className="status-pill badge-disponible">En Stock ({repuesto.stock} unid.)</span>
                )}
              </span>
            </div>

            <div className="detail-item">
              <span className="detail-label" style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                <Building2 size={15} color="#94a3b8" aria-hidden="true" />
                <span>Ubicación / Sucursal:</span>
              </span>
              <span className="detail-value">{nombreSucursal}</span>
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
