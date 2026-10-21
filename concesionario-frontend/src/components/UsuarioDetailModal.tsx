import React, { useEffect } from 'react'
import { X, User, Mail, Phone, ShieldCheck } from 'lucide-react'
import type { UsuarioResponseDto } from '../types'

interface UsuarioDetailModalProps {
  usuario: UsuarioResponseDto | null
  rolesMap: Record<number, string>
  onClose: () => void
}

export const UsuarioDetailModal: React.FC<UsuarioDetailModalProps> = ({
  usuario,
  rolesMap,
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

  if (!usuario) return null

  const nombreRol =
    usuario.nombreRol || rolesMap[usuario.idRol] || 'Sin rol'

  const getRoleBadgeClass = (roleName: string) => {
    const lower = roleName.toLowerCase()
    if (lower === 'admin') return 'badge-mantenimiento'
    if (lower === 'vendedor') return 'badge-disponible'
    if (lower === 'mecanico') return 'badge-otro'
    return 'badge-reservado'
  }

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
        aria-labelledby="usuario-detail-title"
      >
        <header className="modal-header">
          <div>
            <span className="modal-badge">Ficha de Usuario</span>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '0.25rem' }}>
              <User size={22} color="#60a5fa" aria-hidden="true" />
              <h2 id="usuario-detail-title" className="modal-title">
                {usuario.nombre}
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
                <ShieldCheck size={15} color="#94a3b8" aria-hidden="true" />
                <span>Rol Asignado:</span>
              </span>
              <span className="detail-value">
                <span className={`status-pill ${getRoleBadgeClass(nombreRol)}`}>
                  {nombreRol}
                </span>
              </span>
            </div>

            <div className="detail-item" style={{ gridColumn: '1 / -1' }}>
              <span className="detail-label" style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                <Mail size={15} color="#94a3b8" aria-hidden="true" />
                <span>Correo Electrónico:</span>
              </span>
              <span className="detail-value">
                <a
                  href={`mailto:${usuario.email}`}
                  style={{ color: '#60a5fa', textDecoration: 'none' }}
                >
                  {usuario.email}
                </a>
              </span>
            </div>

            <div className="detail-item" style={{ gridColumn: '1 / -1' }}>
              <span className="detail-label" style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                <Phone size={15} color="#94a3b8" aria-hidden="true" />
                <span>Teléfono de Contacto:</span>
              </span>
              <span className="detail-value">
                {usuario.telefono ? (
                  <a
                    href={`tel:${usuario.telefono}`}
                    style={{ color: '#cbd5e1', textDecoration: 'none' }}
                  >
                    {usuario.telefono}
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
