using backendpedidofigueri.Entity.Login;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;
using System.Text;
using Microsoft.IdentityModel.Tokens;
using backendpedidofigueri.Utilities;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Mvc;
using backendpedidofigueri.Entity.Usuarios;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using System.Collections.Generic;
using System.Data;
using System.IdentityModel.Tokens.Jwt;
using System.Net;
using System.Security.Claims;
using System.Text;
using System.Xml.Linq;
using backendpedidofigueri.Utilities;



namespace backendpedidofigueri.Controllers.Login
{
    public class UserSettings
    {
        public object Layout { get; set; } = new { };  // Inicializado como un objeto vacío
        public object Theme { get; set; } = new { };  // Puedes hacer lo mismo para Theme si lo necesitas
    }

    public class UserData
    {
        public string DisplayName { get; set; }
        public string PhotoURL { get; set; }
        public string Email { get; set; }
        public UserSettings Settings { get; set; }
        public List<string> Shortcuts { get; set; }
    }

    public class User
    {
        public string Uuid { get; set; }
        public string From { get; set; } = "custom-db";
        public string Role { get; set; }
        public UserData Data { get; set; }
    }

    public class ItemResp3
    {
        public int Status { get; set; }
        public string Message { get; set; }
        public User User { get; set; }
        public string access_token { get; set; }
        public IEnumerable<object> Navigation { get; set; }  // Propiedad agregada para almacenar el groupby

    }

    public class ItemResp2
    {
        public int Status { get; set; }
        public string Message { get; set; }
        public object Data { get; set; }
        public List<CustomError> Error { get; set; }
    }
    public class CustomError
    {
        public string Type { get; set; }
        public string Message { get; set; }
    }
    public class NavigationNode
    {
        public string id { get; set; }
        public string title { get; set; }
        public string type { get; set; }
        public string icon { get; set; }
        public string url { get; set; }
        public List<NavigationNode> children { get; set; }
    }

    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class LoginController : ControllerBase
    {
        private DbContextS context;
        private Status status = new Status();
        private readonly IConfiguration configuration;

        public LoginController(DbContextS _context, IConfiguration _configuration)
        {
            context = _context;
            configuration = _configuration;
        }

        [AllowAnonymous]
        [HttpPost("PostToken")]
        public async Task<ActionResult> PostToken(Usuario usu)
        {
            //Login y pass
            try
            {
                usu.Pass = Crypto.EncryptRijndael(usu.Pass);

                List<Usuario> usuario = await context.Usuario.FromSqlInterpolated($"Exec [login].[SP_VALIDATION_CREDENTIAL] @p_login={usu.Login},@p_pass={usu.Pass}").ToListAsync();

                if (usuario.Count() > 0)
                {
                    var claims = new ClaimsIdentity();
                    claims.AddClaim(new Claim(ClaimTypes.NameIdentifier, usuario[0].Login));
                    claims.AddClaim(new Claim(ClaimTypes.NameIdentifier, usuario[0].IdUsuario.ToString()));

                    var securityKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(configuration.GetValue<string>("Jwt:Key")));
                    var credentials = new SigningCredentials(securityKey, SecurityAlgorithms.HmacSha256Signature);
                    var tokenDescriptor = new SecurityTokenDescriptor
                    {
                        Subject = claims,
                        Expires = DateTime.UtcNow.AddHours(48),
                        SigningCredentials = credentials
                    };

                    var tokenHandler = new JwtSecurityTokenHandler { };
                    var createdToken = tokenHandler.CreateToken(tokenDescriptor);
                    var bearerToken = tokenHandler.WriteToken(createdToken);

                    //En caso se logue ,le de los accesos

                    var IdUsuario = usuario[0].IdUsuario;
                    IEnumerable<Navigation> navigation = (IEnumerable<Navigation>)await context.Navigation.FromSqlInterpolated($"Exec [login].[navegacion] @IdUsuario={IdUsuario}").ToListAsync();
                    var roots = navigation.Where(x => x.IdFuncionSuper == null).ToList();
                    var list = roots.Select(x => ProcessNode(navigation, x)).ToList();
                    var rootsDistinct = roots.DistinctBy(c => c.NomModulo);
                    var groupby = rootsDistinct.Select(c => new { id = c.NomModulo, title = c.NomModulo, type = "collapse", icon = (c.Icon == null) ? null : c.Icon.Trim(), link = ' ', children = list.Where(x => x.id == c.NomModulo) });
                    var user = new User
                    {
                        Uuid = "XgbuVEXBU5gtSKdbQRP1Zbbby1i1", // Puedes obtenerlo de tu base de datos o de cualquier otra fuente
                        Role = "admin", // Puedes obtenerlo de tu base de datos o de cualquier otra fuente
                        Data = new UserData
                        {
                            DisplayName = "Abbott Keitch", // Puedes obtenerlo de tu base de datos o de cualquier otra fuente
                            PhotoURL = "assets/images/avatars/brian-hughes.jpg", // Puedes obtenerlo de tu base de datos o de cualquier otra fuente
                            Email = "admin@fusetheme.com", // Puedes obtenerlo de tu base de datos o de cualquier otra fuente
                            Settings = new UserSettings
                            {
                                // Rellena los ajustes del usuario aquí
                            },
                            Shortcuts = new List<string>
            {
                "apps.calendar",
                "apps.mailbox",
                "apps.contacts"
            }
                        }
                    };
                    return StatusCode(200, new ItemResp3
                    {
                        Status = 200,
                        Message = status.CONFIRM,
                        User = user,
                        access_token = bearerToken
                    });
                }
                else
                {
                    var errorList = new List<CustomError>
    {
        new CustomError { Type = "email", Message = "Ha ocurrido un error" }
    };

                    return StatusCode(200, new ItemResp2
                    {
                        Status = 200,
                        Message = status.NOTFOUND,
                        Data = null,
                        Error = errorList
                    });
                }

            }
            catch (InvalidCastException e)
            {
                return StatusCode(404, new ItemResp { status = 200, message = status.ERROR, data = e.ToString() });
            }

        }
        [HttpGet("GetNavigation")]
        public async Task<ActionResult> GetNavigation()
        {
            // 1. Obtener el valor de la cabecera 'Authorization'
            var authorizationHeader = this.Request.Headers["Authorization"].ToString();

            // 2. Extraer el token real (sin "Bearer ")
            string bearerToken;
            if (!string.IsNullOrEmpty(authorizationHeader) && authorizationHeader.StartsWith("Bearer ", StringComparison.OrdinalIgnoreCase))
            {
                bearerToken = authorizationHeader.Substring("Bearer ".Length).Trim();
            }
            else
            {
                // Aquí puedes manejar el error si el token no se encuentra o no tiene el formato correcto.
                return BadRequest("Token no válido.");
            }

            var IdUsuario = ((ClaimsIdentity)User.Identity).FindAll(ClaimTypes.NameIdentifier).ToList()[1].Value;
            IEnumerable<Navigation> navigation = (IEnumerable<Navigation>)await context.Navigation.FromSqlInterpolated($"Exec [login].[navegacion] @IdUsuario={IdUsuario}").ToListAsync();
            var roots = navigation.Where(x => x.IdFuncionSuper == null).ToList();
            var list = roots.Select(x => ProcessNode(navigation, x)).ToList();
            var rootsDistinct = roots.DistinctBy(c => c.NomModulo);

            var groupby = rootsDistinct.Select(c => new { id = c.NomModulo, title = c.NomModulo, type = "collapse", icon = (c.Icon == null) ? null : c.Icon.Trim(), link = ' ', children = list.Where(x => x.id == c.NomModulo) });

            var user = new User
            {
                Uuid = "XgbuVEXBU5gtSKdbQRP1Zbbby1i1",
                Role = "admin",
                Data = new UserData
                {
                    DisplayName = "Abbott Keitch",
                    PhotoURL = "assets/images/avatars/brian-hughes.jpg",
                    Email = "admin@fusetheme.com",
                    Settings = new UserSettings
                    {
                        // Rellena los ajustes del usuario aquí
                    },
                    Shortcuts = new List<string>
            {
                "apps.calendar",
                "apps.mailbox",
                "apps.contacts"
            }
                }
            };
            return StatusCode(200, new ItemResp3
            {
                Status = 200,
                Message = status.CONFIRM,
                User = user,
                access_token = bearerToken,
                Navigation = groupby  // Incluimos groupby en la respuesta

            });
        }

        private NavigationNode ProcessNode(IEnumerable<Navigation> navigation, Navigation node)
        {
            var children = navigation.Where(x => x.IdFuncionSuper == node.IdFuncion)
                .Select(x => ProcessNode(navigation, x))
                .ToList();

            var result = new NavigationNode() { };

            result = new NavigationNode
            {
                id = node.NomModulo,
                title = node.NomFuncion,
                type = "item",
                icon = (node.Icon == null) ? null : node.Icon.Trim(),
                url = node.Ruta == null ? node.Ruta : node.Ruta.Trim(),
            };
            if (children.Any())
            {
                result = new NavigationNode { id = node.NomModulo, title = node.NomFuncion, type = "collapse", icon = (node.Icon == null) ? null : node.Icon.Trim(), url = node.Ruta == null ? node.Ruta : node.Ruta.Trim(), children = children };
            }
            return result;
        }

    }
}
