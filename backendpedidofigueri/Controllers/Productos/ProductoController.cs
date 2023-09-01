using backendpedidofigueri.Entity.Productos;
using backendpedidofigueri.Entity.Rol.Permisos;
using backendpedidofigueri.Utilities;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;

namespace backendpedidofigueri.Controllers.Productos
{
    [Route("api/[controller]")]
    [ApiController]
    public class ProductoController : ControllerBase
    {
        private DbContextS context;
        private Status status = new Status();
        private readonly IConfiguration configuration;
        public ProductoController(DbContextS _context, IConfiguration _configuration)
        {
            context = _context;
            configuration = _configuration;
        }

        [HttpGet("GetProductos")]
        public async Task<ActionResult> GetProductos()
        {
            var result = await context.Producto.FromSqlInterpolated($"Exec [productos].[SP_GET_PRODUCTOS]").ToListAsync();


            return StatusCode(200, new ItemResp
            {
                status = 200,
                message = status.CREATE,
                data = result 
            });

        }

        [HttpGet("GetProductosByCategoria")]
        public async Task<ActionResult> GetProductosByCategoria(string IdCategoria)
        {
            var result = await context.Producto.FromSqlInterpolated($"Exec [productos].[SP_GET_PRODUCTOS_POR_CATEGORIA] @IdCategoria={IdCategoria} ").ToListAsync();


            return StatusCode(200, new ItemResp
            {
                status = 200,
                message = status.CREATE,
                data = result
            });

        }

        [HttpPost("SaveCatalogo")]
        public async Task<ActionResult> SaveCatalogo(InsertCatalogo insertCatalogo)
        {
            try
            {
                await context.Database.ExecuteSqlInterpolatedAsync($"Exec [productos].[SP_INSERT_CATALOGO] @IdProducto = {insertCatalogo.IdProducto},@Imagen = {insertCatalogo.Imagen},@Descripcion = {insertCatalogo.Descripcion}");

                return StatusCode(200, new ItemResp { status = 200, message = status.CREATE, data = null });
            }
            catch (InvalidCastException e)
            {
                return StatusCode(404, new ItemResp { status = 200, message = status.ERROR, data = e.ToString() });
            }

        }

        [HttpPut("UpdateCatalogo")]
        public async Task<ActionResult> UpdateCatalogo(UpdateCatalogo updateCatalogo)
        {
            try
            {
                await context.Database.ExecuteSqlInterpolatedAsync($"Exec [productos].[SP_UPDATE_CATALOGO] @IdCatalogo = {updateCatalogo.IdCatalogo},@Imagen = {updateCatalogo.Imagen},@Descripcion = {updateCatalogo.Descripcion}");

                return StatusCode(200, new ItemResp { status = 200, message = status.CREATE, data = null });
            }
            catch (InvalidCastException e)
            {
                return StatusCode(404, new ItemResp { status = 200, message = status.ERROR, data = e.ToString() });
            }

        }

        [HttpGet("GetCatalogoByProducto")]
        public async Task<ActionResult> GetCatalogoByProducto(string IdProducto)
        {

            try
            {
                var catalogo = await context.Catalogo.
                    FromSqlInterpolated($"Exec [productos].[SP_GET_CATALOGO_BY_PRODUCTO] @IdProducto={IdProducto}").ToListAsync();

                return StatusCode(200, new ItemResp { status = 200, message = status.CONFIRM, data = catalogo });
            }
            catch (InvalidCastException e)
            {
                return StatusCode(404, new ItemResp { status = 200, message = status.ERROR, data = e.ToString() });
            }


        }
    }
}
