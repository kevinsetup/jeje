using backendpedidofigueri.Utilities;
using backendpedidofigueri.Entity.ArchiveManager;
using backendpedidofigueri.Utilities;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace backendpedidofigueri.Controllers.ArchiveManager

{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class ArchiveManagerController : ControllerBase
    {
        private DbContextS context;
        private IWebHostEnvironment webHostEnvironment;

        private Status status = new Status();

        public ArchiveManagerController(DbContextS _context, IWebHostEnvironment _webHostEnvironment)
        {
            context = _context;
            webHostEnvironment = _webHostEnvironment;
        }
        [HttpPost("SaveArchiveImage")]
        public async Task<ActionResult> SaveArchive([FromForm] ArchiveManagers archiveManager)
        {

            try
            {
                if (archiveManager.File.Length > 0)
                {
                    string pathCarpet = "\\Images\\";

                    string[] Listvalidate = { "jpeg", "png", "gif", "jpg", "PNG", "JPEG", "GIF", "JPG" };

                    string[] extension = archiveManager.File.FileName.Split(".");
                    string validate = extension[extension.Count() - 1]; // Obtiene la extensión

                    if (Listvalidate.Contains(validate))
                    {
                        if (!Directory.Exists(webHostEnvironment.WebRootPath + pathCarpet))
                        {
                            Directory.CreateDirectory(webHostEnvironment.WebRootPath + pathCarpet);
                        }
                        string nombreSave = archiveManager.File.FileName;
                        List<ArchiveManagers> foundArchive = await context.ArchiveManagers.FromSqlInterpolated($"Exec [archivos].[SP_SEARCH_ARCHIVE]  @NomArchive ={nombreSave}").ToListAsync();
                        //Verificar si el nombre existe en la tabla,si existe ,sacar una copia con (1)
                        if (foundArchive.Count() > 0)
                        {
                            nombreSave = string.Join("", extension.Take(extension.Length - 1).ToArray()) + "(" + foundArchive.Count().ToString() + ")." + validate;
                        }
                        else
                        {
                            nombreSave = string.Join("", extension.Take(extension.Length - 1).ToArray()) + "." + validate;
                        }
                        string path = pathCarpet + nombreSave;

                        using (FileStream fileStream = System.IO.File.Create(webHostEnvironment.WebRootPath + path))
                        {
                            archiveManager.File.CopyTo(fileStream);
                            fileStream.Flush();
                        }
                        string ruta = (webHostEnvironment.WebRootPath + path).ToString();
                        await context.Database.ExecuteSqlAsync($"Exec [archivos].[SP_INSERT_ARCHIVE]  @NomSave={nombreSave},@NomArchive={archiveManager.File.FileName},@Ruta ={ruta}");

                        return StatusCode(200, new ItemResp { status = 200, message = status.CONFIRM, data = path });
                    }
                    else
                    {
                        return StatusCode(404, new ItemResp { status = 200, message = status.ERROR, data = null });
                    }
                }
                else
                {
                    return StatusCode(404, new ItemResp { status = 200, message = status.ERROR, data = null });
                }

            }
            catch (InvalidCastException e)
            {
                return StatusCode(404, new ItemResp { status = 200, message = status.ERROR, data = e.ToString() });
            }


        }
        [HttpGet("GetArchiveImage")]
        public async Task<ActionResult> GetArchiveImage(string ruta)
        {

            try
            {
                string cadenaADevolver = Convert.ToBase64String(System.IO.File.ReadAllBytes(webHostEnvironment.WebRootPath + ruta));


                return StatusCode(200, new ItemResp { status = 200, message = status.CONFIRM, data = cadenaADevolver });
            }
            catch (InvalidCastException e)
            {
                return StatusCode(404, new ItemResp { status = 200, message = status.ERROR, data = e.ToString() });
            }

        }

    }
}
