using backendpedidofigueri.Entity.Credito;
using backendpedidofigueri.Utilities;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Globalization;
using System.Security.Claims;

namespace backendpedidofigueri.Controllers.Credito
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class CreditoController : ControllerBase
    {

        private DbContextS context;
        private Status status = new Status();
        private readonly IConfiguration configuration;

        public CreditoController(DbContextS _context)
        {
            context = _context;
        }
        [HttpGet("GetCreditoById")]
        public async Task<ActionResult> GetHistorial()
        {
            var IdVendedor = ((ClaimsIdentity)User.Identity).FindAll(ClaimTypes.NameIdentifier).ToList()[4].Value;



            List<Creditos> data = await context.Credito.FromSqlInterpolated($"Exec [pedido].[sp_obtener_creditos_por_vendedor] @IdVendedor={IdVendedor}").ToListAsync();

            return StatusCode(200, new ItemResp { status = 200, message = status.CONFIRM, data = data });


        }
        [HttpPost("RestoCredito")]
        public async Task<ActionResult> GetResto([FromHeader] double  CreditoUtilizado)
        {
            var IdVendedor = ((ClaimsIdentity)User.Identity).FindAll(ClaimTypes.NameIdentifier).ToList()[4].Value;



            List<Creditos> data = await context.Credito.FromSqlInterpolated($"EXEC pedido.sp_actualizar_creditos_por_vendedor @IdVendedor={IdVendedor}, @CreditoUtilizado = {CreditoUtilizado}").ToListAsync();

            return StatusCode(200, new ItemResp { status = 200, message = status.CONFIRM, data = data });


        }

        [HttpPost("savecredito")]
        public async Task<ActionResult> savecredito(Creditos credito)
        {
            // Suponiendo que "context" es tu instancia del DbContext y "Creditos" es el DbSet<Creditos> en tu DbContext
            // Asegúrate de ajustar el nombre de tu DbSet si es diferente.
            // Además, asegúrate de que los nombres de las propiedades de la clase "Creditos" coincidan con los nombres de las columnas en la tabla "credito" en tu base de datos.

            // Convertir el valor del crédito inicial a decimal (asumiendo que es un string)
            if (decimal.TryParse(credito.credito_inicial, NumberStyles.AllowDecimalPoint, CultureInfo.InvariantCulture, out decimal creditoInicialDecimal))
            {
                // Formatear el número decimal usando la cultura peruana (es-PE)
                CultureInfo culture = new CultureInfo("es-PE");
                string creditoInicialFormateado = creditoInicialDecimal.ToString("0.00", culture); // "1700.00"

                // Pasar el valor formateado al procedimiento almacenado
                await context.Database.ExecuteSqlInterpolatedAsync($@"
            EXEC pedido.sp_InsertarCredito
                @IdCliente={credito.IdCliente},
                @CreditoInicial={creditoInicialFormateado}
        ");
            }
            else
            {
                // Manejar el caso en el que el valor no se pueda convertir a decimal
                // Aquí puedes mostrar un mensaje de error o realizar otra acción adecuada para tu aplicación.
                return StatusCode(400, new ItemResp { status = 400, message = "Error: valor de crédito inicial inválido" });
            }

            return StatusCode(200, new ItemResp { status = 200, message = status.CONFIRM, data = credito });
        }

        [HttpGet("GetCreditos")]
        public async Task<ActionResult> CreditoTotales()
        {
            // Suponiendo que "context" es tu instancia del DbContext y "Creditos" es el DbSet<Creditos> en tu DbContext
            // Asegúrate de ajustar el nombre de tu DbSet si es diferente.
            // Además, asegúrate de que los nombres de las propiedades de la clase "Creditos" coincidan con los nombres de las columnas en la tabla "credito" en tu base de datos.
            List<Creditos> data =  context.Credito.FromSqlRaw("EXEC pedido.sp_obtener_credito_todos").ToList();

            return StatusCode(200, new ItemResp { status = 200, message = status.CONFIRM, data = data });
        }

        [HttpGet("GetClientes")]
        public async Task<ActionResult> GetClientes()
        {
            // Suponiendo que "context" es tu instancia del DbContext y "Creditos" es el DbSet<Creditos> en tu DbContext
            // Asegúrate de ajustar el nombre de tu DbSet si es diferente.
            // Además, asegúrate de que los nombres de las propiedades de la clase "Creditos" coincidan con los nombres de las columnas en la tabla "credito" en tu base de datos.
            List<Cliente> data = context.Cliente.FromSqlRaw("EXEC pedido.sp_obtener_cliente").ToList();

            return StatusCode(200, new ItemResp { status = 200, message = status.CONFIRM, data = data });
        }


    }
}
