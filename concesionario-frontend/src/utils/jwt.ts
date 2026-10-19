import type { AuthUser } from '../types'

export interface RawJwtPayload {
  nameid?: string
  sub?: string
  'http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier'?: string
  email?: string
  'http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress'?: string
  unique_name?: string
  name?: string
  'http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name'?: string
  role?: string
  'http://schemas.microsoft.com/ws/2008/06/identity/claims/role'?: string
  exp?: number
  iss?: string
  aud?: string
  [key: string]: unknown
}

/**
 * Decodifica de forma segura la carga útil (payload) de un JWT en base64url.
 */
export function decodeJwt(token: string): RawJwtPayload | null {
  if (!token || typeof token !== 'string') return null

  try {
    const parts = token.split('.')
    if (parts.length !== 3) return null

    // Convertir de base64url a base64 estándar
    const base64Url = parts[1]
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/')
    
    // Decodificar caracteres multibyte de forma segura
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join(''),
    )

    return JSON.parse(jsonPayload) as RawJwtPayload
  } catch {
    return null
  }
}

/**
 * Verifica si un token ha expirado comparando su claim 'exp' con la hora actual.
 */
export function isTokenExpired(token: string): boolean {
  const payload = decodeJwt(token)
  if (!payload || !payload.exp) return true

  // 'exp' está en segundos desde la época Unix, comparar con Date.now() en ms
  const expirationMs = payload.exp * 1000
  // Margen de seguridad de 5 segundos
  return Date.now() >= expirationMs - 5000
}

/**
 * Extrae y normaliza los datos del usuario a partir de los claims del token JWT.
 */
export function extractUserFromToken(token: string): AuthUser | null {
  if (!token || isTokenExpired(token)) return null

  const payload = decodeJwt(token)
  if (!payload) return null

  const idStr =
    payload.nameid ||
    payload.sub ||
    payload['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier'] ||
    '0'
  const id = parseInt(String(idStr), 10) || 0

  const email =
    payload.email ||
    payload['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress'] ||
    ''

  const name =
    payload.name ||
    payload.unique_name ||
    payload['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name'] ||
    email ||
    'Usuario'

  const role =
    payload.role ||
    payload['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'] ||
    'Usuario'

  return {
    id,
    email,
    name,
    role,
    token,
  }
}
