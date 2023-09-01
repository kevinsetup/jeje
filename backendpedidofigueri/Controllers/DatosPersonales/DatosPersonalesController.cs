
using backendpedidofigueri.Entity.DatosPersonales;
using backendpedidofigueri.Entity.Historial;
using backendpedidofigueri.Entity.Login;
using backendpedidofigueri.Utilities;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;

namespace backendpedidofigueri.Controllers.Datos
{
    [Route("api/[controller]")]
    [ApiController]
    public class DatosPersonalesController : ControllerBase
    {
        private DbContextS context;
        private Status status = new Status();
        private readonly IConfiguration configuration;

        public DatosPersonalesController(DbContextS _context)
        {
            context = _context;
        }


        [HttpGet("GetDatosPersonales")]
        public async Task<ActionResult> GetDatosPersonales(bool hasPermission)
        {
            var IdUsuario = ((ClaimsIdentity)User.Identity).FindAll(ClaimTypes.NameIdentifier).ToList()[1].Value;

            List<DatosPersonales> data = await context.DatosPersonales.FromSqlInterpolated($"Exec [dbo].[SP_GET_DATOS_PERSONALES] @IdUsuario={IdUsuario} ").ToListAsync();

            return StatusCode(200, new ItemResp { status = 200, message = status.CONFIRM, data = data });


        }

        [HttpPost("InsertDatosPersonales")]
        public async Task<ActionResult> InsertDatosPersonales(DatosPersonales datosPersonales)
        {
            var IdUsuario = ((ClaimsIdentity)User.Identity).FindAll(ClaimTypes.NameIdentifier).ToList()[1].Value;

            await context.Database.ExecuteSqlInterpolatedAsync($"EXEC [dbo].[SP_INSERT_DATOS_PERSONALES]  @idDatosPersonales ={IdUsuario},@nombre ={ datosPersonales.nombre}, @apellidoPaterno ={ datosPersonales.apellidoPaterno},@apellidoMaterno ={ datosPersonales.apellidoMaterno},@tipoDocumento ={ datosPersonales.tipoDocumento},@nCelular ={ datosPersonales.nCelular},@email ={ datosPersonales.email}, @nombreEmpresa = {datosPersonales.nombreEmpresa} ");

            return StatusCode(200, new ItemResp { status = 200, message = status.CONFIRM });
        }
        [HttpPut("UpdateDatosPersonales")]
        public async Task<ActionResult> UpdateDatosPersonales(DatosPersonales datosPersonales)
        {
            var IdUsuario = ((ClaimsIdentity)User.Identity).FindAll(ClaimTypes.NameIdentifier).ToList()[1].Value;

            await context.Database.ExecuteSqlInterpolatedAsync($"EXEC [dbo].[SP_UPDATE_DATOS_PERSONALES]@idDatosPersonales ={IdUsuario}, @nombre ={ datosPersonales.nombre},@apellidoPaterno ={ datosPersonales.apellidoPaterno},@apellidoMaterno ={ datosPersonales.apellidoMaterno},@tipoDocumento ={ datosPersonales.tipoDocumento},@nCelular ={ datosPersonales.nCelular},@email ={ datosPersonales.email} , @nombreEmpresa = {datosPersonales.nombreEmpresa}");

            return StatusCode(200, new ItemResp { status = 200, message = status.CONFIRM });
        }

        [HttpPut("CambiarContra")]
        public async Task<ActionResult> CambiarContraseña([FromBody] CambiarContrasena request)
        {
            try
            {
                var IdUsuarioStr = ((ClaimsIdentity)User.Identity).FindAll(ClaimTypes.NameIdentifier).ToList()[1].Value;
                int IdUsuario = int.Parse(IdUsuarioStr);

                // Obtiene la contraseña almacenada en la base de datos
                var contraseñaAlmacenada = context.Usuario
                                        .Where(u => u.IdUsuario == IdUsuario)
                                        .Select(u => u.Pass)
                                        .FirstOrDefault();

                if (contraseñaAlmacenada == null)
                {
                    return StatusCode(200, new { status = 404, message = "Usuario no encontrado" });
                }

                // Descifra la contraseña almacenada
                string contraseñaDescifrada = Crypto.DecryptRijndael(contraseñaAlmacenada);

                // Comprueba si la contraseña actual proporcionada coincide con la descifrada
                if (contraseñaDescifrada != request.ContraseñaActual)
                {
                    return StatusCode(200, new { status = 200, message = "Contraseña actual incorrecta" });
                }

                // Cifra la nueva contraseña
                string contraseñaCifrada = Crypto.EncryptRijndael(request.NuevaContraseña);

                // Llama al procedimiento almacenado para actualizar la contraseña
                await context.Database.ExecuteSqlInterpolatedAsync($"EXEC sp_CambiarContraseña @idUsuario={IdUsuario}, @nuevaContraseña={contraseñaCifrada}");

                return StatusCode(200, new { status = 404, message = "Contraseña actualizada correctamente" });
            }
            catch (Exception ex)
            {
                return StatusCode(200, new { status = 404, message = "Error al actualizar la contraseña", error = ex.Message });
            }
        }




    }



}

