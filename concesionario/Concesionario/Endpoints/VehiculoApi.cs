using Concesionario.DTOs;
using Concesionario.Models;
using Microsoft.EntityFrameworkCore;

namespace Concesionario.Endpoints;

public static class VehiculoApi
{
    public static void MapVehiculoApi(this IEndpointRouteBuilder app)
    {
        var vehiculos = app.MapGroup("/api/vehiculos")
                           .WithTags("Vehículos");

        // GET: Obtener todos los vehículos
        vehiculos.MapGet("/", async (ConcesionariodbContext db) =>
        {
            var listaVehiculos = await db.Vehiculos
                .Select(v => new VehiculoResponseDto(
                    v.IdVehiculo, v.Patente, v.Modelo, v.Anio, v.Precio,
                    v.Estado, v.IdMarca, v.IdTipoVehiculo, v.IdTipoCombustible, v.IdSucursal
                ))
                .ToListAsync();

            return Results.Ok(listaVehiculos);
        })
        .WithName("GetVehiculos");

        // GET: Obtener vehículo por ID
        vehiculos.MapGet("/{id:int}", async (int id, ConcesionariodbContext db) =>
        {
            var vehiculo = await db.Vehiculos
                .Where(v => v.IdVehiculo == id)
                .Select(v => new VehiculoResponseDto(
                    v.IdVehiculo, v.Patente, v.Modelo, v.Anio, v.Precio,
                    v.Estado, v.IdMarca, v.IdTipoVehiculo, v.IdTipoCombustible, v.IdSucursal
                ))
                .FirstOrDefaultAsync();

            return vehiculo is not null ? Results.Ok(vehiculo) : Results.NotFound("Vehículo no encontrado");
        });

        // GET: Buscar vehículos por marca
        vehiculos.MapGet("/marca/{idMarca:int}", async (int idMarca, ConcesionariodbContext db) =>
        {
            var vehiculosPorMarca = await db.Vehiculos
                .Where(v => v.IdMarca == idMarca)
                .Select(v => new VehiculoResponseDto(
                    v.IdVehiculo, v.Patente, v.Modelo, v.Anio, v.Precio,
                    v.Estado, v.IdMarca, v.IdTipoVehiculo, v.IdTipoCombustible, v.IdSucursal
                ))
                .ToListAsync();

            if (!vehiculosPorMarca.Any())
                return Results.NotFound("No hay vehículos de esa marca");

            return Results.Ok(vehiculosPorMarca);
        })
        .WithName("GetVehiculosPorMarca");

        // POST: Crear nuevo vehículo
        vehiculos.MapPost("/", async (CreateVehiculoDto dto, ConcesionariodbContext db) =>
        {
            // Validar existencia de referencias (Foreign Keys)
            var marcaExiste = await db.Marcas.AnyAsync(m => m.IdMarca == dto.IdMarca);
            var sucursalExiste = await db.Sucursals.AnyAsync(s => s.IdSucursal == dto.IdSucursal);

            if (!marcaExiste || !sucursalExiste)
            {
                return Results.BadRequest("La Marca o Sucursal especificada no existe.");
            }

            try
            {
                var vehiculo = new Vehiculo
                {
                    Patente = dto.Patente,
                    Modelo = dto.Modelo,
                    Anio = dto.Anio,
                    Precio = dto.Precio,
                    Estado = dto.Estado,
                    IdMarca = dto.IdMarca,
                    IdTipoVehiculo = dto.IdTipoVehiculo,
                    IdTipoCombustible = dto.IdTipoCombustible,
                    IdSucursal = dto.IdSucursal
                };

                db.Vehiculos.Add(vehiculo);
                await db.SaveChangesAsync();

                var response = new VehiculoResponseDto(
                    vehiculo.IdVehiculo, vehiculo.Patente, vehiculo.Modelo, vehiculo.Anio, vehiculo.Precio,
                    vehiculo.Estado, vehiculo.IdMarca, vehiculo.IdTipoVehiculo, vehiculo.IdTipoCombustible, vehiculo.IdSucursal
                );

                return Results.Created($"/api/vehiculos/{vehiculo.IdVehiculo}", response);
            }
            catch (DbUpdateException ex)
            {
                var errorDetalle = ex.InnerException?.Message ?? ex.Message;
                return Results.Problem($"Error en base de datos al guardar vehículo: {errorDetalle}");
            }
        }).RequireAuthorization(policy => policy.RequireRole("Admin"));

        // PUT: Actualizar vehículo
        vehiculos.MapPut("/{id:int}", async (int id, UpdateVehiculoDto dto, ConcesionariodbContext db) =>
        {
            var vehiculo = await db.Vehiculos.FindAsync(id);

            if (vehiculo is null)
                return Results.NotFound("Vehículo no encontrado");

            vehiculo.Patente = dto.Patente;
            vehiculo.Modelo = dto.Modelo;
            vehiculo.Anio = dto.Anio;
            vehiculo.Precio = dto.Precio;
            vehiculo.Estado = dto.Estado;
            vehiculo.IdMarca = dto.IdMarca;
            vehiculo.IdTipoVehiculo = dto.IdTipoVehiculo;
            vehiculo.IdTipoCombustible = dto.IdTipoCombustible;
            vehiculo.IdSucursal = dto.IdSucursal;

            await db.SaveChangesAsync();

            return Results.NoContent();
        }).RequireAuthorization(policy => policy.RequireRole("Admin"));

        // DELETE: Eliminar vehículo
        vehiculos.MapDelete("/{id:int}", async (int id, ConcesionariodbContext db) =>
        {
            var vehiculo = await db.Vehiculos.FindAsync(id);

            if (vehiculo is null)
                return Results.NotFound("Vehículo no encontrado");

            db.Vehiculos.Remove(vehiculo);
            await db.SaveChangesAsync();

            return Results.NoContent();
        }).RequireAuthorization(policy => policy.RequireRole("Admin"));
    }
}