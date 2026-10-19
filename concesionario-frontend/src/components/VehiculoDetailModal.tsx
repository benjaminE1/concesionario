import React, { useEffect } from 'react'
import { X } from 'lucide-react'
import type { VehiculoResponseDto } from '../types'

interface VehiculoDetailModalProps {
  vehiculo: VehiculoResponseDto | null
  onClose: () => void
  marcasMap: Record<number, string>
  tiposVehiculoMap: Record<number, string>
  tiposCombustibleMap: Record<number, string>
  sucursalesMap: Record<number, string>
}

export const VehiculoDetailModal: React.FC<VehiculoDetailModalProps> = ({
  vehiculo,
  onClose,
  marcasMap,
  tiposVehiculoMap,
  tiposCombustibleMap,
  sucursalesMap,
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

  if (!vehiculo) return null

  const formatPrecio = (precio: number) => {
    return new Intl.NumberFormat('es-CL', {
      style: 'currency',
      currency: 'CLP',
      maximumFractionDigits: 0,
    }).format(precio)
  }

  const nombreMarca = marcasMap[vehiculo.idMarca] || `Marca #${vehiculo.idMarca}`
  const nombreTipoVehiculo =
    tiposVehiculoMap[vehiculo.idTipoVehiculo] || `Tipo #${vehiculo.idTipoVehiculo}`
  const nombreCombustible =
    tiposCombustibleMap[vehiculo.idTipoCombustible] || `Combustible #${vehiculo.idTipoCombustible}`
  const nombreSucursal =
    sucursalesMap[vehiculo.idSucursal] || `Sucursal #${vehiculo.idSucursal}`

  const estadoLower = vehiculo.estado.toLowerCase()
  const badgeClass =
    estadoLower === 'disponible'
      ? 'badge-disponible'
      : estadoLower === 'vendido'
        ? 'badge-vendido'
        : 'badge-otro'

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
        aria-labelledby="detail-modal-title"
      >
        <header className="modal-header">
          <div>
            <span className="modal-badge">Ficha Técnica</span>
            <h2 id="detail-modal-title" className="modal-title">
              {vehiculo.modelo} ({vehiculo.anio})
            </h2>
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
              <span className="detail-label">Identificador (ID):</span>
              <span className="detail-value">#{vehiculo.idVehiculo}</span>
            </div>

            <div className="detail-item">
              <span className="detail-label">Patente:</span>
              <span className="detail-value cell-patente">
                <strong>{vehiculo.patente}</strong>
              </span>
            </div>

            <div className="detail-item">
              <span className="detail-label">Marca:</span>
              <span className="detail-value">{nombreMarca}</span>
            </div>

            <div className="detail-item">
              <span className="detail-label">Modelo:</span>
              <span className="detail-value">{vehiculo.modelo}</span>
            </div>

            <div className="detail-item">
              <span className="detail-label">Año de Fabricación:</span>
              <span className="detail-value">{vehiculo.anio}</span>
            </div>

            <div className="detail-item">
              <span className="detail-label">Precio de Venta:</span>
              <span className="detail-value cell-precio">{formatPrecio(vehiculo.precio)}</span>
            </div>

            <div className="detail-item">
              <span className="detail-label">Estado Actual:</span>
              <span className="detail-value">
                <span className={`status-pill ${badgeClass}`}>{vehiculo.estado}</span>
              </span>
            </div>

            <div className="detail-item">
              <span className="detail-label">Tipo de Carrocería:</span>
              <span className="detail-value">{nombreTipoVehiculo}</span>
            </div>

            <div className="detail-item">
              <span className="detail-label">Tipo de Combustible:</span>
              <span className="detail-value">{nombreCombustible}</span>
            </div>

            <div className="detail-item">
              <span className="detail-label">Sucursal Asignada:</span>
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
