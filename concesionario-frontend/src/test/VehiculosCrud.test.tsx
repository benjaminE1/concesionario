import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, waitFor, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { VehiculosPage } from '../pages/VehiculosPage'
import * as vehiculosService from '../api/vehiculosService'
import * as AuthContextModule from '../context/useAuth'
import type { VehiculoResponseDto, Marca, TipoVehiculo, TipoCombustible, Sucursal } from '../types'

const mockVehiculos: VehiculoResponseDto[] = [
  {
    idVehiculo: 1,
    patente: 'AB123CD',
    modelo: 'Corolla 2.0',
    anio: 2023,
    precio: 18500000,
    estado: 'Disponible',
    idMarca: 1,
    idTipoVehiculo: 1,
    idTipoCombustible: 1,
    idSucursal: 1,
  },
  {
    idVehiculo: 2,
    patente: 'XY987ZT',
    modelo: 'Hilux 4x4',
    anio: 2022,
    precio: 25000000,
    estado: 'Vendido',
    idMarca: 1,
    idTipoVehiculo: 2,
    idTipoCombustible: 2,
    idSucursal: 1,
  },
]

const mockMarcas: Marca[] = [{ idMarca: 1, nombre: 'Toyota' }]
const mockTiposVehiculo: TipoVehiculo[] = [
  { idTipoVehiculo: 1, nombre: 'Sedán' },
  { idTipoVehiculo: 2, nombre: 'Camioneta' },
]
const mockTiposCombustible: TipoCombustible[] = [
  { idTipoCombustible: 1, nombre: 'Bencina' },
  { idTipoCombustible: 2, nombre: 'Diésel' },
]
const mockSucursales: Sucursal[] = [
  {
    idSucursal: 1,
    nombre: 'Sucursal Central',
    ciudad: 'Santiago',
    direccion: 'Av. Libertador 1234',
    telefono: '22334455',
  },
]

describe('Módulo CRUD de Vehículos (VehiculosPage.tsx)', () => {
  beforeEach(() => {
    vi.clearAllMocks()

    vi.spyOn(vehiculosService, 'getVehiculos').mockResolvedValue(mockVehiculos)
    vi.spyOn(vehiculosService, 'getMarcas').mockResolvedValue(mockMarcas)
    vi.spyOn(vehiculosService, 'getTiposVehiculo').mockResolvedValue(mockTiposVehiculo)
    vi.spyOn(vehiculosService, 'getTiposCombustible').mockResolvedValue(mockTiposCombustible)
    vi.spyOn(vehiculosService, 'getSucursales').mockResolvedValue(mockSucursales)
    vi.spyOn(vehiculosService, 'createVehiculo').mockResolvedValue({
      idVehiculo: 3,
      patente: 'NEW111',
      modelo: 'Yaris',
      anio: 2024,
      precio: 12000000,
      estado: 'Disponible',
      idMarca: 1,
      idTipoVehiculo: 1,
      idTipoCombustible: 1,
      idSucursal: 1,
    })
    vi.spyOn(vehiculosService, 'updateVehiculo').mockResolvedValue(undefined)
    vi.spyOn(vehiculosService, 'deleteVehiculo').mockResolvedValue(undefined)
  })

  it('renderiza el listado de vehículos cargados desde la API', async () => {
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

    render(<VehiculosPage />)

    expect(screen.getByText(/cargando catálogo de vehículos/i)).toBeInTheDocument()

    await waitFor(() => {
      expect(screen.getByText('AB123CD')).toBeInTheDocument()
      expect(screen.getByText('Corolla 2.0')).toBeInTheDocument()
      expect(screen.getByText('XY987ZT')).toBeInTheDocument()
      expect(screen.getByText('Hilux 4x4')).toBeInTheDocument()
    })
  })

  it('no muestra botones de crear, editar ni eliminar a usuarios no administradores', async () => {
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

    render(<VehiculosPage />)

    await waitFor(() => {
      expect(screen.getByText('AB123CD')).toBeInTheDocument()
    })

    // Botón de nuevo vehículo no debe existir
    expect(screen.queryByRole('button', { name: /nuevo vehículo/i })).not.toBeInTheDocument()
    // Botones de editar y eliminar no deben existir
    expect(screen.queryByRole('button', { name: /editar corolla/i })).not.toBeInTheDocument()
    expect(screen.queryByRole('button', { name: /eliminar corolla/i })).not.toBeInTheDocument()
    // Pero el botón de ver detalles sí está disponible
    expect(screen.getByRole('button', { name: /ver detalles de corolla/i })).toBeInTheDocument()
  })

  it('permite a un usuario Admin abrir el modal de creación y enviar datos válidos', async () => {
    const user = userEvent.setup()

    vi.spyOn(AuthContextModule, 'useAuth').mockReturnValue({
      user: { id: 2, email: 'admin@gmail.com', name: 'Admin', role: 'Admin', token: 'token' },
      token: 'token',
      isAuthenticated: true,
      isAdmin: true,
      loading: false,
      error: null,
      login: vi.fn(),
      logout: vi.fn(),
      clearError: vi.fn(),
    })

    render(<VehiculosPage />)

    await waitFor(() => {
      expect(screen.getByText('AB123CD')).toBeInTheDocument()
    })

    const newBtn = screen.getByRole('button', { name: /nuevo vehículo/i })
    await user.click(newBtn)

    const modal = screen.getByRole('dialog', { name: /registrar nuevo vehículo/i })
    expect(modal).toBeInTheDocument()

    const patenteInput = within(modal).getByLabelText(/^patente/i)
    const modeloInput = within(modal).getByLabelText(/^modelo/i)
    const precioInput = within(modal).getByLabelText(/^precio/i)

    await user.clear(patenteInput)
    await user.type(patenteInput, 'NEW111')
    await user.clear(modeloInput)
    await user.type(modeloInput, 'Yaris')
    await user.clear(precioInput)
    await user.type(precioInput, '12000000')

    const submitBtn = within(modal).getByRole('button', { name: /crear vehículo/i })
    await user.click(submitBtn)

    await waitFor(() => {
      expect(vehiculosService.createVehiculo).toHaveBeenCalledWith(
        expect.objectContaining({
          patente: 'NEW111',
          modelo: 'Yaris',
          precio: 12000000,
        }),
      )
    })
  })

  it('permite abrir el modal de confirmación y eliminar un vehículo (Admin)', async () => {
    const user = userEvent.setup()

    vi.spyOn(AuthContextModule, 'useAuth').mockReturnValue({
      user: { id: 2, email: 'admin@gmail.com', name: 'Admin', role: 'Admin', token: 'token' },
      token: 'token',
      isAuthenticated: true,
      isAdmin: true,
      loading: false,
      error: null,
      login: vi.fn(),
      logout: vi.fn(),
      clearError: vi.fn(),
    })

    render(<VehiculosPage />)

    await waitFor(() => {
      expect(screen.getByText('AB123CD')).toBeInTheDocument()
    })

    const deleteBtn = screen.getByRole('button', { name: /eliminar corolla/i })
    await user.click(deleteBtn)

    const modal = screen.getByRole('dialog', { name: /confirmar eliminación/i })
    expect(modal).toBeInTheDocument()

    const confirmBtn = within(modal).getByRole('button', { name: /sí, eliminar vehículo/i })
    await user.click(confirmBtn)

    await waitFor(() => {
      expect(vehiculosService.deleteVehiculo).toHaveBeenCalledWith(1)
    })
  })

  it('permite consultar los detalles de un vehículo abriendo el modal de ficha técnica', async () => {
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

    render(<VehiculosPage />)

    await waitFor(() => {
      expect(screen.getByText('AB123CD')).toBeInTheDocument()
    })

    const viewBtn = screen.getByRole('button', { name: /ver detalles de corolla/i })
    await user.click(viewBtn)

    expect(screen.getByRole('heading', { name: /corolla 2.0 \(2023\)/i })).toBeInTheDocument()
    expect(screen.getByText('Ficha Técnica')).toBeInTheDocument()
  })
})
