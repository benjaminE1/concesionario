import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import { LoginPage } from '../pages/LoginPage'
import * as AuthContextModule from '../context/useAuth'

describe('Página de Inicio de Sesión (LoginPage.tsx)', () => {
  const mockLogin = vi.fn()
  const mockClearError = vi.fn()

  beforeEach(() => {
    vi.clearAllMocks()
    vi.spyOn(AuthContextModule, 'useAuth').mockReturnValue({
      user: null,
      token: null,
      isAuthenticated: false,
      isAdmin: false,
      loading: false,
      error: null,
      login: mockLogin,
      logout: vi.fn(),
      clearError: mockClearError,
    })
  })

  it('renderiza correctamente el formulario con etiquetas y atributos accesibles', () => {
    render(
      <MemoryRouter>
        <LoginPage />
      </MemoryRouter>,
    )

    expect(screen.getByRole('heading', { name: /iniciar sesión/i })).toBeInTheDocument()
    expect(screen.getByLabelText(/correo electrónico/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/contraseña/i)).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /acceder al sistema/i })).toBeInTheDocument()
  })

  it('muestra errores de validación si se envía el formulario vacío', async () => {
    const user = userEvent.setup()

    render(
      <MemoryRouter>
        <LoginPage />
      </MemoryRouter>,
    )

    const submitBtn = screen.getByRole('button', { name: /acceder al sistema/i })
    await user.click(submitBtn)

    expect(screen.getByText(/el correo electrónico es requerido/i)).toBeInTheDocument()
    expect(screen.getByText(/la contraseña es requerida/i)).toBeInTheDocument()
    expect(mockLogin).not.toHaveBeenCalled()
  })

  it('valida el formato de correo electrónico', async () => {
    const user = userEvent.setup()

    render(
      <MemoryRouter>
        <LoginPage />
      </MemoryRouter>,
    )

    const emailInput = screen.getByLabelText(/correo electrónico/i)
    const passwordInput = screen.getByLabelText(/contraseña/i)
    const submitBtn = screen.getByRole('button', { name: /acceder al sistema/i })

    await user.type(emailInput, 'correo-no-valido')
    await user.type(passwordInput, '123')
    await user.click(submitBtn)

    expect(
      screen.getByText(/ingresa un formato de correo electrónico válido/i),
    ).toBeInTheDocument()
    expect(mockLogin).not.toHaveBeenCalled()
  })

  it('invoca a la función login cuando los datos son válidos', async () => {
    const user = userEvent.setup()
    mockLogin.mockResolvedValueOnce(undefined)

    render(
      <MemoryRouter>
        <LoginPage />
      </MemoryRouter>,
    )

    const emailInput = screen.getByLabelText(/correo electrónico/i)
    const passwordInput = screen.getByLabelText(/contraseña/i)
    const submitBtn = screen.getByRole('button', { name: /acceder al sistema/i })

    await user.type(emailInput, 'admin@gmail.com')
    await user.type(passwordInput, '123')
    await user.click(submitBtn)

    expect(mockLogin).toHaveBeenCalledWith({
      email: 'admin@gmail.com',
      password: '123',
    })
  })

  it('muestra mensaje de alerta si existe un error de autenticación del servidor', () => {
    vi.spyOn(AuthContextModule, 'useAuth').mockReturnValue({
      user: null,
      token: null,
      isAuthenticated: false,
      isAdmin: false,
      loading: false,
      error: 'Credenciales inválidas o sesión no autorizada.',
      login: mockLogin,
      logout: vi.fn(),
      clearError: mockClearError,
    })

    render(
      <MemoryRouter>
        <LoginPage />
      </MemoryRouter>,
    )

    expect(screen.getByRole('alert')).toBeInTheDocument()
    expect(
      screen.getByText(/credenciales inválidas o sesión no autorizada/i),
    ).toBeInTheDocument()
  })
})
