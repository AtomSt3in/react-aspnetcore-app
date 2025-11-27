using System;
using System.Collections.Generic;
using System.Text.Json.Serialization;

namespace ReactAppREST.Server.Models;

public partial class CaGrado
{
    public int CaGradoNId { get; set; }

    public string? CaGradoTDescripcion { get; set; }

    [JsonIgnore]
    public virtual ICollection<CaAlumno> CaAlumnos { get; set; } = new List<CaAlumno>();
}
