import React, { useState, useEffect } from 'react'
import { X, Save, Plus, Building2 } from 'lucide-react'
import type { Sucursal, CreateSucursalDto } from '../types'

interface SucursalFormModalProps {
  isOpen: boolean
  initialData?: Sucursal | null
  onSubmit: (dto: CreateSucursalDto) => Promise<void>
  onClose: () => void
  isSubmitting: boolean
  serverError: string | null
}

const SucursalFormModalInner: React.FC<SucursalFormModalProps> = ({
  initialData,
  onSubmit,
  onClose,
  isSubmitting,
  serverError,
}) => {
  const isEditing = Boolean(initialData)

  const [formData, setFormData] = useState<CreateSucursalDto>(() => {
    if (initialData) {
      return {
        nombre: initialData.nombre,
        ciudad: initialData.ciudad,
        direccion: initialData.direccion,
        telefono: initialData.telefono || '',
      }
    }
    return {
      nombre: '',
      ciudad: '',
      direccion: '',
      telefono: '',
    }
  })

  const [errors, setErrors] = useState<Record<string, string>>({})

  // Escuchar tecla Escape para cerrar modal
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
      newErrors.nombre = 'El nombre de la sucursal es obligatorio.'
    } else if (trimmedNombre.length < 3) {
      newErrors.nombre = 'El nombre debe tener al menos 3 caracteres.'
    } else if (trimmedNombre.length > 100) {
      newErrors.nombre = 'El nombre no puede exceder los 100 caracteres.'
    }

    const trimmedCiudad = formData.ciudad.trim()
    if (!trimmedCiudad) {
      newErrors.ciudad = 'La ciudad es obligatoria.'
    } else if (trimmedCiudad.length < 2) {
      newErrors.ciudad = 'La ciudad debe tener al menos 2 caracteres.'
    } else if (trimmedCiudad.length > 100) {
      newErrors.ciudad = 'La ciudad no puede exceder los 100 caracteres.'
    }

    const trimmedDireccion = formData.direccion.trim()
    if (!trimmedDireccion) {
      newErrors.direccion = 'La dirección es obligatoria.'
    } else if (trimmedDireccion.length < 5) {
      newErrors.direccion = 'La dirección debe tener al menos 5 caracteres.'
    } else if (trimmedDireccion.length > 200) {
      newErrors.direccion = 'La dirección no puede exceder los 200 caracteres.'
    }

    if (formData.telefono && formData.telefono.trim().length > 50) {
      newErrors.telefono = 'El teléfono no puede exceder los 50 caracteres.'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
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

    const payload: CreateSucursalDto = {
      nombre: formData.nombre.trim(),
      ciudad: formData.ciudad.trim(),
      direccion: formData.direccion.trim(),
      telefono: formData.telefono ? formData.telefono.trim() : null,
    }

    await onSubmit(payload)
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
        aria-labelledby="sucursal-modal-title"
      >
        <header className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <Building2 size={22} color="#60a5fa" aria-hidden="true" />
            <h2 id="sucursal-modal-title" className="modal-title">
              {isEditing ? `Editar Sucursal #${initialData?.idSucursal}` : 'Registrar Nueva Sucursal'}
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
              {/* Nombre */}
              <div className="form-group full-width">
                <label htmlFor="sucursal-nombre" className="form-label">
                  Nombre de Sucursal <span className="req-star">*</span>
                </label>
                <input
                  id="sucursal-nombre"
                  name="nombre"
                  type="text"
                  className={`form-input ${errors.nombre ? 'has-error' : ''}`}
                  value={formData.nombre}
                  onChange={handleChange}
                  placeholder="Ej. Sucursal Central Alameda"
                  disabled={isSubmitting}
                  aria-invalid={Boolean(errors.nombre)}
                  aria-describedby={errors.nombre ? 'nombre-error' : undefined}
                  required
                />
                {errors.nombre && (
                  <span id="nombre-error" className="form-error-msg" role="alert">
                    {errors.nombre}
                  </span>
                )}
              </div>

              {/* Ciudad */}
              <div className="form-group">
                <label htmlFor="sucursal-ciudad" className="form-label">
                  Ciudad <span className="req-star">*</span>
                </label>
                <input
                  id="sucursal-ciudad"
                  name="ciudad"
                  type="text"
                  className={`form-input ${errors.ciudad ? 'has-error' : ''}`}
                  value={formData.ciudad}
                  onChange={handleChange}
                  placeholder="Ej. Santiago"
                  disabled={isSubmitting}
                  aria-invalid={Boolean(errors.ciudad)}
                  aria-describedby={errors.ciudad ? 'ciudad-error' : undefined}
                  required
                />
                {errors.ciudad && (
                  <span id="ciudad-error" className="form-error-msg" role="alert">
                    {errors.ciudad}
                  </span>
                )}
              </div>

              {/* Teléfono */}
              <div className="form-group">
                <label htmlFor="sucursal-telefono" className="form-label">
                  Teléfono de Contacto
                </label>
                <input
                  id="sucursal-telefono"
                  name="telefono"
                  type="tel"
                  className={`form-input ${errors.telefono ? 'has-error' : ''}`}
                  value={formData.telefono || ''}
                  onChange={handleChange}
                  placeholder="Ej. +56 2 2345 6789"
                  disabled={isSubmitting}
                  aria-invalid={Boolean(errors.telefono)}
                  aria-describedby={errors.telefono ? 'telefono-error' : undefined}
                />
                {errors.telefono && (
                  <span id="telefono-error" className="form-error-msg" role="alert">
                    {errors.telefono}
                  </span>
                )}
              </div>

              {/* Dirección */}
              <div className="form-group full-width">
                <label htmlFor="sucursal-direccion" className="form-label">
                  Dirección Completa <span className="req-star">*</span>
                </label>
                <input
                  id="sucursal-direccion"
                  name="direccion"
                  type="text"
                  className={`form-input ${errors.direccion ? 'has-error' : ''}`}
                  value={formData.direccion}
                  onChange={handleChange}
                  placeholder="Ej. Av. Libertador Bernardo O'Higgins 1234"
                  disabled={isSubmitting}
                  aria-invalid={Boolean(errors.direccion)}
                  aria-describedby={errors.direccion ? 'direccion-error' : undefined}
                  required
                />
                {errors.direccion && (
                  <span id="direccion-error" className="form-error-msg" role="alert">
                    {errors.direccion}
                  </span>
                )}
              </div>
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
                  <span>Actualizar Sucursal</span>
                </>
              ) : (
                <>
                  <Plus size={16} aria-hidden="true" style={{ marginRight: '0.4rem' }} />
                  <span>Crear Sucursal</span>
                </>
              )}
            </button>
          </footer>
        </form>
      </div>
    </div>
  )
}

export const SucursalFormModal: React.FC<SucursalFormModalProps> = (props) => {
  if (!props.isOpen) return null
  return <SucursalFormModalInner key={props.initialData?.idSucursal || 'new'} {...props} />
}
