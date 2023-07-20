using Microsoft.EntityFrameworkCore.Metadata.Internal;
using System.ComponentModel.DataAnnotations;

namespace backendpedidofigueri.Entity.Rol.Permisos
{
    public class Permiso
    {

        [Key]
        public int? IdPermiso { get; set; }
        public string? NomPermiso { get; set; }
        public string? Logo { get; set; }

        public bool? Estado { get; set; }

    }
}
