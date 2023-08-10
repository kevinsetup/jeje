namespace backendpedidofigueri.Entity.Pedidos
{
    public class PedidoProducto
    {
      public int? IdRegistroPedido { get; set; }
                   
      public string? IdCliente { get; set; }
      public string? IdTienda { get; set; }
      public DateTime? FechaPedido { get; set; }
      public DateTime? FechaEntrega { get; set; }
      public double? Valor { get; set; }
      public double? IGV { get; set; }
      public double? MontoTotal { get; set; }
      public double? Descuento { get; set; }
      public string? Estado { get; set; }
      public string? IdTipoDoc { get; set; }
      public double? TotalEnviado { get; set; }
      public string? IdVendedor { get; set; }
      public DateTime? FechaRegistro { get; set; }
      public DateTime? HoraRegistro { get; set; }
      public string? Nota { get; set; }
      public string IP { get; set; }

  }
}
