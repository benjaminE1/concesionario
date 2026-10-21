import React, { useEffect } from 'react'
import { AlertTriangle, X, Trash2 } from 'lucide-react'
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
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <AlertTriangle size={22} color="#f87171" aria-hidden="true" />
            <h2 id="confirm-delete-title" className="modal-title" style={{ color: '#f87171' }}>
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
            <X size={20} aria-hidden="true" />
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
          </div>

          <p className="help-note" style={{ color: '#f87171' }}>
            Esta acción no se puede deshacer y el registro del vehículo será eliminado permanentemente del sistema.
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
            <Trash2 size={16} aria-hidden="true" style={{ marginRight: '0.4rem' }} />
            <span>{isDeleting ? 'Eliminando...' : 'Sí, Eliminar Vehículo'}</span>
          </button>
        </footer>
      </div>
    </div>
  )
}
