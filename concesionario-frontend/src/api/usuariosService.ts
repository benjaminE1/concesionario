import { apiClient } from './client'
import type {
  UsuarioResponseDto,
  CrearUsuarioDto,
  ActualizarUsuarioDto,
  Rol,
} from '../types'

/**
 * Obtiene la lista completa de usuarios registrados.
 * Endpoint: GET /api/Usuario (requiere rol Admin)
 */
export const getUsuarios = async (): Promise<UsuarioResponseDto[]> => {
  const response = await apiClient.get<UsuarioResponseDto[]>('/Usuario')
  return response.data || []
}

/**
 * Obtiene los datos de un usuario por su ID.
 * Endpoint: GET /api/Usuario/{id} (requiere rol Admin)
 */
export const getUsuarioById = async (id: number): Promise<UsuarioResponseDto> => {
  const response = await apiClient.get<UsuarioResponseDto>(`/Usuario/${id}`)
  return response.data
}

/**
 * Registra un nuevo usuario en la base de datos con contraseña hasheada.
 * Endpoint: POST /api/Usuario
 */
export const createUsuario = async (
  dto: CrearUsuarioDto,
): Promise<UsuarioResponseDto> => {
  const response = await apiClient.post<UsuarioResponseDto>('/Usuario', dto)
  return response.data
}

/**
 * Actualiza los datos de un usuario existente (nombre, email, teléfono, rol).
 * Endpoint: PUT /api/Usuario/{id} (requiere rol Admin)
 */
export const updateUsuario = async (
  id: number,
  dto: ActualizarUsuarioDto,
): Promise<string> => {
  const response = await apiClient.put<string>(`/Usuario/${id}`, dto)
  return response.data || 'Usuario actualizado correctamente.'
}

/**
 * Elimina permanentemente a un usuario por su ID.
 * Endpoint: DELETE /api/Usuario/{id} (requiere rol Admin)
 */
export const deleteUsuario = async (id: number): Promise<void> => {
  await apiClient.delete(`/Usuario/${id}`)
}

/**
 * Obtiene el catálogo de roles disponibles en el sistema.
 * Endpoint: GET /api/rol (requiere rol Admin)
 */
export const getRoles = async (): Promise<Rol[]> => {
  try {
    const response = await apiClient.get<Rol[]>('/rol')
    return response.data || []
  } catch {
    return []
  }
}
