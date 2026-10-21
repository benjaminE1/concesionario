import { apiClient } from './client'
import type { Sucursal, CreateSucursalDto, UpdateSucursalDto } from '../types'

/**
 * Obtiene la lista completa de sucursales desde el backend.
 * Requiere rol Admin en el backend.
 * Endpoint: GET /api/sucursal
 */
export const getSucursales = async (): Promise<Sucursal[]> => {
  const response = await apiClient.get<Sucursal[]>('/sucursal')
  return response.data || []
}

/**
 * Obtiene el detalle de una sucursal por su ID.
 * Requiere rol Admin en el backend.
 * Endpoint: GET /api/sucursal/{id}
 */
export const getSucursalById = async (id: number): Promise<Sucursal> => {
  const response = await apiClient.get<Sucursal>(`/sucursal/${id}`)
  return response.data
}

/**
 * Crea una nueva sucursal en el sistema.
 * Requiere rol Admin en el backend.
 * Endpoint: POST /api/sucursal
 */
export const createSucursal = async (
  dto: CreateSucursalDto,
): Promise<Sucursal> => {
  const response = await apiClient.post<Sucursal>('/sucursal', dto)
  return response.data
}

/**
 * Actualiza una sucursal existente por su ID.
 * Requiere rol Admin en el backend.
 * Endpoint: PUT /api/sucursal/{id}
 */
export const updateSucursal = async (
  id: number,
  dto: UpdateSucursalDto,
): Promise<Sucursal> => {
  const response = await apiClient.put<Sucursal>(`/sucursal/${id}`, dto)
  return response.data
}

/**
 * Elimina una sucursal por su ID.
 * Requiere rol Admin en el backend.
 * Endpoint: DELETE /api/sucursal/{id}
 */
export const deleteSucursal = async (id: number): Promise<void> => {
  await apiClient.delete(`/sucursal/${id}`)
}
