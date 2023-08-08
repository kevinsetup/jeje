using System.ComponentModel.DataAnnotations;

namespace backendpedidofigueri.Entity.Credito
{
    public class Cliente
    {
        [Key]
        public string? IdCliente { get; set; }
        public string? IdTienda { get; set; }
        public string? IdSector { get; set; }
        public string? NombreEmpresa { get; set; }
        public string? Direccion { get; set; }
        public string? Contacto { get; set; }
        public string? Estado { get; set; }
        public string? TipoCliente { get; set; }

    }
}
