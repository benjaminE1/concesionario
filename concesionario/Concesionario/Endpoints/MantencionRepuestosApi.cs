using Concesionario.Models;
using Microsoft.EntityFrameworkCore;

namespace concesionario.Endpoints
{
    public static class MantencionRepuestoApi
    {
        public static void MapMantencionRepuestoApi(this WebApplication app)
        {
            var mantencionRepuestos = app.MapGroup("/api/mantencion-repuestos")
                .WithTags("Mantención Repuestos");

            // GET: Obtener todos los registros
            mantencionRepuestos.MapGet("/", async (ConcesionariodbContext db) =>
            {
                var listaMantencionRepuestos = await db.MantencionRepuestos.ToListAsync();

                return Results.Ok(listaMantencionRepuestos);
            })
            .WithName("GetMantencionRepuestos");

            // GET: Obtener registro por ID
            mantencionRepuestos.MapGet("/{id:int}", async (
                int id,
                ConcesionariodbContext db) =>
            {
                var mantencionRepuesto = await db.MantencionRepuestos.FindAsync(id);

                if (mantencionRepuesto is null)
                    return Results.NotFound("Registro de mantención-repuesto no encontrado");

                return Results.Ok(mantencionRepuesto);
            })
            .WithName("GetMantencionRepuestoById");

            // GET: Buscar repuestos utilizados en una mantención
            mantencionRepuestos.MapGet("/mantencion/{idMantencion:int}", async (
                int idMantencion,
                ConcesionariodbContext db) =>
            {
                var repuestos = await db.MantencionRepuestos
                    .Where(mr => mr.IdMantencion == idMantencion)
                    .ToListAsync();

                if (!repuestos.Any())
                    return Results.NotFound("No hay repuestos asociados a esa mantención");

                return Results.Ok(repuestos);
            })
            .WithName("GetRepuestosPorMantencion");

            // GET: Buscar mantenciones donde se utilizó un repuesto
            mantencionRepuestos.MapGet("/repuesto/{idRepuesto:int}", async (
                int idRepuesto,
                ConcesionariodbContext db) =>
            {
                var mantenciones = await db.MantencionRepuestos
                    .Where(mr => mr.IdRepuesto == idRepuesto)
                    .ToListAsync();

                if (!mantenciones.Any())
                    return Results.NotFound("No hay mantenciones asociadas a ese repuesto");

                return Results.Ok(mantenciones);
            })
            .WithName("GetMantencionesPorRepuesto");

            // POST: Crear nuevo registro
            mantencionRepuestos.MapPost("/", async (
                MantencionRepuesto mantencionRepuesto,
                ConcesionariodbContext db) =>
            {
                db.MantencionRepuestos.Add(mantencionRepuesto);

                await db.SaveChangesAsync();

                return Results.Created(
                    $"/api/mantencion-repuestos/{mantencionRepuesto.IdMantencionRepuesto}",
                    mantencionRepuesto);
            })
            .WithName("CreateMantencionRepuesto");

            // PUT: Actualizar registro
            mantencionRepuestos.MapPut("/{id:int}", async (
                int id,
                MantencionRepuesto mantencionRepuestoActualizado,
                ConcesionariodbContext db) =>
            {
                var mantencionRepuesto = await db.MantencionRepuestos.FindAsync(id);

                if (mantencionRepuesto is null)
                    return Results.NotFound("Registro de mantención-repuesto no encontrado");

                mantencionRepuesto.IdMantencion =
                    mantencionRepuestoActualizado.IdMantencion;

                mantencionRepuesto.IdRepuesto =
                    mantencionRepuestoActualizado.IdRepuesto;

                mantencionRepuesto.Cantidad =
                    mantencionRepuestoActualizado.Cantidad;

                mantencionRepuesto.PrecioUnitario =
                    mantencionRepuestoActualizado.PrecioUnitario;

                await db.SaveChangesAsync();

                return Results.Ok(mantencionRepuesto);
            })
            .WithName("UpdateMantencionRepuesto");

            // DELETE: Eliminar registro
            mantencionRepuestos.MapDelete("/{id:int}", async (
                int id,
                ConcesionariodbContext db) =>
            {
                var mantencionRepuesto =
                    await db.MantencionRepuestos.FindAsync(id);

                if (mantencionRepuesto is null)
                    return Results.NotFound("Registro de mantención-repuesto no encontrado");

                db.MantencionRepuestos.Remove(mantencionRepuesto);

                await db.SaveChangesAsync();

                return Results.NoContent();
            })
            .WithName("DeleteMantencionRepuesto");
        }
    }


}