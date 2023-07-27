using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System.ComponentModel.DataAnnotations;

namespace backendpedidofigueri.Entity.Credito
{
    public class Creditos
    {
        [Key]
        public string? IdCredito { get; set; }
        public string? IdVendedor { get; set; }
        public string? credito_incial { get; set; }
        public string? credito_utilizado { get; set; }
        public string? restante { get; set; }

    }
}
