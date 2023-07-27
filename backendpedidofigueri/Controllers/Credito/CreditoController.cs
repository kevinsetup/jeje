using backendpedidofigueri.Entity.Credito;
using backendpedidofigueri.Utilities;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;

namespace backendpedidofigueri.Controllers.Credito
{
    [Route("api/[controller]")]
    [ApiController]
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
        public async Task<ActionResult> GetResto(string CreditoUtilizado)
        {
            var IdVendedor = ((ClaimsIdentity)User.Identity).FindAll(ClaimTypes.NameIdentifier).ToList()[4].Value;



            List<Creditos> data = await context.Credito.FromSqlInterpolated($"EXEC pedido.sp_actualizar_creditos_por_vendedor] @IdVendedor={IdVendedor}, @CreditoUtilizado = {CreditoUtilizado}").ToListAsync();

            return StatusCode(200, new ItemResp { status = 200, message = status.CONFIRM, data = data });


        }


    }
}
