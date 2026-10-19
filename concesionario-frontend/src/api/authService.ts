import { apiClient } from './client'
import type { LoginDto, LoginResponse } from '../types'

/**
 * Realiza la petición de autenticación contra el backend.
 * Endpoint: POST /api/Usuario/login
 */
export const loginRequest = async (credentials: LoginDto): Promise<LoginResponse> => {
  const response = await apiClient.post<LoginResponse>('/Usuario/login', credentials)
  return response.data
}
