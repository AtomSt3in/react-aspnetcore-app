import { Table, Button } from "reactstrap";

type Mapping = Record<string, string | null>;

type Props = {
  rows: Record<string, any>[];
  mapping: Mapping;
  errors: { index: number; messages: string[] }[];
  onBack: () => void;
  onNext: () => void;
};

export default function PreviewStep({
  rows,
  mapping,
  errors,
  onBack,
  onNext,
}: Props) {
  // Previsualizar solo 20 registros
  const preview = rows.slice(0, 20);

  // Filtrar solo campos del mapping válidos (sin null)
  const validFields = Object.values(mapping).filter(
    (f): f is string => typeof f === "string" && Boolean(f)
  );

  // Mapear datos: r[col] solo si col existe en el row
  const mapped = preview.map((row) => {
    const result: Record<string, any> = {};

    Object.entries(mapping).forEach(([colName, fieldName]) => {
      if (fieldName) {
        // Evitar errores por columnas inexistentes
        result[fieldName] = row?.[colName] ?? "";
      }
    });

    return result;
  });

  return (
    <div>
      <p className="text-muted">
        Se muestran los primeros {preview.length} registros mapeados. Revisa los
        errores antes de continuar.
      </p>

      <div className="mb-3">
        {errors.length > 0 ? (
          <div className="text-danger">
            Se encontraron {errors.length} filas con errores. Revisa el archivo
            o el mapeo.
          </div>
        ) : (
          <div className="text-success">
            No se detectaron errores críticos. Puedes continuar.
          </div>
        )}
      </div>

      {/* Tabla */}
      <Table responsive bordered className="custom-table">
        <thead className="custom-table-header">
          <tr>
            {validFields.map((field) => (
              <th key={field}>{field}</th>
            ))}
          </tr>
        </thead>

        <tbody>
          {mapped.map((row, index) => (
            <tr key={index} className="custom-table-row">
              {validFields.map((field) => (
                <td key={field}>{String(row[field] ?? "")}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </Table>

      {/* Botones */}
      <div className="d-flex justify-content-between mt-3">
        <Button color="secondary" onClick={onBack} outline>
          ← Atrás
        </Button>

        <Button color="primary" onClick={onNext}>
          Confirmar →
        </Button>
      </div>
    </div>
  );
}
