import React, { useEffect, useState, useMemo, useCallback } from 'react'
import type { AuthUser, LoginDto } from '../types'
import { loginRequest } from '../api/authService'
import { extractUserFromToken, isTokenExpired } from '../utils/jwt'
import { AuthContext } from './authContextDef'

const TOKEN_KEY = 'token'

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Inicialización perezosa (lazy) en memoria para evitar renders síncronos en useEffect
  const [token, setToken] = useState<string | null>(() => {
    try {
      const stored = sessionStorage.getItem(TOKEN_KEY) || localStorage.getItem(TOKEN_KEY)
      return stored && !isTokenExpired(stored) ? stored : null
    } catch {
      return null
    }
  })

  const [user, setUser] = useState<AuthUser | null>(() => {
    try {
      const stored = sessionStorage.getItem(TOKEN_KEY) || localStorage.getItem(TOKEN_KEY)
      return stored && !isTokenExpired(stored) ? extractUserFromToken(stored) : null
    } catch {
      return null
    }
  })

  const [loading, setLoading] = useState<boolean>(false)
  const [error, setError] = useState<string | null>(null)

  const clearError = useCallback(() => {
    setError(null)
  }, [])

  const logout = useCallback(() => {
    try {
      sessionStorage.removeItem(TOKEN_KEY)
      localStorage.removeItem(TOKEN_KEY)
    } catch {
      // Ignorar errores en entornos sin soporte de almacenamiento
    }
    setToken(null)
    setUser(null)
    setError(null)
  }, [])

  // Escuchar evento de 401 no autorizado emitido por el interceptor HTTP de Axios
  useEffect(() => {
    const handleUnauthorized = () => {
      logout()
    }

    window.addEventListener('auth:unauthorized', handleUnauthorized)
    return () => {
      window.removeEventListener('auth:unauthorized', handleUnauthorized)
    }
  }, [logout])

  const login = async (credentials: LoginDto) => {
    setLoading(true)
    setError(null)
    try {
      const response = await loginRequest(credentials)
      const receivedToken = response.token

      if (!receivedToken) {
        throw new Error('La respuesta del servidor no incluyó un token de autenticación.')
      }

      const authUser = extractUserFromToken(receivedToken)
      if (!authUser) {
        throw new Error('El token recibido no es válido o ha expirado.')
      }

      // Persistir token en sessionStorage por seguridad de sesión de pestaña
      try {
        sessionStorage.setItem(TOKEN_KEY, receivedToken)
      } catch {
        // En caso de modo incógnito restrictivo, se mantendrá en memoria
      }

      setToken(receivedToken)
      setUser(authUser)
    } catch (err) {
      const message =
        err && typeof err === 'object' && 'message' in err
          ? String(err.message)
          : 'Credenciales inválidas o error de conexión.'
      setError(message)
      throw new Error(message)
    } finally {
      setLoading(false)
    }
  }

  const isAuthenticated = useMemo(() => {
    return Boolean(user && token && !isTokenExpired(token))
  }, [user, token])

  const isAdmin = useMemo(() => {
    return Boolean(
      user &&
        (user.role === 'Admin' ||
          user.role.toLowerCase() === 'admin' ||
          user.role.includes('Admin')),
    )
  }, [user])

  const contextValue = useMemo(
    () => ({
      user,
      token,
      isAuthenticated,
      isAdmin,
      loading,
      error,
      login,
      logout,
      clearError,
    }),
    [user, token, isAuthenticated, isAdmin, loading, error, logout, clearError],
  )

  return <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
}
