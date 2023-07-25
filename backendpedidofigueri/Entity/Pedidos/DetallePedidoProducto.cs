using System.ComponentModel.DataAnnotations;

namespace backendpedidofigueri.Entity.Pedidos
{
    public class DetallePedidoProducto
    {
      [Key]
      public int? IdDetallePedido { get; set; }

      [Required]
      public string IdProducto { get; set; }

      public string IdCliente { get; set; }

      public string IdTienda { get; set; }

      public double? Precio { get; set; }

      public double? Cantidad { get; set; }

      public double? Cantidad_Atendida { get; set; }

      public int? IdRegistroPedido { get; set; }
  }
}
