using System.ComponentModel.DataAnnotations;

namespace backendpedidofigueri.Entity.Rol.TipoUsuario
{
    public class TipoUsuario
    {
        [Key]
        public int? IdTipoUsuario { get; set; }
        public string? Nombre { get; set; }
    }
}
