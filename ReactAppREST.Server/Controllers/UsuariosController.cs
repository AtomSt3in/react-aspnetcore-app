using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ReactAppREST.Server.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace ReactAppREST.Server.Controllers
{
    //[Authorize]
    [Route("api/[controller]")]
    [ApiController]
    public class UsuariosController : ControllerBase
    {
        private readonly SemestreFrontContext _context;

        public UsuariosController(SemestreFrontContext context)
        {
            _context = context;
        }

        //GET: obtener/Usuarios
        [HttpGet]
        [Route("Lista")]
        public async Task<ActionResult> Get()
        {
            var usuarios = await _context.CaUsuarios
                .AsNoTracking()
                .ToListAsync();

            return StatusCode(StatusCodes.Status200OK, usuarios);
        }

        //GET: obtener/Usuarios/5
        [HttpGet]
        [Route("Obtener/{id:int}")]
        public async Task<ActionResult> Get(int id)
        {
            var usuario = await _context.CaUsuarios
                .AsNoTracking()
                .FirstOrDefaultAsync(u => u.CaUsuaNId == id);

            if (usuario == null)
                return NotFound($"No se encontró un usuario con el ID {id}");

            return StatusCode(StatusCodes.Status200OK, usuario);
        }

        //POST:
        [HttpPost]
        [Route("Nuevo")]
        public async Task<ActionResult> Nuevo([FromBody] CaUsuario usuario)
        {
            // Si tienes un campo activo, descomenta esta línea
            // usuario.CaUsuaBActivo = true;

            await _context.CaUsuarios.AddAsync(usuario);
            await _context.SaveChangesAsync();

            return Ok(new { mensaje = "ok" });
        }

        //PUT: api/Usuarios/Editar
        [HttpPut]
        [Route("Editar")]
        public async Task<ActionResult> Editar([FromBody] CaUsuario usuario)
        {
            var usuarioExistente = await _context.CaUsuarios.FindAsync(usuario.CaUsuaNId);
            if (usuarioExistente == null)
                return NotFound(new { mensaje = $"No se encontró el usuario con ID {usuario.CaUsuaNId}" });

            // Actualizar campos específicos
            // Ajusta estas propiedades según los campos de tu modelo CaUsuario
            usuarioExistente.CaUsuaTNombre = usuario.CaUsuaTNombre;
            usuarioExistente.CaUsuaTApP = usuario.CaUsuaTApP;
            usuarioExistente.CaUsuaTApM = usuario.CaUsuaTApM;
            usuarioExistente.CaUsuaTEmail = usuario.CaUsuaTEmail;
            // Agrega aquí todas las propiedades que necesites actualizar

            await _context.SaveChangesAsync();

            return Ok(new { mensaje = "ok" });
        }

        //DELETE: eliminar/usuarios/5
        [HttpDelete]
        [Route("Eliminar/{id:int}")]
        public async Task<ActionResult> Eliminar(int id)
        {
            var usuario = await _context.CaUsuarios.FirstOrDefaultAsync(u => u.CaUsuaNId == id);
            if (usuario == null)
                return NotFound(new { mensaje = $"No se encontró el usuario con ID {id}" });

            _context.CaUsuarios.Remove(usuario);
            await _context.SaveChangesAsync();

            return StatusCode(StatusCodes.Status200OK, new { mensaje = "ok" });
        }

        // POST: api/Usuarios/Bulk
        [HttpPost]
        [Route("Bulk")]
        public async Task<ActionResult> Bulk([FromBody] List<CaUsuario> usuarios)
        {
            if (usuarios == null || usuarios.Count == 0)
                return BadRequest(new { mensaje = "No se recibieron usuarios" });

            // Validar cada registro mínimamente
            foreach (var usuario in usuarios)
            {
                // Ajusta la validación según los campos requeridos de tu modelo
                if (string.IsNullOrWhiteSpace(usuario.CaUsuaTNombre) ||
                    string.IsNullOrWhiteSpace(usuario.CaUsuaTApP) ||
                    string.IsNullOrWhiteSpace(usuario.CaUsuaTApM))
                    return BadRequest(new { mensaje = "Uno o más registros tienen campos obligatorios vacíos" });

                // Si tienes un campo activo, establece el valor por defecto
                // usuario.CaUsuaBActivo = usuario.CaUsuaBActivo ?? true;
            }

            await _context.CaUsuarios.AddRangeAsync(usuarios);
            await _context.SaveChangesAsync();

            return Ok(new { mensaje = "ok", cantidad = usuarios.Count });
        }
    }
}