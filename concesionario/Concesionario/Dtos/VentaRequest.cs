namespace Concesionario.Dtos
{
    public class VentaRequest
    {
        public int IdVehiculo { get; set; }
        public int IdCliente { get; set; }
        public int IdVendedor { get; set; }
        public int IdSucursal { get; set; }
        public decimal MontoTotal { get; set; }
    }
}