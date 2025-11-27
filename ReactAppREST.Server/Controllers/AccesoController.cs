using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ReactAppREST.Server.Models;
using System.ComponentModel.DataAnnotations;
using System.Security.Claims;
using System.Threading.Tasks;

namespace ReactAppREST.Server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AccesoController : ControllerBase
    {
        private readonly SemestreFrontContext _context;
        private readonly ILogger<AccesoController> _logger;

        public AccesoController(SemestreFrontContext context, ILogger<AccesoController> logger)
        {
            _context = context;
            _logger = logger;
        }

        // DTO para login
        public class LoginDto
        {
            [Required]
            public string CaUsuaTEmail { get; set; }
            [Required]
            public string CaUsuaTContraseña { get; set; }
        }

        // DTO para registro
        public class RegistroDto
        {
            public string? CaUsuaTApP { get; set; }
            public string? CaUsuaTApM { get; set; }
            [Required]
            public string CaUsuaTContraseña { get; set; }
            [Required]
            public string CaUsuaTConfirmarContraseña { get; set; }
            public string? CaUsuaTNombre { get; set; }
            [Required]
            public string CaUsuaTEmail { get; set; }
        }

        // POST: api/Acceso/Registrar
        [HttpPost]
        [Route("Registrar")]
        public async Task<ActionResult> Registrar([FromBody] RegistroDto modelo)
        {
            try
            {
                _logger.LogInformation("Intento de registro recibido para email: {Email}", modelo.CaUsuaTEmail);

                if (modelo.CaUsuaTContraseña != modelo.CaUsuaTConfirmarContraseña)
                {
                    _logger.LogWarning("Las contraseñas no coinciden para el email: {Email}", modelo.CaUsuaTEmail);
                    return BadRequest(new { mensaje = "Las contraseñas no coinciden." });
                }

                var usuarioExiste = await _context.CaUsuarios
                    .FirstOrDefaultAsync(u => u.CaUsuaTEmail == modelo.CaUsuaTEmail);

                if (usuarioExiste != null)
                {
                    _logger.LogWarning("El email ya existe: {Email}", modelo.CaUsuaTEmail);
                    return BadRequest(new { mensaje = "Ya existe una cuenta registrada con este correo." });
                }

                // Validar campos requeridos
                if (string.IsNullOrEmpty(modelo.CaUsuaTNombre))
                {
                    _logger.LogWarning("El nombre es requerido para el email: {Email}", modelo.CaUsuaTEmail);
                    return BadRequest(new { mensaje = "El nombre es obligatorio." });
                }

                if (string.IsNullOrEmpty(modelo.CaUsuaTEmail))
                {
                    _logger.LogWarning("El email es requerido");
                    return BadRequest(new { mensaje = "El email es obligatorio." });
                }

                CaUsuario nuevoUsuario = new CaUsuario
                {
                    CaUsuaTNombre = modelo.CaUsuaTNombre?.Trim(),
                    CaUsuaTApP = modelo.CaUsuaTApP?.Trim(),
                    CaUsuaTApM = modelo.CaUsuaTApM?.Trim(),
                    CaUsuaTEmail = modelo.CaUsuaTEmail?.Trim(),
                    CaUsuaTContraseña = modelo.CaUsuaTContraseña,
                    CaUsuaBActivo = true
                };

                await _context.CaUsuarios.AddAsync(nuevoUsuario);
                await _context.SaveChangesAsync();

                _logger.LogInformation("Usuario registrado exitosamente con ID: {UsuarioId}", nuevoUsuario.CaUsuaNId);

                return Ok(new { mensaje = "Usuario registrado exitosamente." });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error al registrar usuario para email: {Email}", modelo.CaUsuaTEmail);
                return StatusCode(500, new { mensaje = "Error interno del servidor al registrar el usuario." });
            }
        }

        // POST: api/Acceso/Login
        [HttpPost]
        [Route("Login")]
        public async Task<ActionResult> Login([FromBody] LoginDto modelo)
        {
            var usuario = await _context.CaUsuarios
                .FirstOrDefaultAsync(u => u.CaUsuaTEmail == modelo.CaUsuaTEmail && u.CaUsuaTContraseña == modelo.CaUsuaTContraseña);

            if (usuario == null)
            {
                return BadRequest(new { mensaje = "Credenciales incorrectas." });
            }

            if (usuario.CaUsuaBActivo == false)
            {
                return BadRequest(new { mensaje = "Este usuario está inactivo." });
            }

            var claims = new List<Claim>
            {
                new Claim(ClaimTypes.Name, usuario.CaUsuaTNombre ?? ""),
                new Claim(ClaimTypes.Email, usuario.CaUsuaTEmail ?? ""),
                new Claim("CaUsuaNId", usuario.CaUsuaNId.ToString()),
                new Claim("NombreCompleto", $"{usuario.CaUsuaTNombre} {usuario.CaUsuaTApP} {usuario.CaUsuaTApM}".Trim())
            };

            var claimsIdentity = new ClaimsIdentity(claims, CookieAuthenticationDefaults.AuthenticationScheme);
            var authProperties = new AuthenticationProperties
            {
                AllowRefresh = true,
                ExpiresUtc = DateTimeOffset.UtcNow.AddMinutes(60),
                IsPersistent = true
            };

            await HttpContext.SignInAsync(
                CookieAuthenticationDefaults.AuthenticationScheme,
                new ClaimsPrincipal(claimsIdentity),
                authProperties);

            // Devolver información del usuario sin contraseña
            var usuarioResponse = new
            {
                usuario.CaUsuaNId,
                usuario.CaUsuaTNombre,
                usuario.CaUsuaTApP,
                usuario.CaUsuaTApM,
                usuario.CaUsuaTEmail,
                usuario.CaUsuaBActivo
            };

            return Ok(new { mensaje = "Login exitoso", usuario = usuarioResponse });
        }

        // POST: api/Acceso/Logout
        [HttpPost]
        [Route("Logout")]
        public async Task<ActionResult> Logout()
        {
            await HttpContext.SignOutAsync(CookieAuthenticationDefaults.AuthenticationScheme);
            return Ok(new { mensaje = "Sesión cerrada exitosamente." });
        }

        // GET: api/Acceso/UsuarioActual
        [HttpGet]
        [Route("UsuarioActual")]
        public ActionResult ObtenerUsuarioActual()
        {
            if (User.Identity.IsAuthenticated)
            {
                var usuario = new
                {
                    Id = User.FindFirst("CaUsuaNId")?.Value,
                    Nombre = User.FindFirst(ClaimTypes.Name)?.Value,
                    Email = User.FindFirst(ClaimTypes.Email)?.Value,
                    NombreCompleto = User.FindFirst("NombreCompleto")?.Value
                };
                return Ok(usuario);
            }
            return Unauthorized(new { mensaje = "Usuario no autenticado" });
        }

        // GET: api/Acceso/VerificarAutenticacion
        [HttpGet]
        [Route("VerificarAutenticacion")]
        public ActionResult VerificarAutenticacion()
        {
            return Ok(new { autenticado = User.Identity.IsAuthenticated });
        }
    }
}