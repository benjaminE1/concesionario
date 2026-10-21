import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, waitFor, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { SucursalesPage } from '../pages/SucursalesPage'
import * as sucursalesService from '../api/sucursalesService'
import * as AuthContextModule from '../context/useAuth'
import type { Sucursal } from '../types'

const mockSucursales: Sucursal[] = [
  {
    idSucursal: 1,
    nombre: 'Sucursal Central Santiago',
    ciudad: 'Santiago',
    direccion: 'Av. Libertador Bernardo O Higgins 1234',
    telefono: '+56 2 2222 3333',
  },
  {
    idSucursal: 2,
    nombre: 'Sucursal Viña del Mar',
    ciudad: 'Viña del Mar',
    direccion: 'Av. Libertad 456',
    telefono: '+56 32 211 4455',
  },
]

describe('Módulo CRUD de Sucursales (SucursalesPage.tsx)', () => {
  beforeEach(() => {
    vi.clearAllMocks()

    vi.spyOn(sucursalesService, 'getSucursales').mockResolvedValue(mockSucursales)
    vi.spyOn(sucursalesService, 'createSucursal').mockResolvedValue({
      idSucursal: 3,
      nombre: 'Sucursal Concepción',
      ciudad: 'Concepción',
      direccion: 'Av. O Higgins 789',
      telefono: '+56 41 234 5678',
    })
    vi.spyOn(sucursalesService, 'updateSucursal').mockResolvedValue({
      idSucursal: 1,
      nombre: 'Sucursal Central Santiago Modificada',
      ciudad: 'Santiago',
      direccion: 'Av. Libertador Bernardo O Higgins 1234',
      telefono: '+56 2 2222 3333',
    })
    vi.spyOn(sucursalesService, 'deleteSucursal').mockResolvedValue(undefined)
  })

  it('renderiza la lista de sucursales cargadas desde la API', async () => {
    vi.spyOn(AuthContextModule, 'useAuth').mockReturnValue({
      user: { id: 1, name: 'Admin', email: 'admin@test.com', role: 'Admin', token: 'fake' },
      token: 'fake',
      isAuthenticated: true,
      isAdmin: true,
      loading: false,
      error: null,
      login: vi.fn(),
      logout: vi.fn(),
      clearError: vi.fn(),
    })

    render(<SucursalesPage />)

    expect(screen.getByText(/cargando catálogo de sucursales/i)).toBeInTheDocument()

    await waitFor(() => {
      expect(screen.getByText('Sucursal Central Santiago')).toBeInTheDocument()
      expect(screen.getByText('Sucursal Viña del Mar')).toBeInTheDocument()
      expect(screen.getByText('Viña del Mar')).toBeInTheDocument()
    })
  })

  it('permite a un usuario Admin abrir el modal de creación y guardar una nueva sucursal', async () => {
    const user = userEvent.setup()

    vi.spyOn(AuthContextModule, 'useAuth').mockReturnValue({
      user: { id: 1, name: 'Admin', email: 'admin@test.com', role: 'Admin', token: 'fake' },
      token: 'fake',
      isAuthenticated: true,
      isAdmin: true,
      loading: false,
      error: null,
      login: vi.fn(),
      logout: vi.fn(),
      clearError: vi.fn(),
    })

    render(<SucursalesPage />)

    await waitFor(() => {
      expect(screen.getByText('Sucursal Central Santiago')).toBeInTheDocument()
    })

    const newBtn = screen.getByRole('button', { name: /registrar nueva sucursal/i })
    await user.click(newBtn)

    const modal = screen.getByRole('dialog')
    expect(within(modal).getByRole('heading', { name: /registrar nueva sucursal/i })).toBeInTheDocument()

    const nombreInput = within(modal).getByLabelText(/nombre de sucursal/i)
    const ciudadInput = within(modal).getByLabelText(/ciudad/i)
    const direccionInput = within(modal).getByLabelText(/dirección completa/i)
    const telefonoInput = within(modal).getByLabelText(/teléfono de contacto/i)

    await user.type(nombreInput, 'Sucursal Concepción')
    await user.type(ciudadInput, 'Concepción')
    await user.type(direccionInput, 'Av. O Higgins 789')
    await user.type(telefonoInput, '+56 41 234 5678')

    const submitBtn = screen.getByRole('button', { name: /crear sucursal/i })
    await user.click(submitBtn)

    await waitFor(() => {
      expect(sucursalesService.createSucursal).toHaveBeenCalledWith({
        nombre: 'Sucursal Concepción',
        ciudad: 'Concepción',
        direccion: 'Av. O Higgins 789',
        telefono: '+56 41 234 5678',
      })
      expect(screen.getByText(/creada con éxito en la base de datos/i)).toBeInTheDocument()
    })
  })

  it('muestra errores de validación si los campos obligatorios están vacíos', async () => {
    const user = userEvent.setup()

    vi.spyOn(AuthContextModule, 'useAuth').mockReturnValue({
      user: { id: 1, name: 'Admin', email: 'admin@test.com', role: 'Admin', token: 'fake' },
      token: 'fake',
      isAuthenticated: true,
      isAdmin: true,
      loading: false,
      error: null,
      login: vi.fn(),
      logout: vi.fn(),
      clearError: vi.fn(),
    })

    render(<SucursalesPage />)

    await waitFor(() => {
      expect(screen.getByText('Sucursal Central Santiago')).toBeInTheDocument()
    })

    const newBtn = screen.getByRole('button', { name: /registrar nueva sucursal/i })
    await user.click(newBtn)

    const submitBtn = screen.getByRole('button', { name: /crear sucursal/i })
    await user.click(submitBtn)

    await waitFor(() => {
      expect(screen.getByText(/el nombre de la sucursal es obligatorio/i)).toBeInTheDocument()
      expect(screen.getByText(/la ciudad es obligatoria/i)).toBeInTheDocument()
      expect(screen.getByText(/la dirección es obligatoria/i)).toBeInTheDocument()
      expect(sucursalesService.createSucursal).not.toHaveBeenCalled()
    })
  })

  it('permite a un usuario Admin abrir el modal de edición y actualizar los datos', async () => {
    const user = userEvent.setup()

    vi.spyOn(AuthContextModule, 'useAuth').mockReturnValue({
      user: { id: 1, name: 'Admin', email: 'admin@test.com', role: 'Admin', token: 'fake' },
      token: 'fake',
      isAuthenticated: true,
      isAdmin: true,
      loading: false,
      error: null,
      login: vi.fn(),
      logout: vi.fn(),
      clearError: vi.fn(),
    })

    render(<SucursalesPage />)

    await waitFor(() => {
      expect(screen.getByText('Sucursal Central Santiago')).toBeInTheDocument()
    })

    const editBtn = screen.getByRole('button', { name: /editar sucursal central santiago/i })
    await user.click(editBtn)

    expect(screen.getByRole('heading', { name: /editar sucursal #1/i })).toBeInTheDocument()

    const nombreInput = screen.getByLabelText(/nombre de sucursal/i)
    await user.clear(nombreInput)
    await user.type(nombreInput, 'Sucursal Central Santiago Modificada')

    const updateBtn = screen.getByRole('button', { name: /actualizar sucursal/i })
    await user.click(updateBtn)

    await waitFor(() => {
      expect(sucursalesService.updateSucursal).toHaveBeenCalledWith(1, {
        nombre: 'Sucursal Central Santiago Modificada',
        ciudad: 'Santiago',
        direccion: 'Av. Libertador Bernardo O Higgins 1234',
        telefono: '+56 2 2222 3333',
      })
      expect(screen.getByText(/actualizada con éxito/i)).toBeInTheDocument()
    })
  })

  it('maneja y advierte sobre conflictos de integridad referencial al eliminar una sucursal', async () => {
    const user = userEvent.setup()

    vi.spyOn(AuthContextModule, 'useAuth').mockReturnValue({
      user: { id: 1, name: 'Admin', email: 'admin@test.com', role: 'Admin', token: 'fake' },
      token: 'fake',
      isAuthenticated: true,
      isAdmin: true,
      loading: false,
      error: null,
      login: vi.fn(),
      logout: vi.fn(),
      clearError: vi.fn(),
    })

    // Simula fallo por clave foránea / registro dependiente
    vi.spyOn(sucursalesService, 'deleteSucursal').mockRejectedValue({
      status: 500,
      message: 'The DELETE statement conflicted with the REFERENCE constraint.',
    })

    render(<SucursalesPage />)

    await waitFor(() => {
      expect(screen.getByText('Sucursal Central Santiago')).toBeInTheDocument()
    })

    const deleteBtn = screen.getByRole('button', { name: /eliminar sucursal central santiago/i })
    await user.click(deleteBtn)

    expect(screen.getByRole('heading', { name: /eliminar sucursal/i })).toBeInTheDocument()
    expect(screen.getByText(/control de integridad referencial/i)).toBeInTheDocument()

    const confirmBtn = screen.getByRole('button', { name: /confirmar eliminación/i })
    await user.click(confirmBtn)

    await waitFor(() => {
      expect(sucursalesService.deleteSucursal).toHaveBeenCalledWith(1)
      expect(
        screen.getByText(/la base de datos rechaza la operación para preservar la integridad referencial/i),
      ).toBeInTheDocument()
    })
  })

  it('filtra sucursales en tiempo real mediante la barra de búsqueda', async () => {
    const user = userEvent.setup()

    vi.spyOn(AuthContextModule, 'useAuth').mockReturnValue({
      user: { id: 1, name: 'Admin', email: 'admin@test.com', role: 'Admin', token: 'fake' },
      token: 'fake',
      isAuthenticated: true,
      isAdmin: true,
      loading: false,
      error: null,
      login: vi.fn(),
      logout: vi.fn(),
      clearError: vi.fn(),
    })

    render(<SucursalesPage />)

    await waitFor(() => {
      expect(screen.getByText('Sucursal Central Santiago')).toBeInTheDocument()
      expect(screen.getByText('Sucursal Viña del Mar')).toBeInTheDocument()
    })

    const searchInput = screen.getByRole('searchbox', { name: /buscar sucursales/i })
    await user.type(searchInput, 'Viña')

    expect(screen.queryByText('Sucursal Central Santiago')).not.toBeInTheDocument()
    expect(screen.getByText('Sucursal Viña del Mar')).toBeInTheDocument()
  })
})
