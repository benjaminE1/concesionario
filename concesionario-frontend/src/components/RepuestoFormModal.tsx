import React, { useState, useEffect } from 'react'
import { X, Save, Plus, Wrench } from 'lucide-react'
import type { Repuesto, CreateRepuestoDto, Sucursal } from '../types'

interface RepuestoFormModalProps {
  isOpen: boolean
  initialData?: Repuesto | null
  sucursales: Sucursal[]
  onSubmit: (dto: CreateRepuestoDto) => Promise<void>
  onClose: () => void
  isSubmitting: boolean
  serverError: string | null
}

const RepuestoFormModalInner: React.FC<RepuestoFormModalProps> = ({
  initialData,
  sucursales,
  onSubmit,
  onClose,
  isSubmitting,
  serverError,
}) => {
  const isEditing = Boolean(initialData)

  const [formData, setFormData] = useState<CreateRepuestoDto>(() => {
    if (initialData) {
      return {
        nombre: initialData.nombre,
        codigoReferencia: initialData.codigoReferencia || '',
        precio: initialData.precio,
        stock: initialData.stock,
        idSucursal: initialData.idSucursal ?? (sucursales[0]?.idSucursal || null),
      }
    }
    return {
      nombre: '',
      codigoReferencia: '',
      precio: 15000,
      stock: 10,
      idSucursal: sucursales[0]?.idSucursal || null,
    }
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
      newErrors.nombre = 'El nombre del repuesto es obligatorio.'
    } else if (trimmedNombre.length < 2) {
      newErrors.nombre = 'El nombre debe tener al menos 2 caracteres.'
    } else if (trimmedNombre.length > 100) {
      newErrors.nombre = 'El nombre no puede exceder los 100 caracteres.'
    }

    if (formData.codigoReferencia && formData.codigoReferencia.trim().length > 50) {
      newErrors.codigoReferencia = 'El código de referencia no puede exceder 50 caracteres.'
    }

    if (formData.precio === undefined || formData.precio === null || isNaN(formData.precio)) {
      newErrors.precio = 'El precio es obligatorio.'
    } else if (formData.precio <= 0) {
      newErrors.precio = 'El precio debe ser mayor a $0.'
    }

    if (formData.stock === undefined || formData.stock === null || isNaN(formData.stock)) {
      newErrors.stock = 'El stock es obligatorio.'
    } else if (formData.stock < 0) {
      newErrors.stock = 'El stock no puede ser negativo.'
    } else if (!Number.isInteger(formData.stock)) {
      newErrors.stock = 'El stock debe ser un número entero.'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value, type } = e.target

    setFormData((prev) => ({
      ...prev,
      [name]:
        type === 'number'
          ? value === ''
            ? 0
            : Number(value)
          : name === 'idSucursal'
            ? value === ''
              ? null
              : Number(value)
            : value,
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

    const payload: CreateRepuestoDto = {
      nombre: formData.nombre.trim(),
      codigoReferencia: formData.codigoReferencia ? formData.codigoReferencia.trim() : null,
      precio: Number(formData.precio),
      stock: Number(formData.stock),
      idSucursal: formData.idSucursal ? Number(formData.idSucursal) : null,
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
        aria-labelledby="repuesto-modal-title"
      >
        <header className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <Wrench size={22} color="#60a5fa" aria-hidden="true" />
            <h2 id="repuesto-modal-title" className="modal-title">
              {isEditing ? `Editar Repuesto #${initialData?.idRepuesto}` : 'Registrar Nuevo Repuesto'}
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
                <label htmlFor="repuesto-nombre" className="form-label">
                  Nombre del Repuesto <span className="req-star">*</span>
                </label>
                <input
                  id="repuesto-nombre"
                  name="nombre"
                  type="text"
                  className={`form-input ${errors.nombre ? 'has-error' : ''}`}
                  value={formData.nombre}
                  onChange={handleChange}
                  placeholder="Ej. Pastillas de Freno Delanteras"
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

              {/* Código de Referencia */}
              <div className="form-group">
                <label htmlFor="repuesto-codigo" className="form-label">
                  Código de Referencia / SKU
                </label>
                <div style={{ position: 'relative' }}>
                  <input
                    id="repuesto-codigo"
                    name="codigoReferencia"
                    type="text"
                    className={`form-input ${errors.codigoReferencia ? 'has-error' : ''}`}
                    value={formData.codigoReferencia || ''}
                    onChange={handleChange}
                    placeholder="Ej. BRK-2024-TY"
                    disabled={isSubmitting}
                    aria-invalid={Boolean(errors.codigoReferencia)}
                    aria-describedby={errors.codigoReferencia ? 'codigo-error' : undefined}
                  />
                </div>
                {errors.codigoReferencia && (
                  <span id="codigo-error" className="form-error-msg" role="alert">
                    {errors.codigoReferencia}
                  </span>
                )}
              </div>

              {/* Sucursal asignada */}
              <div className="form-group">
                <label htmlFor="repuesto-sucursal" className="form-label">
                  Sucursal de Almacenamiento
                </label>
                <select
                  id="repuesto-sucursal"
                  name="idSucursal"
                  className="form-select"
                  value={formData.idSucursal ?? ''}
                  onChange={handleChange}
                  disabled={isSubmitting}
                  aria-label="Seleccionar sucursal"
                >
                  <option value="">(Sin sucursal asignada)</option>
                  {sucursales.map((s) => (
                    <option key={s.idSucursal} value={s.idSucursal}>
                      {s.nombre} ({s.ciudad})
                    </option>
                  ))}
                </select>
              </div>

              {/* Precio */}
              <div className="form-group">
                <label htmlFor="repuesto-precio" className="form-label">
                  Precio Unitario (CLP) <span className="req-star">*</span>
                </label>
                <input
                  id="repuesto-precio"
                  name="precio"
                  type="number"
                  min="1"
                  step="1"
                  className={`form-input ${errors.precio ? 'has-error' : ''}`}
                  value={formData.precio === 0 ? '' : formData.precio}
                  onChange={handleChange}
                  placeholder="Ej. 25000"
                  disabled={isSubmitting}
                  aria-invalid={Boolean(errors.precio)}
                  aria-describedby={errors.precio ? 'precio-error' : undefined}
                  required
                />
                {errors.precio && (
                  <span id="precio-error" className="form-error-msg" role="alert">
                    {errors.precio}
                  </span>
                )}
              </div>

              {/* Stock */}
              <div className="form-group">
                <label htmlFor="repuesto-stock" className="form-label">
                  Unidades en Stock <span className="req-star">*</span>
                </label>
                <input
                  id="repuesto-stock"
                  name="stock"
                  type="number"
                  min="0"
                  step="1"
                  className={`form-input ${errors.stock ? 'has-error' : ''}`}
                  value={formData.stock === 0 ? '0' : formData.stock}
                  onChange={handleChange}
                  placeholder="Ej. 15"
                  disabled={isSubmitting}
                  aria-invalid={Boolean(errors.stock)}
                  aria-describedby={errors.stock ? 'stock-error' : undefined}
                  required
                />
                {errors.stock && (
                  <span id="stock-error" className="form-error-msg" role="alert">
                    {errors.stock}
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
                  <span>Actualizar Repuesto</span>
                </>
              ) : (
                <>
                  <Plus size={16} aria-hidden="true" style={{ marginRight: '0.4rem' }} />
                  <span>Crear Repuesto</span>
                </>
              )}
            </button>
          </footer>
        </form>
      </div>
    </div>
  )
}

export const RepuestoFormModal: React.FC<RepuestoFormModalProps> = (props) => {
  if (!props.isOpen) return null
  return <RepuestoFormModalInner key={props.initialData?.idRepuesto || 'new'} {...props} />
}
