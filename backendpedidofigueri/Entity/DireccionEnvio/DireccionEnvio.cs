using System.ComponentModel.DataAnnotations;

namespace backendpedidofigueri.Entity.DireccionEnvio
{
    public class DireccionEnvio
    {
        [Key]
        public int? IdDireccionEnvio { get; set; }
        public string? Direccion { get; set; }
        public string? IdCliente { get; set; }
    }
}
