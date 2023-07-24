using System.ComponentModel.DataAnnotations;

namespace backendpedidofigueri.Entity.Usuarios
{
    public class UsuarioEdit
    {
    [Key]
    public string? tipoUsuario { get; set; }
    public string? distribuidor { get; set; }
    public string? contacto { get; set; }
    public string? vendedor { get; set; }
    public string? login { get; set; }
    public string? estado { get; set; }
    public string? nombres { get; set; }
    public string? apellidos { get; set; }


  }
}
