namespace Concesionario.DTOs;

public record MantencionResponseDto(
    int IdMantencion,
    int IdVehiculo,
    int IdSucursal,
    DateOnly FechaIngreso,
    DateOnly? FechaSalida,
    string? Descripcion,
    decimal CostoManoObra,
    decimal CostoTotal
);

public record CreateMantencionDto(
    int IdVehiculo,
    int IdSucursal,
    DateOnly FechaIngreso,
    DateOnly? FechaSalida,
    string? Descripcion,
    decimal CostoManoObra,
    decimal CostoTotal
);

public record UpdateMantencionDto(
    DateOnly FechaIngreso,
    DateOnly? FechaSalida,
    string? Descripcion,
    decimal CostoManoObra,
    decimal CostoTotal
);