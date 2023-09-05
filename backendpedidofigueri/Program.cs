using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using System.Text;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.

builder.Services.AddControllers();
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

//Start Cors configuration
builder.Services.AddCors(options => options.AddDefaultPolicy(builder => builder.WithOrigins("http://localhost:3000", "http://192.168.10.3:9099", "https://192.168.10.3:9099", "https://192.168.10.3:7233", "https://192.168.10.3:7233", "http://localhost:9012", "https://localhost:9012", "https://developer:9012", "http://developer:9012", "https://26.248.51.202:9012", "http://26.248.51.202:9012", "https://26.126.142.213:9012", "http://26.126.142.213:9012", "http://localhost:8070").AllowAnyHeader().AllowAnyMethod()));
builder.Services.AddControllers();
//End Cors configuration

//Start DbContextS
builder.Services.AddDbContext<DbContextS>(options =>
{
    options.UseSqlServer(builder.Configuration.GetConnectionString("DbContextS"));
});

//End DbContextS

//Star JWT Bearer
builder.Services
    .AddHttpContextAccessor()
    .AddAuthorization()
    .AddAuthentication(JwtBearerDefaults.AuthenticationScheme)

    .AddJwtBearer(options =>
    {
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuer = false,
            ValidateAudience = false,
            ValidateLifetime = true,
            ValidateIssuerSigningKey = true,
            IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(builder.Configuration["Jwt:Key"]))
        };
    });

builder.Services.AddAuthorization();

//End JWT Bearer





var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

//Use Cors configuration
app.UseCors();
app.UseHttpsRedirection();

app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();

app.Run();
