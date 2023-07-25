using backendpedidofigueri.Controllers.Login;
using backendpedidofigueri.Entity.Login;
using backendpedidofigueri.Entity.Rol.Permisos;
using backendpedidofigueri.Entity.Usuarios;
using backendpedidofigueri.Utilities;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;

namespace backendpedidofigueri.Controllers.Rol
{
    [Route("api/[controller]")]
    [ApiController]
    public class PermisosController : ControllerBase
    {
        private DbContextS context;
        private Status status = new Status();
        private readonly IConfiguration configuration;
        public PermisosController(DbContextS _context, IConfiguration _configuration)
        {
          context = _context;
          configuration = _configuration;
        }

        [HttpGet("GetPermiso")]
        public async Task<ActionResult> GetPermiso()
        {
          var result =await context.Permiso.FromSqlInterpolated($"Exec [roles].[SP_LIST_PERMISO]").ToListAsync();


          return StatusCode(200, new ItemResp
          {
            status = 200,
            message = status.CREATE,
            data = result  // Incluimos groupby en la respuesta
          });

        }
        [HttpPost("SavePermiso")]
        public async Task<ActionResult> SavePermiso(Permiso permiso)
        {
        await context.Database.ExecuteSqlInterpolatedAsync($"Exec [roles].[SP_INSERT_PERMISO] @NomPermiso={permiso.NomPermiso},@Logo={permiso.Logo},@Estado={permiso.Estado}");


        return StatusCode(200, new ItemResp
          {
            status = 200,
            message = status.CREATE,
            data = null  // Incluimos groupby en la respuesta
          });

        }
        [HttpPut("EditPermiso")]
        public async Task<ActionResult> EditPermiso(Permiso permiso)
        {

        await context.Database.ExecuteSqlInterpolatedAsync($"Exec [roles].[SP_EDIT_PERMISO] @IdPermiso={permiso.IdPermiso}, @NomPermiso={permiso.NomPermiso},@Logo={permiso.Logo},@Estado={permiso.Estado}");

        return StatusCode(200, new ItemResp
          {
            status = 200,
            message = status.UPDATE,
            data = null  // Incluimos groupby en la respuesta
          });

        }
        [HttpDelete("DeletePermiso")]
        public async Task<ActionResult> DeletePermiso(int IdPermiso)
        {
          await context.Database.ExecuteSqlInterpolatedAsync($"Exec [roles].[SP_DELETE_PERMISO] @IdPermiso={IdPermiso}");


          return StatusCode(200, new ItemResp
            {
              status = 200,
              message = status.DELETE,
              data = null  // Incluimos groupby en la respuesta
            });
        }
      [HttpPut("AssignPermiso")]
      public async Task<ActionResult> AssignPermiso(int IdUsuario, int IdPermiso)
      {

        await context.Database.ExecuteSqlInterpolatedAsync($"Exec [roles].[SP_ASSIGN_USUARIO_PERMISO] @IdUsuario={IdUsuario},@IdPermiso={IdPermiso}");

        return StatusCode(200, new ItemResp
        {
          status = 200,
          message = status.CREATE,
          data = null  // Incluimos groupby en la respuesta
        });

      }
      [HttpPut("RemovePermiso")]
      public async Task<ActionResult> RemovePermiso(int IdUsuario, int IdPermiso)
      {

        await context.Database.ExecuteSqlInterpolatedAsync($"Exec [roles].[SP_REMOVE_USUARIO_PERMISO] @IdUsuario={IdUsuario},@IdPermiso={IdPermiso}");

        return StatusCode(200, new ItemResp
        {
          status = 200,
          message = status.DELETE,
          data = null  // Incluimos groupby en la respuesta
        });

      }

        [HttpGet("GetPermisosByUsuario")]
        public async Task<ActionResult> GetPermisosByUsuario(int IdUsuario)
        {
            var result = await context.Permiso.FromSqlInterpolated($"Exec [roles].[SP_LIST_PERMISO_BY_USER] @IdUsuario={IdUsuario}").ToListAsync();


            return StatusCode(200, new ItemResp
            {
                status = 200,
                message = status.CREATE,
                data = result  // Incluimos groupby en la respuesta
            });

        }
    }
}
