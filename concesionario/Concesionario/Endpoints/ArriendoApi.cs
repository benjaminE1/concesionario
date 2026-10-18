using Concesionario.Models;
using Microsoft.EntityFrameworkCore;

namespace concesionario.Endpoints
{
    public static class ArriendoVehiculoApi
    {
        public static void MapArriendoVehiculoApi(this WebApplication app)
        {
            var arriendos = app.MapGroup("/api/arriendos")
                .WithTags("Arriendos");

            // GET: Obtener todos los arriendos
            arriendos.MapGet("/", async (ConcesionariodbContext db) =>
            {
                var listaArriendos = await db.ArriendoVehiculos.ToListAsync();

                return Results.Ok(listaArriendos);
            })
            .WithName("GetArriendos");

            // GET: Obtener arriendo por ID
            arriendos.MapGet("/{id:int}", async (
                int id,
                ConcesionariodbContext db) =>
            {
                var arriendo = await db.ArriendoVehiculos.FindAsync(id);

                if (arriendo is null)
                    return Results.NotFound("Arriendo no encontrado");

                return Results.Ok(arriendo);
            })
            .WithName("GetArriendoById");

            // GET: Buscar arriendos por vehículo
            arriendos.MapGet("/vehiculo/{idVehiculo:int}", async (
                int idVehiculo,
                ConcesionariodbContext db) =>
            {
                var arriendosPorVehiculo = await db.ArriendoVehiculos
                    .Where(a => a.IdVehiculo == idVehiculo)
                    .ToListAsync();

                if (!arriendosPorVehiculo.Any())
                    return Results.NotFound("No hay arriendos para ese vehículo");

                return Results.Ok(arriendosPorVehiculo);
            })
            .WithName("GetArriendosPorVehiculo");

            // GET: Buscar arriendos por cliente
            arriendos.MapGet("/cliente/{idCliente:int}", async (
                int idCliente,
                ConcesionariodbContext db) =>
            {
                var arriendosPorCliente = await db.ArriendoVehiculos
                    .Where(a => a.IdCliente == idCliente)
                    .ToListAsync();

                if (!arriendosPorCliente.Any())
                    return Results.NotFound("No hay arriendos para ese cliente");

                return Results.Ok(arriendosPorCliente);
            })
            .WithName("GetArriendosPorCliente");

            // GET: Buscar arriendos por sucursal
            arriendos.MapGet("/sucursal/{idSucursal:int}", async (
                int idSucursal,
                ConcesionariodbContext db) =>
            {
                var arriendosPorSucursal = await db.ArriendoVehiculos
                    .Where(a => a.IdSucursal == idSucursal)
                    .ToListAsync();

                if (!arriendosPorSucursal.Any())
                    return Results.NotFound("No hay arriendos en esa sucursal");

                return Results.Ok(arriendosPorSucursal);
            })
            .WithName("GetArriendosPorSucursal");

            // POST: Crear nuevo arriendo
            arriendos.MapPost("/", async (
                ArriendoVehiculo arriendo,
                ConcesionariodbContext db) =>
            {
                db.ArriendoVehiculos.Add(arriendo);

                await db.SaveChangesAsync();

                return Results.Created(
                    $"/api/arriendos/{arriendo.IdArriendo}",
                    arriendo);
            })
            .WithName("CreateArriendo");

            // PUT: Actualizar arriendo
            arriendos.MapPut("/{id:int}", async (
                int id,
                ArriendoVehiculo arriendoActualizado,
                ConcesionariodbContext db) =>
            {
                var arriendo = await db.ArriendoVehiculos.FindAsync(id);

                if (arriendo is null)
                    return Results.NotFound("Arriendo no encontrado");

                arriendo.IdVehiculo = arriendoActualizado.IdVehiculo;
                arriendo.IdCliente = arriendoActualizado.IdCliente;
                arriendo.IdSucursal = arriendoActualizado.IdSucursal;
                arriendo.FechaInicio = arriendoActualizado.FechaInicio;
                arriendo.FechaFin = arriendoActualizado.FechaFin;
                arriendo.MontoTotal = arriendoActualizado.MontoTotal;
                arriendo.Estado = arriendoActualizado.Estado;

                await db.SaveChangesAsync();

                return Results.Ok(arriendo);
            })
            .WithName("UpdateArriendo");

            // DELETE: Eliminar arriendo
            arriendos.MapDelete("/{id:int}", async (
                int id,
                ConcesionariodbContext db) =>
            {
                var arriendo = await db.ArriendoVehiculos.FindAsync(id);

                if (arriendo is null)
                    return Results.NotFound("Arriendo no encontrado");

                db.ArriendoVehiculos.Remove(arriendo);

                await db.SaveChangesAsync();

                return Results.NoContent();
            })
            .WithName("DeleteArriendo");
        }
    }
}