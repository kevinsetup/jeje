using backendpedidofigueri.Controllers.Login;
using backendpedidofigueri.Entity.DireccionEnvio;
using backendpedidofigueri.Entity.Rol.Roles;
using backendpedidofigueri.Entity.Rol.Vendedor;
using backendpedidofigueri.Utilities;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;

namespace backendpedidofigueri.Controllers.Pedidos
{
    [Route("api/[controller]")]
    [ApiController]
    public class DireccionEnvioController : ControllerBase
    {
        private DbContextS context;
        private Status status = new Status();
        private readonly IConfiguration configuration;
        public DireccionEnvioController(DbContextS _context, IConfiguration _configuration)
        {
            context = _context;
            configuration = _configuration;
        }

        [HttpGet("GetDireccionEnvio")]
        public async Task<ActionResult> GetDireccionEnvio()
        {
            var IdCliente = ((ClaimsIdentity)User.Identity).FindAll(ClaimTypes.NameIdentifier).ToList()[3].Value;

            var result = await context.DireccionEnvio.FromSqlInterpolated($"Exec [pedido].[SP_GET_DIRECCION_ENVIO] @IdCliente={IdCliente}").ToListAsync();

            return StatusCode(200, new ItemResp
            {
                status = 200,
                message = status.CREATE,
                data = result  // Incluimos groupby en la respuesta
            });

        }

        [HttpPost("SaveDirecccionEnvio")]
        public async Task<ActionResult> SaveDirecccionEnvio(DireccionEnvio direccionEnvio)
        {
            var IdCliente = ((ClaimsIdentity)User.Identity).FindAll(ClaimTypes.NameIdentifier).ToList()[3].Value;

            await context.Database.ExecuteSqlInterpolatedAsync($"Exec [pedido].[SP_INSERT_DIRECCION_ENVIO] @IdCliente={IdCliente}, @Direccion={direccionEnvio.Direccion}");


            return StatusCode(200, new ItemResp
            {
                status = 200,
                message = status.CREATE,
                data = null  // Incluimos groupby en la respuesta
            });

        }
        [HttpPut("EditDirecccionEnvio")]
        public async Task<ActionResult> EditDirecccionEnvio(DireccionEnvio direccionEnvio)
        {

            await context.Database.ExecuteSqlInterpolatedAsync($"Exec [pedido].[SP_UPDATE_DIRECCION_ENVIO] @IdDireccionEnvio={direccionEnvio.IdDireccionEnvio}, @Direccion={direccionEnvio.Direccion}");

            return StatusCode(200, new ItemResp
            {
                status = 200,
                message = status.UPDATE,
                data = null  // Incluimos groupby en la respuesta
            });

        }
        [HttpDelete("DeleteDirecccionEnvio")]
        public async Task<ActionResult> DeleteDirecccionEnvio(DireccionEnvio direccionEnvio)
        {
            await context.Database.ExecuteSqlInterpolatedAsync($"Exec [pedido].[SP_DELETE_DIRECCION_ENVIO] @IdDireccionEnvio={direccionEnvio.IdDireccionEnvio}");


            return StatusCode(200, new ItemResp
            {
                status = 200,
                message = status.DELETE,
                data = null  // Incluimos groupby en la respuesta
            });
        }
    }
}
