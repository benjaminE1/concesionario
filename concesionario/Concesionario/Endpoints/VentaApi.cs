using Concesionario.Dtos;
using Concesionario.Models;
using Microsoft.EntityFrameworkCore;
public static class VentaApi
{
    public static void MapVentaApi(this WebApplication app)
    {
        var venta = app.MapGroup("/api/venta").WithTags("Venta");

        // Listar ventas
        venta.MapGet("/", async (ConcesionariodbContext db) =>
            await db.Venta
                .Select(v => new
                {
                    v.IdVenta,
                    v.IdVehiculo,
                    v.IdCliente,
                    v.IdVendedor,
                    v.IdSucursal,
                    v.FechaVenta,
                    v.MontoTotal
                })
                .ToListAsync());

        // Obtener venta por ID
        venta.MapGet("/{id:int}", async (int id, ConcesionariodbContext db) =>
        {
            var ventaEncontrada = await db.Venta
                .Where(v => v.IdVenta == id)
                .Select(v => new
                {
                    v.IdVenta,
                    v.IdVehiculo,
                    v.IdCliente,
                    v.IdVendedor,
                    v.IdSucursal,
                    v.FechaVenta,
                    v.MontoTotal
                })
                .FirstOrDefaultAsync();

            return ventaEncontrada is null
                ? Results.NotFound()
                : Results.Ok(ventaEncontrada);
        });

        // Crear venta
        venta.MapPost("/", async (VentaRequest request, ConcesionariodbContext db) =>
        {
            var vehiculo = await db.Vehiculos.FindAsync(request.IdVehiculo);
            if (vehiculo == null)
                return Results.BadRequest("El vehículo no existe.");

            var cliente = await db.Usuarios.FindAsync(request.IdCliente);
            if (cliente == null)
                return Results.BadRequest("El cliente no existe.");

            var vendedor = await db.Usuarios.FindAsync(request.IdVendedor);
            if (vendedor == null)
                return Results.BadRequest("El vendedor no existe.");

            var sucursal = await db.Sucursals.FindAsync(request.IdSucursal);
            if (sucursal == null)
                return Results.BadRequest("La sucursal no existe.");

            var nuevaVenta = new Ventum
            {
                IdVehiculo = request.IdVehiculo,
                IdCliente = request.IdCliente,
                IdVendedor = request.IdVendedor,
                IdSucursal = request.IdSucursal,
                MontoTotal = request.MontoTotal
            };

            db.Venta.Add(nuevaVenta);
            await db.SaveChangesAsync();

            return Results.Created($"/api/venta/{nuevaVenta.IdVenta}", nuevaVenta);
        });
    }
}