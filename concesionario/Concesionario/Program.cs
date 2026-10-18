using Concesionario.Endpoints;
using Concesionario.Models;
using Concesionario.Services;
using Scalar.AspNetCore;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using System.Text;
using concesionario.Endpoints;

var builder = WebApplication.CreateBuilder(args);

var jwtKey = builder.Configuration["Jwt:Key"];
var jwtIssuer = builder.Configuration["Jwt:Issuer"];
var jwtAudience = builder.Configuration["Jwt:Audience"];


builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
        .AddJwtBearer(options =>
        {
            options.TokenValidationParameters = new TokenValidationParameters
            {
                ValidateIssuer = true,
                ValidateAudience = true,
                ValidateIssuerSigningKey = true,
                ValidateLifetime = true,
                ValidIssuer = jwtIssuer,
                ValidAudience = jwtAudience,
                IssuerSigningKey = new SymmetricSecurityKey(
                    Encoding.UTF8.GetBytes(jwtKey!))

            };
        });
builder.Services.AddAuthorization();

builder.Services.AddDbContext<ConcesionariodbContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("miconexion")));

// Add services to the container.
// Learn more about configuring OpenAPI at https://aka.ms/aspnet/openapi
builder.Services.AddOpenApi();
builder.Services.AddScoped<AuthService>();

var app = builder.Build();

app.UseAuthentication();
app.UseAuthorization();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
    app.MapScalarApiReference();
}

app.UseHttpsRedirection();

app.MapRolApi();
app.MapMarcaApi();
app.MapCombustibleApi();
app.MapTipoVehiculoApi();
app.MapSucursalApi();
app.MapUsuarioApi();
app.MapVentaApi();
app.MapMantencionApi();
app.MapVehiculoApi();
app.MapArriendoVehiculoApi();
app.MapFacturaApi();
app.MapMantencionRepuestoApi();
app.MapRepuestoApi();
app.Run();
