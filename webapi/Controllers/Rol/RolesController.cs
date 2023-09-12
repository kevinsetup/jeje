using backendpedidofigueri.Entity.Rol.Roles;
using backendpedidofigueri.Utilities;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace backendpedidofigueri.Controllers.Rol
{
    [Route("api/[controller]")]
    [ApiController]
    public class RolesController : ControllerBase
    {
        private DbContextS context;
        private Status status = new Status();
        private readonly IConfiguration configuration;
        public RolesController(DbContextS _context, IConfiguration _configuration)
        {
          context = _context;
          configuration = _configuration;
        }
        [HttpGet("GetRoles")]
        public async Task<ActionResult> GetRoles()
        {
          var result =await context.Roles.FromSqlInterpolated($"Exec [roles].[SP_LIST_ROLES]").ToListAsync();


          return StatusCode(200, new ItemResp
          {
            status = 200,
            message = status.CREATE,
            data = result  // Incluimos groupby en la respuesta
          });

        }
        [HttpPost("SaveRol")]
        public async Task<ActionResult> SaveRol(Roles roles)
        {
        await context.Database.ExecuteSqlInterpolatedAsync($"Exec [roles].[SP_INSERT_ROL] @desRol={roles.desRol},@IdTipoUsuario={roles.IdTipoUsuario},@Estado={roles.Estado}");


        return StatusCode(200, new ItemResp
          {
            status = 200,
            message = status.CREATE,
            data = null  // Incluimos groupby en la respuesta
          });

        }
        [HttpPut("EditRol")]
        public async Task<ActionResult> EditRol(Roles roles)
        {

        await context.Database.ExecuteSqlInterpolatedAsync($"Exec [roles].[SP_EDIT_ROL] @idRol={roles.idRol},@desRol={roles.desRol},@IdTipoUsuario={roles.IdTipoUsuario},@Estado={roles.Estado}");

        return StatusCode(200, new ItemResp
          {
            status = 200,
            message = status.UPDATE,
            data = null  // Incluimos groupby en la respuesta
          });

        }
        [HttpDelete("DeleteRol")]
        public async Task<ActionResult> DeleteRol(int IdRol)
        {
          await context.Database.ExecuteSqlInterpolatedAsync($"Exec [roles].[SP_DELETE_ROL] @idRol={IdRol}");


          return StatusCode(200, new ItemResp
            {
              status = 200,
              message = status.DELETE,
              data = null  // Incluimos groupby en la respuesta
            });
        }
        [HttpPut("AssignRol")]
        public async Task<ActionResult> AssignRol(int IdUsuario,int IdRol)
        {
       
        await context.Database.ExecuteSqlInterpolatedAsync($"Exec [roles].[SP_ASSIGN_USUARIO_ROL] @IdUsuario={IdUsuario},@IdRol={IdRol}");
       
        return StatusCode(200, new ItemResp
          {
            status = 200,
            message = status.CREATE,
            data = null  // Incluimos groupby en la respuesta
          });
       
        }
        [HttpPut("RemoveRol")]
        public async Task<ActionResult> RemoveRol(int IdUsuario,int IdRol)
        {
       
        await context.Database.ExecuteSqlInterpolatedAsync($"Exec [roles].[SP_REMOVE_USUARIO_ROL] @IdUsuario={IdUsuario},@IdRol={IdRol}");
       
        return StatusCode(200, new ItemResp
          {
            status = 200,
            message = status.DELETE,
            data = null  
          });
       
        }
        
        [HttpGet("GetRolByUser")]
        public async Task<ActionResult> GetRolByUser(int IdUsuario)
        {

          var result =await context.Roles.FromSqlInterpolated($"Exec [roles].[SP_LIST_ROL_BY_USER] @IdUsuario={IdUsuario}").ToListAsync();

          return StatusCode(200, new ItemResp
          {
            status = 200,
            message = status.CREATE,
            data = result 
          });

        }
        [HttpGet("GetRolByTipoUsuario")]
        public async Task<ActionResult> GetRolByTipoUsuario(int IdTipoUsuario)
        {

          var result =await context.Roles.FromSqlInterpolated($"Exec [roles].[SP_LIST_ROL_BY_TIPOUSUARIO] @IdTipoUsuario={IdTipoUsuario}").ToListAsync();

          return StatusCode(200, new ItemResp
          {
            status = 200,
            message = status.CREATE,
            data = result  
          });

        }
        
    }
}
