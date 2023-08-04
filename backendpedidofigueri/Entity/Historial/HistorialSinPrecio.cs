using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System.ComponentModel.DataAnnotations;

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
        public string? Imagen { get; set; }
        public string? ultimos_pedidos { get; set; }

    }
}
