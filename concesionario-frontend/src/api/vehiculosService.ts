import { apiClient } from './client'
import type {
  VehiculoResponseDto,
  CreateVehiculoDto,
  UpdateVehiculoDto,
  Marca,
  TipoVehiculo,
  TipoCombustible,
  Sucursal,
} from '../types'

/**
 * Obtiene la lista completa de vehículos desde el backend.
 * Endpoint: GET /api/vehiculos
 */
export const getVehiculos = async (): Promise<VehiculoResponseDto[]> => {
  const response = await apiClient.get<VehiculoResponseDto[]>('/vehiculos')
  return response.data || []
}

/**
 * Obtiene el detalle de un vehículo por su ID.
 * Endpoint: GET /api/vehiculos/{id}
 */
export const getVehiculoById = async (id: number): Promise<VehiculoResponseDto> => {
  const response = await apiClient.get<VehiculoResponseDto>(`/vehiculos/${id}`)
  return response.data
}

/**
 * Crea un nuevo vehículo en el sistema (requiere rol Admin).
 * Endpoint: POST /api/vehiculos
 */
export const createVehiculo = async (
  dto: CreateVehiculoDto,
): Promise<VehiculoResponseDto> => {
  const response = await apiClient.post<VehiculoResponseDto>('/vehiculos', dto)
  return response.data
}

/**
 * Actualiza un vehículo existente por su ID (requiere rol Admin).
 * Endpoint: PUT /api/vehiculos/{id}
 * El backend responde con 204 NoContent en caso de éxito.
 */
export const updateVehiculo = async (
  id: number,
  dto: UpdateVehiculoDto,
): Promise<void> => {
  await apiClient.put(`/vehiculos/${id}`, dto)
}

/**
 * Elimina un vehículo por su ID (requiere rol Admin).
 * Endpoint: DELETE /api/vehiculos/{id}
 * El backend responde con 204 NoContent en caso de éxito.
 */
export const deleteVehiculo = async (id: number): Promise<void> => {
  await apiClient.delete(`/vehiculos/${id}`)
}

/**
 * Obtiene el catálogo de marcas (público).
 * Endpoint: GET /api/Marca
 */
export const getMarcas = async (): Promise<Marca[]> => {
  try {
    const response = await apiClient.get<Marca[]>('/Marca')
    return response.data || []
  } catch {
    return []
  }
}

/**
 * Obtiene el catálogo de tipos de vehículo (público).
 * Endpoint: GET /api/TipoVehiculo
 */
export const getTiposVehiculo = async (): Promise<TipoVehiculo[]> => {
  try {
    const response = await apiClient.get<TipoVehiculo[]>('/TipoVehiculo')
    return response.data || []
  } catch {
    return []
  }
}

/**
 * Obtiene el catálogo de tipos de combustible (público).
 * Endpoint: GET /api/combustible
 */
export const getTiposCombustible = async (): Promise<TipoCombustible[]> => {
  try {
    const response = await apiClient.get<TipoCombustible[]>('/combustible')
    return response.data || []
  } catch {
    return []
  }
}

/**
 * Obtiene el catálogo de sucursales.
 * Endpoint: GET /api/sucursal (requiere rol Admin en el backend)
 */
export const getSucursales = async (): Promise<Sucursal[]> => {
  try {
    const response = await apiClient.get<Sucursal[]>('/sucursal')
    return response.data || []
  } catch (error) {
    // Si el usuario no tiene permisos (403) o no está autenticado, retornamos arreglo vacío
    console.warn('No se pudieron obtener las sucursales (puede requerir rol Admin):', error)
    return []
  }
}
