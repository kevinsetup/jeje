using System.ComponentModel.DataAnnotations;

namespace backendpedidofigueri.Entity.Pedidos
{
    public class GetPedidosConfirmados
    {
        [Key]
        public int? IdRegistroPedido { get; set; }
        public DateTime? FechaPedido { get; set; }
        public DateTime? FechaEntrega { get; set; }
        public double? MontoTotal { get; set; }
        public string? NombreEmpresa { get; set; }
        public string? Apellidos { get; set; }
        public string? Nombres { get; set; }
        public string? Nota { get; set;  }
        public string? TipoPago { get; set; }
        public string? IdPedidoProducto { get; set; }
        public string? DescripcionEstadoPago { get; set; }
    }
}
