import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MemoryRouter, Routes, Route } from 'react-router-dom'
import { ProtectedRoute } from '../components/ProtectedRoute'
import { RoleRoute } from '../components/RoleRoute'
import * as AuthContextModule from '../context/useAuth'

describe('Protección de Rutas (ProtectedRoute y RoleRoute)', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('ProtectedRoute redirige a /login cuando el usuario no está autenticado', () => {
    vi.spyOn(AuthContextModule, 'useAuth').mockReturnValue({
      user: null,
      token: null,
      isAuthenticated: false,
      isAdmin: false,
      loading: false,
      error: null,
      login: vi.fn(),
      logout: vi.fn(),
      clearError: vi.fn(),
    })

    render(
      <MemoryRouter initialEntries={['/privado']}>
        <Routes>
          <Route path="/login" element={<div>Página de Login</div>} />
          <Route element={<ProtectedRoute />}>
            <Route path="/privado" element={<div>Contenido Protegido</div>} />
          </Route>
        </Routes>
      </MemoryRouter>,
    )

    expect(screen.getByText('Página de Login')).toBeInTheDocument()
    expect(screen.queryByText('Contenido Protegido')).not.toBeInTheDocument()
  })

  it('ProtectedRoute permite el acceso cuando el usuario está autenticado', () => {
    vi.spyOn(AuthContextModule, 'useAuth').mockReturnValue({
      user: {
        id: 2,
        email: 'admin@gmail.com',
        name: 'Administrador',
        role: 'Admin',
        token: 'fake-token',
      },
      token: 'fake-token',
      isAuthenticated: true,
      isAdmin: true,
      loading: false,
      error: null,
      login: vi.fn(),
      logout: vi.fn(),
      clearError: vi.fn(),
    })

    render(
      <MemoryRouter initialEntries={['/privado']}>
        <Routes>
          <Route path="/login" element={<div>Página de Login</div>} />
          <Route element={<ProtectedRoute />}>
            <Route path="/privado" element={<div>Contenido Protegido</div>} />
          </Route>
        </Routes>
      </MemoryRouter>,
    )

    expect(screen.getByText('Contenido Protegido')).toBeInTheDocument()
  })

  it('RoleRoute redirige a /unauthorized si el rol no coincide con allowedRoles', () => {
    vi.spyOn(AuthContextModule, 'useAuth').mockReturnValue({
      user: {
        id: 10,
        email: 'cliente@gmail.com',
        name: 'Juan Pérez',
        role: 'Cliente', // Rol no permitido para sección Admin
        token: 'fake-token',
      },
      token: 'fake-token',
      isAuthenticated: true,
      isAdmin: false,
      loading: false,
      error: null,
      login: vi.fn(),
      logout: vi.fn(),
      clearError: vi.fn(),
    })

    render(
      <MemoryRouter initialEntries={['/admin-solo']}>
        <Routes>
          <Route path="/unauthorized" element={<div>Acceso Denegado 403</div>} />
          <Route element={<ProtectedRoute />}>
            <Route element={<RoleRoute allowedRoles={['Admin']} />}>
              <Route path="/admin-solo" element={<div>Área Secreta Admin</div>} />
            </Route>
          </Route>
        </Routes>
      </MemoryRouter>,
    )

    expect(screen.getByText('Acceso Denegado 403')).toBeInTheDocument()
    expect(screen.queryByText('Área Secreta Admin')).not.toBeInTheDocument()
  })

  it('RoleRoute permite el acceso cuando el usuario posee el rol Admin', () => {
    vi.spyOn(AuthContextModule, 'useAuth').mockReturnValue({
      user: {
        id: 2,
        email: 'admin@gmail.com',
        name: 'Administrador',
        role: 'Admin',
        token: 'fake-token',
      },
      token: 'fake-token',
      isAuthenticated: true,
      isAdmin: true,
      loading: false,
      error: null,
      login: vi.fn(),
      logout: vi.fn(),
      clearError: vi.fn(),
    })

    render(
      <MemoryRouter initialEntries={['/admin-solo']}>
        <Routes>
          <Route path="/unauthorized" element={<div>Acceso Denegado 403</div>} />
          <Route element={<ProtectedRoute />}>
            <Route element={<RoleRoute allowedRoles={['Admin']} />}>
              <Route path="/admin-solo" element={<div>Área Secreta Admin</div>} />
            </Route>
          </Route>
        </Routes>
      </MemoryRouter>,
    )

    expect(screen.getByText('Área Secreta Admin')).toBeInTheDocument()
  })
})
