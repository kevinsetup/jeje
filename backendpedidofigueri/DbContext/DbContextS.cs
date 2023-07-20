
using backendpedidofigueri.Entity.Login;
using backendpedidofigueri.Entity.Usuarios;
using Microsoft.EntityFrameworkCore;
using System.Text.RegularExpressions;

public class DbContextS : DbContext
{
    public DbContextS(DbContextOptions<DbContextS> options) : base(options)
    {


    }


    public DbSet<Usuario> Usuario { get; set; }


    public DbSet<Navigation> Navigation { get; set; }




    //Administracion




    //Compras





}

