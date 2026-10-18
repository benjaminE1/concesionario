using Concesionario.DTOs;
using Concesionario.Models;
using Microsoft.EntityFrameworkCore;

namespace Concesionario.Endpoints;

public static class MantencionEndpoints
{
    public static void MapMantencionApi(this IEndpointRouteBuilder routes)
    {
        var group = routes.MapGroup("/api/mantenciones")
                          .WithTags("Mantenciones");

        // GET: Listar todas las mantenciones
        group.MapGet("/", async (ConcesionariodbContext db) =>
        {
            var mantenciones = await db.Mantencions
                .Select(m => new MantencionResponseDto(
                    m.IdMantencion,
                    m.IdVehiculo,
                    m.IdSucursal,
                    m.FechaIngreso,
                    m.FechaSalida,
                    m.Descripcion,
                    m.CostoManoObra,
                    m.CostoTotal
                ))
                .ToListAsync();

            return Results.Ok(mantenciones);
        });

        // GET: Obtener mantención por ID
        group.MapGet("/{id:int}", async (int id, ConcesionariodbContext db) =>
        {
            var mantencion = await db.Mantencions
                .Where(m => m.IdMantencion == id)
                .Select(m => new MantencionResponseDto(
                    m.IdMantencion,
                    m.IdVehiculo,
                    m.IdSucursal,
                    m.FechaIngreso,
                    m.FechaSalida,
                    m.Descripcion,
                    m.CostoManoObra,
                    m.CostoTotal
                ))
                .FirstOrDefaultAsync();

            return mantencion is not null ? Results.Ok(mantencion) : Results.NotFound();
        });

        // POST: Crear una mantención
        group.MapPost("/", async (CreateMantencionDto dto, ConcesionariodbContext db) =>
        {
            var vehiculoExiste = await db.Vehiculos.AnyAsync(v => v.IdVehiculo == dto.IdVehiculo);
            var sucursalExiste = await db.Sucursals.AnyAsync(s => s.IdSucursal == dto.IdSucursal);

            if (!vehiculoExiste || !sucursalExiste)
            {
                return Results.BadRequest("El vehículo o la sucursal especificada no existen.");
            }

            var mantencion = new Mantencion
            {
                IdVehiculo = dto.IdVehiculo,
                IdSucursal = dto.IdSucursal,
                FechaIngreso = dto.FechaIngreso,
                FechaSalida = dto.FechaSalida,
                Descripcion = dto.Descripcion,
                CostoManoObra = dto.CostoManoObra,
                CostoTotal = dto.CostoTotal
            };

            db.Mantencions.Add(mantencion);
            await db.SaveChangesAsync();

            var response = new MantencionResponseDto(
                mantencion.IdMantencion,
                mantencion.IdVehiculo,
                mantencion.IdSucursal,
                mantencion.FechaIngreso,
                mantencion.FechaSalida,
                mantencion.Descripcion,
                mantencion.CostoManoObra,
                mantencion.CostoTotal
            );

            return Results.Created($"/api/mantenciones/{mantencion.IdMantencion}", response);
        });

        // PUT: Actualizar mantención existente
        group.MapPut("/{id:int}", async (int id, UpdateMantencionDto dto, ConcesionariodbContext db) =>
        {
            var mantencion = await db.Mantencions.FindAsync(id);
            if (mantencion is null) return Results.NotFound();

            mantencion.FechaIngreso = dto.FechaIngreso;
            mantencion.FechaSalida = dto.FechaSalida;
            mantencion.Descripcion = dto.Descripcion;
            mantencion.CostoManoObra = dto.CostoManoObra;
            mantencion.CostoTotal = dto.CostoTotal;

            await db.SaveChangesAsync();
            return Results.NoContent();
        });

        // DELETE: Eliminar mantención
        group.MapDelete("/{id:int}", async (int id, ConcesionariodbContext db) =>
        {
            var mantencion = await db.Mantencions.FindAsync(id);
            if (mantencion is null) return Results.NotFound();

            db.Mantencions.Remove(mantencion);
            await db.SaveChangesAsync();

            return Results.NoContent();
        });
    }
}