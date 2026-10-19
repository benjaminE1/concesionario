import React, { useState, useEffect } from 'react'
import type {
  VehiculoResponseDto,
  CreateVehiculoDto,
  Marca,
  TipoVehiculo,
  TipoCombustible,
  Sucursal,
} from '../types'

interface VehiculoFormModalProps {
  isOpen: boolean
  initialData?: VehiculoResponseDto | null
  marcas: Marca[]
  tiposVehiculo: TipoVehiculo[]
  tiposCombustible: TipoCombustible[]
  sucursales: Sucursal[]
  onSubmit: (dto: CreateVehiculoDto) => Promise<void>
  onClose: () => void
  isSubmitting: boolean
  serverError: string | null
}

const CURRENT_YEAR = 2026

const VehiculoFormModalInner: React.FC<VehiculoFormModalProps> = ({
  initialData,
  marcas,
  tiposVehiculo,
  tiposCombustible,
  sucursales,
  onSubmit,
  onClose,
  isSubmitting,
  serverError,
}) => {
  const isEditing = Boolean(initialData)

  // Inicialización directa según props en el montaje (sin useEffect reactivo de estado)
  const [formData, setFormData] = useState<CreateVehiculoDto>(() => {
    if (initialData) {
      return {
        patente: initialData.patente,
        modelo: initialData.modelo,
        anio: initialData.anio,
        precio: initialData.precio,
        estado: initialData.estado,
        idMarca: initialData.idMarca,
        idTipoVehiculo: initialData.idTipoVehiculo,
        idTipoCombustible: initialData.idTipoCombustible,
        idSucursal: initialData.idSucursal,
      }
    }
    return {
      patente: '',
      modelo: '',
      anio: CURRENT_YEAR,
      precio: 10000000,
      estado: 'Disponible',
      idMarca: marcas[0]?.idMarca || 1,
      idTipoVehiculo: tiposVehiculo[0]?.idTipoVehiculo || 1,
      idTipoCombustible: tiposCombustible[0]?.idTipoCombustible || 1,
      idSucursal: sucursales[0]?.idSucursal || 1,
    }
  })

  const [errors, setErrors] = useState<Record<string, string>>({})

  // Escuchar tecla Escape
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

    const trimmedPatente = formData.patente.trim().toUpperCase()
    if (!trimmedPatente) {
      newErrors.patente = 'La patente es requerida.'
    } else if (trimmedPatente.length > 10) {
      newErrors.patente = 'La patente no puede exceder los 10 caracteres.'
    }

    if (!formData.modelo.trim()) {
      newErrors.modelo = 'El modelo es requerido.'
    } else if (formData.modelo.trim().length > 100) {
      newErrors.modelo = 'El modelo no puede exceder los 100 caracteres.'
    }

    if (!formData.anio || formData.anio < 1900 || formData.anio > CURRENT_YEAR + 1) {
      newErrors.anio = `El año debe estar entre 1900 y ${CURRENT_YEAR + 1}.`
    }

    if (!formData.precio || formData.precio <= 0) {
      newErrors.precio = 'El precio debe ser un número positivo mayor a 0.'
    }

    if (!formData.estado.trim()) {
      newErrors.estado = 'El estado es requerido.'
    }

    if (!formData.idMarca || formData.idMarca <= 0) {
      newErrors.idMarca = 'Debes seleccionar una marca válida.'
    }

    if (!formData.idTipoVehiculo || formData.idTipoVehiculo <= 0) {
      newErrors.idTipoVehiculo = 'Debes seleccionar un tipo de vehículo válido.'
    }

    if (!formData.idTipoCombustible || formData.idTipoCombustible <= 0) {
      newErrors.idTipoCombustible = 'Debes seleccionar un tipo de combustible válido.'
    }

    if (!formData.idSucursal || formData.idSucursal <= 0) {
      newErrors.idSucursal = 'Debes seleccionar una sucursal válida.'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!validate()) return

    const sanitizedData: CreateVehiculoDto = {
      ...formData,
      patente: formData.patente.trim().toUpperCase(),
      modelo: formData.modelo.trim(),
      anio: Number(formData.anio),
      precio: Number(formData.precio),
      idMarca: Number(formData.idMarca),
      idTipoVehiculo: Number(formData.idTipoVehiculo),
      idTipoCombustible: Number(formData.idTipoCombustible),
      idSucursal: Number(formData.idSucursal),
    }

    await onSubmit(sanitizedData)
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
        className="modal-dialog modal-lg"
        role="dialog"
        aria-modal="true"
        aria-labelledby="vehiculo-modal-title"
      >
        <header className="modal-header">
          <div>
            <span className="modal-badge">{isEditing ? 'Edición' : 'Nuevo Registro'}</span>
            <h2 id="vehiculo-modal-title" className="modal-title">
              {isEditing ? `Editar Vehículo #${initialData?.idVehiculo}` : 'Registrar Nuevo Vehículo'}
            </h2>
          </div>
          <button
            type="button"
            className="modal-close-btn"
            onClick={onClose}
            disabled={isSubmitting}
            aria-label="Cerrar modal de formulario"
          >
            ✕
          </button>
        </header>

        <form onSubmit={handleSubmit} noValidate className="modal-form">
          <div className="modal-body">
            {serverError && (
              <div className="alert alert-danger" role="alert" style={{ marginBottom: '1.25rem' }}>
                <p className="alert-heading">Error al guardar vehículo</p>
                <p className="alert-text">{serverError}</p>
              </div>
            )}

            <div className="form-grid">
              {/* Patente */}
              <div className="form-group">
                <label htmlFor="vehiculo-patente" className="form-label">
                  Patente <span aria-hidden="true">*</span>
                </label>
                <input
                  id="vehiculo-patente"
                  type="text"
                  className={`form-input cell-patente ${errors.patente ? 'input-error' : ''}`}
                  placeholder="Ej: AB123CD"
                  maxLength={10}
                  value={formData.patente}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, patente: e.target.value.toUpperCase() }))
                  }
                  aria-required="true"
                  aria-invalid={Boolean(errors.patente)}
                  aria-describedby={errors.patente ? 'patente-error' : undefined}
                  disabled={isSubmitting}
                />
                {errors.patente && (
                  <p id="patente-error" className="field-error" role="alert">
                    {errors.patente}
                  </p>
                )}
              </div>

              {/* Modelo */}
              <div className="form-group">
                <label htmlFor="vehiculo-modelo" className="form-label">
                  Modelo <span aria-hidden="true">*</span>
                </label>
                <input
                  id="vehiculo-modelo"
                  type="text"
                  className={`form-input ${errors.modelo ? 'input-error' : ''}`}
                  placeholder="Ej: Corolla XEI, Hilux 4x4..."
                  maxLength={100}
                  value={formData.modelo}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, modelo: e.target.value }))
                  }
                  aria-required="true"
                  aria-invalid={Boolean(errors.modelo)}
                  aria-describedby={errors.modelo ? 'modelo-error' : undefined}
                  disabled={isSubmitting}
                />
                {errors.modelo && (
                  <p id="modelo-error" className="field-error" role="alert">
                    {errors.modelo}
                  </p>
                )}
              </div>

              {/* Año */}
              <div className="form-group">
                <label htmlFor="vehiculo-anio" className="form-label">
                  Año de Fabricación <span aria-hidden="true">*</span>
                </label>
                <input
                  id="vehiculo-anio"
                  type="number"
                  min={1900}
                  max={CURRENT_YEAR + 1}
                  className={`form-input ${errors.anio ? 'input-error' : ''}`}
                  value={formData.anio || ''}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, anio: parseInt(e.target.value, 10) || 0 }))
                  }
                  aria-required="true"
                  aria-invalid={Boolean(errors.anio)}
                  aria-describedby={errors.anio ? 'anio-error' : undefined}
                  disabled={isSubmitting}
                />
                {errors.anio && (
                  <p id="anio-error" className="field-error" role="alert">
                    {errors.anio}
                  </p>
                )}
              </div>

              {/* Precio */}
              <div className="form-group">
                <label htmlFor="vehiculo-precio" className="form-label">
                  Precio (CLP) <span aria-hidden="true">*</span>
                </label>
                <input
                  id="vehiculo-precio"
                  type="number"
                  min={1}
                  step={1000}
                  className={`form-input ${errors.precio ? 'input-error' : ''}`}
                  placeholder="Ej: 14500000"
                  value={formData.precio || ''}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      precio: parseFloat(e.target.value) || 0,
                    }))
                  }
                  aria-required="true"
                  aria-invalid={Boolean(errors.precio)}
                  aria-describedby={errors.precio ? 'precio-error' : undefined}
                  disabled={isSubmitting}
                />
                {errors.precio && (
                  <p id="precio-error" className="field-error" role="alert">
                    {errors.precio}
                  </p>
                )}
              </div>

              {/* Estado */}
              <div className="form-group">
                <label htmlFor="vehiculo-estado" className="form-label">
                  Estado <span aria-hidden="true">*</span>
                </label>
                <select
                  id="vehiculo-estado"
                  className={`form-select ${errors.estado ? 'input-error' : ''}`}
                  value={formData.estado}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, estado: e.target.value }))
                  }
                  disabled={isSubmitting}
                >
                  <option value="Disponible">Disponible</option>
                  <option value="Vendido">Vendido</option>
                  <option value="Arrendado">Arrendado</option>
                  <option value="En Mantención">En Mantención</option>
                </select>
                {errors.estado && (
                  <p id="estado-error" className="field-error" role="alert">
                    {errors.estado}
                  </p>
                )}
              </div>

              {/* Marca */}
              <div className="form-group">
                <label htmlFor="vehiculo-marca" className="form-label">
                  Marca (Catálogo Real) <span aria-hidden="true">*</span>
                </label>
                <select
                  id="vehiculo-marca"
                  className={`form-select ${errors.idMarca ? 'input-error' : ''}`}
                  value={formData.idMarca}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      idMarca: parseInt(e.target.value, 10),
                    }))
                  }
                  disabled={isSubmitting}
                >
                  {marcas.length === 0 && <option value="1">Marca por defecto (ID 1)</option>}
                  {marcas.map((m) => (
                    <option key={m.idMarca} value={m.idMarca}>
                      {m.nombre}
                    </option>
                  ))}
                </select>
                {errors.idMarca && (
                  <p id="marca-error" className="field-error" role="alert">
                    {errors.idMarca}
                  </p>
                )}
              </div>

              {/* Tipo de Vehículo */}
              <div className="form-group">
                <label htmlFor="vehiculo-tipo" className="form-label">
                  Tipo de Vehículo (Catálogo Real) <span aria-hidden="true">*</span>
                </label>
                <select
                  id="vehiculo-tipo"
                  className={`form-select ${errors.idTipoVehiculo ? 'input-error' : ''}`}
                  value={formData.idTipoVehiculo}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      idTipoVehiculo: parseInt(e.target.value, 10),
                    }))
                  }
                  disabled={isSubmitting}
                >
                  {tiposVehiculo.length === 0 && <option value="1">Tipo por defecto (ID 1)</option>}
                  {tiposVehiculo.map((tv) => (
                    <option key={tv.idTipoVehiculo} value={tv.idTipoVehiculo}>
                      {tv.nombre}
                    </option>
                  ))}
                </select>
                {errors.idTipoVehiculo && (
                  <p id="tipo-error" className="field-error" role="alert">
                    {errors.idTipoVehiculo}
                  </p>
                )}
              </div>

              {/* Tipo de Combustible */}
              <div className="form-group">
                <label htmlFor="vehiculo-combustible" className="form-label">
                  Tipo de Combustible (Catálogo Real) <span aria-hidden="true">*</span>
                </label>
                <select
                  id="vehiculo-combustible"
                  className={`form-select ${errors.idTipoCombustible ? 'input-error' : ''}`}
                  value={formData.idTipoCombustible}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      idTipoCombustible: parseInt(e.target.value, 10),
                    }))
                  }
                  disabled={isSubmitting}
                >
                  {tiposCombustible.length === 0 && (
                    <option value="1">Combustible por defecto (ID 1)</option>
                  )}
                  {tiposCombustible.map((tc) => (
                    <option key={tc.idTipoCombustible} value={tc.idTipoCombustible}>
                      {tc.nombre}
                    </option>
                  ))}
                </select>
                {errors.idTipoCombustible && (
                  <p id="combustible-error" className="field-error" role="alert">
                    {errors.idTipoCombustible}
                  </p>
                )}
              </div>

              {/* Sucursal */}
              <div className="form-group" style={{ gridColumn: 'span 2' }}>
                <label htmlFor="vehiculo-sucursal" className="form-label">
                  Sucursal Asignada (Catálogo Real) <span aria-hidden="true">*</span>
                </label>
                <select
                  id="vehiculo-sucursal"
                  className={`form-select ${errors.idSucursal ? 'input-error' : ''}`}
                  value={formData.idSucursal}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      idSucursal: parseInt(e.target.value, 10),
                    }))
                  }
                  disabled={isSubmitting}
                >
                  {sucursales.length === 0 && (
                    <option value="1">Sucursal Principal (ID 1)</option>
                  )}
                  {sucursales.map((s) => (
                    <option key={s.idSucursal} value={s.idSucursal}>
                      {s.nombre} — {s.ciudad} ({s.direccion})
                    </option>
                  ))}
                </select>
                {errors.idSucursal && (
                  <p id="sucursal-error" className="field-error" role="alert">
                    {errors.idSucursal}
                  </p>
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
              aria-busy={isSubmitting}
            >
              {isSubmitting
                ? 'Guardando...'
                : isEditing
                  ? 'Guardar Cambios'
                  : 'Crear Vehículo'}
            </button>
          </footer>
        </form>
      </div>
    </div>
  )
}

export const VehiculoFormModal: React.FC<VehiculoFormModalProps> = (props) => {
  if (!props.isOpen) return null

  // Usar key para reinicializar el estado limpio al abrir o cambiar de vehículo sin efectos síncronos
  const modalKey = props.initialData ? `edit-${props.initialData.idVehiculo}` : 'create-new'

  return <VehiculoFormModalInner key={modalKey} {...props} />
}
