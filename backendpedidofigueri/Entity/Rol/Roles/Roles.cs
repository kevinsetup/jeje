using System.ComponentModel.DataAnnotations;

namespace backendpedidofigueri.Entity.Rol.Roles
{
    public class Roles
    {
        [Key]
        public int idRol { get; set; }
        public string desRol { get; set; }
        public int IdTipoUsuario { get; set; }
        public bool Estado { get; set; }

    }
}
