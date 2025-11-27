using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ReactAppREST.Server.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace proyectoFinal2.Server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class GradosController : ControllerBase
    {
        private readonly SemestreFrontContext _context;

        public GradosController(SemestreFrontContext context)
        {
            _context = context;
        }

        // GET: api/Grados/Obtener
        [HttpGet]
        [Route("Obtener")]
        public async Task<ActionResult> Get()
        {
            var grados = await _context.CaGrados
                .AsNoTracking()
                .ToListAsync();

            return StatusCode(StatusCodes.Status200OK, grados);
        }


        //GET: api/Grados/5
        [HttpGet("{id:int}")]
        public async Task<ActionResult<CaGrado>> GetById(int id)
        {
            var grado = await _context.CaGrados.FindAsync(id);
            if (grado == null)
                return NotFound($"No se encontró un grado con el ID {id}");

            return Ok(grado);
        }

        //POST: api/Grados
        [HttpPost]
        public async Task<ActionResult> Create([FromBody] CaGrado grado)
        {
            if (string.IsNullOrWhiteSpace(grado.CaGradoTDescripcion))
                return BadRequest("La descripción del grado es obligatoria.");

            _context.CaGrados.Add(grado);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetById), new { id = grado.CaGradoNId }, grado);
        }

        //PUT: api/Grados/5
        [HttpPut("{id:int}")]
        public async Task<ActionResult> Update(int id, [FromBody] CaGrado grado)
        {
            if (id != grado.CaGradoNId)
                return BadRequest("El ID del grado no coincide.");

            var existente = await _context.CaGrados.FindAsync(id);
            if (existente == null)
                return NotFound($"No se encontró un grado con el ID {id}");

            existente.CaGradoTDescripcion = grado.CaGradoTDescripcion;
            await _context.SaveChangesAsync();

            return Ok("Grado actualizado correctamente.");
        }

        //DELETE: api/Grados/5
        [HttpDelete("{id:int}")]
        public async Task<ActionResult> Delete(int id)
        {
            var grado = await _context.CaGrados.FindAsync(id);
            if (grado == null)
                return NotFound($"No se encontró un grado con el ID {id}");

            _context.CaGrados.Remove(grado);
            await _context.SaveChangesAsync();

            return Ok("Grado eliminado correctamente.");
        }
    }
}
