using System.ComponentModel.DataAnnotations;

namespace backendpedidofigueri.Entity.Pedidos
{
    public class DetalleCheckout
    {
     
      //Set
      public string? direccion { get; set; }
      public string? tipoEntrega { get; set; }
      public string? tipoPago { get; set; }
      public int? idPedidoProducto { get; set; }
      //Get
      [Key]
      public int? IdDetallePedido { get; set; }
      public DateTime? fecha { get; set; }

  }
}
