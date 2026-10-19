import React, { useEffect } from 'react'
import type { VehiculoResponseDto } from '../types'

interface ConfirmDeleteModalProps {
  isOpen: boolean
  vehiculo: VehiculoResponseDto | null
  onConfirm: () => Promise<void>
  onCancel: () => void
  isDeleting: boolean
  error: string | null
}

export const ConfirmDeleteModal: React.FC<ConfirmDeleteModalProps> = ({
  isOpen,
  vehiculo,
  onConfirm,
  onCancel,
  isDeleting,
  error,
}) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && !isDeleting) {
        onCancel()
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [onCancel, isDeleting])

  if (!isOpen || !vehiculo) return null

  return (
    <div
      className="modal-backdrop"
      role="presentation"
      onClick={(e) => {
        if (e.target === e.currentTarget && !isDeleting) onCancel()
      }}
    >
      <div
        className="modal-dialog modal-sm"
        role="dialog"
        aria-modal="true"
        aria-labelledby="confirm-delete-title"
      >
        <header className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span style={{ fontSize: '1.5rem' }} aria-hidden="true">
              ⚠️
            </span>
            <h2 id="confirm-delete-title" className="modal-title" style={{ color: '#b91c1c' }}>
              Confirmar Eliminación
            </h2>
          </div>
          <button
            type="button"
            className="modal-close-btn"
            onClick={onCancel}
            disabled={isDeleting}
            aria-label="Cerrar modal de confirmación"
          >
            ✕
          </button>
        </header>

        <div className="modal-body">
          <p className="modal-alert-text">
            ¿Estás seguro de que deseas eliminar permanentemente el siguiente vehículo?
          </p>

          <div className="delete-target-box">
            <p>
              <strong>Patente:</strong> <span className="cell-patente">{vehiculo.patente}</span>
            </p>
            <p>
              <strong>Modelo:</strong> {vehiculo.modelo} ({vehiculo.anio})
            </p>
            <p>
              <strong>ID:</strong> #{vehiculo.idVehiculo}
            </p>
          </div>

          <p className="help-note" style={{ color: '#b91c1c' }}>
            Esta operación invocará <code>DELETE /api/vehiculos/{vehiculo.idVehiculo}</code> en la base de datos y no se puede deshacer.
          </p>

          {error && (
            <div className="alert alert-danger" style={{ marginTop: '1rem' }} role="alert">
              <p className="alert-text">{error}</p>
            </div>
          )}
        </div>

        <footer className="modal-footer">
          <button
            type="button"
            className="btn btn-secondary"
            onClick={onCancel}
            disabled={isDeleting}
          >
            Cancelar
          </button>
          <button
            type="button"
            className="btn btn-danger"
            onClick={() => void onConfirm()}
            disabled={isDeleting}
            aria-busy={isDeleting}
          >
            {isDeleting ? 'Eliminando...' : 'Sí, Eliminar Vehículo'}
          </button>
        </footer>
      </div>
    </div>
  )
}
