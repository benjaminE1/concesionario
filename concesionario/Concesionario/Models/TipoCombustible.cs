using System;
using System.Collections.Generic;
using System.Text.Json.Serialization;

namespace Concesionario.Models;

public partial class TipoCombustible
{
    public int IdTipoCombustible { get; set; }

    public string Nombre { get; set; } = null!;

    [JsonIgnore] public virtual ICollection<Vehiculo> Vehiculos { get; set; } = new List<Vehiculo>();
}
