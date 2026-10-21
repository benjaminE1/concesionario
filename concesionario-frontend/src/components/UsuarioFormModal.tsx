import React, { useState, useEffect } from 'react'
import { X, Save, Plus, UserPlus, UserCheck } from 'lucide-react'
import type {
  UsuarioResponseDto,
  CrearUsuarioDto,
  ActualizarUsuarioDto,
  Rol,
} from '../types'

interface UsuarioFormModalProps {
  isOpen: boolean
  initialData?: UsuarioResponseDto | null
  roles: Rol[]
  onSubmitCreate: (dto: CrearUsuarioDto) => Promise<void>
  onSubmitUpdate: (id: number, dto: ActualizarUsuarioDto) => Promise<void>
  onClose: () => void
  isSubmitting: boolean
  serverError: string | null
}

const UsuarioFormModalInner: React.FC<UsuarioFormModalProps> = ({
  initialData,
  roles,
  onSubmitCreate,
  onSubmitUpdate,
  onClose,
  isSubmitting,
  serverError,
}) => {
  const isEditing = Boolean(initialData)

  const [formData, setFormData] = useState({
    nombre: initialData ? initialData.nombre : '',
    email: initialData ? initialData.email : '',
    password: '',
    telefono: initialData ? initialData.telefono || '' : '',
    idRol: initialData ? initialData.idRol : roles[0]?.idRol || 2,
  })

  const [errors, setErrors] = useState<Record<string, string>>({})

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && !isSubmitting) {
        onClose()
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [onClose, isSubmitting])

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {}

    const trimmedNombre = formData.nombre.trim()
    if (!trimmedNombre) {
      newErrors.nombre = 'El nombre completo es obligatorio.'
    } else if (trimmedNombre.length < 3) {
      newErrors.nombre = 'El nombre debe tener al menos 3 caracteres.'
    } else if (trimmedNombre.length > 100) {
      newErrors.nombre = 'El nombre no puede exceder los 100 caracteres.'
    }

    const trimmedEmail = formData.email.trim()
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!trimmedEmail) {
      newErrors.email = 'El correo electrónico es obligatorio.'
    } else if (!emailRegex.test(trimmedEmail)) {
      newErrors.email = 'Ingresa un formato de correo electrónico válido (ej. usuario@dominio.cl).'
    }

    if (!isEditing) {
      if (!formData.password) {
        newErrors.password = 'La contraseña temporal o inicial es obligatoria.'
      } else if (formData.password.length < 3) {
        newErrors.password = 'La contraseña debe contener al menos 3 caracteres.'
      }
    }

    if (formData.telefono && formData.telefono.trim().length > 50) {
      newErrors.telefono = 'El teléfono no puede exceder los 50 caracteres.'
    }

    if (!formData.idRol) {
      newErrors.idRol = 'Debes seleccionar un rol para el usuario.'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target

    setFormData((prev) => ({
      ...prev,
      [name]: name === 'idRol' ? Number(value) : value,
    }))

    if (errors[name]) {
      setErrors((prev) => {
        const next = { ...prev }
        delete next[name]
        return next
      })
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validate()) {
      return
    }

    if (isEditing && initialData) {
      const updatePayload: ActualizarUsuarioDto = {
        nombre: formData.nombre.trim(),
        email: formData.email.trim(),
        telefono: formData.telefono ? formData.telefono.trim() : null,
        idRol: Number(formData.idRol),
      }
      await onSubmitUpdate(initialData.idUsuario, updatePayload)
    } else {
      const createPayload: CrearUsuarioDto = {
        nombre: formData.nombre.trim(),
        email: formData.email.trim(),
        password: formData.password,
        telefono: formData.telefono ? formData.telefono.trim() : null,
        idRol: Number(formData.idRol),
      }
      await onSubmitCreate(createPayload)
    }
  }

  return (
    <div
      className="modal-backdrop"
      role="presentation"
      onClick={(e) => {
        if (e.target === e.currentTarget && !isSubmitting) onClose()
      }}
    >
      <div
        className="modal-dialog modal-md"
        role="dialog"
        aria-modal="true"
        aria-labelledby="usuario-modal-title"
      >
        <header className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            {isEditing ? (
              <UserCheck size={22} color="#60a5fa" aria-hidden="true" />
            ) : (
              <UserPlus size={22} color="#60a5fa" aria-hidden="true" />
            )}
            <h2 id="usuario-modal-title" className="modal-title">
              {isEditing ? `Editar Usuario #${initialData?.idUsuario}` : 'Registrar Nuevo Usuario'}
            </h2>
          </div>
          <button
            type="button"
            className="modal-close-btn"
            onClick={onClose}
            disabled={isSubmitting}
            aria-label="Cerrar modal"
          >
            <X size={20} aria-hidden="true" />
          </button>
        </header>

        <form onSubmit={handleSubmit} noValidate>
          <div className="modal-body">
            {serverError && (
              <div className="alert alert-danger" style={{ marginBottom: '1.25rem' }} role="alert">
                <p className="alert-text">{serverError}</p>
              </div>
            )}

            <div className="form-grid">
              {/* Nombre Completo */}
              <div className="form-group full-width">
                <label htmlFor="user-nombre" className="form-label">
                  Nombre Completo <span className="req-star">*</span>
                </label>
                <input
                  id="user-nombre"
                  name="nombre"
                  type="text"
                  className={`form-input ${errors.nombre ? 'has-error' : ''}`}
                  value={formData.nombre}
                  onChange={handleChange}
                  placeholder="Ej. Roberto Gómez Bolaños"
                  disabled={isSubmitting}
                  aria-invalid={Boolean(errors.nombre)}
                  aria-describedby={errors.nombre ? 'user-nombre-error' : undefined}
                  required
                />
                {errors.nombre && (
                  <span id="user-nombre-error" className="form-error-msg" role="alert">
                    {errors.nombre}
                  </span>
                )}
              </div>

              {/* Correo Electrónico */}
              <div className="form-group">
                <label htmlFor="user-email" className="form-label">
                  Correo Electrónico <span className="req-star">*</span>
                </label>
                <input
                  id="user-email"
                  name="email"
                  type="email"
                  className={`form-input ${errors.email ? 'has-error' : ''}`}
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Ej. usuario@concesionario.cl"
                  disabled={isSubmitting}
                  aria-invalid={Boolean(errors.email)}
                  aria-describedby={errors.email ? 'user-email-error' : undefined}
                  required
                />
                {errors.email && (
                  <span id="user-email-error" className="form-error-msg" role="alert">
                    {errors.email}
                  </span>
                )}
              </div>

              {/* Rol Asignado */}
              <div className="form-group">
                <label htmlFor="user-rol" className="form-label">
                  Rol del Sistema <span className="req-star">*</span>
                </label>
                <select
                  id="user-rol"
                  name="idRol"
                  className={`form-select ${errors.idRol ? 'has-error' : ''}`}
                  value={formData.idRol}
                  onChange={handleChange}
                  disabled={isSubmitting}
                  aria-invalid={Boolean(errors.idRol)}
                  aria-describedby={errors.idRol ? 'user-rol-error' : undefined}
                  required
                >
                  {roles.map((r) => (
                    <option key={r.idRol} value={r.idRol}>
                      {r.nombre} (ID #{r.idRol})
                    </option>
                  ))}
                </select>
                {errors.idRol && (
                  <span id="user-rol-error" className="form-error-msg" role="alert">
                    {errors.idRol}
                  </span>
                )}
              </div>

              {/* Teléfono */}
              <div className="form-group">
                <label htmlFor="user-telefono" className="form-label">
                  Teléfono de Contacto
                </label>
                <input
                  id="user-telefono"
                  name="telefono"
                  type="tel"
                  className={`form-input ${errors.telefono ? 'has-error' : ''}`}
                  value={formData.telefono}
                  onChange={handleChange}
                  placeholder="Ej. +56 9 8765 4321"
                  disabled={isSubmitting}
                  aria-invalid={Boolean(errors.telefono)}
                  aria-describedby={errors.telefono ? 'user-tel-error' : undefined}
                />
                {errors.telefono && (
                  <span id="user-tel-error" className="form-error-msg" role="alert">
                    {errors.telefono}
                  </span>
                )}
              </div>

              {/* Contraseña (Solo en creación) */}
              {!isEditing ? (
                <div className="form-group">
                  <label htmlFor="user-password" className="form-label">
                    Contraseña Inicial <span className="req-star">*</span>
                  </label>
                  <input
                    id="user-password"
                    name="password"
                    type="password"
                    className={`form-input ${errors.password ? 'has-error' : ''}`}
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Mínimo 3 caracteres"
                    disabled={isSubmitting}
                    aria-invalid={Boolean(errors.password)}
                    aria-describedby={errors.password ? 'user-pwd-error' : undefined}
                    required
                  />
                  {errors.password && (
                    <span id="user-pwd-error" className="form-error-msg" role="alert">
                      {errors.password}
                    </span>
                  )}
                </div>
              ) : (
                <div className="form-group" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                  <span className="form-label" style={{ color: '#64748b' }}>Seguridad de Contraseña</span>
                  <p className="help-note" style={{ margin: 0 }}>
                    La contraseña se mantiene protegida con hash criptográfico en el backend.
                  </p>
                </div>
              )}
            </div>
          </div>

          <footer className="modal-footer">
            <button
              type="button"
              className="btn btn-secondary"
              onClick={onClose}
              disabled={isSubmitting}
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <span className="spinner-border" aria-hidden="true"></span>
                  <span>Guardando...</span>
                </>
              ) : isEditing ? (
                <>
                  <Save size={16} aria-hidden="true" style={{ marginRight: '0.4rem' }} />
                  <span>Actualizar Usuario</span>
                </>
              ) : (
                <>
                  <Plus size={16} aria-hidden="true" style={{ marginRight: '0.4rem' }} />
                  <span>Crear Usuario</span>
                </>
              )}
            </button>
          </footer>
        </form>
      </div>
    </div>
  )
}

export const UsuarioFormModal: React.FC<UsuarioFormModalProps> = (props) => {
  if (!props.isOpen) return null
  return <UsuarioFormModalInner key={props.initialData?.idUsuario || 'new'} {...props} />
}
