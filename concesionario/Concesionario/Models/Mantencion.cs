using System;
using System.Collections.Generic;

namespace Concesionario.Models;

public partial class Mantencion
{
    public int IdMantencion { get; set; }

    public int IdVehiculo { get; set; }

    public int IdSucursal { get; set; }

    public DateOnly FechaIngreso { get; set; }

    public DateOnly? FechaSalida { get; set; }

    public string? Descripcion { get; set; }

    public decimal CostoManoObra { get; set; }

    public decimal CostoTotal { get; set; }

    public virtual Sucursal IdSucursalNavigation { get; set; } = null!;

    public virtual Vehiculo IdVehiculoNavigation { get; set; } = null!;

    public virtual ICollection<MantencionRepuesto> MantencionRepuestos { get; set; } = new List<MantencionRepuesto>();
}
