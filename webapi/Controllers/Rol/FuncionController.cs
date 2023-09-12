using backendpedidofigueri.Entity.Usuarios;
using backendpedidofigueri.Utilities;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace backendpedidofigueri.Controllers.Rol
{
    [Route("api/[controller]")]
    [ApiController]
    public class FuncionController: ControllerBase
    {
        private DbContextS context;
        private Status status = new Status();
        private readonly IConfiguration configuration;
        public FuncionController(DbContextS _context, IConfiguration _configuration)
        {
            context = _context;
            configuration = _configuration;
        }

        [HttpGet("GetFunciones")]
        public async Task<ActionResult> GetFunciones()
        {
            var result = await context.Funcion.FromSqlInterpolated($"Exec [roles].[SP_LIST_FUNCION]").ToListAsync();


            return StatusCode(200, new ItemResp
            {
                status = 200,
                message = status.CREATE,
                data = result  // Incluimos groupby en la respuesta
            });

        }

        [HttpGet("GetFuncionesByRol")]
        public async Task<ActionResult> GetFuncionesByRol(int IdRol)
        {
            var result = await context.Funcion.FromSqlInterpolated($"Exec [roles].[SP_LIST_FUNCION_BY_ROL] @IdRol={IdRol}").ToListAsync();


            return StatusCode(200, new ItemResp
            {
                status = 200,
                message = status.CREATE,
                data = result  // Incluimos groupby en la respuesta
            });

        }

        [HttpPut("AssignFuncion")]
        public async Task<ActionResult> AssignFuncion(string IdFuncion, int IdRol)
        {

            await context.Database.ExecuteSqlInterpolatedAsync($"Exec [roles].[SP_ASSIGN_ROL_FUNCION] @IdFuncion={IdFuncion},@IdRol={IdRol}");

            return StatusCode(200, new ItemResp
            {
                status = 200,
                message = status.CREATE,
                data = null  // Incluimos groupby en la respuesta
            });

        }
        [HttpPut("RemoveFuncion")]
        public async Task<ActionResult> RemoveFuncion(string IdFuncion, int IdRol)
        {

            await context.Database.ExecuteSqlInterpolatedAsync($"Exec [roles].[SP_REMOVE_ROL_FUNCION]  @IdFuncion={IdFuncion},@IdRol={IdRol}");

            return StatusCode(200, new ItemResp
            {
                status = 200,
                message = status.DELETE,
                data = null
            });

        }
    }
}
