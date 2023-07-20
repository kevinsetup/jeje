using Microsoft.EntityFrameworkCore.Metadata.Internal;
using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;

namespace backendpedidofigueri.Entity.Usuarios
{
    public class Usuario
    {
        [Key]
        public int IdUsuario { get; set; }

        public string? Login { get; set; }

        public string? Pass { get; set; }
        public string? TipoUsuario { get; set; }

        public string? IdTipo{ get; set; }


        public string? estado { get; set; }

        public int? IdRol{ get; set; }

    }
}
