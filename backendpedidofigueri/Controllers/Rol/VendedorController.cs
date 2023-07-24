using backendpedidofigueri.Utilities;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace backendpedidofigueri.Controllers.Rol
{
    [Route("api/[controller]")]
    [ApiController]
    public class VendedorController : ControllerBase
    {
        private DbContextS context;
        private Status status = new Status();
        private readonly IConfiguration configuration;
        public VendedorController(DbContextS _context, IConfiguration _configuration)
        {
          context = _context;
          configuration = _configuration;
        }
        [HttpGet("GetUnnasignedVendedor")]
        public async Task<ActionResult> GetUnnasignedVendedor()
        {
          var result = await context.Vendedor.FromSqlInterpolated($"Exec [roles].[SP_GET_UNNASIGNED_VENDEDOR]").ToListAsync();

          return StatusCode(200, new ItemResp
          {
            status = 200,
            message = status.CREATE,
            data = result
          });
        }
    }
}
