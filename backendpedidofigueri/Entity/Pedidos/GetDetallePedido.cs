using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

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
        public string? ImagenRuta { get; set; }
        [NotMapped]
        public string? Imagen { get; set; }
        public Double? Cantidad1 { get; set; }
        public Double? Cantidad2 { get; set; }
        public Double? Cantidad3 { get; set; }
    }
}
