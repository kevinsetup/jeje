using System.ComponentModel.DataAnnotations;

namespace backendpedidofigueri.Entity.DatosPersonales
{
    public class DatosPersonales
    {
        [Key]
        public int? idDatosPersonales { get; set; }
        public string? nombre { get; set; }
        public string? apellidoPaterno { get; set; }
        public string? apellidoMaterno { get; set; }
        public string? tipoDocumento { get; set; }
        public int? nCelular { get; set; }
        public string? email { get; set; }
        public string? nombreEmpresa { get; set; }



    }
}
