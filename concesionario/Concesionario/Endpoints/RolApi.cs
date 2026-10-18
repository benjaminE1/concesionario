using Concesionario.Models;
using Microsoft.EntityFrameworkCore;

namespace Concesionario.Endpoints
{
    public static class RolApi
    {
        public static void MapRolApi(this WebApplication app)
        {
            //asignamos la dirección api roles
            var rol = app.MapGroup("/api/rol").WithTags("Rol").RequireAuthorization(policy => policy.RequireRole("Admin"));
            //api para listar todos los roles 
            rol.MapGet("/", async (ConcesionariodbContext db) =>
                await db.Rols
                    .Select(r => new
                    {
                        r.IdRol,
                        r.Nombre
                    })
                    .ToListAsync());
            //api para crear rol
            rol.MapPost("/", async (Rol rol, ConcesionariodbContext db) =>
            {
                db.Rols.Add(rol);
                await db.SaveChangesAsync();
                return Results.Created($"/api/rol/{rol.IdRol}", rol);
            });

            rol.MapGet("/{id:int}", async (int id, ConcesionariodbContext db) =>
            {
                var rolEncontrado = await db.Rols
                    .Where(r => r.IdRol == id)
                    .Select(r => new
                    {
                        r.IdRol,
                        r.Nombre
                    })
                    .FirstOrDefaultAsync();

                return rolEncontrado is null
                    ? Results.NotFound()
                    : Results.Ok(rolEncontrado);
            });

            // api para editar
            rol.MapPut("/{id:int}", async (int id, Rol r, ConcesionariodbContext db) =>
            {
                //verificamos si existe el id buscado
                var exist = await db.Rols.FindAsync(id);
                if (exist == null) return Results.NotFound();

                exist.Nombre = r.Nombre;
                await db.SaveChangesAsync();
                return Results.Ok(exist);
            });
            // api para eliminar
            rol.MapDelete("/{id:int}", async (int id, ConcesionariodbContext db) =>
            {
                var exist = await db.Rols.FindAsync(id);
                if (exist == null) return Results.NotFound();

                db.Rols.Remove(exist);
                await db.SaveChangesAsync();
                return Results.NoContent();
            });
        }
    }
}
