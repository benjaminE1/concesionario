import React, { useEffect, useState, useMemo, useCallback } from 'react'
import {
  getSucursales,
  createSucursal,
  updateSucursal,
  deleteSucursal,
} from '../api/sucursalesService'
import { useAuth } from '../context/useAuth'
import {
  Plus,
  RefreshCw,
  X,
  Eye,
  Pencil,
  Trash2,
  Building2,
  Search,
  MapPin,
  Phone,
} from 'lucide-react'
import { SucursalDetailModal } from '../components/SucursalDetailModal'
import { SucursalFormModal } from '../components/SucursalFormModal'
import { SucursalDeleteModal } from '../components/SucursalDeleteModal'
import type { Sucursal, CreateSucursalDto } from '../types'

export const SucursalesPage: React.FC = () => {
  const { isAdmin } = useAuth()

  // Datos principales
  const [sucursales, setSucursales] = useState<Sucursal[]>([])

  // Estados de carga y error principal
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState<string>('')

  // Feedback de operaciones CRUD
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(
    null,
  )

  // Modales
  const [detailSucursal, setDetailSucursal] = useState<Sucursal | null>(null)

  const [isFormModalOpen, setIsFormModalOpen] = useState(false)
  const [editingSucursal, setEditingSucursal] = useState<Sucursal | null>(null)
  const [formSubmitting, setFormSubmitting] = useState(false)
  const [formError, setFormError] = useState<string | null>(null)

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const [deletingSucursal, setDeletingSucursal] = useState<Sucursal | null>(null)
  const [deleteSubmitting, setDeleteSubmitting] = useState(false)
  const [deleteError, setDeleteError] = useState<string | null>(null)

  // Cargar lista completa de sucursales desde la API
  const loadData = useCallback(async () => {
    try {
      const data = await getSucursales()
      setSucursales(data)
    } catch (err) {
      const errorMsg =
        err && typeof err === 'object' && 'message' in err
          ? String(err.message)
          : 'Error al conectar con la API de sucursales.'
      setError(errorMsg)
    } finally {
      setLoading(false)
    }
  }, [])

  const handleRefresh = async () => {
    setLoading(true)
    setError(null)
    setFeedback(null)
    await loadData()
  }

  useEffect(() => {
    let isMounted = true

    void (async () => {
      try {
        const data = await getSucursales()
        if (!isMounted) return
        setSucursales(data)
      } catch (err) {
        if (!isMounted) return
        const errorMsg =
          err && typeof err === 'object' && 'message' in err
            ? String(err.message)
            : 'Error al conectar con la API de sucursales.'
        setError(errorMsg)
      } finally {
        if (isMounted) setLoading(false)
      }
    })()

    return () => {
      isMounted = false
    }
  }, [])

  // Apertura de modales
  const handleOpenCreate = () => {
    setEditingSucursal(null)
    setFormError(null)
    setIsFormModalOpen(true)
  }

  const handleOpenEdit = (sucursal: Sucursal) => {
    setEditingSucursal(sucursal)
    setFormError(null)
    setIsFormModalOpen(true)
  }

  const handleOpenDelete = (sucursal: Sucursal) => {
    setDeletingSucursal(sucursal)
    setDeleteError(null)
    setIsDeleteModalOpen(true)
  }

  // Operación Guardar (POST / PUT)
  const handleSaveSucursal = async (dto: CreateSucursalDto) => {
    setFormSubmitting(true)
    setFormError(null)

    try {
      if (editingSucursal) {
        // PUT /api/sucursal/{id}
        const updated = await updateSucursal(editingSucursal.idSucursal, dto)
        const updatedItem: Sucursal = updated && updated.idSucursal
          ? updated
          : { ...dto, idSucursal: editingSucursal.idSucursal }

        setSucursales((prev) =>
          prev.map((s) => (s.idSucursal === editingSucursal.idSucursal ? updatedItem : s)),
        )

        setFeedback({
          type: 'success',
          message: `Sucursal "${dto.nombre}" actualizada con éxito.`,
        })
      } else {
        // POST /api/sucursal
        const nuevaSucursal = await createSucursal(dto)
        setSucursales((prev) => [nuevaSucursal, ...prev])

        setFeedback({
          type: 'success',
          message: `Sucursal "${dto.nombre}" creada con éxito en la base de datos.`,
        })
      }

      setIsFormModalOpen(false)
    } catch (err) {
      const errorMsg =
        err && typeof err === 'object' && 'message' in err
          ? String(err.message)
          : 'Ocurrió un error al procesar la sucursal en el servidor.'
      setFormError(errorMsg)
    } finally {
      setFormSubmitting(false)
    }
  }

  // Operación Eliminar (DELETE) con manejo de integridad referencial
  const handleConfirmDelete = async () => {
    if (!deletingSucursal) return

    setDeleteSubmitting(true)
    setDeleteError(null)

    try {
      // DELETE /api/sucursal/{id}
      await deleteSucursal(deletingSucursal.idSucursal)

      setSucursales((prev) => prev.filter((s) => s.idSucursal !== deletingSucursal.idSucursal))
      setFeedback({
        type: 'success',
        message: `Sucursal "${deletingSucursal.nombre}" eliminada con éxito.`,
      })
      setIsDeleteModalOpen(false)
    } catch (err) {
      const rawMsg =
        err && typeof err === 'object' && 'message' in err ? String(err.message) : ''

      let friendlyMsg =
        'No se pudo eliminar la sucursal. Si tiene vehículos, repuestos o arriendos asociados, la base de datos rechaza la operación para preservar la integridad referencial.'

      if (rawMsg.includes('403')) {
        friendlyMsg = 'No tienes permisos de Administrador para eliminar sucursales.'
      } else if (rawMsg.includes('404')) {
        friendlyMsg = 'La sucursal ya no existe en el servidor.'
      }

      setDeleteError(friendlyMsg)
    } finally {
      setDeleteSubmitting(false)
    }
  }

  // Filtrado reactivo por texto
  const sucursalesFiltradas = useMemo(() => {
    if (!searchTerm.trim()) return sucursales

    const term = searchTerm.toLowerCase()
    return sucursales.filter((s) => {
      const matchNombre = s.nombre.toLowerCase().includes(term)
      const matchCiudad = s.ciudad.toLowerCase().includes(term)
      const matchDireccion = s.direccion.toLowerCase().includes(term)
      const matchTelefono = s.telefono ? s.telefono.toLowerCase().includes(term) : false

      return matchNombre || matchCiudad || matchDireccion || matchTelefono
    })
  }, [sucursales, searchTerm])

  return (
    <div className="vehiculos-page" aria-busy={loading}>
      {/* Cabecera de la sección */}
      <header className="page-header">
        <div>
          <h1 className="page-title">Gestión de Sucursales</h1>
          <p className="page-subtitle">
            Administración completa de sedes, concesionarios y puntos de atención en el país.
          </p>
        </div>

        <div className="header-actions">
          <button
            type="button"
            className="btn btn-secondary"
            onClick={handleRefresh}
            disabled={loading}
            aria-label="Recargar lista de sucursales"
          >
            <RefreshCw
              size={16}
              className={loading ? 'animate-spin' : ''}
              aria-hidden="true"
              style={{ marginRight: '0.4rem' }}
            />
            <span>Actualizar</span>
          </button>

          {isAdmin && (
            <button
              type="button"
              className="btn btn-primary"
              onClick={handleOpenCreate}
              aria-label="Registrar nueva sucursal"
            >
              <Plus size={16} aria-hidden="true" style={{ marginRight: '0.4rem' }} />
              <span>Nueva Sucursal</span>
            </button>
          )}
        </div>
      </header>

      {/* Alerta de notificación / feedback */}
      {feedback && (
        <div
          className={`alert ${feedback.type === 'success' ? 'alert-success' : 'alert-danger'}`}
          role="status"
          aria-live="polite"
          style={{ marginBottom: '1.5rem', display: 'flex', justifyContent: 'space-between' }}
        >
          <p className="alert-text">{feedback.message}</p>
          <button
            type="button"
            onClick={() => setFeedback(null)}
            className="btn-icon"
            style={{ color: 'inherit', padding: '0 0.25rem' }}
            aria-label="Cerrar notificación"
          >
            <X size={16} aria-hidden="true" />
          </button>
        </div>
      )}

      {/* Alerta de error principal */}
      {error && (
        <div className="alert alert-danger" role="alert" style={{ marginBottom: '1.5rem' }}>
          <p className="alert-text">
            <strong>Error:</strong> {error}
          </p>
          <button
            type="button"
            className="btn btn-secondary btn-sm"
            onClick={handleRefresh}
            style={{ marginTop: '0.75rem' }}
          >
            Reintentar
          </button>
        </div>
      )}

      {/* Barra de Filtros y Búsqueda */}
      <section className="filters-card" aria-label="Filtros de sucursales">
        <div className="filter-group">
          <label htmlFor="search-sucursales" className="filter-label">
            <Search size={14} aria-hidden="true" style={{ display: 'inline', marginRight: '0.35rem', verticalAlign: 'middle' }} />
            Buscar por nombre, ciudad, dirección o teléfono:
          </label>
          <input
            id="search-sucursales"
            type="search"
            className="form-input"
            placeholder="Ej: Central, Santiago, Alameda, +56 2..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            aria-label="Buscar sucursales"
          />
        </div>
      </section>

      {/* Resumen de resultados */}
      {!loading && !error && (
        <div className="results-summary" style={{ marginBottom: '1rem' }}>
          <p>
            Mostrando <strong>{sucursalesFiltradas.length}</strong> de{' '}
            <strong>{sucursales.length}</strong> sucursales registradas.
          </p>
        </div>
      )}

      {/* Contenedor principal: Estado de carga o Tabla */}
      {loading ? (
        <div className="loading-card" role="status" aria-live="polite">
          <div className="spinner-border" aria-hidden="true"></div>
          <p className="loading-text">Cargando catálogo de sucursales desde el servidor...</p>
        </div>
      ) : sucursalesFiltradas.length === 0 ? (
        <div className="empty-state-card" role="region" aria-label="Sin resultados">
          <Building2 size={48} color="#64748b" aria-hidden="true" style={{ margin: '0 auto 1rem' }} />
          <h2 className="empty-title">No se encontraron sucursales</h2>
          <p className="empty-text">
            {searchTerm
              ? 'No hay registros que coincidan con el término de búsqueda ingresado.'
              : 'Actualmente no hay sucursales registradas en el sistema.'}
          </p>
          {searchTerm && (
            <button
              type="button"
              className="btn btn-secondary"
              onClick={() => setSearchTerm('')}
              style={{ marginTop: '1rem' }}
            >
              Limpiar búsqueda
            </button>
          )}
        </div>
      ) : (
        <div className="table-container" role="region" aria-label="Tabla de sucursales">
          <table className="data-table">
            <thead>
              <tr>
                <th scope="col">Nombre de Sucursal</th>
                <th scope="col">Ciudad</th>
                <th scope="col">Dirección</th>
                <th scope="col">Teléfono</th>
                <th scope="col" style={{ textAlign: 'center', width: '150px' }}>
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody>
              {sucursalesFiltradas.map((sucursal) => (
                <tr key={sucursal.idSucursal} className="table-row">
                  <td className="cell-modelo">
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <Building2 size={16} color="#60a5fa" aria-hidden="true" />
                      <span>{sucursal.nombre}</span>
                    </div>
                  </td>
                  <td>
                    <span className="status-pill badge-disponible">{sucursal.ciudad}</span>
                  </td>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#cbd5e1' }}>
                      <MapPin size={14} color="#94a3b8" aria-hidden="true" />
                      <span>{sucursal.direccion}</span>
                    </div>
                  </td>
                  <td>
                    {sucursal.telefono ? (
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#94a3b8' }}>
                        <Phone size={14} aria-hidden="true" />
                        <span>{sucursal.telefono}</span>
                      </div>
                    ) : (
                      <span style={{ color: '#64748b' }}>—</span>
                    )}
                  </td>
                  <td style={{ textAlign: 'center' }}>
                    <div className="table-actions">
                      <button
                        type="button"
                        className="btn btn-action btn-view"
                        onClick={() => setDetailSucursal(sucursal)}
                        title={`Ver detalles de ${sucursal.nombre}`}
                        aria-label={`Ver detalles de ${sucursal.nombre}`}
                      >
                        <Eye size={15} aria-hidden="true" />
                        <span>Ver</span>
                      </button>

                      {isAdmin && (
                        <>
                          <button
                            type="button"
                            className="btn btn-action btn-edit"
                            onClick={() => handleOpenEdit(sucursal)}
                            title={`Editar ${sucursal.nombre}`}
                            aria-label={`Editar ${sucursal.nombre}`}
                          >
                            <Pencil size={15} aria-hidden="true" />
                            <span>Editar</span>
                          </button>
                          <button
                            type="button"
                            className="btn btn-action btn-delete"
                            onClick={() => handleOpenDelete(sucursal)}
                            title={`Eliminar ${sucursal.nombre}`}
                            aria-label={`Eliminar ${sucursal.nombre}`}
                          >
                            <Trash2 size={15} aria-hidden="true" />
                            <span>Eliminar</span>
                          </button>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Modales */}
      <SucursalDetailModal
        sucursal={detailSucursal}
        onClose={() => setDetailSucursal(null)}
      />

      <SucursalFormModal
        isOpen={isFormModalOpen}
        initialData={editingSucursal}
        onSubmit={handleSaveSucursal}
        onClose={() => {
          setIsFormModalOpen(false)
          setEditingSucursal(null)
          setFormError(null)
        }}
        isSubmitting={formSubmitting}
        serverError={formError}
      />

      <SucursalDeleteModal
        isOpen={isDeleteModalOpen}
        sucursal={deletingSucursal}
        onConfirm={handleConfirmDelete}
        onCancel={() => {
          setIsDeleteModalOpen(false)
          setDeletingSucursal(null)
          setDeleteError(null)
        }}
        isDeleting={deleteSubmitting}
        error={deleteError}
      />
    </div>
  )
}
