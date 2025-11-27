using System;
using System.Collections.Generic;
using System.Text.Json.Serialization;

namespace ReactAppREST.Server.Models;

public partial class CaAlumno
{
    public int CaAlumnNId { get; set; }

    public string CaAlumnTNombre { get; set; } = null!;

    public string? CaAlumnTApellidoPaterno { get; set; }

    public string? CaAlumnTApellidoMaterno { get; set; }

    public string? CaAlumnTTelefono { get; set; }

    public int? CaGradNId { get; set; }

    public bool? CaAlumnBActivo { get; set; }

    [JsonIgnore]
    public virtual CaGrado? CaGradN { get; set; }
}
