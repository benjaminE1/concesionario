import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { RepuestosPage } from '../pages/RepuestosPage'
import * as repuestosService from '../api/repuestosService'
import * as sucursalesService from '../api/sucursalesService'
import * as AuthContextModule from '../context/useAuth'
import type { Repuesto, Sucursal } from '../types'

const mockRepuestos: Repuesto[] = [
  {
    idRepuesto: 1,
    nombre: 'Pastillas de Freno Delanteras',
    codigoReferencia: 'BRK-2024-TY',
    precio: 35000,
    stock: 12,
    idSucursal: 1,
  },
  {
    idRepuesto: 2,
    nombre: 'Filtro de Aceite Sintético',
    codigoReferencia: 'FLT-OIL-01',
    precio: 12000,
    stock: 2, // Stock bajo
    idSucursal: 1,
  },
  {
    idRepuesto: 3,
    nombre: 'Batería 12V 60Ah',
    codigoReferencia: 'BAT-60AH',
    precio: 85000,
    stock: 0, // Agotado
    idSucursal: 1,
  },
]

const mockSucursales: Sucursal[] = [
  {
    idSucursal: 1,
    nombre: 'Sucursal Central',
    ciudad: 'Santiago',
    direccion: 'Av. Libertador 1234',
    telefono: '+56 2 2222 3333',
  },
]

describe('Módulo CRUD de Repuestos (RepuestosPage.tsx)', () => {
  beforeEach(() => {
    vi.clearAllMocks()

    vi.spyOn(repuestosService, 'getRepuestos').mockResolvedValue(mockRepuestos)
    vi.spyOn(sucursalesService, 'getSucursales').mockResolvedValue(mockSucursales)
    vi.spyOn(repuestosService, 'createRepuesto').mockResolvedValue({
      idRepuesto: 4,
      nombre: 'Bujías de Iridio (Pack 4)',
      codigoReferencia: 'SPK-IRI-04',
      precio: 28000,
      stock: 20,
      idSucursal: 1,
    })
    vi.spyOn(repuestosService, 'updateRepuesto').mockResolvedValue({
      idRepuesto: 1,
      nombre: 'Pastillas de Freno Cerámicas',
      codigoReferencia: 'BRK-2024-TY',
      precio: 45000,
      stock: 15,
      idSucursal: 1,
    })
    vi.spyOn(repuestosService, 'deleteRepuesto').mockResolvedValue(undefined)
  })

  it('renderiza el catálogo de repuestos cargados desde la API con sus estados de stock', async () => {
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

    render(<RepuestosPage />)

    expect(screen.getByText(/cargando inventario de repuestos/i)).toBeInTheDocument()

    await waitFor(() => {
      expect(screen.getByText('Pastillas de Freno Delanteras')).toBeInTheDocument()
      expect(screen.getByText('BRK-2024-TY')).toBeInTheDocument()
      expect(screen.getByText('Filtro de Aceite Sintético')).toBeInTheDocument()
      expect(screen.getByText('Batería 12V 60Ah')).toBeInTheDocument()
      expect(screen.getByText('Agotado (0)')).toBeInTheDocument()
      expect(screen.getByText('Bajo (2)')).toBeInTheDocument()
    })
  })

  it('permite a un usuario Admin abrir el modal de creación y registrar un repuesto con datos válidos', async () => {
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

    render(<RepuestosPage />)

    await waitFor(() => {
      expect(screen.getByText('Pastillas de Freno Delanteras')).toBeInTheDocument()
    })

    const newBtn = screen.getByRole('button', { name: /registrar nuevo repuesto/i })
    await user.click(newBtn)

    expect(screen.getByRole('heading', { name: /registrar nuevo repuesto/i })).toBeInTheDocument()

    const nombreInput = screen.getByLabelText(/nombre del repuesto/i)
    const codigoInput = screen.getByLabelText(/código de referencia/i)
    const precioInput = screen.getByLabelText(/precio unitario/i)
    const stockInput = screen.getByLabelText(/unidades en stock/i)

    await user.type(nombreInput, 'Bujías de Iridio (Pack 4)')
    await user.type(codigoInput, 'SPK-IRI-04')
    await user.clear(precioInput)
    await user.type(precioInput, '28000')
    await user.clear(stockInput)
    await user.type(stockInput, '20')

    const submitBtn = screen.getByRole('button', { name: /crear repuesto/i })
    await user.click(submitBtn)

    await waitFor(() => {
      expect(repuestosService.createRepuesto).toHaveBeenCalledWith({
        nombre: 'Bujías de Iridio (Pack 4)',
        codigoReferencia: 'SPK-IRI-04',
        precio: 28000,
        stock: 20,
        idSucursal: 1,
      })
      expect(screen.getByText(/registrado con éxito en el catálogo/i)).toBeInTheDocument()
    })
  })

  it('valida que los campos obligatorios y números sean válidos', async () => {
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

    render(<RepuestosPage />)

    await waitFor(() => {
      expect(screen.getByText('Pastillas de Freno Delanteras')).toBeInTheDocument()
    })

    const newBtn = screen.getByRole('button', { name: /registrar nuevo repuesto/i })
    await user.click(newBtn)

    const precioInput = screen.getByLabelText(/precio unitario/i)
    await user.clear(precioInput)
    await user.type(precioInput, '0')

    const submitBtn = screen.getByRole('button', { name: /crear repuesto/i })
    await user.click(submitBtn)

    await waitFor(() => {
      expect(screen.getByText(/el nombre del repuesto es obligatorio/i)).toBeInTheDocument()
      expect(screen.getByText(/el precio debe ser mayor a \$0/i)).toBeInTheDocument()
      expect(repuestosService.createRepuesto).not.toHaveBeenCalled()
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

    render(<RepuestosPage />)

    await waitFor(() => {
      expect(screen.getByText('Pastillas de Freno Delanteras')).toBeInTheDocument()
    })

    const editBtn = screen.getByRole('button', { name: /editar pastillas de freno delanteras/i })
    await user.click(editBtn)

    expect(screen.getByRole('heading', { name: /editar repuesto #1/i })).toBeInTheDocument()

    const nombreInput = screen.getByLabelText(/nombre del repuesto/i)
    await user.clear(nombreInput)
    await user.type(nombreInput, 'Pastillas de Freno Cerámicas')

    const precioInput = screen.getByLabelText(/precio unitario/i)
    await user.clear(precioInput)
    await user.type(precioInput, '45000')

    const updateBtn = screen.getByRole('button', { name: /actualizar repuesto/i })
    await user.click(updateBtn)

    await waitFor(() => {
      expect(repuestosService.updateRepuesto).toHaveBeenCalledWith(1, {
        nombre: 'Pastillas de Freno Cerámicas',
        codigoReferencia: 'BRK-2024-TY',
        precio: 45000,
        stock: 12,
        idSucursal: 1,
      })
      expect(screen.getByText(/actualizado con éxito/i)).toBeInTheDocument()
    })
  })

  it('maneja y advierte sobre conflictos de integridad referencial al eliminar un repuesto', async () => {
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

    // Simula fallo por clave foránea en MantencionRepuesto
    vi.spyOn(repuestosService, 'deleteRepuesto').mockRejectedValue({
      status: 500,
      message: 'The DELETE statement conflicted with the REFERENCE constraint.',
    })

    render(<RepuestosPage />)

    await waitFor(() => {
      expect(screen.getByText('Pastillas de Freno Delanteras')).toBeInTheDocument()
    })

    const deleteBtn = screen.getByRole('button', { name: /eliminar pastillas de freno delanteras/i })
    await user.click(deleteBtn)

    expect(screen.getByRole('heading', { name: /eliminar repuesto/i })).toBeInTheDocument()
    expect(screen.getByText(/control de integridad referencial/i)).toBeInTheDocument()

    const confirmBtn = screen.getByRole('button', { name: /confirmar eliminación/i })
    await user.click(confirmBtn)

    await waitFor(() => {
      expect(repuestosService.deleteRepuesto).toHaveBeenCalledWith(1)
      expect(
        screen.getByText(/rechaza la operación para preservar el historial de taller/i),
      ).toBeInTheDocument()
    })
  })

  it('filtra repuestos por término de búsqueda y nivel de stock', async () => {
    const user = userEvent.setup()

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

    render(<RepuestosPage />)

    await waitFor(() => {
      expect(screen.getByText('Pastillas de Freno Delanteras')).toBeInTheDocument()
      expect(screen.getByText('Batería 12V 60Ah')).toBeInTheDocument()
    })

    // Filtro por texto
    const searchInput = screen.getByRole('searchbox', { name: /buscar repuestos/i })
    await user.type(searchInput, 'Filtro')

    expect(screen.queryByText('Pastillas de Freno Delanteras')).not.toBeInTheDocument()
    expect(screen.getByText('Filtro de Aceite Sintético')).toBeInTheDocument()

    await user.clear(searchInput)

    // Filtro por stock: Agotados
    const stockSelect = screen.getByRole('combobox', { name: /filtrar por nivel de stock/i })
    await user.selectOptions(stockSelect, 'agotado')

    expect(screen.queryByText('Pastillas de Freno Delanteras')).not.toBeInTheDocument()
    expect(screen.queryByText('Filtro de Aceite Sintético')).not.toBeInTheDocument()
    expect(screen.getByText('Batería 12V 60Ah')).toBeInTheDocument()
  })
})
