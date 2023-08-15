using System.ComponentModel.DataAnnotations;

namespace backendpedidofigueri.Entity.Credito
{
    public class CajaCliente
    {
        [Key]
        public string? IdCliente { get; set; }
        public string? IdTienda { get; set; }
        public string? IdSector { get; set; }
        public string? Nombres { get; set; }
        public string? ApellidoPaterno { get; set; }

        public string? NombreEmpresa { get; set; }

        public string? Estado { get; set; }

        public double? SaldoCtaCte { get; set; }

        public double? Credito { get; set; }
        public decimal? CreditoUtilizado { get; set; }
   
        public decimal? CreditoRestante { get; set; }

        public string? Queja { get; set; }


        public int? Diascredito { get; set; }
        public int? NroDiasPedido { get; set; }


    }

    public class DiasInfoDto
    {
        [Key]
        public string? IdCliente { get; set; }

        public int? Diascredito { get; set; }
        public int? NroDiasPedido { get; set; }
    }
}
