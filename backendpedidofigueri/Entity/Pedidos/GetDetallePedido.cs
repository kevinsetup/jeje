using System.ComponentModel.DataAnnotations;

namespace backendpedidofigueri.Entity.Pedidos
{
    public class GetDetallePedido
    {
        [Key]
        public int? IdDetallePedido { get; set; }
        public string? IdProducto { get; set; }
        public string? DescripcionProducto { get; set; }
        public double? Precio { get; set; }
        public double? Cantidad { get; set; }
        public double? Resultado { get; set; }
        public string? ultimos_pedidos { get; set; }
    }
}
