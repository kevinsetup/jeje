using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace backendpedidofigueri.Entity.ArchiveManager
{
    public class ArchiveManagers
    {
        [Key]
        public int? IdArchive { get; set; }
        public string? NomArchive { get; set; }
        public string? NomSave { get; set; }

        [NotMapped]
        public IFormFile? File { get; set; }
        public string? Ruta { get; set; }
        public DateTime? FechaCreacion { get; set; }


    }
}
