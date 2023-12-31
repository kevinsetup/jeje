﻿using backendpedidofigueri.Entity.Pedidos;
using backendpedidofigueri.Utilities;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Data.SqlClient;
using Microsoft.EntityFrameworkCore;
using System.Data;
using System.Security.Claims;
using System.Drawing;
using System.Security.Cryptography;
using System.Collections;
using Microsoft.AspNetCore.Authorization;
using backendpedidofigueri.Entity.Rol.Vendedor;
using backendpedidofigueri.Entity.Credito;
using Newtonsoft.Json.Linq;
using Microsoft.AspNetCore.Hosting;

public class SavePedido
{
    public PedidoProducto? pedidoProducto { get; set; }
    public List<DetallePedidoProducto>? listDetallePedidoProducto { get; set; }
}

namespace backendpedidofigueri.Controllers.Pedidos
{
    [Authorize]

    [Route("api/[controller]")]
    [ApiController]
    public class PedidoController : ControllerBase
    {
        private DbContextS context;
        private Status status = new Status();
        private readonly IConfiguration configuration;
        private IWebHostEnvironment webHostEnvironment;

        public PedidoController(DbContextS _context, IConfiguration _configuration, IWebHostEnvironment _webHostEnvironment)
        {
            context = _context;
            configuration = _configuration;
            webHostEnvironment = _webHostEnvironment;

        }
        public class DatosCombinados
        {
            public DetalleCheckout DetalleCheckout { get; set; }
            public SavePedido SavePedido { get; set; }
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


        [HttpGet("GetPedidoById")]
        public async Task<ActionResult> GetPedidoById(int id, bool hasPermission)
        {
            var result = await context.GetPedidos.FromSqlInterpolated($"Exec [dbo].[SP_GET_PEDIDO_BY_ID] @IdRegistroPedido={id}, @PermisoVerMonto={hasPermission}").ToListAsync();

            return StatusCode(200, new ItemResp
            {
                status = 200,
                message = status.CREATE,
                data = result
            });
        }

        [HttpGet("GetDetallePedido")]
        public async Task<ActionResult> GetDetallePedido(string IdRegistroPedido, bool hasPermission)
        {
            var result = await context.GetDetallePedido.FromSqlInterpolated($"Exec [pedido].[sp_obtener_detalle_pedido_por_id] @IdRegistroPedido={IdRegistroPedido}, @PermisoVerMonto={hasPermission}").ToListAsync();
            result.ForEach(x =>
            {
                if(x.ImagenRuta != null)
                {
                    x.Imagen = "data:image/jpg;base64," + Convert.ToBase64String(System.IO.File.ReadAllBytes(webHostEnvironment.WebRootPath + x.ImagenRuta));

                }
            });


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
            var IdCliente = ((ClaimsIdentity)User.Identity).FindAll(ClaimTypes.NameIdentifier).ToList()[3].Value;
            var IdVendedor = ((ClaimsIdentity)User.Identity).FindAll(ClaimTypes.NameIdentifier).ToList()[4].Value;
            savepedido.pedidoProducto.IdVendedor = IdVendedor;
            savepedido.pedidoProducto.IdCliente = IdCliente;

            double total = 0;
            foreach (DetallePedidoProducto item in savepedido.listDetallePedidoProducto)
            {
                item.IdCliente = IdCliente;
                var returnValue = new SqlParameter("@precio", SqlDbType.Float)
                {
                    Direction = ParameterDirection.Output
                };

                await context.Database.ExecuteSqlInterpolatedAsync($"Exec [pedido].[SP_GET_PRICE_BY_PRODUCT] @idCliente={IdCliente}, @idProducto={item.IdProducto}, @precio={returnValue} Output");
                var price = returnValue.Value;
                item.Precio = (double?)price;
                total = (double)(total + ((double?)price * item.Cantidad));

            }
            savepedido.pedidoProducto.MontoTotal = total;
            double creditoInicial = 0;
            double creditoUtilizado = 0;
            double creditoRestante = 0;
            //var creditoParams = new SqlParameter("@IdCliente", SqlDbType.Int)
            //{
            //    Value = IdCliente
            //};

            //var creditoQuery = await context.Credito
            //    .FromSqlInterpolated($"EXEC pedido.sp_obtener_creditos_por_vendedor @IdCliente= {IdCliente}")
            //    .ToListAsync();

            //if (creditoQuery.Count == 0)
            //{
            //    return StatusCode(404, new ItemResp
            //    {
            //        status = 404,
            //        message = "No se encontró el crédito para el vendedor especificado.",
            //        data = null
            //    });
            //}
            //var credito = creditoQuery[0];

            //if (!double.TryParse(credito.credito_inicial, out creditoInicial))
            //{
            //    return StatusCode(500, new ItemResp
            //    {
            //        status = 500,
            //        message = "Error al convertir el crédito inicial a valor numérico.",
            //        data = null
            //    });
            //}

            //if (!double.TryParse(credito.credito_utilizado, out creditoUtilizado))
            //{
            //    return StatusCode(500, new ItemResp
            //    {
            //        status = 500,
            //        message = "Error al convertir el crédito utilizado a valor numérico.",
            //        data = null
            //    });
            //}
            //if (!double.TryParse(credito.restante, out creditoRestante))
            //{
            //    return StatusCode(500, new ItemResp
            //    {
            //        status = 500,
            //        message = "Error al convertir el crédito restante a valor numérico.",
            //        data = null
            //    });
            //}
            double montoTotal = savepedido.pedidoProducto.MontoTotal ?? 0.0; // Convertir MontoTotal a double

            //if (montoTotal > creditoInicial)
            //{
            //    return StatusCode(400, new ItemResp
            //    {
            //        status = 400,
            //        message = "El monto total excede el crédito inicial del vendedor.",
            //        data = null
            //    });
            //}

            //if (montoTotal > creditoRestante)
            //{
            //    return StatusCode(400, new ItemResp
            //    {
            //        status = 400,
            //        message = "El monto total excede el crédito restante del vendedor.",
            //        data = null
            //    });
            //}

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
            var idValue = new SqlParameter("@Id", SqlDbType.Int)
            {
                Direction = ParameterDirection.Output
            };
            //await context.Database.ExecuteSqlInterpolatedAsync($"Exec pedido.sp_actualizar_creditos_por_vendedor @idCliente = {IdCliente}, @IdVendedor = {IdVendedor}, @CreditoUtilizado = {montoTotal}");
            var a = await context.Database.ExecuteSqlInterpolatedAsync($"Exec [pedido].[SP_INSERT_DETALLEPEDIDOPRODUCTO] @listaDetallePedidoProducto={param},@idCliente ={savepedido.pedidoProducto.IdCliente},@idTienda ={savepedido.pedidoProducto.IdTienda}, @FechaPedido ={savepedido.pedidoProducto.FechaPedido},@FechaEntrega ={savepedido.pedidoProducto.FechaEntrega}, @valor ={savepedido.pedidoProducto.Valor},@IGV = {savepedido.pedidoProducto.IGV},@MontoTotal = {montoTotal},@Descuento = {savepedido.pedidoProducto.Descuento},@Estado = {savepedido.pedidoProducto.Estado}, @IdTipoDoc ={savepedido.pedidoProducto.IdTipoDoc}, @TotalEnviado ={savepedido.pedidoProducto.TotalEnviado},@IdVendedor = {savepedido.pedidoProducto.IdVendedor}, @FechaRegistro ={savepedido.pedidoProducto.FechaRegistro}, @HoraRegistro ={savepedido.pedidoProducto.HoraRegistro}, @Nota ={savepedido.pedidoProducto.Nota},  @Id={idValue} Output");

            return StatusCode(200, new ItemResp
            {
                status = 200,
                message = status.CONFIRM,
                data = idValue.Value
            });
        }

        [HttpPost("GetAvailability")]
        public async Task<ActionResult> GetAvailability(SavePedido savepedido)
        {
            var IdCliente = ((ClaimsIdentity)User.Identity).FindAll(ClaimTypes.NameIdentifier).ToList()[3].Value;
            var IdVendedor = ((ClaimsIdentity)User.Identity).FindAll(ClaimTypes.NameIdentifier).ToList()[4].Value;
            savepedido.pedidoProducto.IdVendedor = IdVendedor;
            savepedido.pedidoProducto.IdCliente = IdCliente;

            double total = 0;
            foreach (DetallePedidoProducto item in savepedido.listDetallePedidoProducto)
            {
                item.IdCliente = IdCliente;
                var returnValue = new SqlParameter("@precio", SqlDbType.Float)
                {
                    Direction = ParameterDirection.Output
                };

                await context.Database.ExecuteSqlInterpolatedAsync($"Exec [pedido].[SP_GET_PRICE_BY_PRODUCT] @idCliente={IdCliente}, @idProducto={item.IdProducto}, @precio={returnValue} Output");
                var price = returnValue.Value;
                item.Precio = (double?)price;
                total = (double)(total + ((double?)price * item.Cantidad));
            }
            savepedido.pedidoProducto.MontoTotal = total;

            var creditoQuery = await context.CajaCliente
                .FromSqlInterpolated($"EXEC pedido.sp_obtener_creditos_por_cliente @IdCliente= {IdCliente}")
                .ToListAsync();

            if (creditoQuery.Count == 0)
            {
                return StatusCode(404, new ItemResp
                {
                    status = 404,
                    message = "No se encontró el crédito para el vendedor especificado.",
                    data = null
                });
            }
            var credito = creditoQuery[0];

            // Obtener los valores de crédito
            var creditoInicial = credito.Credito;
            var creditoUtilizado = credito.CreditoUtilizado;
            var creditoRestante = credito.CreditoRestante;
            double montoTotal = savepedido.pedidoProducto.MontoTotal.HasValue ? savepedido.pedidoProducto.MontoTotal.Value : 0.0;

            bool isAvailable = (decimal)montoTotal <= (decimal)creditoRestante && (decimal)montoTotal <= (decimal)creditoInicial;

            // Construir objeto de respuesta
            var response = new
            {
                MontoTotal = montoTotal,
                CreditoInicial = creditoInicial,
                CreditoUtilizado = creditoUtilizado,
                CreditoRestante = creditoRestante,
                IsAvailable = isAvailable
            };

            return StatusCode(200, new ItemResp
            {
                status = 200,
                message = status.CONFIRM,
                data = response
            });
        }



        [HttpPut("EditPedidoAndDetalleProducto")]
        public async Task<ActionResult> EditPedidoAndDetalleProducto(SavePedido savepedido)
        {

            var IdCliente = ((ClaimsIdentity)User.Identity).FindAll(ClaimTypes.NameIdentifier).ToList()[3].Value;

            MapClassDatatable _map = new MapClassDatatable();
            //Datatable
            // Pasar el DataTable como parámetro al procedimiento almacenado
            double total = 0;
            foreach (DetallePedidoProducto item in savepedido.listDetallePedidoProducto)
            {
                item.IdCliente = IdCliente;

                var returnValue = new SqlParameter("@precio", SqlDbType.Float)
                {
                    Direction = ParameterDirection.Output
                };

                await context.Database.ExecuteSqlInterpolatedAsync($"Exec [pedido].[SP_GET_PRICE_BY_PRODUCT] @idCliente={IdCliente}, @idProducto={item.IdProducto}, @precio={returnValue} Output");
                var price = returnValue.Value;
                item.Precio = (double?)price;
                total = (double)(total + ((double?)price * item.Cantidad));
            }
            savepedido.pedidoProducto.MontoTotal = total;

            DataTable dataTable = _map.MapClassToDataTable(savepedido.listDetallePedidoProducto);

            var param = new SqlParameter
            {
                ParameterName = "@listaDetallePedidoProducto",
                SqlDbType = SqlDbType.Structured,
                Value = dataTable,
                TypeName = "pedido.DetallePedidoProducto" // Reemplaza "TuTipoTabla" con el nombre correcto del tipo de tabla en la base de datos
            };
            var a = await context.Database.ExecuteSqlInterpolatedAsync($"Exec [pedido].[SP_UPDATE_DETALLEPEDIDOPRODUCTO] @listaDetallePedidoProducto={param},@IdRegistroPedido = {savepedido.pedidoProducto.IdRegistroPedido},@FechaEntrega = {savepedido.pedidoProducto.FechaEntrega}, @MontoTotal = {savepedido.pedidoProducto.MontoTotal},@Nota = {savepedido.pedidoProducto.Nota}");
            return StatusCode(200, new ItemResp
            {
                status = 200,
                message = status.CONFIRM,
                data = a
            });

        }
        [HttpPost("SaveCkeckoutUpdatePedido")]
        public async Task<ActionResult> SaveCkeckoutAndUpdatePedido([FromBody] DatosCombinados datosCombinados)
        {
            try
            {
                var IdCliente = ((ClaimsIdentity)User.Identity).FindAll(ClaimTypes.NameIdentifier).ToList()[3].Value;
                var IdVendedor = ((ClaimsIdentity)User.Identity).FindAll(ClaimTypes.NameIdentifier).ToList()[4].Value;
                var detalleCheckout = datosCombinados.DetalleCheckout;
                var savepedido = datosCombinados.SavePedido;
                savepedido.pedidoProducto.IdVendedor = IdVendedor;
                savepedido.pedidoProducto.IdCliente = IdCliente;

                // Rest of your existing code...

                double total = 0;
                foreach (DetallePedidoProducto item in savepedido.listDetallePedidoProducto)
                {
                    item.IdCliente = IdCliente;
                    var returnValue = new SqlParameter("@precio", SqlDbType.Float)
                    {
                        Direction = ParameterDirection.Output
                    };

                    await context.Database.ExecuteSqlInterpolatedAsync($"Exec [pedido].[SP_GET_PRICE_BY_PRODUCT] @idCliente={IdCliente}, @idProducto={item.IdProducto}, @precio={returnValue} Output");
                    var price = returnValue.Value;
                    item.Precio = (double?)price;
                    total = (double)(total + ((double?)price * item.Cantidad));
                }
                savepedido.pedidoProducto.MontoTotal = total;
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

                var idPedidoProducto = new SqlParameter("@Id", SqlDbType.VarChar, 12)
                {
                    Direction = ParameterDirection.Output
                };


                await context.Database.ExecuteSqlInterpolatedAsync($"Exec [pedido].[SP_DESCARGAR_PEDIDO] @IdRegistroPedido ={detalleCheckout.idPedidoProducto} ,@IdResponsable={"0001"} , @Id={idPedidoProducto} Output ");

                //Console.WriteLine(idPedidoProducto.Value);

                await context.Database.ExecuteSqlInterpolatedAsync($"Exec pedido.sp_actualizar_creditos_por_vendedor @idCliente = {IdCliente}, @IdVendedor = {IdVendedor}, @CreditoUtilizado = {savepedido.pedidoProducto.MontoTotal}, @IP = {savepedido.pedidoProducto.IP}");
                var a = await context.Database.ExecuteSqlInterpolatedAsync($"Exec [pedido].[SP_UPDATE_DETALLE_CHECKOUT] @direccion ={detalleCheckout.IdDireccionEnvio},@tipoEntrega ={detalleCheckout.tipoEntrega},@tipoPago ={detalleCheckout.tipoPago},@idPedidoProducto ={detalleCheckout.idPedidoProducto}");


                return StatusCode(200, new ItemResp
                {
                    status = 200,
                    message = status.CONFIRM,
                    data = a
                });
            }
            catch (InvalidCastException e)
            {
                return StatusCode(404, new ItemResp { status = 200, message = status.ERROR, data = e.ToString() });
            }
        }

        [HttpPost("SaveCheckoutPedidoContado")]
        public async Task<ActionResult> SaveCheckoutPedidoContado( DetalleCheckout detalleCheckout)
        {

            try
            {
                var idPedidoProducto = new SqlParameter("@Id", SqlDbType.VarChar, 12)
                {
                    Direction = ParameterDirection.Output
                };

                await context.Database.ExecuteSqlInterpolatedAsync($"Exec [pedido].[SP_DESCARGAR_PEDIDO] @IdRegistroPedido ={detalleCheckout.idPedidoProducto} ,@IdResponsable={"0001"}, @Id={idPedidoProducto} Output ");

                var a = await context.Database.ExecuteSqlInterpolatedAsync($"Exec [pedido].[SP_UPDATE_DETALLE_CHECKOUT] @direccion ={detalleCheckout.IdDireccionEnvio},@tipoEntrega ={detalleCheckout.tipoEntrega},@tipoPago ={detalleCheckout.tipoPago},@idPedidoProducto ={detalleCheckout.idPedidoProducto}");


                return StatusCode(200, new ItemResp
                {
                    status = 200,
                    message = status.CONFIRM,
                    data = a
                });
            }
            catch (InvalidCastException e)
            {
                return StatusCode(404, new ItemResp { status = 200, message = status.ERROR, data = e.ToString() });
            }
        }

        [HttpGet("GetPedidosCanceladoByDate")]
        public async Task<ActionResult> GetPedidosCanceladoByDate(DateTime fechaInicio, DateTime fechaFin, bool hasPermission)
        {
            var IdVendedor = ((ClaimsIdentity)User.Identity).FindAll(ClaimTypes.NameIdentifier).ToList()[4].Value;

            var result = await context.GetPedidosCancelados.FromSqlInterpolated($"Exec [pedido].[SP_LIST_PEDIDO_CANCELADO_BY_FECHA] @FechaInicio={fechaInicio}, @FechaFin={fechaFin},@IdVendedor={IdVendedor}, @PermisoVerMontoTotal={hasPermission} ").ToListAsync();

            return StatusCode(200, new ItemResp
            {
                status = 200,
                message = status.CREATE,
                data = result
            });
        }
        [HttpDelete("CancelarPedidoProducto")]
        public async Task<ActionResult> CancelarPedidoProducto(int IdRegistroPedido, string justificacion )
        {
            await context.Database.ExecuteSqlInterpolatedAsync($"Exec [pedido].[SP_INSERT_DETALLE_CANCELADO] @justificacion = {justificacion}, @idRegistroPedido = {IdRegistroPedido}");

            var result = await context.Database.ExecuteSqlInterpolatedAsync($"Exec [pedido].[SP_CANCELAR_PEDIDO] @idRegistroPedido={IdRegistroPedido} ");

            return StatusCode(200, new ItemResp
            {
                status = 200,
                message = status.CREATE,
                data = result
            });
        }

        [HttpGet("GetPedidosConfirmadosByDate")]
        public async Task<ActionResult> GetPedidosConfirmadosByDate(DateTime fechaInicio, DateTime fechaFin, bool hasPermission)
        {
            var IdVendedor = ((ClaimsIdentity)User.Identity).FindAll(ClaimTypes.NameIdentifier).ToList()[4].Value;

            var result = await context.GetPedidosConfirmados.FromSqlInterpolated($"Exec [pedido].[SP_LIST_PEDIDO_CONFIRMADO_BY_FECHA] @FechaInicio={fechaInicio}, @FechaFin={fechaFin},@IdVendedor={IdVendedor}, @PermisoVerMonto={hasPermission} ").ToListAsync();

            return StatusCode(200, new ItemResp
            {
                status = 200,
                message = status.CREATE,
                data = result
            });
        }

        [HttpGet("GetPedidosEnviadosByDate")]
        public async Task<ActionResult> GetPedidosEnviadosByDate(DateTime fechaInicio, DateTime fechaFin, bool hasPermission)
        {
            var IdVendedor = ((ClaimsIdentity)User.Identity).FindAll(ClaimTypes.NameIdentifier).ToList()[4].Value;

            var result = await context.GetPedidos.FromSqlInterpolated($"Exec [pedido].[SP_LIST_PEDIDO_ENVIADO_BY_FECHA] @FechaInicio={fechaInicio}, @FechaFin={fechaFin},@IdVendedor={IdVendedor}, @PermisoVerMonto={hasPermission} ").ToListAsync();

            return StatusCode(200, new ItemResp
            {
                status = 200,
                message = status.CREATE,
                data = result
            });
        }

        [HttpGet("GetMisCompras")]
        public async Task<ActionResult> GetMisCompras(DateTime fechaInicio, DateTime fechaFin, bool hasPermission)
        {
            var IdVendedor = ((ClaimsIdentity)User.Identity).FindAll(ClaimTypes.NameIdentifier).ToList()[4].Value;

            var result = await context.GetPedidos.FromSqlInterpolated($"Exec [pedido].[SP_LIST_MIS_COMPRAS] @FechaInicio={fechaInicio}, @FechaFin={fechaFin},@IdVendedor={IdVendedor}, @PermisoVerMonto={hasPermission} ").ToListAsync();

            return StatusCode(200, new ItemResp
            {
                status = 200,
                message = status.CREATE,
                data = result
            });
        }

        [HttpGet("GetDCreditoNdiasPedido")]
        public async Task<ActionResult> GetDCreditoNdiasPedido()
        {
            var IdVendedor = ((ClaimsIdentity)User.Identity).FindAll(ClaimTypes.NameIdentifier).ToList()[4].Value;
            var IdCliente = ((ClaimsIdentity)User.Identity).FindAll(ClaimTypes.NameIdentifier).ToList()[3].Value;

            var result = await context.DiasInfoDto.FromSqlInterpolated($"exec sp_ObtenerDiasCreditoYDiasPedido {IdCliente} ").ToListAsync();

            return StatusCode(200, new ItemResp
            {
                status = 200,
                message = status.CREATE,
                data = result
            });
        }

    }
}
