using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace backendpedidofigueri.Entity.Login
{
    public class CambiarContrasena
    {
        public string ContraseñaActual { get; set; }
        public string NuevaContraseña { get; set; }
    }
}
