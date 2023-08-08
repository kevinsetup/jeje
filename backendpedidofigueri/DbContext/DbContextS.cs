
using Azure;
using backendpedidofigueri.Entity.Credito;
using backendpedidofigueri.Entity.DireccionEnvio;
using backendpedidofigueri.Entity.Historial;
using backendpedidofigueri.Entity.Login;
using backendpedidofigueri.Entity.Pedidos;
using backendpedidofigueri.Entity.Rol.Funcion;
using backendpedidofigueri.Entity.Rol.Permisos;
using backendpedidofigueri.Entity.Rol.Responsable;
using backendpedidofigueri.Entity.Rol.Roles;
using backendpedidofigueri.Entity.Rol.TipoUsuario;
using backendpedidofigueri.Entity.Rol.Vendedor;
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
    public DbSet<Responsable> Responsable { get; set; }
    public DbSet<Vendedor> Vendedor { get; set; }
    public DbSet<Funcion> Funcion { get; set; }

    //Usuario
    public DbSet<Usuario> Usuario { get; set; }
    public DbSet<UsuarioEdit> UsuarioEdit { get; set; }

    //Pedido
    public DbSet<DetallePedidoProducto> DetallePedidoProducto { get; set; }
    public DbSet<GetPedidos> GetPedidos { get; set; }
    public DbSet<GetPedidosCancelados> GetPedidosCancelados { get; set; }
    public DbSet<GetDetallePedido> GetDetallePedido { get; set; }
    public DbSet<DetalleCheckout> DetalleCheckout { get; set; }
    public DbSet<DireccionEnvio> DireccionEnvio { get; set; }

  
    //Administracion


    //Historial
    public DbSet<HistorialSinPrecio> HistorialSinPrecio { get; set; }


    //Credito
    public DbSet<Creditos> Credito { get; set; }
    public DbSet<Cliente> Cliente{ get; set; }





}

