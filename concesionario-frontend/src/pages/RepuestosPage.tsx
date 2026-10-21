import React, { useEffect, useState, useMemo, useCallback } from 'react'
import {
  getRepuestos,
  createRepuesto,
  updateRepuesto,
  deleteRepuesto,
} from '../api/repuestosService'
import { getSucursales } from '../api/sucursalesService'
import { useAuth } from '../context/useAuth'
import {
  Plus,
  RefreshCw,
  X,
  Eye,
  Pencil,
  Trash2,
  Wrench,
  Search,
  Filter,
  Building2,
} from 'lucide-react'
import { RepuestoDetailModal } from '../components/RepuestoDetailModal'
import { RepuestoFormModal } from '../components/RepuestoFormModal'
import { RepuestoDeleteModal } from '../components/RepuestoDeleteModal'
import type { Repuesto, CreateRepuestoDto, Sucursal } from '../types'

export const RepuestosPage: React.FC = () => {
  const { isAdmin } = useAuth()

  // Datos principales
  const [repuestos, setRepuestos] = useState<Repuesto[]>([])
  const [sucursales, setSucursales] = useState<Sucursal[]>([])

  // Estados de carga y error principal
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState<string>('')
  const [stockFilter, setStockFilter] = useState<string>('todos')
  const [sucursalFilter, setSucursalFilter] = useState<string>('todos')

  // Feedback de operaciones CRUD
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(
    null,
  )

  // Modales
  const [detailRepuesto, setDetailRepuesto] = useState<Repuesto | null>(null)

  const [isFormModalOpen, setIsFormModalOpen] = useState(false)
  const [editingRepuesto, setEditingRepuesto] = useState<Repuesto | null>(null)
  const [formSubmitting, setFormSubmitting] = useState(false)
  const [formError, setFormError] = useState<string | null>(null)

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const [deletingRepuesto, setDeletingRepuesto] = useState<Repuesto | null>(null)
  const [deleteSubmitting, setDeleteSubmitting] = useState(false)
  const [deleteError, setDeleteError] = useState<string | null>(null)

  // Mapa de sucursales para nombres
  const sucursalesMap = useMemo(() => {
    const map: Record<number, string> = {}
    sucursales.forEach((s) => {
      map[s.idSucursal] = `${s.nombre} (${s.ciudad})`
    })
    return map
  }, [sucursales])

  // Cargar lista completa de repuestos y catálogo de sucursales
  const loadData = useCallback(async () => {
    try {
      const [repuestosRes, sucursalesRes] = await Promise.all([
        getRepuestos(),
        getSucursales().catch(() => [] as Sucursal[]),
      ])
      setRepuestos(repuestosRes)
      setSucursales(sucursalesRes)
    } catch (err) {
      const errorMsg =
        err && typeof err === 'object' && 'message' in err
          ? String(err.message)
          : 'Error al conectar con la API de repuestos.'
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
        const [repuestosRes, sucursalesRes] = await Promise.all([
          getRepuestos(),
          getSucursales().catch(() => [] as Sucursal[]),
        ])
        if (!isMounted) return
        setRepuestos(repuestosRes)
        setSucursales(sucursalesRes)
      } catch (err) {
        if (!isMounted) return
        const errorMsg =
          err && typeof err === 'object' && 'message' in err
            ? String(err.message)
            : 'Error al conectar con la API de repuestos.'
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
    setEditingRepuesto(null)
    setFormError(null)
    setIsFormModalOpen(true)
  }

  const handleOpenEdit = (repuesto: Repuesto) => {
    setEditingRepuesto(repuesto)
    setFormError(null)
    setIsFormModalOpen(true)
  }

  const handleOpenDelete = (repuesto: Repuesto) => {
    setDeletingRepuesto(repuesto)
    setDeleteError(null)
    setIsDeleteModalOpen(true)
  }

  // Operación Guardar (POST / PUT)
  const handleSaveRepuesto = async (dto: CreateRepuestoDto) => {
    setFormSubmitting(true)
    setFormError(null)

    try {
      if (editingRepuesto) {
        // PUT /api/repuestos/{id}
        const updated = await updateRepuesto(editingRepuesto.idRepuesto, dto)
        const updatedItem: Repuesto = updated && updated.idRepuesto
          ? updated
          : { ...dto, idRepuesto: editingRepuesto.idRepuesto }

        setRepuestos((prev) =>
          prev.map((r) => (r.idRepuesto === editingRepuesto.idRepuesto ? updatedItem : r)),
        )

        setFeedback({
          type: 'success',
          message: `Repuesto "${dto.nombre}" actualizado con éxito.`,
        })
      } else {
        // POST /api/repuestos
        const nuevoRepuesto = await createRepuesto(dto)
        setRepuestos((prev) => [nuevoRepuesto, ...prev])

        setFeedback({
          type: 'success',
          message: `Repuesto "${dto.nombre}" registrado con éxito en el catálogo.`,
        })
      }

      setIsFormModalOpen(false)
    } catch (err) {
      const errorMsg =
        err && typeof err === 'object' && 'message' in err
          ? String(err.message)
          : 'Ocurrió un error al procesar el repuesto en el servidor.'
      setFormError(errorMsg)
    } finally {
      setFormSubmitting(false)
    }
  }

  // Operación Eliminar (DELETE) con control de integridad referencial
  const handleConfirmDelete = async () => {
    if (!deletingRepuesto) return

    setDeleteSubmitting(true)
    setDeleteError(null)

    try {
      // DELETE /api/repuestos/{id}
      await deleteRepuesto(deletingRepuesto.idRepuesto)

      setRepuestos((prev) => prev.filter((r) => r.idRepuesto !== deletingRepuesto.idRepuesto))
      setFeedback({
        type: 'success',
        message: `Repuesto "${deletingRepuesto.nombre}" eliminado con éxito del inventario.`,
      })
      setIsDeleteModalOpen(false)
    } catch (err) {
      const rawMsg =
        err && typeof err === 'object' && 'message' in err ? String(err.message) : ''

      let friendlyMsg =
        'No se pudo eliminar el repuesto. Si ya ha sido utilizado en órdenes de mantenimiento (MantencionRepuesto), la base de datos SQL Server rechaza la operación para preservar el historial de taller.'

      if (rawMsg.includes('403')) {
        friendlyMsg = 'No posees permisos de Administrador para eliminar repuestos.'
      } else if (rawMsg.includes('404')) {
        friendlyMsg = 'El repuesto ya no existe en el catálogo.'
      }

      setDeleteError(friendlyMsg)
    } finally {
      setDeleteSubmitting(false)
    }
  }

  // Filtrado reactivo por texto, estado de stock y sucursal
  const repuestosFiltrados = useMemo(() => {
    return repuestos.filter((r) => {
      const term = searchTerm.toLowerCase()
      const matchSearch =
        !searchTerm.trim() ||
        r.nombre.toLowerCase().includes(term) ||
        (r.codigoReferencia ? r.codigoReferencia.toLowerCase().includes(term) : false)

      let matchStock = true
      if (stockFilter === 'en_stock') {
        matchStock = r.stock > 5
      } else if (stockFilter === 'bajo_stock') {
        matchStock = r.stock > 0 && r.stock <= 5
      } else if (stockFilter === 'agotado') {
        matchStock = r.stock === 0
      }

      const matchSucursal =
        sucursalFilter === 'todos' ||
        (sucursalFilter === 'sin_sucursal' ? !r.idSucursal : r.idSucursal === Number(sucursalFilter))

      return matchSearch && matchStock && matchSucursal
    })
  }, [repuestos, searchTerm, stockFilter, sucursalFilter])

  const formatPrecio = (precio: number) => {
    return new Intl.NumberFormat('es-CL', {
      style: 'currency',
      currency: 'CLP',
      maximumFractionDigits: 0,
    }).format(precio)
  }

  return (
    <div className="vehiculos-page" aria-busy={loading}>
      {/* Cabecera de la sección */}
      <header className="page-header">
        <div>
          <h1 className="page-title">Catálogo de Repuestos</h1>
          <p className="page-subtitle">
            Inventario general de partes, piezas y repuestos mecánicos disponibles para servicio y venta.
          </p>
        </div>

        <div className="header-actions">
          <button
            type="button"
            className="btn btn-secondary"
            onClick={handleRefresh}
            disabled={loading}
            aria-label="Recargar lista de repuestos"
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
              aria-label="Registrar nuevo repuesto"
            >
              <Plus size={16} aria-hidden="true" style={{ marginRight: '0.4rem' }} />
              <span>Nuevo Repuesto</span>
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
      <section className="filters-card" aria-label="Filtros del catálogo de repuestos">
        <div className="filter-group">
          <label htmlFor="search-repuestos" className="filter-label">
            <Search size={14} aria-hidden="true" style={{ display: 'inline', marginRight: '0.35rem', verticalAlign: 'middle' }} />
            Buscar por nombre o código:
          </label>
          <input
            id="search-repuestos"
            type="search"
            className="form-input"
            placeholder="Buscar por nombre o código..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            aria-label="Buscar repuestos"
          />
        </div>

        <div className="filter-group">
          <label htmlFor="filter-stock" className="filter-label">
            <Filter size={14} aria-hidden="true" style={{ display: 'inline', marginRight: '0.35rem', verticalAlign: 'middle' }} />
            Filtrar por nivel de stock:
          </label>
          <select
            id="filter-stock"
            className="form-select"
            value={stockFilter}
            onChange={(e) => setStockFilter(e.target.value)}
            aria-label="Filtrar por nivel de stock"
          >
            <option value="todos">Todos los niveles</option>
            <option value="en_stock">En Stock (&gt; 5)</option>
            <option value="bajo_stock">Stock Bajo (1 a 5)</option>
            <option value="agotado">Agotados (0)</option>
          </select>
        </div>

        {sucursales.length > 0 && (
          <div className="filter-group">
            <label htmlFor="filter-sucursal" className="filter-label">
              <Building2 size={14} aria-hidden="true" style={{ display: 'inline', marginRight: '0.35rem', verticalAlign: 'middle' }} />
              Filtrar por sucursal:
            </label>
            <select
              id="filter-sucursal"
              className="form-select"
              value={sucursalFilter}
              onChange={(e) => setSucursalFilter(e.target.value)}
              aria-label="Filtrar por sucursal"
            >
              <option value="todos">Todas las sucursales</option>
              <option value="sin_sucursal">Sin sucursal</option>
              {sucursales.map((s) => (
                <option key={s.idSucursal} value={s.idSucursal}>
                  {s.nombre}
                </option>
              ))}
            </select>
          </div>
        )}
      </section>

      {/* Resumen de resultados */}
      {!loading && !error && (
        <div className="results-summary" style={{ marginBottom: '1rem' }}>
          <p>
            Mostrando <strong>{repuestosFiltrados.length}</strong> de{' '}
            <strong>{repuestos.length}</strong> repuestos registrados.
          </p>
        </div>
      )}

      {/* Contenedor principal: Estado de carga o Tabla */}
      {loading ? (
        <div className="loading-card" role="status" aria-live="polite">
          <div className="spinner-border" aria-hidden="true"></div>
          <p className="loading-text">Cargando inventario de repuestos desde el servidor...</p>
        </div>
      ) : repuestosFiltrados.length === 0 ? (
        <div className="empty-state-card" role="region" aria-label="Sin resultados">
          <Wrench size={48} color="#64748b" aria-hidden="true" style={{ margin: '0 auto 1rem' }} />
          <h2 className="empty-title">No se encontraron repuestos</h2>
          <p className="empty-text">
            {searchTerm || stockFilter !== 'todos' || sucursalFilter !== 'todos'
              ? 'No hay registros que coincidan con los criterios de búsqueda o filtros seleccionados.'
              : 'Actualmente no hay repuestos registrados en el inventario.'}
          </p>
          {(searchTerm || stockFilter !== 'todos' || sucursalFilter !== 'todos') && (
            <button
              type="button"
              className="btn btn-secondary"
              onClick={() => {
                setSearchTerm('')
                setStockFilter('todos')
                setSucursalFilter('todos')
              }}
              style={{ marginTop: '1rem' }}
            >
              Restablecer filtros
            </button>
          )}
        </div>
      ) : (
        <div className="table-container" role="region" aria-label="Tabla de repuestos">
          <table className="data-table">
            <thead>
              <tr>
                <th scope="col">Repuesto</th>
                <th scope="col">Código / SKU</th>
                <th scope="col">Precio (CLP)</th>
                <th scope="col">Stock</th>
                <th scope="col">Sucursal</th>
                <th scope="col" style={{ textAlign: 'center', width: '150px' }}>
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody>
              {repuestosFiltrados.map((repuesto) => (
                <tr key={repuesto.idRepuesto} className="table-row">
                  <td className="cell-modelo">
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <Wrench size={16} color="#60a5fa" aria-hidden="true" />
                      <span>{repuesto.nombre}</span>
                    </div>
                  </td>
                  <td>
                    {repuesto.codigoReferencia ? (
                      <span className="cell-patente">{repuesto.codigoReferencia}</span>
                    ) : (
                      <span style={{ color: '#64748b' }}>—</span>
                    )}
                  </td>
                  <td className="cell-precio" style={{ color: '#6ee7b7' }}>
                    {formatPrecio(repuesto.precio)}
                  </td>
                  <td>
                    {repuesto.stock === 0 ? (
                      <span className="status-pill badge-vendido">Agotado (0)</span>
                    ) : repuesto.stock <= 5 ? (
                      <span className="status-pill badge-otro">Bajo ({repuesto.stock})</span>
                    ) : (
                      <span className="status-pill badge-disponible">{repuesto.stock} unid.</span>
                    )}
                  </td>
                  <td>
                    {repuesto.idSucursal && sucursalesMap[repuesto.idSucursal] ? (
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#cbd5e1' }}>
                        <Building2 size={14} color="#94a3b8" aria-hidden="true" />
                        <span>{sucursalesMap[repuesto.idSucursal]}</span>
                      </div>
                    ) : (
                      <span style={{ color: '#64748b' }}>Sin asignar</span>
                    )}
                  </td>
                  <td style={{ textAlign: 'center' }}>
                    <div className="table-actions">
                      <button
                        type="button"
                        className="btn btn-action btn-view"
                        onClick={() => setDetailRepuesto(repuesto)}
                        title={`Ver detalles de ${repuesto.nombre}`}
                        aria-label={`Ver detalles de ${repuesto.nombre}`}
                      >
                        <Eye size={15} aria-hidden="true" />
                        <span>Ver</span>
                      </button>

                      {isAdmin && (
                        <>
                          <button
                            type="button"
                            className="btn btn-action btn-edit"
                            onClick={() => handleOpenEdit(repuesto)}
                            title={`Editar ${repuesto.nombre}`}
                            aria-label={`Editar ${repuesto.nombre}`}
                          >
                            <Pencil size={15} aria-hidden="true" />
                            <span>Editar</span>
                          </button>
                          <button
                            type="button"
                            className="btn btn-action btn-delete"
                            onClick={() => handleOpenDelete(repuesto)}
                            title={`Eliminar ${repuesto.nombre}`}
                            aria-label={`Eliminar ${repuesto.nombre}`}
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
      <RepuestoDetailModal
        repuesto={detailRepuesto}
        sucursalesMap={sucursalesMap}
        onClose={() => setDetailRepuesto(null)}
      />

      <RepuestoFormModal
        isOpen={isFormModalOpen}
        initialData={editingRepuesto}
        sucursales={sucursales}
        onSubmit={handleSaveRepuesto}
        onClose={() => {
          setIsFormModalOpen(false)
          setEditingRepuesto(null)
          setFormError(null)
        }}
        isSubmitting={formSubmitting}
        serverError={formError}
      />

      <RepuestoDeleteModal
        isOpen={isDeleteModalOpen}
        repuesto={deletingRepuesto}
        onConfirm={handleConfirmDelete}
        onCancel={() => {
          setIsDeleteModalOpen(false)
          setDeletingRepuesto(null)
          setDeleteError(null)
        }}
        isDeleting={deleteSubmitting}
        error={deleteError}
      />
    </div>
  )
}
