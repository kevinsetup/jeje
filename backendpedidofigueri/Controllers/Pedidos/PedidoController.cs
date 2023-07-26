using backendpedidofigueri.Entity.Pedidos;
using backendpedidofigueri.Utilities;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Data.SqlClient;
using Microsoft.EntityFrameworkCore;
using System.Data;
using System.Security.Claims;
using System.Drawing;
using System.Security.Cryptography;


public class SavePedido
{
  public PedidoProducto? pedidoProducto { get; set; }
  public List<DetallePedidoProducto>? listDetallePedidoProducto { get; set; } 
}

namespace backendpedidofigueri.Controllers.Pedidos
{
    [Route("api/[controller]")]
    [ApiController]
    public class PedidoController : ControllerBase
    {
        private DbContextS context;
        private Status status = new Status();
        private readonly IConfiguration configuration;
        public PedidoController(DbContextS _context, IConfiguration _configuration)
        {
          context = _context;
          configuration = _configuration;
        }

        [HttpGet("GetPedidosByDate")]
        public async Task<ActionResult> GetPedidosByDate(DateTime fechaInicio, DateTime fechaFin, bool hasPermission)
        {
            var IdVendedor = ((ClaimsIdentity)User.Identity).FindAll(ClaimTypes.NameIdentifier).ToList()[4].Value;

            var result = await context.GetPedidos.FromSqlInterpolated($"Exec [dbo].[sp_obtener_pedidos_por_fecha] @FechaInicio={fechaInicio}, @FechaFin={fechaFin},@IdVendedor={IdVendedor}, @PermisoVerMontoTotal={hasPermission} ").ToListAsync();

            return StatusCode(200, new ItemResp
            {
                status = 200,
                message = status.CREATE,
                data = result
            });
        }

        [HttpGet("GetDetallePedido")]
        public async Task<ActionResult> GetDetallePedido(string IdRegistroPedido)
        {
            var result = await context.GetDetallePedido.FromSqlInterpolated($"Exec [pedido].[sp_obtener_detalle_pedido_por_id] @IdRegistroPedido={IdRegistroPedido}").ToListAsync();

            return StatusCode(200, new ItemResp
            {
                status = 200,
                message = status.CREATE,
                data = result
            });
        }

     
        [HttpPost("SavePedidoAndDetalleProducto")]
        public async Task<ActionResult> SavePedidoAndDetalleProducto(SavePedido savepedido)
        {
          MapClassDatatable _map = new MapClassDatatable();
          //Datatable
          DataTable dataTable = _map.MapClassToDataTable(savepedido.listDetallePedidoProducto);
          // Pasar el DataTable como parámetro al procedimiento almacenado
          var param = new SqlParameter
          {
            ParameterName = "@listaDetallePedidoProducto",
            SqlDbType = SqlDbType.Structured,
            Value = dataTable,
            TypeName = "pedido.DetallePedidoProducto" // Reemplaza "TuTipoTabla" con el nombre correcto del tipo de tabla en la base de datos
          };
          var a =await context.Database.ExecuteSqlInterpolatedAsync($"Exec [pedido].[SP_INSERT_DETALLEPEDIDOPRODUCTO] @listaDetallePedidoProducto={param},@idCliente ={ savepedido.pedidoProducto.IdCliente },@idTienda ={ savepedido.pedidoProducto.IdTienda }, @FechaPedido ={ savepedido.pedidoProducto.FechaPedido },@FechaEntrega ={ savepedido.pedidoProducto.FechaEntrega }, @valor ={ savepedido.pedidoProducto.Valor },@IGV = { savepedido.pedidoProducto.IGV },@MontoTotal = { savepedido.pedidoProducto.MontoTotal },@Descuento = { savepedido.pedidoProducto.Descuento },@Estado = { savepedido.pedidoProducto.Estado }, @IdTipoDoc ={ savepedido.pedidoProducto.IdTipoDoc }, @TotalEnviado ={ savepedido.pedidoProducto.TotalEnviado },@IdVendedor = { savepedido.pedidoProducto.IdVendedor },  @FechaRegistro ={ savepedido.pedidoProducto.FechaRegistro }, @HoraRegistro ={ savepedido.pedidoProducto.HoraRegistro }, @Nota ={ savepedido.pedidoProducto.Nota }");


          return StatusCode(200, new ItemResp
          {
            status = 200,
            message = status.CONFIRM,
            data = a
          });

        }
  }
}
