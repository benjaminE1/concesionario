import React, { useEffect, useState, useMemo, useCallback } from 'react'
import {
  getVehiculos,
  createVehiculo,
  updateVehiculo,
  deleteVehiculo,
  getMarcas,
  getTiposVehiculo,
  getTiposCombustible,
  getSucursales,
} from '../api/vehiculosService'
import { useAuth } from '../context/useAuth'
import { VehiculoDetailModal } from '../components/VehiculoDetailModal'
import { VehiculoFormModal } from '../components/VehiculoFormModal'
import { ConfirmDeleteModal } from '../components/ConfirmDeleteModal'
import type {
  VehiculoResponseDto,
  CreateVehiculoDto,
  Marca,
  TipoVehiculo,
  TipoCombustible,
  Sucursal,
} from '../types'

export const VehiculosPage: React.FC = () => {
  const { isAdmin } = useAuth()

  // Datos principales
  const [vehiculos, setVehiculos] = useState<VehiculoResponseDto[]>([])
  const [marcas, setMarcas] = useState<Marca[]>([])
  const [tiposVehiculo, setTiposVehiculo] = useState<TipoVehiculo[]>([])
  const [tiposCombustible, setTiposCombustible] = useState<TipoCombustible[]>([])
  const [sucursales, setSucursales] = useState<Sucursal[]>([])

  // Estados de carga y error principal
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState<string>('')
  const [estadoFilter, setEstadoFilter] = useState<string>('todos')

  // Feedback de operaciones CRUD
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(
    null,
  )

  // Modales
  const [detailVehiculo, setDetailVehiculo] = useState<VehiculoResponseDto | null>(null)

  const [isFormModalOpen, setIsFormModalOpen] = useState(false)
  const [editingVehiculo, setEditingVehiculo] = useState<VehiculoResponseDto | null>(null)
  const [formSubmitting, setFormSubmitting] = useState(false)
  const [formError, setFormError] = useState<string | null>(null)

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const [deletingVehiculo, setDeletingVehiculo] = useState<VehiculoResponseDto | null>(null)
  const [deleteSubmitting, setDeleteSubmitting] = useState(false)
  const [deleteError, setDeleteError] = useState<string | null>(null)

  // Mapas de claves foráneas para renderizado rápido
  const marcasMap = useMemo(() => {
    const map: Record<number, string> = {}
    marcas.forEach((m) => {
      map[m.idMarca] = m.nombre
    })
    return map
  }, [marcas])

  const tiposVehiculoMap = useMemo(() => {
    const map: Record<number, string> = {}
    tiposVehiculo.forEach((t) => {
      map[t.idTipoVehiculo] = t.nombre
    })
    return map
  }, [tiposVehiculo])

  const tiposCombustibleMap = useMemo(() => {
    const map: Record<number, string> = {}
    tiposCombustible.forEach((c) => {
      map[c.idTipoCombustible] = c.nombre
    })
    return map
  }, [tiposCombustible])

  const sucursalesMap = useMemo(() => {
    const map: Record<number, string> = {}
    sucursales.forEach((s) => {
      map[s.idSucursal] = `${s.nombre} (${s.ciudad})`
    })
    return map
  }, [sucursales])

  // Cargar lista completa de vehículos y catálogos auxiliares
  const loadData = useCallback(async () => {
    try {
      const [vehiculosRes, marcasRes, tiposVehiculoRes, tiposCombustibleRes, sucursalesRes] =
        await Promise.all([
          getVehiculos(),
          getMarcas(),
          getTiposVehiculo(),
          getTiposCombustible(),
          getSucursales(),
        ])

      setVehiculos(vehiculosRes)
      setMarcas(marcasRes)
      setTiposVehiculo(tiposVehiculoRes)
      setTiposCombustible(tiposCombustibleRes)
      setSucursales(sucursalesRes)
    } catch (err) {
      const errorMsg =
        err && typeof err === 'object' && 'message' in err
          ? String(err.message)
          : 'Error al conectar con la API de vehículos.'
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
        const [vehiculosRes, marcasRes, tiposVehiculoRes, tiposCombustibleRes, sucursalesRes] =
          await Promise.all([
            getVehiculos(),
            getMarcas(),
            getTiposVehiculo(),
            getTiposCombustible(),
            getSucursales(),
          ])

        if (!isMounted) return
        setVehiculos(vehiculosRes)
        setMarcas(marcasRes)
        setTiposVehiculo(tiposVehiculoRes)
        setTiposCombustible(tiposCombustibleRes)
        setSucursales(sucursalesRes)
      } catch (err) {
        if (!isMounted) return
        const errorMsg =
          err && typeof err === 'object' && 'message' in err
            ? String(err.message)
            : 'Error al conectar con la API de vehículos.'
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
    setEditingVehiculo(null)
    setFormError(null)
    setIsFormModalOpen(true)
  }

  const handleOpenEdit = (vehiculo: VehiculoResponseDto) => {
    setEditingVehiculo(vehiculo)
    setFormError(null)
    setIsFormModalOpen(true)
  }

  const handleOpenDelete = (vehiculo: VehiculoResponseDto) => {
    setDeletingVehiculo(vehiculo)
    setDeleteError(null)
    setIsDeleteModalOpen(true)
  }

  // Operación Guardar (POST / PUT)
  const handleSaveVehiculo = async (dto: CreateVehiculoDto) => {
    setFormSubmitting(true)
    setFormError(null)

    try {
      if (editingVehiculo) {
        // PUT /api/vehiculos/{id}
        await updateVehiculo(editingVehiculo.idVehiculo, dto)

        setVehiculos((prev) =>
          prev.map((v) =>
            v.idVehiculo === editingVehiculo.idVehiculo
              ? { ...dto, idVehiculo: editingVehiculo.idVehiculo }
              : v,
          ),
        )

        setFeedback({
          type: 'success',
          message: `Vehículo ${dto.patente} (${dto.modelo}) actualizado con éxito.`,
        })
      } else {
        // POST /api/vehiculos
        const nuevoVehiculo = await createVehiculo(dto)
        setVehiculos((prev) => [nuevoVehiculo, ...prev])

        setFeedback({
          type: 'success',
          message: `Vehículo ${dto.patente} (${dto.modelo}) creado con éxito en la base de datos.`,
        })
      }

      setIsFormModalOpen(false)
    } catch (err) {
      const errorMsg =
        err && typeof err === 'object' && 'message' in err
          ? String(err.message)
          : 'Ocurrió un error al procesar el vehículo en el servidor.'
      setFormError(errorMsg)
    } finally {
      setFormSubmitting(false)
    }
  }

  // Operación Eliminar (DELETE)
  const handleConfirmDelete = async () => {
    if (!deletingVehiculo) return

    setDeleteSubmitting(true)
    setDeleteError(null)

    try {
      // DELETE /api/vehiculos/{id}
      await deleteVehiculo(deletingVehiculo.idVehiculo)

      setVehiculos((prev) => prev.filter((v) => v.idVehiculo !== deletingVehiculo.idVehiculo))
      setFeedback({
        type: 'success',
        message: `Vehículo con patente ${deletingVehiculo.patente} eliminado con éxito.`,
      })
      setIsDeleteModalOpen(false)
    } catch (err) {
      const errorMsg =
        err && typeof err === 'object' && 'message' in err
          ? String(err.message)
          : 'No se pudo eliminar el vehículo. Verifica que no tenga registros dependientes.'
      setDeleteError(errorMsg)
    } finally {
      setDeleteSubmitting(false)
    }
  }

  // Filtrado reactivo por texto y estado
  const vehiculosFiltrados = useMemo(() => {
    return vehiculos.filter((v) => {
      const matchSearch =
        v.modelo.toLowerCase().includes(searchTerm.toLowerCase()) ||
        v.patente.toLowerCase().includes(searchTerm.toLowerCase())

      const matchEstado =
        estadoFilter === 'todos' || v.estado.toLowerCase() === estadoFilter.toLowerCase()

      return matchSearch && matchEstado
    })
  }, [vehiculos, searchTerm, estadoFilter])

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
          <h1 className="page-title">Gestión de Vehículos</h1>
          <p className="page-subtitle">
            Inventario general disponible para consulta y operaciones del concesionario.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center', flexWrap: 'wrap' }}>
          {isAdmin && (
            <button
              type="button"
              className="btn btn-primary"
              style={{ backgroundColor: '#15803d' }}
              onClick={handleOpenCreate}
              aria-label="Registrar un nuevo vehículo"
            >
              ➕ Nuevo Vehículo
            </button>
          )}

          <button
            type="button"
            className="btn btn-secondary"
            onClick={() => void handleRefresh()}
            disabled={loading}
            aria-label="Recargar lista de vehículos"
          >
            {loading ? 'Cargando...' : '🔄 Actualizar'}
          </button>
        </div>
      </header>

      {/* Aviso informativo de permisos si el usuario no es Admin */}
      {!isAdmin && (
        <aside className="role-notice-banner" role="status">
          <span aria-hidden="true">ℹ️</span>
          <span>
            Estás visualizando el catálogo en modo de solo lectura. Para crear, editar o eliminar vehículos, debes iniciar sesión con una cuenta de <strong>Administrador</strong>.
          </span>
        </aside>
      )}

      {/* Notificación de feedback temporal */}
      {feedback && (
        <div
          className={`alert ${feedback.type === 'success' ? 'alert-success' : 'alert-danger'}`}
          role="status"
          aria-live="polite"
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <p className="alert-text">{feedback.message}</p>
            <button
              type="button"
              className="alert-dismiss-btn"
              onClick={() => setFeedback(null)}
              aria-label="Cerrar notificación"
            >
              ✕
            </button>
          </div>
        </div>
      )}

      {/* Barra de Filtros y Búsqueda */}
      <section className="filters-card" aria-label="Filtros de vehículos">
        <div className="filter-group">
          <label htmlFor="search-input" className="filter-label">
            Buscar por modelo o patente:
          </label>
          <input
            id="search-input"
            type="search"
            className="form-input"
            placeholder="Ej: Corolla, Hilux, AB123CD..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="filter-group">
          <label htmlFor="estado-select" className="filter-label">
            Filtrar por estado:
          </label>
          <select
            id="estado-select"
            className="form-select"
            value={estadoFilter}
            onChange={(e) => setEstadoFilter(e.target.value)}
          >
            <option value="todos">Todos los estados</option>
            <option value="Disponible">Disponible</option>
            <option value="Vendido">Vendido</option>
            <option value="Arrendado">Arrendado</option>
            <option value="En Mantención">En Mantención</option>
          </select>
        </div>
      </section>

      {/* Región de Estado (Carga / Error) */}
      <div aria-live="polite" className="status-announcer">
        {loading && (
          <div className="loading-state">
            <div className="spinner" aria-hidden="true" />
            <p>Cargando catálogo de vehículos desde la API...</p>
          </div>
        )}

        {error && !loading && (
          <div className="alert alert-danger" role="alert">
            <h2 className="alert-heading">No fue posible cargar los vehículos</h2>
            <p className="alert-text">{error}</p>
            <button
              type="button"
              className="btn btn-primary alert-action"
              onClick={() => void handleRefresh()}
            >
              Reintentar
            </button>
          </div>
        )}
      </div>

      {/* Listado y Tabla de Vehículos */}
      {!loading && !error && (
        <>
          <div className="results-summary">
            <p>
              Mostrando <strong>{vehiculosFiltrados.length}</strong> de{' '}
              <strong>{vehiculos.length}</strong> vehículos registrados.
            </p>
          </div>

          {vehiculosFiltrados.length === 0 ? (
            <div className="empty-state">
              <span className="empty-icon" aria-hidden="true">
                🚙
              </span>
              <h2 className="empty-title">No se encontraron vehículos</h2>
              <p className="empty-text">
                {vehiculos.length === 0
                  ? 'Aún no hay vehículos registrados en la base de datos.'
                  : 'Ningún vehículo coincide con el criterio de búsqueda seleccionado.'}
              </p>
            </div>
          ) : (
            <div className="table-responsive">
              <table className="data-table" aria-label="Tabla de gestión de vehículos">
                <thead>
                  <tr>
                    <th scope="col">ID</th>
                    <th scope="col">Patente</th>
                    <th scope="col">Marca</th>
                    <th scope="col">Modelo</th>
                    <th scope="col">Año</th>
                    <th scope="col">Precio</th>
                    <th scope="col">Estado</th>
                    <th scope="col" style={{ textAlign: 'center' }}>
                      Acciones
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {vehiculosFiltrados.map((v) => {
                    const nombreMarca = marcasMap[v.idMarca] || `Marca #${v.idMarca}`
                    const estadoLower = v.estado.toLowerCase()
                    const badgeClass =
                      estadoLower === 'disponible'
                        ? 'badge-disponible'
                        : estadoLower === 'vendido'
                          ? 'badge-vendido'
                          : 'badge-otro'

                    return (
                      <tr key={v.idVehiculo}>
                        <td className="cell-id">#{v.idVehiculo}</td>
                        <td className="cell-patente">
                          <strong>{v.patente}</strong>
                        </td>
                        <td>{nombreMarca}</td>
                        <td>{v.modelo}</td>
                        <td>{v.anio}</td>
                        <td className="cell-precio">{formatPrecio(v.precio)}</td>
                        <td>
                          <span className={`status-pill ${badgeClass}`}>{v.estado}</span>
                        </td>
                        <td style={{ textAlign: 'center' }}>
                          <div className="table-actions">
                            <button
                              type="button"
                              className="btn btn-action btn-view"
                              onClick={() => setDetailVehiculo(v)}
                              title="Consultar detalles"
                              aria-label={`Ver detalles de ${v.modelo} patente ${v.patente}`}
                            >
                              👁️ Ver
                            </button>

                            {isAdmin && (
                              <>
                                <button
                                  type="button"
                                  className="btn btn-action btn-edit"
                                  onClick={() => handleOpenEdit(v)}
                                  title="Editar vehículo"
                                  aria-label={`Editar ${v.modelo} patente ${v.patente}`}
                                >
                                  ✏️ Editar
                                </button>
                                <button
                                  type="button"
                                  className="btn btn-action btn-delete"
                                  onClick={() => handleOpenDelete(v)}
                                  title="Eliminar vehículo"
                                  aria-label={`Eliminar ${v.modelo} patente ${v.patente}`}
                                >
                                  🗑️ Eliminar
                                </button>
                              </>
                            )}
                          </div>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          )}
        </>
      )}

      {/* Modales de Operación */}
      <VehiculoDetailModal
        vehiculo={detailVehiculo}
        onClose={() => setDetailVehiculo(null)}
        marcasMap={marcasMap}
        tiposVehiculoMap={tiposVehiculoMap}
        tiposCombustibleMap={tiposCombustibleMap}
        sucursalesMap={sucursalesMap}
      />

      <VehiculoFormModal
        isOpen={isFormModalOpen}
        initialData={editingVehiculo}
        marcas={marcas}
        tiposVehiculo={tiposVehiculo}
        tiposCombustible={tiposCombustible}
        sucursales={sucursales}
        onSubmit={handleSaveVehiculo}
        onClose={() => setIsFormModalOpen(false)}
        isSubmitting={formSubmitting}
        serverError={formError}
      />

      <ConfirmDeleteModal
        isOpen={isDeleteModalOpen}
        vehiculo={deletingVehiculo}
        onConfirm={handleConfirmDelete}
        onCancel={() => setIsDeleteModalOpen(false)}
        isDeleting={deleteSubmitting}
        error={deleteError}
      />
    </div>
  )
}
