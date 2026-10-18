using System;
using System.Collections.Generic;

namespace Concesionario.Models;

public partial class Factura
{
    public int IdFactura { get; set; }

    public string NumeroFactura { get; set; } = null!;

    public DateTime? FechaEmision { get; set; }

    public decimal Monto { get; set; }

    public int? IdVenta { get; set; }

    public int? IdArriendo { get; set; }

    public virtual ArriendoVehiculo? IdArriendoNavigation { get; set; }

    public virtual Ventum? IdVentaNavigation { get; set; }
}
