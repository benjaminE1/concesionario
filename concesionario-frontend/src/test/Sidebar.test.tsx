import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import { Sidebar } from '../components/Sidebar'
import * as useAuthModule from '../context/useAuth'

describe('Barra Lateral Izquierda (Sidebar.tsx)', () => {
  const mockLogout = vi.fn()

  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('muestra el logotipo y los módulos públicos cuando el usuario no está autenticado', () => {
    vi.spyOn(useAuthModule, 'useAuth').mockReturnValue({
      user: null,
      token: null,
      isAuthenticated: false,
      isAdmin: false,
      login: vi.fn(),
      logout: mockLogout,
      loading: false,
      error: null,
      clearError: vi.fn(),
    })

    render(
      <MemoryRouter initialEntries={['/']}>
        <Sidebar />
      </MemoryRouter>,
    )

    // Logo / Marca
    expect(screen.getAllByText(/AutoGestión/i).length).toBeGreaterThan(0)

    // Módulos públicos
    expect(screen.getByRole('link', { name: /inicio/i })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /vehículos/i })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /repuestos/i })).toBeInTheDocument()

    // Enlace de inicio de sesión
    expect(screen.getByRole('link', { name: /iniciar sesión/i })).toBeInTheDocument()

    // Módulos protegidos NO deben aparecer
    expect(screen.queryByRole('link', { name: /sucursales/i })).not.toBeInTheDocument()
    expect(screen.queryByRole('link', { name: /usuarios/i })).not.toBeInTheDocument()
    expect(screen.queryByRole('link', { name: /panel admin/i })).not.toBeInTheDocument()
  })

  it('muestra los módulos de administración y datos del usuario cuando tiene rol Admin', () => {
    vi.spyOn(useAuthModule, 'useAuth').mockReturnValue({
      user: {
        id: 1,
        email: 'admin@gmail.com',
        name: 'Administrador Demo',
        role: 'Admin',
        token: 'fake-jwt-token',
      },
      token: 'fake-jwt-token',
      isAuthenticated: true,
      isAdmin: true,
      login: vi.fn(),
      logout: mockLogout,
      loading: false,
      error: null,
      clearError: vi.fn(),
    })

    render(
      <MemoryRouter initialEntries={['/vehiculos']}>
        <Sidebar />
      </MemoryRouter>,
    )

    // Módulos de administración visibles
    expect(screen.getByRole('link', { name: /sucursales/i })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /usuarios/i })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /panel admin/i })).toBeInTheDocument()

    // Datos del usuario autenticado
    expect(screen.getByText('Administrador Demo')).toBeInTheDocument()
    expect(screen.getByText('Admin')).toBeInTheDocument()

    // Botón de cerrar sesión
    const logoutBtn = screen.getByRole('button', { name: /cerrar sesión/i })
    expect(logoutBtn).toBeInTheDocument()
  })

  it('llama a la función logout al hacer clic en Cerrar sesión', async () => {
    const user = userEvent.setup()

    vi.spyOn(useAuthModule, 'useAuth').mockReturnValue({
      user: {
        id: 1,
        email: 'admin@gmail.com',
        name: 'Administrador Demo',
        role: 'Admin',
        token: 'fake-jwt-token',
      },
      token: 'fake-jwt-token',
      isAuthenticated: true,
      isAdmin: true,
      login: vi.fn(),
      logout: mockLogout,
      loading: false,
      error: null,
      clearError: vi.fn(),
    })

    render(
      <MemoryRouter initialEntries={['/']}>
        <Sidebar />
      </MemoryRouter>,
    )

    const logoutBtn = screen.getByRole('button', { name: /cerrar sesión/i })
    await user.click(logoutBtn)

    expect(mockLogout).toHaveBeenCalledTimes(1)
  })

  it('marca visualmente el módulo activo según la ruta actual', () => {
    vi.spyOn(useAuthModule, 'useAuth').mockReturnValue({
      user: null,
      token: null,
      isAuthenticated: false,
      isAdmin: false,
      login: vi.fn(),
      logout: mockLogout,
      loading: false,
      error: null,
      clearError: vi.fn(),
    })

    render(
      <MemoryRouter initialEntries={['/vehiculos']}>
        <Sidebar />
      </MemoryRouter>,
    )

    const vehiculosLink = screen.getByRole('link', { name: /vehículos/i })
    expect(vehiculosLink).toHaveClass('is-active')
    expect(vehiculosLink).toHaveAttribute('aria-current', 'page')

    const inicioLink = screen.getByRole('link', { name: /inicio/i })
    expect(inicioLink).not.toHaveClass('is-active')
  })

  it('permite alternar la apertura y cierre en pantallas móviles mediante el botón de menú', async () => {
    const user = userEvent.setup()

    vi.spyOn(useAuthModule, 'useAuth').mockReturnValue({
      user: null,
      token: null,
      isAuthenticated: false,
      isAdmin: false,
      login: vi.fn(),
      logout: mockLogout,
      loading: false,
      error: null,
      clearError: vi.fn(),
    })

    render(
      <MemoryRouter initialEntries={['/']}>
        <Sidebar />
      </MemoryRouter>,
    )

    const toggleBtn = screen.getByRole('button', { name: /abrir menú de navegación/i })
    const aside = screen.getByRole('complementary', { name: /barra lateral de navegación/i })

    expect(aside).not.toHaveClass('is-open')

    await user.click(toggleBtn)
    expect(aside).toHaveClass('is-open')

    // El botón ahora debe permitir cerrar el menú
    const closeToggleBtn = screen.getByRole('button', { name: /cerrar menú de navegación/i })
    await user.click(closeToggleBtn)
    expect(aside).not.toHaveClass('is-open')
  })
})
