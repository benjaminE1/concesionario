import { describe, it, expect } from 'vitest'
import { decodeJwt, isTokenExpired, extractUserFromToken } from '../utils/jwt'

function createMockToken(payload: Record<string, unknown>): string {
  const header = btoa(JSON.stringify({ alg: 'HS256', typ: 'JWT' }))
    .replace(/=/g, '')
    .replace(/\+/g, '-')
    .replace(/\//g, '_')

  const encodedPayload = btoa(unescape(encodeURIComponent(JSON.stringify(payload))))
    .replace(/=/g, '')
    .replace(/\+/g, '-')
    .replace(/\//g, '_')

  const signature = 'fake-signature-for-unit-testing'
  return `${header}.${encodedPayload}.${signature}`
}

describe('Utilidades de JWT (jwt.ts)', () => {
  it('decodifica correctamente la carga útil de un token JWT', () => {
    const payload = {
      nameid: '2',
      email: 'admin@gmail.com',
      name: 'Administrador Concesionario',
      role: 'Admin',
      exp: Math.floor(Date.now() / 1000) + 3600, // expira en 1 hora
    }
    const token = createMockToken(payload)
    const decoded = decodeJwt(token)

    expect(decoded).not.toBeNull()
    expect(decoded?.nameid).toBe('2')
    expect(decoded?.email).toBe('admin@gmail.com')
    expect(decoded?.name).toBe('Administrador Concesionario')
    expect(decoded?.role).toBe('Admin')
  })

  it('detecta correctamente cuando un token ha expirado', () => {
    const expiredPayload = {
      email: 'expirado@gmail.com',
      exp: Math.floor(Date.now() / 1000) - 300, // expiró hace 5 minutos
    }
    const expiredToken = createMockToken(expiredPayload)
    expect(isTokenExpired(expiredToken)).toBe(true)

    const validPayload = {
      email: 'activo@gmail.com',
      exp: Math.floor(Date.now() / 1000) + 1800, // activo por 30 minutos
    }
    const validToken = createMockToken(validPayload)
    expect(isTokenExpired(validToken)).toBe(false)
  })

  it('extrae el usuario AuthUser con claims de ASP.NET Core', () => {
    const payload = {
      'http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier': '2',
      'http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress': 'admin@gmail.com',
      'http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name': 'Admin Principal',
      'http://schemas.microsoft.com/ws/2008/06/identity/claims/role': 'Admin',
      exp: Math.floor(Date.now() / 1000) + 3600,
    }
    const token = createMockToken(payload)
    const user = extractUserFromToken(token)

    expect(user).not.toBeNull()
    expect(user?.id).toBe(2)
    expect(user?.email).toBe('admin@gmail.com')
    expect(user?.name).toBe('Admin Principal')
    expect(user?.role).toBe('Admin')
  })

  it('retorna null para tokens malformados o vacíos', () => {
    expect(decodeJwt('')).toBeNull()
    expect(decodeJwt('token-invalido')).toBeNull()
    expect(extractUserFromToken('')).toBeNull()
    expect(extractUserFromToken('invalido.invalido')).toBeNull()
  })
})
