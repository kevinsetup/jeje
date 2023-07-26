using backendpedidofigueri.Entity.Pedidos;
using backendpedidofigueri.Utilities;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Data.SqlClient;
using Microsoft.EntityFrameworkCore;
using System.Data;
using System.Security.Claims;
using System.Security.Cryptography;

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
        public async Task<ActionResult> GetPedidosByDate(DateTime fechaInicio, DateTime fechaFin)
        {
            var IdVendedor = ((ClaimsIdentity)User.Identity).FindAll(ClaimTypes.NameIdentifier).ToList()[4].Value;

            var result = await context.GetPedidos.FromSqlInterpolated($"Exec [dbo].[sp_obtener_pedidos_por_fecha] @FechaInicio={fechaInicio}, @FechaFin={fechaFin},@IdVendedor={IdVendedor}").ToListAsync();

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

        [HttpPost("SaveDetallePedidoProducto")]
        public async Task<ActionResult> SaveDetallePedidoProducto(List<DetallePedidoProducto> listDetallePedidoProducto=null)
        {
          
          //Datatable
          DataTable dataTable = new DataTable();
          var properties = typeof(DetallePedidoProducto).GetProperties();
          // Agregar las columnas al DataTable basado en las propiedades de DetallePedidoProducto
          foreach (var prop in properties)
          {
            dataTable.Columns.Add(prop.Name, Nullable.GetUnderlyingType(prop.PropertyType) ?? prop.PropertyType);
          }
          // Llenar el DataTable con los datos de la lista
          foreach (var item in listDetallePedidoProducto)
          {
            var row = dataTable.NewRow();
            foreach (var prop in properties)
            {
              row[prop.Name] = prop.GetValue(item) ?? DBNull.Value;
            }
            dataTable.Rows.Add(row);
          }
          // Pasar el DataTable como parámetro al procedimiento almacenado
          var param = new SqlParameter
          {
            ParameterName = "@listaDetallePedidoProducto",
            SqlDbType = SqlDbType.Structured,
            Value = dataTable,
            TypeName = "pedido.DetallePedidoProducto" // Reemplaza "TuTipoTabla" con el nombre correcto del tipo de tabla en la base de datos
          };
          var a =await context.DetallePedidoProducto.FromSqlInterpolated($"Exec [pedido].[SP_INSERT_DETALLEPEDIDOPRODUCTO] @listaDetallePedidoProducto={param}").ToListAsync();

          return StatusCode(200, new ItemResp
          {
            status = 200,
            message = status.DELETE,
            data = a
          });

        }
  }
}
