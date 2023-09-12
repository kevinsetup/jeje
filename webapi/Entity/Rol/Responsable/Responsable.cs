using System.ComponentModel.DataAnnotations;

namespace backendpedidofigueri.Entity.Rol.Responsable
{
    public class Responsable
    {
    [Key]
    public string? IdResponsable { get; set; }
    public string? Tipo_Cargo { get; set; }
    public int? IdNivel { get; set; }
    public string? Nombres { get; set; }
    public string? Apellidos { get; set; }
    public string? Direccion { get; set; }
    public string? Telefono { get; set; }
    public DateTime? FechaIngreso { get; set; }
    public DateTime? FechaNac { get; set; }
    public string? Login { get; set; }
    public string? Clave { get; set; }
    public string? Estado { get; set; }
    public string? fotografiaUrl { get; set; }
    public string? email { get; set; }


     
    }
}
