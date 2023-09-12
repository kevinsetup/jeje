using System.ComponentModel.DataAnnotations;

namespace backendpedidofigueri.Entity.Login
{
    public class Navigation
    {
        public string? NomModulo { get; set; }
        [Key]
        public string IdFuncion { get; set; }
        public string? NomFuncion { get; set; }
        public string? Pagina { get; set; }
        public int? IdModulo { get; set; }
        public string? Imagen { get; set; }
        public string? IdFuncionSuper { get; set; }
        public string? Ruta { get; set; }
        public string? Icon { get; set; }
    }
}
