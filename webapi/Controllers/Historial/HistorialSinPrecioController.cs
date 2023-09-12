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
using System.Security.Claims;

namespace backendpedidofigueri.Controllers.Historial
{
    [Route("api/[controller]")]
    [ApiController]
    public class HistorialSinPrecioController : ControllerBase
    {
        private DbContextS context;
        private Status status = new Status();
        private readonly IConfiguration configuration;
        private IWebHostEnvironment webHostEnvironment;

        public HistorialSinPrecioController(DbContextS _context, IWebHostEnvironment _webHostEnvironment)
        {
            context = _context;
            webHostEnvironment = _webHostEnvironment;

        }



        [HttpGet("GetHistorial")]
    public async Task<ActionResult> GetHistorial(bool hasPermission)
    {
            var IdCliente = ((ClaimsIdentity)User.Identity).FindAll(ClaimTypes.NameIdentifier).ToList()[3].Value;
            var IdSector = ((ClaimsIdentity)User.Identity).FindAll(ClaimTypes.NameIdentifier).ToList()[2].Value;


            List<HistorialSinPrecio> data = await context.HistorialSinPrecio.FromSqlInterpolated($"Exec [dbo].[sp_listarProductoCliente] @idCliente={IdCliente},@idSector={IdSector}, @PermisoVerMonto={hasPermission}").ToListAsync();
            data.ForEach(x =>
            {
                if (x.ImagenRuta != null)
                {
                    x.Imagen = "data:image/jpg;base64," + Convert.ToBase64String(System.IO.File.ReadAllBytes(webHostEnvironment.WebRootPath + x.ImagenRuta));

                }
            });


            return StatusCode(200, new ItemResp { status = 200, message = status.CONFIRM, data = data });


        }
    }
    

}
