using backendpedidofigueri.Utilities;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace backendpedidofigueri.Controllers.Rol
{
    [Route("api/[controller]")]
    [ApiController]
    public class ResponsableController : ControllerBase
    {
        private DbContextS context;
        private Status status = new Status();
        private readonly IConfiguration configuration;
        public ResponsableController(DbContextS _context, IConfiguration _configuration)
        {
          context = _context;
          configuration = _configuration;
        }
        [HttpGet("GetUnnasignedResponsable")]
        public async Task<ActionResult> GetUnnasignedResponsable()
        {
          var result = await context.Responsable.FromSqlInterpolated($"Exec [roles].[SP_GET_UNNASIGNED_RESPONSABLE]").ToListAsync();

          return StatusCode(200, new ItemResp
          {
            status = 200,
            message = status.CREATE,
            data = result
          });
        }
    }
}
