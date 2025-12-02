namespace ReactAppREST.Server.Models
{
    public class ReporteAlumno
    {
        public int Id { get; set; }
        public string Nombre { get; set; } = null!;
        public string? ApellidoPaterno { get; set; } = null!;
        public string? ApellidoMaterno { get; set; } = null!;
        public string? Telefono { get; set; } = null!;
        public string? Grado { get; set; } = null!;
        public bool Activo { get; set; }
    }
}
