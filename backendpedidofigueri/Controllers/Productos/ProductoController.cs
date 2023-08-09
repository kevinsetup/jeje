using backendpedidofigueri.Entity.Rol.Permisos;
using backendpedidofigueri.Utilities;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

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
    }
}
