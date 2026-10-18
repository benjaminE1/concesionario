namespace Concesionario.DTOs;

public record VehiculoResponseDto(
    int IdVehiculo,
    string Patente,
    string Modelo,
    int Anio,
    decimal Precio,
    string Estado,
    int IdMarca,
    int IdTipoVehiculo,
    int IdTipoCombustible,
    int IdSucursal
);

public record CreateVehiculoDto(
    string Patente,
    string Modelo,
    int Anio,
    decimal Precio,
    string Estado,
    int IdMarca,
    int IdTipoVehiculo,
    int IdTipoCombustible,
    int IdSucursal
);

public record UpdateVehiculoDto(
    string Patente,
    string Modelo,
    int Anio,
    decimal Precio,
    string Estado,
    int IdMarca,
    int IdTipoVehiculo,
    int IdTipoCombustible,
    int IdSucursal
);