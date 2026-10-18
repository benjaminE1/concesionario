using System;
using System.Collections.Generic;

namespace Concesionario.Models;

public partial class MantencionRepuesto
{
    public int IdMantencionRepuesto { get; set; }

    public int IdMantencion { get; set; }

    public int IdRepuesto { get; set; }

    public int Cantidad { get; set; }

    public decimal PrecioUnitario { get; set; }

    public virtual Mantencion IdMantencionNavigation { get; set; } = null!;

    public virtual Repuesto IdRepuestoNavigation { get; set; } = null!;
}
