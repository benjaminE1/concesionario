using Concesionario.Models;
using Microsoft.EntityFrameworkCore;

namespace Concesionario.Endpoints
{
    public static class SucursalApi
    {
        public static void MapSucursalApi(this WebApplication app)
        {
            //asignamos la dirección api sucursal
            var sucursal = app.MapGroup("/api/sucursal").WithTags("Sucursal").RequireAuthorization(policy => policy.RequireRole("Admin"));

            //api para listar todos los sucursal 
            sucursal.MapGet("/", async (ConcesionariodbContext db) =>
                await db.Sucursals
                    .Select(s => new
                    {
                        s.IdSucursal,
                        s.Nombre,
                        s.Direccion,
                        s.Telefono,
                        s.Ciudad
                    })
                    .ToListAsync());
            //api para crear sucursal
            sucursal.MapPost("/", async (Sucursal sucursal, ConcesionariodbContext db) =>
            {
                db.Sucursals.Add(sucursal);
                await db.SaveChangesAsync();
                return Results.Created($"/api/combustible/{sucursal.IdSucursal}", sucursal);
            });

            sucursal.MapGet("/{id:int}", async (int id, ConcesionariodbContext db) =>
            {
                var sucursalEncontrado = await db.Sucursals
                    .Where(s => s.IdSucursal == id)
                    .Select(s => new
                    {
                        s.IdSucursal,
                        s.Nombre,
                        s.Direccion,
                        s.Telefono,
                        s.Ciudad
                    })
                    .FirstOrDefaultAsync();

                return sucursalEncontrado is null
                    ? Results.NotFound()
                    : Results.Ok(sucursalEncontrado);
            });

            // api para editar
            sucursal.MapPut("/{id:int}", async (int id, Sucursal s, ConcesionariodbContext db) =>
            {
                var exist = await db.Sucursals.FindAsync(id);

                if (exist == null)
                    return Results.NotFound();

                exist.Nombre = s.Nombre;
                exist.Direccion = s.Direccion;
                exist.Telefono = s.Telefono;
                exist.Ciudad = s.Ciudad;

                await db.SaveChangesAsync();

                return Results.Ok(exist);
            });

            // api para eliminar
            sucursal.MapDelete("/{id:int}", async (int id, ConcesionariodbContext db) =>
            {
                var exist = await db.Sucursals.FindAsync(id);
                if (exist == null) return Results.NotFound();

                db.Sucursals.Remove(exist);
                await db.SaveChangesAsync();
                return Results.NoContent();
            });
        }
    }
}
