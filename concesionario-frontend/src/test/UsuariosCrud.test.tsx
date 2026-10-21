import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, waitFor, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { UsuariosPage } from '../pages/UsuariosPage'
import * as usuariosService from '../api/usuariosService'
import * as AuthContextModule from '../context/useAuth'
import type { UsuarioResponseDto, Rol } from '../types'

const mockUsuarios: UsuarioResponseDto[] = [
  {
    idUsuario: 1,
    nombre: 'Administrador Principal',
    email: 'admin@concesionario.cl',
    telefono: '+56 9 1111 2222',
    idRol: 1,
    nombreRol: 'Admin',
  },
  {
    idUsuario: 2,
    nombre: 'Carlos Vendedor',
    email: 'carlos@concesionario.cl',
    telefono: '+56 9 3333 4444',
    idRol: 3,
    nombreRol: 'Vendedor',
  },
  {
    idUsuario: 3,
    nombre: 'Mario Mecanico',
    email: 'mario@concesionario.cl',
    telefono: null,
    idRol: 4,
    nombreRol: 'Mecanico',
  },
]

const mockRoles: Rol[] = [
  { idRol: 1, nombre: 'Admin' },
  { idRol: 2, nombre: 'User' },
  { idRol: 3, nombre: 'Vendedor' },
  { idRol: 4, nombre: 'Mecanico' },
]

describe('Módulo CRUD de Usuarios y Roles (UsuariosPage.tsx)', () => {
  beforeEach(() => {
    vi.clearAllMocks()

    vi.spyOn(usuariosService, 'getUsuarios').mockResolvedValue(mockUsuarios)
    vi.spyOn(usuariosService, 'getRoles').mockResolvedValue(mockRoles)
    vi.spyOn(usuariosService, 'createUsuario').mockResolvedValue({
      idUsuario: 4,
      nombre: 'Lucía Asesora',
      email: 'lucia@concesionario.cl',
      telefono: '+56 9 5555 6666',
      idRol: 3,
      nombreRol: null,
    })
    vi.spyOn(usuariosService, 'updateUsuario').mockResolvedValue('Usuario actualizado correctamente.')
    vi.spyOn(usuariosService, 'deleteUsuario').mockResolvedValue(undefined)
  })

  it('renderiza la lista de usuarios y resuelve sus roles correctamente', async () => {
    vi.spyOn(AuthContextModule, 'useAuth').mockReturnValue({
      user: { id: 1, name: 'Administrador Principal', email: 'admin@concesionario.cl', role: 'Admin', token: 'fake' },
      token: 'fake',
      isAuthenticated: true,
      isAdmin: true,
      loading: false,
      error: null,
      login: vi.fn(),
      logout: vi.fn(),
      clearError: vi.fn(),
    })

    render(<UsuariosPage />)

    expect(screen.getByText(/cargando directorio de usuarios/i)).toBeInTheDocument()

    await waitFor(() => {
      expect(screen.getByText('Administrador Principal')).toBeInTheDocument()
      expect(screen.getByText('admin@concesionario.cl')).toBeInTheDocument()
      expect(screen.getByText('Carlos Vendedor')).toBeInTheDocument()
      expect(screen.getAllByText('Vendedor').length).toBeGreaterThan(0)
      expect(screen.getByText('Mario Mecanico')).toBeInTheDocument()
      expect(screen.getAllByText('Mecanico').length).toBeGreaterThan(0)
      // Píldora "Tú" para el usuario autenticado
      expect(screen.getByText('Tú')).toBeInTheDocument()
    })
  })

  it('permite a un usuario Admin abrir el modal de creación y registrar un nuevo usuario con credenciales', async () => {
    const user = userEvent.setup()

    vi.spyOn(AuthContextModule, 'useAuth').mockReturnValue({
      user: { id: 1, name: 'Administrador Principal', email: 'admin@concesionario.cl', role: 'Admin', token: 'fake' },
      token: 'fake',
      isAuthenticated: true,
      isAdmin: true,
      loading: false,
      error: null,
      login: vi.fn(),
      logout: vi.fn(),
      clearError: vi.fn(),
    })

    render(<UsuariosPage />)

    await waitFor(() => {
      expect(screen.getByText('Administrador Principal')).toBeInTheDocument()
    })

    const newBtn = screen.getByRole('button', { name: /registrar nuevo usuario/i })
    await user.click(newBtn)

    const modal = screen.getByRole('dialog')
    expect(within(modal).getByRole('heading', { name: /registrar nuevo usuario/i })).toBeInTheDocument()

    const nombreInput = within(modal).getByLabelText(/nombre completo/i)
    const emailInput = within(modal).getByLabelText(/correo electrónico/i)
    const passwordInput = within(modal).getByLabelText(/contraseña inicial/i)
    const rolSelect = within(modal).getByLabelText(/rol del sistema/i)
    const telefonoInput = within(modal).getByLabelText(/teléfono de contacto/i)

    await user.type(nombreInput, 'Lucía Asesora')
    await user.type(emailInput, 'lucia@concesionario.cl')
    await user.type(passwordInput, 'Lucia2026!')
    await user.type(telefonoInput, '+56 9 5555 6666')
    await user.selectOptions(rolSelect, '3') // Vendedor

    const submitBtn = screen.getByRole('button', { name: /crear usuario/i })
    await user.click(submitBtn)

    await waitFor(() => {
      expect(usuariosService.createUsuario).toHaveBeenCalledWith({
        nombre: 'Lucía Asesora',
        email: 'lucia@concesionario.cl',
        password: 'Lucia2026!',
        telefono: '+56 9 5555 6666',
        idRol: 3,
      })
      expect(screen.getByText(/registrado con éxito en el sistema/i)).toBeInTheDocument()
    })
  })

  it('muestra errores de validación si el formato de correo o contraseña no cumplen las reglas', async () => {
    const user = userEvent.setup()

    vi.spyOn(AuthContextModule, 'useAuth').mockReturnValue({
      user: { id: 1, name: 'Administrador Principal', email: 'admin@concesionario.cl', role: 'Admin', token: 'fake' },
      token: 'fake',
      isAuthenticated: true,
      isAdmin: true,
      loading: false,
      error: null,
      login: vi.fn(),
      logout: vi.fn(),
      clearError: vi.fn(),
    })

    render(<UsuariosPage />)

    await waitFor(() => {
      expect(screen.getByText('Administrador Principal')).toBeInTheDocument()
    })

    const newBtn = screen.getByRole('button', { name: /registrar nuevo usuario/i })
    await user.click(newBtn)

    const emailInput = screen.getByLabelText(/correo electrónico/i)
    await user.type(emailInput, 'correo-invalido')

    const submitBtn = screen.getByRole('button', { name: /crear usuario/i })
    await user.click(submitBtn)

    await waitFor(() => {
      expect(screen.getByText(/el nombre completo es obligatorio/i)).toBeInTheDocument()
      expect(screen.getByText(/ingresa un formato de correo electrónico válido/i)).toBeInTheDocument()
      expect(screen.getByText(/la contraseña temporal o inicial es obligatoria/i)).toBeInTheDocument()
      expect(usuariosService.createUsuario).not.toHaveBeenCalled()
    })
  })

  it('permite a un usuario Admin editar los datos de un usuario existente', async () => {
    const user = userEvent.setup()

    vi.spyOn(AuthContextModule, 'useAuth').mockReturnValue({
      user: { id: 1, name: 'Administrador Principal', email: 'admin@concesionario.cl', role: 'Admin', token: 'fake' },
      token: 'fake',
      isAuthenticated: true,
      isAdmin: true,
      loading: false,
      error: null,
      login: vi.fn(),
      logout: vi.fn(),
      clearError: vi.fn(),
    })

    render(<UsuariosPage />)

    await waitFor(() => {
      expect(screen.getByText('Carlos Vendedor')).toBeInTheDocument()
    })

    const editBtn = screen.getByRole('button', { name: /editar usuario carlos vendedor/i })
    await user.click(editBtn)

    expect(screen.getByRole('heading', { name: /editar usuario #2/i })).toBeInTheDocument()

    const nombreInput = screen.getByLabelText(/nombre completo/i)
    await user.clear(nombreInput)
    await user.type(nombreInput, 'Carlos Jefe de Ventas')

    const updateBtn = screen.getByRole('button', { name: /actualizar usuario/i })
    await user.click(updateBtn)

    await waitFor(() => {
      expect(usuariosService.updateUsuario).toHaveBeenCalledWith(2, {
        nombre: 'Carlos Jefe de Ventas',
        email: 'carlos@concesionario.cl',
        telefono: '+56 9 3333 4444',
        idRol: 3,
      })
      expect(screen.getByText(/actualizado con éxito/i)).toBeInTheDocument()
    })
  })

  it('bloquea la autoeliminación de la cuenta en sesión activa', async () => {
    const user = userEvent.setup()

    vi.spyOn(AuthContextModule, 'useAuth').mockReturnValue({
      user: { id: 1, name: 'Administrador Principal', email: 'admin@concesionario.cl', role: 'Admin', token: 'fake' },
      token: 'fake',
      isAuthenticated: true,
      isAdmin: true,
      loading: false,
      error: null,
      login: vi.fn(),
      logout: vi.fn(),
      clearError: vi.fn(),
    })

    render(<UsuariosPage />)

    await waitFor(() => {
      expect(screen.getByText('Administrador Principal')).toBeInTheDocument()
    })

    const deleteBtn = screen.getByRole('button', { name: /eliminar usuario administrador principal/i })
    await user.click(deleteBtn)

    expect(screen.getByRole('heading', { name: /eliminar usuario/i })).toBeInTheDocument()
    expect(screen.getByText(/no puedes eliminar tu propia cuenta mientras te encuentras autenticado/i)).toBeInTheDocument()

    const confirmBtn = screen.getByRole('button', { name: /confirmar eliminación/i })
    expect(confirmBtn).toBeDisabled()
  })

  it('maneja conflictos de integridad referencial al eliminar un usuario con ventas registradas', async () => {
    const user = userEvent.setup()

    vi.spyOn(AuthContextModule, 'useAuth').mockReturnValue({
      user: { id: 1, name: 'Administrador Principal', email: 'admin@concesionario.cl', role: 'Admin', token: 'fake' },
      token: 'fake',
      isAuthenticated: true,
      isAdmin: true,
      loading: false,
      error: null,
      login: vi.fn(),
      logout: vi.fn(),
      clearError: vi.fn(),
    })

    // Simula fallo por clave foránea de ventas/arriendos
    vi.spyOn(usuariosService, 'deleteUsuario').mockRejectedValue({
      status: 500,
      message: 'The DELETE statement conflicted with the REFERENCE constraint.',
    })

    render(<UsuariosPage />)

    await waitFor(() => {
      expect(screen.getByText('Carlos Vendedor')).toBeInTheDocument()
    })

    const deleteBtn = screen.getByRole('button', { name: /eliminar usuario carlos vendedor/i })
    await user.click(deleteBtn)

    const confirmBtn = screen.getByRole('button', { name: /confirmar eliminación/i })
    await user.click(confirmBtn)

    await waitFor(() => {
      expect(usuariosService.deleteUsuario).toHaveBeenCalledWith(2)
      expect(
        screen.getByText(/rechaza la operación para preservar la integridad referencial/i),
      ).toBeInTheDocument()
    })
  })

  it('filtra usuarios en tiempo real por término de búsqueda y por rol', async () => {
    const user = userEvent.setup()

    vi.spyOn(AuthContextModule, 'useAuth').mockReturnValue({
      user: { id: 1, name: 'Administrador Principal', email: 'admin@concesionario.cl', role: 'Admin', token: 'fake' },
      token: 'fake',
      isAuthenticated: true,
      isAdmin: true,
      loading: false,
      error: null,
      login: vi.fn(),
      logout: vi.fn(),
      clearError: vi.fn(),
    })

    render(<UsuariosPage />)

    await waitFor(() => {
      expect(screen.getByText('Administrador Principal')).toBeInTheDocument()
      expect(screen.getByText('Mario Mecanico')).toBeInTheDocument()
    })

    const searchInput = screen.getByRole('searchbox', { name: /buscar usuarios/i })
    await user.type(searchInput, 'mario')

    expect(screen.queryByText('Administrador Principal')).not.toBeInTheDocument()
    expect(screen.getByText('Mario Mecanico')).toBeInTheDocument()

    await user.clear(searchInput)

    const roleSelect = screen.getByRole('combobox', { name: /filtrar por rol del sistema/i })
    await user.selectOptions(roleSelect, '3') // Vendedor

    expect(screen.queryByText('Administrador Principal')).not.toBeInTheDocument()
    expect(screen.queryByText('Mario Mecanico')).not.toBeInTheDocument()
    expect(screen.getByText('Carlos Vendedor')).toBeInTheDocument()
  })
})
