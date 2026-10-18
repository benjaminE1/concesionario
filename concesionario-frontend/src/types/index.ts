// Tipos y DTOs sincronizados con el backend ASP.NET Core

export interface LoginDto {
  email: string
  password: string
}

export interface LoginResponse {
  token: string
}

export interface UsuarioResponseDto {
  idUsuario: number
  nombre: string
  email: string
  telefono?: string | null
  idRol: number
  nombreRol?: string | null
}

export interface VehiculoResponseDto {
  idVehiculo: number
  patente: string
  modelo: string
  anio: number
  precio: number
  estado: string
  idMarca: number
  idTipoVehiculo: number
  idTipoCombustible: number
  idSucursal: number
}

export interface CreateVehiculoDto {
  patente: string
  modelo: string
  anio: number
  precio: number
  estado: string
  idMarca: number
  idTipoVehiculo: number
  idTipoCombustible: number
  idSucursal: number
}

export interface UpdateVehiculoDto extends CreateVehiculoDto {}

export interface Marca {
  idMarca: number
  nombre: string
}

export interface TipoVehiculo {
  idTipoVehiculo: number
  nombre: string
}

export interface TipoCombustible {
  idTipoCombustible: number
  nombre: string
}

export interface Sucursal {
  idSucursal: number
  nombre: string
  direccion: string
  telefono?: string | null
  ciudad: string
}

// Estructura de usuario extraído del JWT en frontend
export interface AuthUser {
  id: number
  email: string
  name: string
  role: string
  token: string
}

// Estructura normalizada de errores de la API
export interface ApiError {
  status: number
  message: string
  details?: unknown
}
