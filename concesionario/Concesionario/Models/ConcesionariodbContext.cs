using System;
using System.Collections.Generic;
using Microsoft.EntityFrameworkCore;

namespace Concesionario.Models;

public partial class ConcesionariodbContext : DbContext
{
    public ConcesionariodbContext()
    {
    }

    public ConcesionariodbContext(DbContextOptions<ConcesionariodbContext> options)
        : base(options)
    {
    }

    public virtual DbSet<ArriendoVehiculo> ArriendoVehiculos { get; set; }

    public virtual DbSet<Factura> Facturas { get; set; }

    public virtual DbSet<Mantencion> Mantencions { get; set; }

    public virtual DbSet<MantencionRepuesto> MantencionRepuestos { get; set; }

    public virtual DbSet<Marca> Marcas { get; set; }

    public virtual DbSet<Repuesto> Repuestos { get; set; }

    public virtual DbSet<Rol> Rols { get; set; }

    public virtual DbSet<Sucursal> Sucursals { get; set; }

    public virtual DbSet<TipoCombustible> TipoCombustibles { get; set; }

    public virtual DbSet<TipoVehiculo> TipoVehiculos { get; set; }

    public virtual DbSet<Usuario> Usuarios { get; set; }

    public virtual DbSet<Vehiculo> Vehiculos { get; set; }

    public virtual DbSet<Ventum> Venta { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<ArriendoVehiculo>(entity =>
        {
            entity.HasKey(e => e.IdArriendo).HasName("PK__Arriendo__EF5139A93BEFBA55");

            entity.ToTable("ArriendoVehiculo");

            entity.Property(e => e.IdArriendo).HasColumnName("id_arriendo");
            entity.Property(e => e.Estado)
                .HasMaxLength(20)
                .IsUnicode(false)
                .HasDefaultValue("Activo")
                .HasColumnName("estado");
            entity.Property(e => e.FechaFin).HasColumnName("fecha_fin");
            entity.Property(e => e.FechaInicio).HasColumnName("fecha_inicio");
            entity.Property(e => e.IdCliente).HasColumnName("id_cliente");
            entity.Property(e => e.IdSucursal).HasColumnName("id_sucursal");
            entity.Property(e => e.IdVehiculo).HasColumnName("id_vehiculo");
            entity.Property(e => e.MontoTotal)
                .HasColumnType("decimal(10, 2)")
                .HasColumnName("monto_total");

            entity.HasOne(d => d.IdClienteNavigation).WithMany(p => p.ArriendoVehiculos)
                .HasForeignKey(d => d.IdCliente)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK__ArriendoV__id_cl__6754599E");

            entity.HasOne(d => d.IdSucursalNavigation).WithMany(p => p.ArriendoVehiculos)
                .HasForeignKey(d => d.IdSucursal)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK__ArriendoV__id_su__68487DD7");

            entity.HasOne(d => d.IdVehiculoNavigation).WithMany(p => p.ArriendoVehiculos)
                .HasForeignKey(d => d.IdVehiculo)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK__ArriendoV__id_ve__66603565");
        });

        modelBuilder.Entity<Factura>(entity =>
        {
            entity.HasKey(e => e.IdFactura).HasName("PK__Factura__6C08ED5303C81B71");

            entity.ToTable("Factura");

            entity.HasIndex(e => e.NumeroFactura, "UQ__Factura__3DC4B2416810592E").IsUnique();

            entity.Property(e => e.IdFactura).HasColumnName("id_factura");
            entity.Property(e => e.FechaEmision)
                .HasDefaultValueSql("(getdate())")
                .HasColumnType("datetime")
                .HasColumnName("fecha_emision");
            entity.Property(e => e.IdArriendo).HasColumnName("id_arriendo");
            entity.Property(e => e.IdVenta).HasColumnName("id_venta");
            entity.Property(e => e.Monto)
                .HasColumnType("decimal(12, 2)")
                .HasColumnName("monto");
            entity.Property(e => e.NumeroFactura)
                .HasMaxLength(50)
                .IsUnicode(false)
                .HasColumnName("numero_factura");

            entity.HasOne(d => d.IdArriendoNavigation).WithMany(p => p.Facturas)
                .HasForeignKey(d => d.IdArriendo)
                .HasConstraintName("FK__Factura__id_arri__6E01572D");

            entity.HasOne(d => d.IdVentaNavigation).WithMany(p => p.Facturas)
                .HasForeignKey(d => d.IdVenta)
                .HasConstraintName("FK__Factura__id_vent__6D0D32F4");
        });

        modelBuilder.Entity<Mantencion>(entity =>
        {
            entity.HasKey(e => e.IdMantencion).HasName("PK__Mantenci__7F79485EF0370709");

            entity.ToTable("Mantencion");

            entity.Property(e => e.IdMantencion).HasColumnName("id_mantencion");
            entity.Property(e => e.CostoManoObra)
                .HasColumnType("decimal(10, 2)")
                .HasColumnName("costo_mano_obra");
            entity.Property(e => e.CostoTotal)
                .HasColumnType("decimal(10, 2)")
                .HasColumnName("costo_total");
            entity.Property(e => e.Descripcion)
                .IsUnicode(false)
                .HasColumnName("descripcion");
            entity.Property(e => e.FechaIngreso).HasColumnName("fecha_ingreso");
            entity.Property(e => e.FechaSalida).HasColumnName("fecha_salida");
            entity.Property(e => e.IdSucursal).HasColumnName("id_sucursal");
            entity.Property(e => e.IdVehiculo).HasColumnName("id_vehiculo");

            entity.HasOne(d => d.IdSucursalNavigation).WithMany(p => p.Mantencions)
                .HasForeignKey(d => d.IdSucursal)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK__Mantencio__id_su__571DF1D5");

            entity.HasOne(d => d.IdVehiculoNavigation).WithMany(p => p.Mantencions)
                .HasForeignKey(d => d.IdVehiculo)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK__Mantencio__id_ve__5629CD9C");
        });

        modelBuilder.Entity<MantencionRepuesto>(entity =>
        {
            entity.HasKey(e => e.IdMantencionRepuesto).HasName("PK__Mantenci__B753677CA7EF03D2");

            entity.Property(e => e.IdMantencionRepuesto).HasColumnName("id_mantencion_repuesto");
            entity.Property(e => e.Cantidad)
                .HasDefaultValue(1)
                .HasColumnName("cantidad");
            entity.Property(e => e.IdMantencion).HasColumnName("id_mantencion");
            entity.Property(e => e.IdRepuesto).HasColumnName("id_repuesto");
            entity.Property(e => e.PrecioUnitario)
                .HasColumnType("decimal(10, 2)")
                .HasColumnName("precio_unitario");

            entity.HasOne(d => d.IdMantencionNavigation).WithMany(p => p.MantencionRepuestos)
                .HasForeignKey(d => d.IdMantencion)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK__Mantencio__id_ma__5AEE82B9");

            entity.HasOne(d => d.IdRepuestoNavigation).WithMany(p => p.MantencionRepuestos)
                .HasForeignKey(d => d.IdRepuesto)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK__Mantencio__id_re__5BE2A6F2");
        });

        modelBuilder.Entity<Marca>(entity =>
        {
            entity.HasKey(e => e.IdMarca).HasName("PK__Marca__7E43E99E972EB603");

            entity.ToTable("Marca");

            entity.HasIndex(e => e.Nombre, "UQ__Marca__72AFBCC6AFB28860").IsUnique();

            entity.Property(e => e.IdMarca).HasColumnName("id_marca");
            entity.Property(e => e.Nombre)
                .HasMaxLength(50)
                .IsUnicode(false)
                .HasColumnName("nombre");
        });

        modelBuilder.Entity<Repuesto>(entity =>
        {
            entity.HasKey(e => e.IdRepuesto).HasName("PK__Repuesto__9D97D13F9E224D67");

            entity.HasIndex(e => e.CodigoReferencia, "UQ__Repuesto__C8E6EEFA46902392").IsUnique();

            entity.Property(e => e.IdRepuesto).HasColumnName("id_repuesto");
            entity.Property(e => e.CodigoReferencia)
                .HasMaxLength(50)
                .IsUnicode(false)
                .HasColumnName("codigo_referencia");
            entity.Property(e => e.IdSucursal).HasColumnName("id_sucursal");
            entity.Property(e => e.Nombre)
                .HasMaxLength(100)
                .IsUnicode(false)
                .HasColumnName("nombre");
            entity.Property(e => e.Precio)
                .HasColumnType("decimal(10, 2)")
                .HasColumnName("precio");
            entity.Property(e => e.Stock).HasColumnName("stock");

            entity.HasOne(d => d.IdSucursalNavigation).WithMany(p => p.Repuestos)
                .HasForeignKey(d => d.IdSucursal)
                .HasConstraintName("FK__Repuestos__id_su__4AB81AF0");
        });

        modelBuilder.Entity<Rol>(entity =>
        {
            entity.HasKey(e => e.IdRol).HasName("PK__Rol__6ABCB5E03A7AF5BB");

            entity.ToTable("Rol");

            entity.HasIndex(e => e.Nombre, "UQ__Rol__72AFBCC6F810615D").IsUnique();

            entity.Property(e => e.IdRol).HasColumnName("id_rol");
            entity.Property(e => e.Nombre)
                .HasMaxLength(50)
                .IsUnicode(false)
                .HasColumnName("nombre");
        });

        modelBuilder.Entity<Sucursal>(entity =>
        {
            entity.HasKey(e => e.IdSucursal).HasName("PK__Sucursal__4C758013A988B997");

            entity.ToTable("Sucursal");

            entity.Property(e => e.IdSucursal).HasColumnName("id_sucursal");
            entity.Property(e => e.Ciudad)
                .HasMaxLength(50)
                .IsUnicode(false)
                .HasColumnName("ciudad");
            entity.Property(e => e.Direccion)
                .HasMaxLength(200)
                .IsUnicode(false)
                .HasColumnName("direccion");
            entity.Property(e => e.Nombre)
                .HasMaxLength(100)
                .IsUnicode(false)
                .HasColumnName("nombre");
            entity.Property(e => e.Telefono)
                .HasMaxLength(20)
                .IsUnicode(false)
                .HasColumnName("telefono");
        });

        modelBuilder.Entity<TipoCombustible>(entity =>
        {
            entity.HasKey(e => e.IdTipoCombustible).HasName("PK__TipoComb__CF05808D16B5516D");

            entity.ToTable("TipoCombustible");

            entity.HasIndex(e => e.Nombre, "UQ__TipoComb__72AFBCC6F8B56B52").IsUnique();

            entity.Property(e => e.IdTipoCombustible).HasColumnName("id_tipo_combustible");
            entity.Property(e => e.Nombre)
                .HasMaxLength(50)
                .IsUnicode(false)
                .HasColumnName("nombre");
        });

        modelBuilder.Entity<TipoVehiculo>(entity =>
        {
            entity.HasKey(e => e.IdTipoVehiculo).HasName("PK__TipoVehi__A9CE9989F91B0BFA");

            entity.ToTable("TipoVehiculo");

            entity.HasIndex(e => e.Nombre, "UQ__TipoVehi__72AFBCC6FFA80BB0").IsUnique();

            entity.Property(e => e.IdTipoVehiculo).HasColumnName("id_tipo_vehiculo");
            entity.Property(e => e.Nombre)
                .HasMaxLength(50)
                .IsUnicode(false)
                .HasColumnName("nombre");
        });

        modelBuilder.Entity<Usuario>(entity =>
        {
            entity.HasKey(e => e.IdUsuario).HasName("PK__Usuarios__4E3E04ADF395980E");

            entity.HasIndex(e => e.Email, "UQ__Usuarios__AB6E616486BE448D").IsUnique();

            entity.Property(e => e.IdUsuario).HasColumnName("id_usuario");
            entity.Property(e => e.Email)
                .HasMaxLength(100)
                .IsUnicode(false)
                .HasColumnName("email");
            entity.Property(e => e.IdRol).HasColumnName("id_rol");
            entity.Property(e => e.Nombre)
                .HasMaxLength(100)
                .IsUnicode(false)
                .HasColumnName("nombre");
            entity.Property(e => e.Password)
                .HasMaxLength(255)
                .IsUnicode(false)
                .HasColumnName("password");
            entity.Property(e => e.Telefono)
                .HasMaxLength(20)
                .IsUnicode(false)
                .HasColumnName("telefono");

            entity.HasOne(d => d.IdRolNavigation).WithMany(p => p.Usuarios)
                .HasForeignKey(d => d.IdRol)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK__Usuarios__id_rol__45F365D3");
        });

        modelBuilder.Entity<Vehiculo>(entity =>
        {
            entity.HasKey(e => e.IdVehiculo).HasName("PK__Vehiculo__F5DC0F391A516BA2");

            entity.ToTable("Vehiculo");

            entity.HasIndex(e => e.Patente, "UQ__Vehiculo__40228D086048C4C5").IsUnique();

            entity.Property(e => e.IdVehiculo).HasColumnName("id_vehiculo");
            entity.Property(e => e.Anio).HasColumnName("anio");
            entity.Property(e => e.Estado)
                .HasMaxLength(20)
                .IsUnicode(false)
                .HasDefaultValue("Disponible")
                .HasColumnName("estado");
            entity.Property(e => e.IdMarca).HasColumnName("id_marca");
            entity.Property(e => e.IdSucursal).HasColumnName("id_sucursal");
            entity.Property(e => e.IdTipoCombustible).HasColumnName("id_tipo_combustible");
            entity.Property(e => e.IdTipoVehiculo).HasColumnName("id_tipo_vehiculo");
            entity.Property(e => e.Modelo)
                .HasMaxLength(100)
                .IsUnicode(false)
                .HasColumnName("modelo");
            entity.Property(e => e.Patente)
                .HasMaxLength(10)
                .IsUnicode(false)
                .HasColumnName("patente");
            entity.Property(e => e.Precio)
                .HasColumnType("decimal(12, 2)")
                .HasColumnName("precio");

            entity.HasOne(d => d.IdMarcaNavigation).WithMany(p => p.Vehiculos)
                .HasForeignKey(d => d.IdMarca)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK__Vehiculo__id_mar__4F7CD00D");

            entity.HasOne(d => d.IdSucursalNavigation).WithMany(p => p.Vehiculos)
                .HasForeignKey(d => d.IdSucursal)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK__Vehiculo__id_suc__52593CB8");

            entity.HasOne(d => d.IdTipoCombustibleNavigation).WithMany(p => p.Vehiculos)
                .HasForeignKey(d => d.IdTipoCombustible)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK__Vehiculo__id_tip__5165187F");

            entity.HasOne(d => d.IdTipoVehiculoNavigation).WithMany(p => p.Vehiculos)
                .HasForeignKey(d => d.IdTipoVehiculo)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK__Vehiculo__id_tip__5070F446");
        });

        modelBuilder.Entity<Ventum>(entity =>
        {
            entity.HasKey(e => e.IdVenta).HasName("PK__Venta__459533BF1D504AB3");

            entity.Property(e => e.IdVenta).HasColumnName("id_venta");
            entity.Property(e => e.FechaVenta)
                .HasDefaultValueSql("(getdate())")
                .HasColumnType("datetime")
                .HasColumnName("fecha_venta");
            entity.Property(e => e.IdCliente).HasColumnName("id_cliente");
            entity.Property(e => e.IdSucursal).HasColumnName("id_sucursal");
            entity.Property(e => e.IdVehiculo).HasColumnName("id_vehiculo");
            entity.Property(e => e.IdVendedor).HasColumnName("id_vendedor");
            entity.Property(e => e.MontoTotal)
                .HasColumnType("decimal(12, 2)")
                .HasColumnName("monto_total");

            entity.HasOne(d => d.IdClienteNavigation).WithMany(p => p.VentumIdClienteNavigations)
                .HasForeignKey(d => d.IdCliente)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK__Venta__id_client__60A75C0F");

            entity.HasOne(d => d.IdSucursalNavigation).WithMany(p => p.Venta)
                .HasForeignKey(d => d.IdSucursal)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK__Venta__id_sucurs__628FA481");

            entity.HasOne(d => d.IdVehiculoNavigation).WithMany(p => p.Venta)
                .HasForeignKey(d => d.IdVehiculo)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK__Venta__id_vehicu__5FB337D6");

            entity.HasOne(d => d.IdVendedorNavigation).WithMany(p => p.VentumIdVendedorNavigations)
                .HasForeignKey(d => d.IdVendedor)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK__Venta__id_vended__619B8048");
        });

        OnModelCreatingPartial(modelBuilder);
    }

    partial void OnModelCreatingPartial(ModelBuilder modelBuilder);
}
