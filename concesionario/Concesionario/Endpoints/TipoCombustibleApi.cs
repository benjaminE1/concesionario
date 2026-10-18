using Concesionario.Models;
using Microsoft.EntityFrameworkCore;

namespace Concesionario.Endpoints
{
    public static class TipoCombustibleApi
    {
        public static void MapCombustibleApi(this WebApplication app)
        {
            //asignamos la dirección api combustible
            var combustible = app.MapGroup("/api/combustible").WithTags("Combustible");
            //api para listar todos los combustibles 
            combustible.MapGet("/", async (ConcesionariodbContext db) =>
                await db.TipoCombustibles
                    .Select(c => new
                    {
                        c.IdTipoCombustible,
                        c.Nombre
                    })
                    .ToListAsync());
            //api para crear combustible
            combustible.MapPost("/", async (TipoCombustible combustible, ConcesionariodbContext db) =>
            {
                db.TipoCombustibles.Add(combustible);
                await db.SaveChangesAsync();
                return Results.Created($"/api/combustible/{combustible.IdTipoCombustible}", combustible);
            }).RequireAuthorization(policy => policy.RequireRole("Admin"));

            combustible.MapGet("/{id:int}", async (int id, ConcesionariodbContext db) =>
            {
                var combustibleEncontrado = await db.TipoCombustibles
                    .Where(c => c.IdTipoCombustible == id)
                    .Select(c => new
                    {
                        c.IdTipoCombustible,
                        c.Nombre
                    })
                    .FirstOrDefaultAsync();

                return combustibleEncontrado is null
                    ? Results.NotFound()
                    : Results.Ok(combustibleEncontrado);
            }).RequireAuthorization(policy => policy.RequireRole("Admin"));

            // api para editar
            combustible.MapPut("/{id:int}", async (int id, TipoCombustible c, ConcesionariodbContext db) =>
            {
                //verificamos si existe el id buscado
                var exist = await db.TipoCombustibles.FindAsync(id);
                if (exist == null) return Results.NotFound();

                exist.Nombre = c.Nombre;
                await db.SaveChangesAsync();
                return Results.Ok(exist);
            }).RequireAuthorization(policy => policy.RequireRole("Admin"));

            // api para eliminar
            combustible.MapDelete("/{id:int}", async (int id, ConcesionariodbContext db) =>
            {
                var exist = await db.TipoCombustibles.FindAsync(id);
                if (exist == null) return Results.NotFound();

                db.TipoCombustibles.Remove(exist);
                await db.SaveChangesAsync();
                return Results.NoContent();
            }).RequireAuthorization(policy => policy.RequireRole("Admin"));
        }
    }
}
