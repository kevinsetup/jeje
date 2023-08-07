using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System.ComponentModel.DataAnnotations;

namespace backendpedidofigueri.Entity.Credito
{
    public class Creditos
    {
        [Key]
        public int? IdCredito { get; set; }
        public string? IdCliente { get; set; }
        public string? credito_inicial { get; set; }
        public string? credito_utilizado { get; set; }
        public string? restante { get; set; }
        public string? IdVendedor { get; set; }
        public DateTime? FechaInsercion { get; set; }
        //public long? RowNum { get; set; }
        public string? Nombres { get; set; }
        public string? Apellidos { get; set; }



    }
}
