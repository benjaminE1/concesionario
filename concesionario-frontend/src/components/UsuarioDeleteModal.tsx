import React, { useEffect } from 'react'
import { AlertTriangle, X, Trash2, User, ShieldAlert } from 'lucide-react'
import type { UsuarioResponseDto } from '../types'

interface UsuarioDeleteModalProps {
  isOpen: boolean
  usuario: UsuarioResponseDto | null
  currentUserId?: number
  onConfirm: () => Promise<void>
  onCancel: () => void
  isDeleting: boolean
  error: string | null
}

export const UsuarioDeleteModal: React.FC<UsuarioDeleteModalProps> = ({
  isOpen,
  usuario,
  currentUserId,
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

  if (!isOpen || !usuario) return null

  const isSelf = Boolean(currentUserId && currentUserId === usuario.idUsuario)

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
        aria-labelledby="confirm-delete-usuario-title"
      >
        <header className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <AlertTriangle size={22} color="#f87171" aria-hidden="true" />
            <h2 id="confirm-delete-usuario-title" className="modal-title" style={{ color: '#f87171' }}>
              Eliminar Usuario
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
            ¿Estás seguro de que deseas eliminar permanentemente a este usuario del sistema?
          </p>

          <div className="delete-target-box">
            <p style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <User size={16} color="#60a5fa" aria-hidden="true" />
              <strong>Usuario:</strong> <span>{usuario.nombre}</span>
            </p>
            <p>
              <strong>Email:</strong> {usuario.email}
            </p>
            <p>
              <strong>Rol:</strong> {usuario.nombreRol || 'Asignado'}
            </p>
          </div>

          {isSelf ? (
            <div className="alert alert-danger" style={{ marginTop: '0.75rem' }} role="alert">
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <ShieldAlert size={18} aria-hidden="true" />
                <p className="alert-text">
                  <strong>Acción Bloqueada:</strong> No puedes eliminar tu propia cuenta mientras te encuentras autenticado en sesión.
                </p>
              </div>
            </div>
          ) : (
            <div className="help-box" style={{ marginTop: '0.75rem', borderColor: '#7f1d1d' }}>
              <p className="help-note" style={{ color: '#fca5a5' }}>
                Si este usuario tiene operaciones o transacciones registradas en el sistema, no podrá ser eliminado para preservar el historial.
              </p>
            </div>
          )}

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
            disabled={isDeleting || isSelf}
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
