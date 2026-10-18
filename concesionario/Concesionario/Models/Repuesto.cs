using System;
using System.Collections.Generic;

namespace Concesionario.Models;

public partial class Repuesto
{
    public int IdRepuesto { get; set; }

    public string Nombre { get; set; } = null!;

    public string? CodigoReferencia { get; set; }

    public decimal Precio { get; set; }

    public int Stock { get; set; }

    public int? IdSucursal { get; set; }

    public virtual Sucursal? IdSucursalNavigation { get; set; }

    public virtual ICollection<MantencionRepuesto> MantencionRepuestos { get; set; } = new List<MantencionRepuesto>();
}