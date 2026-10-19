import axios, { type AxiosError, type AxiosResponse, type InternalAxiosRequestConfig } from 'axios'
import type { ApiError } from '../types'

// Obtener la URL base desde las variables de entorno de Vite (/api en desarrollo)
const BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api'

export const apiClient = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json, text/plain, */*',
  },
})

// Interceptor de petición: previene duplicación de /api e inyecta token JWT
apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    // Si la URL solicitada incluye explícitamente '/api/' o 'api/', normalizar para no duplicar con baseURL
    if (config.url) {
      if (config.url.startsWith('/api/')) {
        config.url = config.url.replace(/^\/api/, '')
      } else if (config.url.startsWith('api/')) {
        config.url = config.url.replace(/^api/, '')
      }
    }

    const token = localStorage.getItem('token') || sessionStorage.getItem('token')
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error: unknown) => Promise.reject(error),
)

// Interceptor de respuesta: gestiona 204 No Content, texto plano y JSON
apiClient.interceptors.response.use(
  (response: AxiosResponse) => {
    // Si la respuesta es 204 No Content o no contiene cuerpo, retornar null seguro
    if (response.status === 204 || response.data === '') {
      response.data = null
    }
    return response
  },
  (error: AxiosError) => {
    const normalizedError: ApiError = {
      status: error.response?.status || 0,
      message: 'Ocurrió un error inesperado al comunicarse con el servidor.',
      details: error.response?.data,
    }

    if (error.response) {
      const data = error.response.data

      // Caso 1: El backend respondió con un string directo en texto plano (ej: "Vehículo no encontrado")
      if (typeof data === 'string' && data.trim().length > 0) {
        normalizedError.message = data
      }
      // Caso 2: El backend respondió con un objeto ProblemDetails u objeto con mensaje
      else if (data && typeof data === 'object') {
        const dataObj = data as Record<string, unknown>
        if (typeof dataObj.message === 'string') {
          normalizedError.message = dataObj.message
        } else if (typeof dataObj.detail === 'string') {
          normalizedError.message = dataObj.detail
        } else if (typeof dataObj.title === 'string') {
          normalizedError.message = dataObj.title
        }
      }

      // Si el backend responde 401 y no es la llamada de login, emitir evento de sesión expirada
      if (error.response.status === 401) {
        const isLoginRequest = error.config?.url?.includes('/Usuario/login')
        if (!isLoginRequest) {
          try {
            sessionStorage.removeItem('token')
            localStorage.removeItem('token')
          } catch {
            // entorno sin storage
          }
          if (typeof window !== 'undefined') {
            window.dispatchEvent(new CustomEvent('auth:unauthorized'))
          }
        }
      }

      // Mensajes de respaldo según código HTTP si no hubo mensaje específico
      if (
        normalizedError.message === 'Ocurrió un error inesperado al comunicarse con el servidor.'
      ) {
        switch (error.response.status) {
          case 400:
            normalizedError.message = 'Los datos enviados son inválidos.'
            break
          case 401:
            normalizedError.message = 'Credenciales inválidas o sesión expirada.'
            break
          case 403:
            normalizedError.message = 'Acceso denegado: no posees los permisos necesarios para realizar esta acción.'
            break
          case 404:
            normalizedError.message = 'El recurso solicitado no fue encontrado en el servidor (HTTP 404).'
            break
          case 500:
            normalizedError.message = 'Error interno en el servidor.'
            break
        }
      }
    } else if (error.code === 'ERR_NETWORK') {
      normalizedError.message =
        'No se pudo conectar con el backend. Asegúrate de que la API esté encendida en http://localhost:5145.'
    } else if (error.code === 'ECONNABORTED') {
      normalizedError.message = 'El tiempo de espera de la petición expiró (timeout).'
    }

    return Promise.reject(normalizedError)
  },
)

// Servicio de conectividad inicial
export const checkApiConnectivity = async (): Promise<{
  connected: boolean
  message: string
  details?: unknown
}> => {
  try {
    const response = await apiClient.get<unknown[]>('/vehiculos')
    return {
      connected: true,
      message: 'Conexión establecida con éxito con la API.',
      details: Array.isArray(response.data) ? `${response.data.length} vehículos cargados` : 'OK',
    }
  } catch (error) {
    const err = error as ApiError
    return {
      connected: false,
      message: err.message,
      details: err.status > 0 ? `Código HTTP: ${err.status}` : 'Sin conexión',
    }
  }
}
