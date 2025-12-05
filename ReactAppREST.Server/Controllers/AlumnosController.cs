using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Hosting;
using QuestPDF.Fluent;
using ReactAppREST.Server.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace proyectoFinal2.Server.Controllers
{
    
    [Route("api/[controller]")]
    [ApiController]
    public class AlumnosController : ControllerBase
    {
        private readonly SemestreFrontContext _context;
        private readonly IWebHostEnvironment _hostEnvironment;

        public AlumnosController(SemestreFrontContext context, IWebHostEnvironment hostEnvironment)
        {
            _context = context;
            _hostEnvironment = hostEnvironment;
        }

        //GET: obtener/Alumnos
        [HttpGet]
        [Route("Lista")]
        public async Task<ActionResult> Get()
        {
            var alumnos = await _context.CaAlumnos
                .Include(a => a.CaGradN) // Incluye el grado relacionado
                .AsNoTracking()
                .ToListAsync();

            return StatusCode(StatusCodes.Status200OK, alumnos);
        }

        //GET: obtener/Alumnos/0
        [HttpGet]
        [Route("Obtener/{id:int}")]
        public async Task<ActionResult> Get(int id)
        {
            var alumno = await _context.CaAlumnos
                .Include(a => a.CaGradN)
                .AsNoTracking()
                .FirstOrDefaultAsync(a => a.CaAlumnNId == id);

            if (alumno == null)
                return NotFound($"No se encontró un alumno con el ID {id}");

            return StatusCode(StatusCodes.Status200OK, alumno);
        }

        //POST:
        [HttpPost]
        [Route("Nuevo")]
        public async Task<ActionResult> Nuevo([FromBody] CaAlumno alumno)
        {
            alumno.CaAlumnBActivo = true;

            var grado = await _context.CaGrados.FindAsync(alumno.CaGradNId);
            if (grado == null)
            {
                return BadRequest(new { mensaje = "El grado especificado no existe." });
            }

            alumno.CaGradN = grado;

            await _context.CaAlumnos.AddAsync(alumno);
            await _context.SaveChangesAsync();

            return Ok(new { mensaje = "ok" });
        }

        //PUT: api/Alumnos/Editar
        [HttpPut]
        [Route("Editar")]
        public async Task<ActionResult> Editar([FromBody] CaAlumno alumno)
        {
            var alumnoExistente = await _context.CaAlumnos.FindAsync(alumno.CaAlumnNId);
            if (alumnoExistente == null)
                return NotFound(new { mensaje = $"No se encontró el alumno con ID {alumno.CaAlumnNId}" });

            // Validar que el grado exista
            var grado = await _context.CaGrados.FindAsync(alumno.CaGradNId);
            if (grado == null)
                return BadRequest(new { mensaje = "El grado especificado no existe." });

            // Actualizar campos
            alumnoExistente.CaAlumnTNombre = alumno.CaAlumnTNombre;
            alumnoExistente.CaAlumnTApellidoPaterno = alumno.CaAlumnTApellidoPaterno;
            alumnoExistente.CaAlumnTApellidoMaterno = alumno.CaAlumnTApellidoMaterno;
            alumnoExistente.CaAlumnTTelefono = alumno.CaAlumnTTelefono;
            alumnoExistente.CaGradNId = alumno.CaGradNId;
            alumnoExistente.CaAlumnBActivo = alumno.CaAlumnBActivo;

            await _context.SaveChangesAsync();

            return Ok(new { mensaje = "ok" });
        }

        //DELETE: eliminar/alumnos/0
        [HttpDelete]
        [Route("Eliminar/{id:int}")]
        public async Task<ActionResult> Eliminar(int id)
        {
            var alumno = await _context.CaAlumnos.FirstOrDefaultAsync(a => a.CaAlumnNId == id);

            _context.CaAlumnos.Remove(alumno);

            await _context.SaveChangesAsync();

            return StatusCode(StatusCodes.Status200OK, new { mensaje = "ok" });
        }

        // POST: api/Alumnos/Bulk
        [HttpPost]
        [Route("Bulk")]
        public async Task<ActionResult> Bulk([FromBody] List<CaAlumno> alumnos)
        {
            if (alumnos == null || alumnos.Count == 0)
                return BadRequest(new { mensaje = "No se recibieron alumnos" });


            // Validar cada registro mínimamente
            foreach (var alumno in alumnos)
            {
                if (string.IsNullOrWhiteSpace(alumno.CaAlumnTNombre) || string.IsNullOrWhiteSpace(alumno.CaAlumnTApellidoPaterno) || alumno.CaGradNId == null)
                    return BadRequest(new { mensaje = "Uno o más registros tienen campos obligatorios vacíos" });


                var grado = await _context.CaGrados.FindAsync(alumno.CaGradNId);
                if (grado == null)
                    return BadRequest(new { mensaje = $"El grado con ID {alumno.CaGradNId} no existe" });


                alumno.CaAlumnBActivo = alumno.CaAlumnBActivo ?? true;
                alumno.CaGradN = grado;
            }


                await _context.CaAlumnos.AddRangeAsync(alumnos);
            await _context.SaveChangesAsync();


            return Ok(new { mensaje = "ok", cantidad = alumnos.Count });
        }

        [HttpGet("Reporte")]
        public async Task<IActionResult> GenerarReporteAlumnos()
        {
            var alumnos = await _context.CaAlumnos
                .Include(a => a.CaGradN)
                .Select(a => new ReporteAlumno
                {
                    Id = a.CaAlumnNId,
                    Nombre = a.CaAlumnTNombre,
                    ApellidoPaterno = a.CaAlumnTApellidoPaterno,
                    ApellidoMaterno = a.CaAlumnTApellidoMaterno,
                    Telefono = a.CaAlumnTTelefono,
                    Grado = a.CaGradN != null ? a.CaGradN.CaGradoTDescripcion : "N/A",
                    Activo = a.CaAlumnBActivo ?? false
                })
                .ToListAsync();

            // >>> OPCIONAL: Ruta del logo <<<
            var rutaLogo = Path.Combine(_hostEnvironment.WebRootPath, "images", "tecDelicias.png");

            // Nuevo formato del documento
            var documento = new AlumnoReporteDocument(alumnos, rutaLogo).Create();

            var pdf = documento.GeneratePdf();

            return File(pdf, "application/pdf", "Reporte_Alumnos.pdf");
        }


    }
}