using backendpedidofigueri.Entity.Historial;
using backendpedidofigueri.Utilities;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using Microsoft.Data.SqlClient;
using System.Data;
using System.Security.Claims;

namespace backendpedidofigueri.Controllers.Historial
{
    [Route("api/[controller]")]
    [ApiController]
    public class HistorialSinPrecioController : ControllerBase
    {
        private DbContextS context;
        private Status status = new Status();
        private readonly IConfiguration configuration;

        public HistorialSinPrecioController(DbContextS _context)
        {
            context = _context;
        }

   

        [HttpGet("GetHistorial")]
    public async Task<ActionResult> GetHistorial()
    {
            var IdCliente = ((ClaimsIdentity)User.Identity).FindAll(ClaimTypes.NameIdentifier).ToList()[3].Value;
            var IdSector = ((ClaimsIdentity)User.Identity).FindAll(ClaimTypes.NameIdentifier).ToList()[2].Value;


            List<HistorialSinPrecio> data = await context.HistorialSinPrecio.FromSqlInterpolated($"Exec [dbo].[sp_listarProductoCliente] @idCliente={IdCliente},@idSector={IdSector}").ToListAsync();

            return StatusCode(200, new ItemResp { status = 200, message = status.CONFIRM, data = data });


        }
    }
    

}
