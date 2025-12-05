using QuestPDF.Fluent;
using QuestPDF.Infrastructure;
using QuestPDF.Helpers;
using ReactAppREST.Server.Models;
using System.Collections.Generic;
using System.IO;

public class AlumnoReporteDocument
{
    private readonly List<ReporteAlumno> _alumnos;
    private readonly string _rutaLogo;

    public AlumnoReporteDocument(List<ReporteAlumno> alumnos, string rutaLogo = "")
    {
        _alumnos = alumnos;
        _rutaLogo = rutaLogo;
    }

    public Document Create()
    {
        return Document.Create(doc =>
        {
            doc.Page(page =>
            {
                page.Margin(30);

                // =============================
                //           HEADER
                // =============================
                page.Header().ShowOnce().Row(row =>
                {
                    if (!string.IsNullOrWhiteSpace(_rutaLogo) && File.Exists(_rutaLogo))
                    {
                        var imgBytes = File.ReadAllBytes(_rutaLogo);
                        row.ConstantItem(120).Image(imgBytes);
                    }
                    else
                    {
                        row.ConstantItem(120).Height(50).Placeholder();
                    }

                    row.RelativeItem().Column(col =>
                    {
                        col.Item().AlignCenter().Text("Sistema Escolar - Reporte General")
                            .Bold().FontSize(14);

                        col.Item().AlignCenter().Text("Listado oficial de alumnos")
                            .FontSize(10);

                        col.Item().AlignCenter().Text(DateTime.Now.ToString("dd/MM/yyyy"))
                            .FontSize(9);
                    });

                    row.RelativeItem().Column(col =>
                    {
                        col.Item().Border(1).BorderColor("#257272").Padding(5)
                            .AlignCenter().Text("REPORTE")
                            .Bold();

                        col.Item().Background("#257272").Border(1)
                            .BorderColor("#257272")
                            .AlignCenter().Padding(5)
                            .Text("Alumnos")
                            .FontColor("#fff");

                        col.Item().Border(1).BorderColor("#257272").Padding(5)
                            .AlignCenter().Text($"Total: {_alumnos.Count}");
                    });
                });

                // =============================
                //         CONTENIDO
                // =============================
                page.Content().PaddingVertical(10).Column(col =>
                {
                    // Subtítulo estilo
                    col.Item().Text("Información general")
                        .Underline().Bold().FontSize(12);

                    col.Item().Element(e => e.LineHorizontal(0.7f));

                    // =========================
                    //       TABLA
                    // =========================
                    col.Item().Table(table =>
                    {
                        table.ColumnsDefinition(c =>
                        {
                            c.RelativeColumn(1);
                            c.RelativeColumn(2);
                            c.RelativeColumn(2);
                            c.RelativeColumn(2);
                            c.RelativeColumn(2);
                            c.RelativeColumn(2);
                            c.RelativeColumn(1);
                        });

                        table.Header(header =>
                        {
                            void HeaderCell(string t) =>
                                header.Cell()
                                      .Background("#257272")
                                      .Padding(5)
                                      .Text(t)
                                      .FontColor("#fff")
                                      .FontSize(10);

                            HeaderCell("#");
                            HeaderCell("Nombre");
                            HeaderCell("Apellido P.");
                            HeaderCell("Apellido M.");
                            HeaderCell("Grado");
                            HeaderCell("Teléfono");
                            HeaderCell("Activo");
                        });

                        int index = 1;

                        foreach (var a in _alumnos)
                        {
                            void BodyCell(string t, bool alignRight = false) =>
                                table.Cell()
                                     .BorderBottom(0.5f)
                                     .BorderColor("#D9D9D9")
                                     .Padding(4)
                                     .AlignRight()
                                     .Text(t)
                                     .FontSize(10);

                            BodyCell(index++.ToString());
                            BodyCell(a.Nombre);
                            BodyCell(a.ApellidoPaterno);
                            BodyCell(a.ApellidoMaterno);
                            BodyCell(a.Grado);
                            BodyCell(a.Telefono);
                            BodyCell(a.Activo ? "Sí" : "No");
                        }
                    });

                    col.Spacing(10);
                });

                // =============================
                //           FOOTER
                // =============================
                page.Footer()
                    .AlignRight()
                    .Text(txt =>
                    {
                        txt.Span("Página ").FontSize(10);
                        txt.CurrentPageNumber().FontSize(10);
                        txt.Span(" de ").FontSize(10);
                        txt.TotalPages().FontSize(10);
                    });
            });
        });
    }
}
