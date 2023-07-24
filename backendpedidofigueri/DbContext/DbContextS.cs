
using backendpedidofigueri.Entity.Login;
using backendpedidofigueri.Entity.Rol.Permisos;
using backendpedidofigueri.Entity.Rol.Roles;
using backendpedidofigueri.Entity.Rol.TipoUsuario;
using backendpedidofigueri.Entity.Usuarios;
using Microsoft.EntityFrameworkCore;
using System.Text.RegularExpressions;

public class DbContextS : DbContext
{
    public DbContextS(DbContextOptions<DbContextS> options) : base(options)
    {


    }

    //Login
    public DbSet<Navigation> Navigation { get; set; }
    public DbSet<InfoUser> InfoUser { get; set; }
    //Roles
    public DbSet<Permiso> Permiso { get; set; }
    public DbSet<Roles> Roles { get; set; }
    public DbSet<TipoUsuario> TipoUsuario { get; set; }
    //Usuario
    public DbSet<Usuario> Usuario { get; set; }
    public DbSet<UsuarioEdit> UsuarioEdit { get; set; }




  //Administracion




  //Compras





}

