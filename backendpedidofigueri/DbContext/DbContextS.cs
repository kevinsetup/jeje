
using backendpedidofigueri.Entity.Login;
using backendpedidofigueri.Entity.Usuarios;
using Microsoft.EntityFrameworkCore;
using System.Text.RegularExpressions;

public class DbContextS : DbContext
{
    public DbContextS(DbContextOptions<DbContextS> options) : base(options)
    {


    }

    //Login
    public DbSet<Usuario> Usuario { get; set; }
    public DbSet<Navigation> Navigation { get; set; }
    public DbSet<InfoUser> InfoUser { get; set; }

  



  //Administracion




  //Compras





}

