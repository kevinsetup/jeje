using System.ComponentModel.DataAnnotations;

namespace backendpedidofigueri.Entity.Productos
{
    public class Producto
    {
        [Key]
        public string? IdProducto { get; set; }
		public string? Alias { get; set; }
        public string? IdCategoria { get; set; }
		public string? IdMedida { get; set; }
		public string? DescripcionProducto { get; set; }
		public int? TiempoDuracion { get; set; }
		public double? Stock { get; set; }
		public double? Valor_Unitario { get; set; }
		public string? Nota { get; set; }
		public double? Factor { get; set; }
		public string? Estado { get; set; }
		public int? Item { get; set; }
		public double? StockInicial { get; set; }
		public int? Vigente { get; set; }
    }
}
