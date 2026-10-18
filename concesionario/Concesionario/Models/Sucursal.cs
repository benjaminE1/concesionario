using System;
using System.Collections.Generic;
using System.Text.Json.Serialization;

namespace Concesionario.Models;

public partial class Sucursal
{
    public int IdSucursal { get; set; }

    public string Nombre { get; set; } = null!;

    public string Direccion { get; set; } = null!;

    public string? Telefono { get; set; }

    public string Ciudad { get; set; } = null!;

    [JsonIgnore] public virtual ICollection<ArriendoVehiculo> ArriendoVehiculos { get; set; } = new List<ArriendoVehiculo>();

    [JsonIgnore] public virtual ICollection<Mantencion> Mantencions { get; set; } = new List<Mantencion>();

    [JsonIgnore] public virtual ICollection<Repuesto> Repuestos { get; set; } = new List<Repuesto>();

    [JsonIgnore] public virtual ICollection<Vehiculo> Vehiculos { get; set; } = new List<Vehiculo>();

    [JsonIgnore] public virtual ICollection<Ventum> Venta { get; set; } = new List<Ventum>();
}
