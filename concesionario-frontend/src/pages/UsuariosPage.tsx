import React, { useEffect, useState, useMemo, useCallback } from 'react'
import {
  getUsuarios,
  createUsuario,
  updateUsuario,
  deleteUsuario,
  getRoles,
} from '../api/usuariosService'
import { useAuth } from '../context/useAuth'
import {
  Plus,
  RefreshCw,
  X,
  Eye,
  Pencil,
  Trash2,
  Users,
  Search,
  Filter,
  UserCheck,
  Mail,
  Phone,
} from 'lucide-react'
import { UsuarioDetailModal } from '../components/UsuarioDetailModal'
import { UsuarioFormModal } from '../components/UsuarioFormModal'
import { UsuarioDeleteModal } from '../components/UsuarioDeleteModal'
import { Pagination } from '../components/Pagination'
import type {
  UsuarioResponseDto,
  CrearUsuarioDto,
  ActualizarUsuarioDto,
  Rol,
} from '../types'

export const UsuariosPage: React.FC = () => {
  const { user, isAdmin } = useAuth()

  // Datos principales
  const [usuarios, setUsuarios] = useState<UsuarioResponseDto[]>([])
  const [roles, setRoles] = useState<Rol[]>([])

  // Estados de carga y error principal
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState<string>('')
  const [roleFilter, setRoleFilter] = useState<string>('todos')
  const [currentPage, setCurrentPage] = useState<number>(1)
  const PAGE_SIZE = 10

  // Feedback de operaciones CRUD
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(
    null,
  )

  // Modales
  const [detailUsuario, setDetailUsuario] = useState<UsuarioResponseDto | null>(null)

  const [isFormModalOpen, setIsFormModalOpen] = useState(false)
  const [editingUsuario, setEditingUsuario] = useState<UsuarioResponseDto | null>(null)
  const [formSubmitting, setFormSubmitting] = useState(false)
  const [formError, setFormError] = useState<string | null>(null)

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const [deletingUsuario, setDeletingUsuario] = useState<UsuarioResponseDto | null>(null)
  const [deleteSubmitting, setDeleteSubmitting] = useState(false)
  const [deleteError, setDeleteError] = useState<string | null>(null)

  // Mapa de roles para resolución de nombres
  const rolesMap = useMemo(() => {
    const map: Record<number, string> = {}
    roles.forEach((r) => {
      map[r.idRol] = r.nombre
    })
    return map
  }, [roles])

  // Cargar lista completa de usuarios y catálogo de roles
  const loadData = useCallback(async () => {
    try {
      const [usuariosRes, rolesRes] = await Promise.all([
        getUsuarios(),
        getRoles(),
      ])
      setUsuarios(usuariosRes)
      setRoles(rolesRes)
    } catch (err) {
      const errorMsg =
        err && typeof err === 'object' && 'message' in err
          ? String(err.message)
          : 'Error al conectar con la API de usuarios.'
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
        const [usuariosRes, rolesRes] = await Promise.all([
          getUsuarios(),
          getRoles(),
        ])
        if (!isMounted) return
        setUsuarios(usuariosRes)
        setRoles(rolesRes)
      } catch (err) {
        if (!isMounted) return
        const errorMsg =
          err && typeof err === 'object' && 'message' in err
            ? String(err.message)
            : 'Error al conectar con la API de usuarios.'
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
    setEditingUsuario(null)
    setFormError(null)
    setIsFormModalOpen(true)
  }

  const handleOpenEdit = (usuarioItem: UsuarioResponseDto) => {
    setEditingUsuario(usuarioItem)
    setFormError(null)
    setIsFormModalOpen(true)
  }

  const handleOpenDelete = (usuarioItem: UsuarioResponseDto) => {
    setDeletingUsuario(usuarioItem)
    setDeleteError(null)
    setIsDeleteModalOpen(true)
  }

  // Operación Crear (POST /api/Usuario)
  const handleSaveCreate = async (dto: CrearUsuarioDto) => {
    setFormSubmitting(true)
    setFormError(null)

    try {
      const nuevoUsuario = await createUsuario(dto)
      const enrichedUser: UsuarioResponseDto = {
        ...nuevoUsuario,
        nombreRol: rolesMap[dto.idRol] || 'Usuario',
      }

      setUsuarios((prev) => [enrichedUser, ...prev])
      setCurrentPage(1)
      setFeedback({
        type: 'success',
        message: `Usuario "${dto.nombre}" (${dto.email}) registrado con éxito en el sistema.`,
      })
      setIsFormModalOpen(false)
    } catch (err) {
      const errorMsg =
        err && typeof err === 'object' && 'message' in err
          ? String(err.message)
          : 'Ocurrió un error al registrar el usuario en el servidor.'
      setFormError(errorMsg)
    } finally {
      setFormSubmitting(false)
    }
  }

  // Operación Editar (PUT /api/Usuario/{id})
  const handleSaveUpdate = async (id: number, dto: ActualizarUsuarioDto) => {
    setFormSubmitting(true)
    setFormError(null)

    try {
      await updateUsuario(id, dto)

      setUsuarios((prev) =>
        prev.map((u) =>
          u.idUsuario === id
            ? {
                ...u,
                nombre: dto.nombre,
                email: dto.email,
                telefono: dto.telefono,
                idRol: dto.idRol,
                nombreRol: rolesMap[dto.idRol] || u.nombreRol,
              }
            : u,
        ),
      )

      setFeedback({
        type: 'success',
        message: `Usuario "${dto.nombre}" actualizado con éxito.`,
      })
      setIsFormModalOpen(false)
    } catch (err) {
      const errorMsg =
        err && typeof err === 'object' && 'message' in err
          ? String(err.message)
          : 'Ocurrió un error al actualizar el usuario en el servidor.'
      setFormError(errorMsg)
    } finally {
      setFormSubmitting(false)
    }
  }

  // Operación Eliminar (DELETE /api/Usuario/{id}) con integridad referencial
  const handleConfirmDelete = async () => {
    if (!deletingUsuario) return

    setDeleteSubmitting(true)
    setDeleteError(null)

    try {
      await deleteUsuario(deletingUsuario.idUsuario)

      setUsuarios((prev) => prev.filter((u) => u.idUsuario !== deletingUsuario.idUsuario))
      setFeedback({
        type: 'success',
        message: `Usuario "${deletingUsuario.nombre}" eliminado con éxito.`,
      })
      setIsDeleteModalOpen(false)
    } catch (err) {
      const rawMsg =
        err && typeof err === 'object' && 'message' in err ? String(err.message) : ''

      let friendlyMsg =
        'No se pudo eliminar el usuario. Si posee registros de ventas o arriendos asociados en la base de datos, SQL Server rechaza la operación para preservar la integridad referencial.'

      if (rawMsg.includes('403')) {
        friendlyMsg = 'No tienes permisos de Administrador para eliminar usuarios.'
      } else if (rawMsg.includes('404')) {
        friendlyMsg = 'El usuario ya no existe en la base de datos.'
      }

      setDeleteError(friendlyMsg)
    } finally {
      setDeleteSubmitting(false)
    }
  }

  // Filtrado reactivo por texto y rol
  const usuariosFiltrados = useMemo(() => {
    return usuarios.filter((u) => {
      const term = searchTerm.toLowerCase()
      const roleName = (u.nombreRol || rolesMap[u.idRol] || '').toLowerCase()

      const matchSearch =
        !searchTerm.trim() ||
        u.nombre.toLowerCase().includes(term) ||
        u.email.toLowerCase().includes(term) ||
        roleName.includes(term)

      const matchRole =
        roleFilter === 'todos' || u.idRol === Number(roleFilter)

      return matchSearch && matchRole
    })
  }, [usuarios, searchTerm, roleFilter, rolesMap])

  const totalPages = Math.max(1, Math.ceil(usuariosFiltrados.length / PAGE_SIZE))
  const safeCurrentPage = Math.min(Math.max(1, currentPage), totalPages)

  const usuariosPaginados = useMemo(() => {
    const startIndex = (safeCurrentPage - 1) * PAGE_SIZE
    return usuariosFiltrados.slice(startIndex, startIndex + PAGE_SIZE)
  }, [usuariosFiltrados, safeCurrentPage])

  const getRoleBadgeClass = (roleName: string) => {
    const lower = roleName.toLowerCase()
    if (lower === 'admin') return 'badge-mantenimiento'
    if (lower === 'vendedor') return 'badge-disponible'
    if (lower === 'mecanico') return 'badge-otro'
    return 'badge-reservado'
  }

  return (
    <div className="vehiculos-page" aria-busy={loading}>
      {/* Cabecera de la sección */}
      <header className="page-header">
        <div>
          <h1 className="page-title">Gestión de Usuarios y Roles</h1>
          <p className="page-subtitle">
            Administración centralizada de cuentas de usuario, asignación de perfiles y credenciales del sistema.
          </p>
        </div>

        <div className="header-actions">
          <button
            type="button"
            className="btn btn-secondary"
            onClick={handleRefresh}
            disabled={loading}
            aria-label="Recargar lista de usuarios"
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
              aria-label="Registrar nuevo usuario"
            >
              <Plus size={16} aria-hidden="true" style={{ marginRight: '0.4rem' }} />
              <span>Nuevo Usuario</span>
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
      <section className="filters-card" aria-label="Filtros del directorio de usuarios">
        <div className="filter-group">
          <label htmlFor="search-usuarios" className="filter-label">
            <Search size={14} aria-hidden="true" style={{ display: 'inline', marginRight: '0.35rem', verticalAlign: 'middle' }} />
            Buscar por nombre, correo o rol:
          </label>
          <input
            id="search-usuarios"
            type="search"
            className="form-input"
            placeholder="Buscar por nombre, correo o rol..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value)
              setCurrentPage(1)
            }}
            aria-label="Buscar usuarios"
          />
        </div>

        {roles.length > 0 && (
          <div className="filter-group">
            <label htmlFor="filter-role" className="filter-label">
              <Filter size={14} aria-hidden="true" style={{ display: 'inline', marginRight: '0.35rem', verticalAlign: 'middle' }} />
              Filtrar por rol del sistema:
            </label>
            <select
              id="filter-role"
              className="form-select"
              value={roleFilter}
              onChange={(e) => {
                setRoleFilter(e.target.value)
                setCurrentPage(1)
              }}
              aria-label="Filtrar por rol del sistema"
            >
              <option value="todos">Todos los roles</option>
              {roles.map((r) => (
                <option key={r.idRol} value={r.idRol}>
                  {r.nombre}
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
            Mostrando <strong>{usuariosFiltrados.length}</strong> de{' '}
            <strong>{usuarios.length}</strong> usuarios registrados.
          </p>
        </div>
      )}

      {/* Contenedor principal: Estado de carga o Tabla */}
      {loading ? (
        <div className="loading-card" role="status" aria-live="polite">
          <div className="spinner-border" aria-hidden="true"></div>
          <p className="loading-text">Cargando directorio de usuarios desde el servidor...</p>
        </div>
      ) : usuariosFiltrados.length === 0 ? (
        <div className="empty-state-card" role="region" aria-label="Sin resultados">
          <Users size={48} color="#64748b" aria-hidden="true" style={{ margin: '0 auto 1rem' }} />
          <h2 className="empty-title">No se encontraron usuarios</h2>
          <p className="empty-text">
            {searchTerm || roleFilter !== 'todos'
              ? 'No hay usuarios que coincidan con los criterios de búsqueda o filtros seleccionados.'
              : 'Actualmente no hay usuarios registrados en el sistema.'}
          </p>
          {(searchTerm || roleFilter !== 'todos') && (
            <button
              type="button"
              className="btn btn-secondary"
              onClick={() => {
                setSearchTerm('')
                setRoleFilter('todos')
                setCurrentPage(1)
              }}
              style={{ marginTop: '1rem' }}
            >
              Restablecer filtros
            </button>
          )}
        </div>
      ) : (
        <>
          <div className="table-container" role="region" aria-label="Tabla de usuarios">
          <table className="data-table">
            <thead>
              <tr>
                <th scope="col">Nombre de Usuario</th>
                <th scope="col">Correo Electrónico</th>
                <th scope="col">Teléfono</th>
                <th scope="col">Rol en Sistema</th>
                <th scope="col" style={{ textAlign: 'center', width: '150px' }}>
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody>
              {usuariosPaginados.map((u) => {
                const nombreRol = u.nombreRol || rolesMap[u.idRol] || `Rol #${u.idRol}`
                const isCurrentAccount = user?.id === u.idUsuario

                return (
                  <tr key={u.idUsuario} className="table-row">
                    <td className="cell-modelo">
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <UserCheck size={16} color="#60a5fa" aria-hidden="true" />
                        <span>{u.nombre}</span>
                        {isCurrentAccount && (
                          <span
                            className="status-pill badge-disponible"
                            style={{ fontSize: '0.7rem', padding: '0.1rem 0.4rem' }}
                          >
                            Tú
                          </span>
                        )}
                      </div>
                    </td>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#cbd5e1' }}>
                        <Mail size={14} color="#94a3b8" aria-hidden="true" />
                        <span>{u.email}</span>
                      </div>
                    </td>
                    <td>
                      {u.telefono ? (
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#94a3b8' }}>
                          <Phone size={14} aria-hidden="true" />
                          <span>{u.telefono}</span>
                        </div>
                      ) : (
                        <span style={{ color: '#64748b' }}>—</span>
                      )}
                    </td>
                    <td>
                      <span className={`status-pill ${getRoleBadgeClass(nombreRol)}`}>
                        {nombreRol}
                      </span>
                    </td>
                    <td style={{ textAlign: 'center' }}>
                      <div className="table-actions">
                        <button
                          type="button"
                          className="btn btn-action btn-view"
                          onClick={() => setDetailUsuario(u)}
                          title={`Ver detalles de ${u.nombre}`}
                          aria-label={`Ver detalles de ${u.nombre}`}
                        >
                          <Eye size={15} aria-hidden="true" />
                          <span>Ver</span>
                        </button>

                        {isAdmin && (
                          <>
                            <button
                              type="button"
                              className="btn btn-action btn-edit"
                              onClick={() => handleOpenEdit(u)}
                              title={`Editar usuario ${u.nombre}`}
                              aria-label={`Editar usuario ${u.nombre}`}
                            >
                              <Pencil size={15} aria-hidden="true" />
                              <span>Editar</span>
                            </button>
                            <button
                              type="button"
                              className="btn btn-action btn-delete"
                              onClick={() => handleOpenDelete(u)}
                              title={`Eliminar usuario ${u.nombre}`}
                              aria-label={`Eliminar usuario ${u.nombre}`}
                            >
                              <Trash2 size={15} aria-hidden="true" />
                              <span>Eliminar</span>
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

        <Pagination
          currentPage={safeCurrentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
          totalItems={usuariosFiltrados.length}
          pageSize={PAGE_SIZE}
        />
      </>
    )}

      {/* Modales */}
      <UsuarioDetailModal
        usuario={detailUsuario}
        rolesMap={rolesMap}
        onClose={() => setDetailUsuario(null)}
      />

      <UsuarioFormModal
        isOpen={isFormModalOpen}
        initialData={editingUsuario}
        roles={roles}
        onSubmitCreate={handleSaveCreate}
        onSubmitUpdate={handleSaveUpdate}
        onClose={() => {
          setIsFormModalOpen(false)
          setEditingUsuario(null)
          setFormError(null)
        }}
        isSubmitting={formSubmitting}
        serverError={formError}
      />

      <UsuarioDeleteModal
        isOpen={isDeleteModalOpen}
        usuario={deletingUsuario}
        currentUserId={user?.id}
        onConfirm={handleConfirmDelete}
        onCancel={() => {
          setIsDeleteModalOpen(false)
          setDeletingUsuario(null)
          setDeleteError(null)
        }}
        isDeleting={deleteSubmitting}
        error={deleteError}
      />
    </div>
  )
}
