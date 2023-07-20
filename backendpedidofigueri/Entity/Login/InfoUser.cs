using System;
using System.ComponentModel.DataAnnotations;

namespace backendpedidofigueri.Entity.Login
{
    public class InfoUser
  {
    [Key]
    public int Uuid { get; set; }
    public string? DisplayName { get; set; }
    public string? Rol { get; set; }
    public string? PhotoUrl { get; set; }
    public string? Email { get; set; }

  }
}
