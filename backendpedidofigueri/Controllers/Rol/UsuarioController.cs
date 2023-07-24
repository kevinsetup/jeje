using backendpedidofigueri.Entity.Usuarios;
using backendpedidofigueri.Utilities;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace backendpedidofigueri.Controllers.Rol
{
    [Route("api/[controller]")]
    [ApiController]
    public class UsuarioController : ControllerBase
    {
        private DbContextS context;
        private Status status = new Status();
        private readonly IConfiguration configuration;
        public UsuarioController(DbContextS _context, IConfiguration _configuration)
        {
          context = _context;
          configuration = _configuration;
        }
        [HttpGet("GetUsuarios")]
        public async Task<ActionResult> GetUsuarios()
        {
          var result = await context.Usuario.FromSqlInterpolated($"Exec [roles].[SP_LIST_USUARIOS]").ToListAsync();

          return StatusCode(200, new ItemResp
          {
            status = 200,
            message = status.CREATE,
            data = result
          });
        }

        [HttpPost("SaveUsuario")]
        public async Task<ActionResult> SaveUsuario(Usuario usuario)
        {

          usuario.Pass = Crypto.EncryptRijndael(usuario.Pass);

          await context.Database.ExecuteSqlInterpolatedAsync($"Exec [roles].[SP_INSERT_USUARIO] @login={usuario.Login}, @pass={usuario.Pass}, @tipoUsuario={usuario.TipoUsuario},@idTipo={usuario.IdTipo}, @estado={usuario.estado}, @idRol={usuario.IdRol}, @idTipoUsuario={usuario.IdTipoUsuario}");

          return StatusCode(200, new ItemResp
          {
            status = 200,
            message = status.CREATE,
            data = null
          });
        }
        
        [HttpPut("EditUsuario")]
        public async Task<ActionResult> EditUsuario(Usuario usuario ,bool editPass)
        {
          usuario.Pass = Crypto.EncryptRijndael(usuario.Pass);


          await context.Database.ExecuteSqlInterpolatedAsync($"Exec [roles].[SP_EDIT_USUARIO] @idUsuario={usuario.IdUsuario},@login={usuario.Login}, @pass={usuario.Pass}, @tipoUsuario={usuario.TipoUsuario},@idTipo={usuario.IdTipo}, @estado={usuario.estado}, @idRol={usuario.IdRol}, @idTipoUsuario={usuario.IdTipoUsuario},@editPass={editPass}");

          return StatusCode(200, new ItemResp
          {
            status = 200,
            message = status.UPDATE,
            data = null
          });
        }

        [HttpDelete("DeleteUsuario")]
        public async Task<ActionResult> DeleteUsuario(int idUsuario)
        {
          await context.Database.ExecuteSqlInterpolatedAsync($"Exec [roles].[SP_DELETE_USUARIO] @idUsuario={idUsuario}");

          return StatusCode(200, new ItemResp
          {
            status = 200,
            message = status.DELETE,
            data = null
          });
        }
        [HttpGet("GetUsuarioEdit")]
        public async Task<ActionResult> GetUsuarioEdit(int idUsuario)
        {
          var result = await context.UsuarioEdit.FromSqlInterpolated($"Exec [roles].[SP_GET_USUARIOEDIT] @idUsuario={idUsuario}").ToListAsync();

          return StatusCode(200, new ItemResp
          {
            status = 200,
            message = status.CREATE,
            data = result
          });
        }
  }
}
