using System;
using System.Collections.Generic;
using System.Text.Json.Serialization;

namespace Concesionario.Models;

public partial class ArriendoVehiculo
{
    public int IdArriendo { get; set; }

    public int IdVehiculo { get; set; }

    public int IdCliente { get; set; }

    public int IdSucursal { get; set; }

    public DateOnly FechaInicio { get; set; }

    public DateOnly FechaFin { get; set; }

    public decimal MontoTotal { get; set; }

    public string? Estado { get; set; }
    [JsonIgnore]
    public virtual ICollection<Factura> Facturas { get; set; } = new List<Factura>();
    [JsonIgnore]
    public virtual Usuario IdClienteNavigation { get; set; } = null!;
    [JsonIgnore]
    public virtual Sucursal IdSucursalNavigation { get; set; } = null!;
    [JsonIgnore]
    public virtual Vehiculo IdVehiculoNavigation { get; set; } = null!;
}