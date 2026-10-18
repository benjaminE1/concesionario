using Concesionario.Models;
using Microsoft.EntityFrameworkCore;

namespace Concesionario.Endpoints
{
    public static class RepuestoApi
    {
        public static void MapRepuestoApi(this WebApplication app)
        {
            // Agrupar todas las rutas de repuestos bajo /api/repuestos
            var repuestos = app.MapGroup("/api/repuestos")
                .WithTags("Repuestos");


            // GET: Obtener todos los repuestos
            repuestos.MapGet("/", async (ConcesionariodbContext db) =>
            {
                var listaRepuestos = await db.Repuestos.ToListAsync();

                return Results.Ok(listaRepuestos);
            })
            .WithName("GetRepuestos");

            // GET: Obtener repuesto por ID
            repuestos.MapGet("/{id:int}", async (int id, ConcesionariodbContext db) =>
            {
                var repuesto = await db.Repuestos.FindAsync(id);

                if (repuesto is null)
                    return Results.NotFound("Repuesto no encontrado");

                return Results.Ok(repuesto);
            })
            .WithName("GetRepuestoById");

            // GET: Buscar repuestos por sucursal
            repuestos.MapGet("/sucursal/{idSucursal:int}", async (
                int idSucursal,
                ConcesionariodbContext db) =>
            {
                var repuestosPorSucursal = await db.Repuestos
                    .Where(r => r.IdSucursal == idSucursal)
                    .ToListAsync();

                if (!repuestosPorSucursal.Any())
                    return Results.NotFound("No hay repuestos en esa sucursal");

                return Results.Ok(repuestosPorSucursal);
            })
            .WithName("GetRepuestosPorSucursal");

            // POST: Crear nuevo repuesto (solo admin)
            repuestos.MapPost("/", async (
                Repuesto repuesto,
                ConcesionariodbContext db) =>
            {
                db.Repuestos.Add(repuesto);

                await db.SaveChangesAsync();

                return Results.Created(
                    $"/api/repuestos/{repuesto.IdRepuesto}",
                    repuesto);
            })
            .WithName("CreateRepuesto");


            // PUT: Actualizar repuesto (solo admin)
            repuestos.MapPut("/{id:int}", async (
                int id,
                Repuesto repuestoActualizado,
                ConcesionariodbContext db) =>
            {
                var repuesto = await db.Repuestos.FindAsync(id);

                if (repuesto is null)
                    return Results.NotFound("Repuesto no encontrado");

                repuesto.Nombre = repuestoActualizado.Nombre;
                repuesto.CodigoReferencia = repuestoActualizado.CodigoReferencia;
                repuesto.Precio = repuestoActualizado.Precio;
                repuesto.Stock = repuestoActualizado.Stock;
                repuesto.IdSucursal = repuestoActualizado.IdSucursal;

                await db.SaveChangesAsync();

                return Results.Ok(repuesto);
            })
            .WithName("UpdateRepuesto");


            // DELETE: Eliminar repuesto (solo admin)
            repuestos.MapDelete("/{id:int}", async (
                int id,
                ConcesionariodbContext db) =>
            {
                var repuesto = await db.Repuestos.FindAsync(id);

                if (repuesto is null)
                    return Results.NotFound("Repuesto no encontrado");

                db.Repuestos.Remove(repuesto);

                await db.SaveChangesAsync();

                return Results.NoContent();
            })
            .WithName("DeleteRepuesto");

        }
    }
}
