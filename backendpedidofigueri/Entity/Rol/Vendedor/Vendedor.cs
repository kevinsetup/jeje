using System.ComponentModel.DataAnnotations;

namespace backendpedidofigueri.Entity.Rol.Vendedor
{
    public class Vendedor
    {

    [Key]
    public string? IdVendedor { get; set; }
    public string? Apellidos { get; set; }
    public string? Nombres { get; set; }
    public string? Telefono { get; set; }
    public string? Direccion { get; set; }
    public string? IdCliente { get; set; }

  }
}
