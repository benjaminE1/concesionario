using Concesionario.Models;
using Microsoft.EntityFrameworkCore;

namespace Concesionario.Endpoints
{
    public static class MarcaApi
    {
        public static void MapMarcaApi(this WebApplication app) 
        {
            var marca = app.MapGroup("/api/Marca").WithTags("Marca");
            //listar las marcas
            marca.MapGet("/", async (ConcesionariodbContext db) => await db.Marcas.ToListAsync());
            //crear las marcas
            marca.MapPost("/", async (Marca marca, ConcesionariodbContext db) =>
            {
                db.Marcas.Add(marca);
                await db.SaveChangesAsync();
                return Results.Created($"/api/Marca/{marca.IdMarca}", marca);
            }).RequireAuthorization(policy => policy.RequireRole("Admin"));
            marca.MapGet("/{id:int}", async (int id, ConcesionariodbContext db) =>
                await db.Marcas.FindAsync(id) is Marca m ? Results.Ok(m) : Results.NotFound());
            //editar las marcas
            marca.MapPut("/{id:int}", async (int id, Marca m, ConcesionariodbContext db) =>
            {
                //verificamos si existe el id buscado
                var exist = await db.Marcas.FindAsync(id);
                if (exist == null) return Results.NotFound();

                exist.Nombre = m.Nombre;
                await db.SaveChangesAsync();
                return Results.Ok(exist);
            }).RequireAuthorization(policy => policy.RequireRole("Admin"));
            //eliminar marcas
            marca.MapDelete("/{id:int}", async (int id, ConcesionariodbContext db) =>
            {
                var exist = await db.Marcas.FindAsync(id);
                if (exist == null) return Results.NotFound();

                db.Marcas.Remove(exist);
                await db.SaveChangesAsync();
                return Results.NoContent();
            }).RequireAuthorization(policy => policy.RequireRole("Admin"));

        }
    }
}
