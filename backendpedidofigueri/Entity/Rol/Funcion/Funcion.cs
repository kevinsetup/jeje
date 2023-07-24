using System.ComponentModel.DataAnnotations;

namespace backendpedidofigueri.Entity.Rol.Funcion
{
    public class Funcion
    {
       [Key]
        public string? IdFuncion { get; set; }
        public string? NomFuncion { get; set ; }
        public string? Pagina { get; set; }
        public string? IdModulo { get; set; }
        public string? Imagen { get; set; }
        public string? IdFuncionSuper { get; set; }
        public string? Ruta { get; set; }
        public string? Icon { get; set; }
        public string? NomModulo { get; set; }
    }
}
