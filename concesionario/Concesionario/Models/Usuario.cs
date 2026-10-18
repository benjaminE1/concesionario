using System;
using System.Collections.Generic;

namespace Concesionario.Models;

public partial class Usuario
{
    public int IdUsuario { get; set; }

    public string Nombre { get; set; } = null!;

    public string Email { get; set; } = null!;

    public string Password { get; set; } = null!;

    public string? Telefono { get; set; }

    public int IdRol { get; set; }

    public virtual ICollection<ArriendoVehiculo> ArriendoVehiculos { get; set; } = new List<ArriendoVehiculo>();

    public virtual Rol IdRolNavigation { get; set; } = null!;

    public virtual ICollection<Ventum> VentumIdClienteNavigations { get; set; } = new List<Ventum>();

    public virtual ICollection<Ventum> VentumIdVendedorNavigations { get; set; } = new List<Ventum>();
}
