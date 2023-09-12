using System.ComponentModel.DataAnnotations;

namespace backendpedidofigueri.Entity.Productos
{
    public class Producto
    {
        [Key]
        public string? IdProducto { get; set; }
		public string? DescripcionProducto { get; set; }
		public double? Valor_Unitario { get; set; }
		public string? Imagen { get; set; }
        public int? IdCatalogo { get; set; }
        public string? Descripcion { get; set; }
    }
}
