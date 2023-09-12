using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace backendpedidofigueri.Entity.Historial
{
    public class HistorialSinPrecio
    {
        [Key]
        public string IdProducto { get; set; }
        public string? DescripcionProducto { get; set; }
        public string? IdPrecio { get; set; }
        public Double? ValorProducto { get; set; }
        public string? IdCliente { get; set; }
        [NotMapped]
        public string? Imagen { get; set; }
        public string? ImagenRuta { get; set; }
        public Double? Cantidad1 { get; set; }
        public Double? Cantidad2 { get; set; }
        public Double? Cantidad3 { get; set; }

    }
}
