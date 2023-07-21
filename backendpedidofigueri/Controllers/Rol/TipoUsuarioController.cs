using backendpedidofigueri.Utilities;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace backendpedidofigueri.Controllers.Rol
{
    [Route("api/[controller]")]
    [ApiController]
    public class TipoUsuarioController: ControllerBase
    {
        private DbContextS context;
        private Status status = new Status();
        private readonly IConfiguration configuration;

        public TipoUsuarioController(DbContextS _context, IConfiguration _configuration)
        {
            context = _context;
            configuration = _configuration;
        }

        [HttpGet("GetTipoUsuario")]
        public async Task<ActionResult> GetRTipoUsuario()
        {
            var result = await context.TipoUsuario.FromSqlInterpolated($"Exec [roles].[SP_LIST_TIPO_USUARIO]").ToListAsync();


            return StatusCode(200, new ItemResp
            {
                status = 200,
                message = status.CREATE,
                data = result  // Incluimos groupby en la respuesta
            });

        }
    }
}
