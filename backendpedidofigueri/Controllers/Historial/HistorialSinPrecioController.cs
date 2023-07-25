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

        [HttpGet("GetIdCliente")]
        public async Task<ActionResult> GetIdCliente(string IdUsuario)
        {
            var output = new SqlParameter("IdCliente", SqlDbType.NVarChar, 100);
            output.Direction = ParameterDirection.Output;
            
            await context.Database.ExecuteSqlInterpolatedAsync($"Exec [dbo].[sp_obtenerIdCliente] @IdUsuario={IdUsuario}, @IdCliente = {output} OUTPUT");

            return StatusCode(200, new ItemResp { status = 200, message = status.CONFIRM, data = output.Value });


        }

        [HttpGet("GetIdSector")]
        public async Task<ActionResult> GetIdSector(string IdUsuario)
        {
            var output = new SqlParameter("IdSector", SqlDbType.NVarChar, 100);
            output.Direction = ParameterDirection.Output;

            await context.Database.ExecuteSqlInterpolatedAsync($"Exec [dbo].[sp_obtenerIdSector] @IdUsuario={IdUsuario}, @IdSector= {output} OUTPUT");

            return StatusCode(200, new ItemResp { status = 200, message = status.CONFIRM, data = output.Value });


        }


        [HttpGet("GetHistorial")]
    public async Task<ActionResult> GetHistorial(string IdCliente, string @IdSector)
    {
            List<HistorialSinPrecio> data = await context.HistorialSinPrecio.FromSqlInterpolated($"Exec [dbo].[sp_listarProductoCliente] @idCliente={IdCliente},@idSector={IdSector}").ToListAsync();

            return StatusCode(200, new ItemResp { status = 200, message = status.CONFIRM, data = data });


        }
    }
    

}
