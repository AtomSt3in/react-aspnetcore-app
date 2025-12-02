using QuestPDF.Fluent;
using QuestPDF.Infrastructure;
using ReactAppREST.Server.Models;
using System.Collections.Generic;

public class AlumnoReporteDocument
{
    private readonly List<ReporteAlumno> _alumnos;

    public AlumnoReporteDocument(List<ReporteAlumno> alumnos)
    {
        _alumnos = alumnos;
    }

    public Document Create()
    {
        return Document.Create(doc =>
        {
            doc.Page(page =>
            {
                page.Margin(30);

                page.Header()
                    .Text("Reporte de Alumnos")
                    .FontSize(20)
                    .SemiBold()
                    .AlignCenter();

                page.Content()
                    .Table(table =>
                    {
                        table.ColumnsDefinition(c =>
                        {
                            c.ConstantColumn(40);
                            c.RelativeColumn(2);
                            c.RelativeColumn(2);
                            c.RelativeColumn(2);
                            c.RelativeColumn(2);
                            c.RelativeColumn(2);
                            c.RelativeColumn(2);
                        });

                        table.Header(header =>
                        {
                            header.Cell().Text("#").Bold();
                            header.Cell().Text("Nombre").Bold();
                            header.Cell().Text("Apellido Paterno").Bold();
                            header.Cell().Text("Apellido Materno").Bold();
                            header.Cell().Text("Grado").Bold();
                            header.Cell().Text("Teléfono").Bold();
                            header.Cell().Text("Activo").Bold();
                        });

                        int index = 1;
                        foreach (var a in _alumnos)
                        {
                            table.Cell().Text(index++.ToString());
                            table.Cell().Text(a.Nombre);
                            table.Cell().Text(a.ApellidoPaterno);
                            table.Cell().Text(a.ApellidoMaterno);
                            table.Cell().Text(a.Grado);
                            table.Cell().Text(a.Telefono);
                            table.Cell().Text(a.Activo ? "Sí" : "No");
                        }
                    });

                page.Footer()
                    .AlignCenter()
                    .Text($"Generado el {DateTime.Now:dd/MM/yyyy}");
            });
        });
    }
}
