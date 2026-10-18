using Concesionario.Models;
using Microsoft.EntityFrameworkCore;

namespace Concesionario.Endpoints
{
    public static class TipoVehiculoApi
    {
        public static void MapTipoVehiculoApi(this WebApplication app)
        {
            var tvehiculo = app.MapGroup("/api/TipoVehiculo").WithTags("TipoVehiculo");
            //listar tipo vehiculo
            tvehiculo.MapGet("/", async (ConcesionariodbContext db) => await db.TipoVehiculos.ToListAsync());
            //crear tipo vehiculo
            tvehiculo.MapPost("/", async (TipoVehiculo tvehiculo, ConcesionariodbContext db) =>
            {
                db.TipoVehiculos.Add(tvehiculo);
                await db.SaveChangesAsync();
                return Results.Created($"/api/TipoVehiculo/{tvehiculo.IdTipoVehiculo}", tvehiculo);
            }).RequireAuthorization(policy => policy.RequireRole("Admin"));
            tvehiculo.MapGet("/{id:int}", async (int id, ConcesionariodbContext db) =>
                await db.TipoVehiculos.FindAsync(id) is TipoVehiculo tv ? Results.Ok(tv) : Results.NotFound());
            //editar tipo vehiculo
            tvehiculo.MapPut("/{id:int}", async (int id, TipoVehiculo tv, ConcesionariodbContext db) =>
            {
                //verificamos si existe el id buscado
                var exist = await db.TipoVehiculos.FindAsync(id);
                if (exist == null) return Results.NotFound();

                exist.Nombre = tv.Nombre;
                await db.SaveChangesAsync();
                return Results.Ok(exist);
            }).RequireAuthorization(policy => policy.RequireRole("Admin"));
            //eliminar tipo vehiculo
            tvehiculo.MapDelete("/{id:int}", async (int id, ConcesionariodbContext db) =>
            {
                var exist = await db.TipoVehiculos.FindAsync(id);
                if (exist == null) return Results.NotFound();

                db.TipoVehiculos.Remove(exist);
                await db.SaveChangesAsync();
                return Results.NoContent();
            }).RequireAuthorization(policy => policy.RequireRole("Admin"));

        }
    }
}
