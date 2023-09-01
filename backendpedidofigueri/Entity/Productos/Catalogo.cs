using System.ComponentModel.DataAnnotations;

namespace backendpedidofigueri.Entity.Productos
{
    public class Catalogo
    {
        [Key]
        public int? IdCatalogo { get; set; }
        public string? IdProducto { get; set; }
        public string? Descripcion {get; set; }
        public string? Imagen { get; set; }
        public int? IdCatalogoGenerated { get; set; }
    }
}
