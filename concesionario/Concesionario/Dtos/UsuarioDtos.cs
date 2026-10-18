namespace Concesionario.Dtos
{
    // Para devolver la información del usuario en las peticiones GET (sin la contraseña)
    public record UsuarioResponseDto(
        int IdUsuario,
        string Nombre,
        string Email,
        string? Telefono,
        int IdRol,
        string? NombreRol
    );

    // Para recibir los datos cuando se crea un usuario en el POST
    public record CrearUsuarioDto(
        string Nombre,
        string Email,
        string Password,
        string? Telefono,
        int IdRol
    );

    // Para recibir los datos cuando se edita un usuario en el PUT
    public record ActualizarUsuarioDto(
        string Nombre,
        string Email,
        string? Telefono,
        int IdRol
    );

    public record LoginDto(
        string Email,
        string Password
    );
}
