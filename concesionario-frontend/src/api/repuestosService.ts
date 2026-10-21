import { apiClient } from './client'
import type { Repuesto, CreateRepuestoDto, UpdateRepuestoDto } from '../types'

/**
 * Obtiene el catálogo completo de repuestos desde el backend.
 * Endpoint: GET /api/repuestos
 */
export const getRepuestos = async (): Promise<Repuesto[]> => {
  const response = await apiClient.get<Repuesto[]>('/repuestos')
  return response.data || []
}

/**
 * Obtiene el detalle de un repuesto específico por su ID.
 * Endpoint: GET /api/repuestos/{id}
 */
export const getRepuestoById = async (id: number): Promise<Repuesto> => {
  const response = await apiClient.get<Repuesto>(`/repuestos/${id}`)
  return response.data
}

/**
 * Obtiene los repuestos asociados a una sucursal específica.
 * Endpoint: GET /api/repuestos/sucursal/{idSucursal}
 */
export const getRepuestosBySucursal = async (idSucursal: number): Promise<Repuesto[]> => {
  try {
    const response = await apiClient.get<Repuesto[]>(`/repuestos/sucursal/${idSucursal}`)
    return response.data || []
  } catch {
    return []
  }
}

/**
 * Crea un nuevo repuesto en el catálogo (operación restringida a Admin).
 * Endpoint: POST /api/repuestos
 */
export const createRepuesto = async (
  dto: CreateRepuestoDto,
): Promise<Repuesto> => {
  const response = await apiClient.post<Repuesto>('/repuestos', dto)
  return response.data
}

/**
 * Actualiza los datos de un repuesto existente (operación restringida a Admin).
 * Endpoint: PUT /api/repuestos/{id}
 */
export const updateRepuesto = async (
  id: number,
  dto: UpdateRepuestoDto,
): Promise<Repuesto> => {
  const response = await apiClient.put<Repuesto>(`/repuestos/${id}`, dto)
  return response.data
}

/**
 * Elimina un repuesto del inventario (operación restringida a Admin).
 * Endpoint: DELETE /api/repuestos/{id}
 */
export const deleteRepuesto = async (id: number): Promise<void> => {
  await apiClient.delete(`/repuestos/${id}`)
}
