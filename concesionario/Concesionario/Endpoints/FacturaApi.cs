using Concesionario.Models;
using Microsoft.EntityFrameworkCore;

namespace concesionario.Endpoints
{
    public static class FacturaApi
    {
        public static void MapFacturaApi(this WebApplication app)
        {
            var facturas = app.MapGroup("/api/facturas")
                .WithTags("Facturas")
                .RequireAuthorization(policy => policy.RequireRole("Admin"));

            // GET: Obtener todas las facturas
            facturas.MapGet("/", async (ConcesionariodbContext db) =>
            {
                var listaFacturas = await db.Facturas.ToListAsync();

                return Results.Ok(listaFacturas);
            })
            .WithName("GetFacturas");

            // GET: Obtener factura por ID
            facturas.MapGet("/{id:int}", async (
                int id,
                ConcesionariodbContext db) =>
            {
                var factura = await db.Facturas.FindAsync(id);

                if (factura is null)
                    return Results.NotFound("Factura no encontrada");

                return Results.Ok(factura);
            })
            .WithName("GetFacturaById");

            // GET: Buscar facturas por venta
            facturas.MapGet("/venta/{idVenta:int}", async (
                int idVenta,
                ConcesionariodbContext db) =>
            {
                var facturasPorVenta = await db.Facturas
                    .Where(f => f.IdVenta == idVenta)
                    .ToListAsync();

                if (!facturasPorVenta.Any())
                    return Results.NotFound("No hay facturas asociadas a esa venta");

                return Results.Ok(facturasPorVenta);
            })
            .WithName("GetFacturasPorVenta");

            // GET: Buscar facturas por arriendo
            facturas.MapGet("/arriendo/{idArriendo:int}", async (
                int idArriendo,
                ConcesionariodbContext db) =>
            {
                var facturasPorArriendo = await db.Facturas
                    .Where(f => f.IdArriendo == idArriendo)
                    .ToListAsync();

                if (!facturasPorArriendo.Any())
                    return Results.NotFound("No hay facturas asociadas a ese arriendo");

                return Results.Ok(facturasPorArriendo);
            })
            .WithName("GetFacturasPorArriendo");

            // POST: Crear nueva factura
            facturas.MapPost("/", async (
                Factura factura,
                ConcesionariodbContext db) =>
            {
                db.Facturas.Add(factura);

                await db.SaveChangesAsync();

                return Results.Created(
                    $"/api/facturas/{factura.IdFactura}",
                    factura);
            })
            .WithName("CreateFactura");

            // PUT: Actualizar factura
            facturas.MapPut("/{id:int}", async (
                int id,
                Factura facturaActualizada,
                ConcesionariodbContext db) =>
            {
                var factura = await db.Facturas.FindAsync(id);

                if (factura is null)
                    return Results.NotFound("Factura no encontrada");

                factura.NumeroFactura = facturaActualizada.NumeroFactura;
                factura.FechaEmision = facturaActualizada.FechaEmision;
                factura.Monto = facturaActualizada.Monto;
                factura.IdVenta = facturaActualizada.IdVenta;
                factura.IdArriendo = facturaActualizada.IdArriendo;

                await db.SaveChangesAsync();

                return Results.Ok(factura);
            })
            .WithName("UpdateFactura");

            // DELETE: Eliminar factura
            facturas.MapDelete("/{id:int}", async (
                int id,
                ConcesionariodbContext db) =>
            {
                var factura = await db.Facturas.FindAsync(id);

                if (factura is null)
                    return Results.NotFound("Factura no encontrada");

                db.Facturas.Remove(factura);

                await db.SaveChangesAsync();

                return Results.NoContent();
            })
            .WithName("DeleteFactura");
        }
    }
}