import React, { useEffect } from 'react'
import { AlertTriangle, X, Trash2, Wrench } from 'lucide-react'
import type { Repuesto } from '../types'

interface RepuestoDeleteModalProps {
  isOpen: boolean
  repuesto: Repuesto | null
  onConfirm: () => Promise<void>
  onCancel: () => void
  isDeleting: boolean
  error: string | null
}

export const RepuestoDeleteModal: React.FC<RepuestoDeleteModalProps> = ({
  isOpen,
  repuesto,
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

  if (!isOpen || !repuesto) return null

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
        aria-labelledby="confirm-delete-repuesto-title"
      >
        <header className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <AlertTriangle size={22} color="#f87171" aria-hidden="true" />
            <h2 id="confirm-delete-repuesto-title" className="modal-title" style={{ color: '#f87171' }}>
              Eliminar Repuesto
            </h2>
          </div>
          <button
            type="button"
            className="modal-close-btn"
            onClick={onCancel}
            disabled={isDeleting}
            aria-label="Cerrar modal de eliminación"
          >
            <X size={20} aria-hidden="true" />
          </button>
        </header>

        <div className="modal-body">
          <p className="modal-alert-text">
            ¿Estás seguro de que deseas eliminar permanentemente este repuesto del inventario?
          </p>

          <div className="delete-target-box">
            <p style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <Wrench size={16} color="#60a5fa" aria-hidden="true" />
              <strong>Repuesto:</strong> <span>{repuesto.nombre}</span>
            </p>
            <p>
              <strong>Código:</strong> {repuesto.codigoReferencia || 'Sin código'}
            </p>
            <p>
              <strong>Stock actual:</strong> {repuesto.stock} unidades
            </p>
          </div>

          <div className="help-box" style={{ marginTop: '0.75rem', borderColor: '#7f1d1d' }}>
            <p className="help-note" style={{ color: '#fca5a5' }}>
              <strong>Control de Integridad Referencial:</strong> Si este repuesto se encuentra asociado a órdenes de servicio o mantenciones activas, el sistema no permitirá su eliminación para preservar el historial.
            </p>
          </div>

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
            onClick={onConfirm}
            disabled={isDeleting}
          >
            {isDeleting ? (
              <>
                <span className="spinner-border" aria-hidden="true"></span>
                <span>Eliminando...</span>
              </>
            ) : (
              <>
                <Trash2 size={16} aria-hidden="true" style={{ marginRight: '0.4rem' }} />
                <span>Confirmar Eliminación</span>
              </>
            )}
          </button>
        </footer>
      </div>
    </div>
  )
}
