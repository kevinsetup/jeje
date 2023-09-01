using static System.Net.Mime.MediaTypeNames;

namespace backendpedidofigueri.Entity.Productos
{
    public class UpdateCatalogo
    {
        public int? IdCatalogo { get; set; }
        public string? Imagen { get; set; }
        public string? Descripcion { get; set; }
    }
}
