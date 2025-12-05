import { Table, Button } from "reactstrap";
import { useMemo } from "react";

type Mapping = Record<string, string | null>;

type Props = {
  rows: Record<string, any>[];
  mapping: Mapping;
  errors: { index: number; messages: string[] }[];
  errorsByCell: Record<number, Record<string, string | null>>;
  updateCell: (rowIndex: number, fieldOrCol: string, value: any) => void;
  onBack: () => void;
  onNext: () => void;
};

export default function PreviewStep({
  rows,
  mapping,
  errors,
  errorsByCell,
  updateCell,
  onBack,
  onNext,
}: Props) {
  const preview = rows.slice(0, 50);

  // fields to show (target fields in current map order)
  const validFields = useMemo(
    () =>
      Array.from(
        new Set(
          Object.entries(mapping)
            .filter(([col, field]) => field)
            .map(([col, field]) => field as string)
        )
      ),
    [mapping]
  );

  // for display: map each preview row into object with target keys
  const mapped = preview.map((row) => {
    const result: Record<string, any> = {};
    Object.entries(mapping).forEach(([col, field]) => {
      if (!field) return;
      result[field] = row[col] ?? row[field] ?? "";
    });
    return result;
  });

  const handleBlur = (rowIndex: number, field: string, e: any) => {
    const newValue = e.currentTarget.innerText;
    // Update the underlying parsed row by the field name (we assume buildPayload will prioritize mapping)
    updateCell(rowIndex, field, newValue);
  };

  return (
    <div>
      <p className="text-muted">Se muestran los primeros {preview.length} registros mapeados. Revisa y corrige errores antes de enviar.</p>

      <div className="mb-3">
        {errors.length > 0 ? (
          <div className="text-danger">Se encontraron {errors.length} filas con errores. Puedes corregirlas directamente en la tabla.</div>
        ) : (
          <div className="text-success">No se detectaron errores críticos. Puedes continuar.</div>
        )}
      </div>

      <div style={{ overflowX: "auto" }}>
        <Table responsive bordered className="custom-table">
          <thead className="custom-table-header">
            <tr>
              <th>#</th>
              {validFields.map((f) => (
                <th key={f}>{f}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {mapped.map((r, idx) => (
              <tr key={idx} className="custom-table-row">
                <td style={{ width: 60 }}>{idx + 1}</td>
                {validFields.map((f) => {
                  const cellErr = errorsByCell?.[idx]?.[f];
                  return (
                    <td
                      key={f}
                      contentEditable
                      suppressContentEditableWarning
                      onBlur={(e) => handleBlur(idx, f, e)}
                      className={cellErr ? "cell-error" : "cell-editable"}
                      style={{ minWidth: 120, cursor: "text", whiteSpace: "pre-wrap" }}
                      title={cellErr ?? ""}
                    >
                      {String(r[f] ?? "")}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </Table>
      </div>

      <div className="d-flex justify-content-between mt-3">
        <Button color="secondary" onClick={onBack} outline>← Atrás</Button>
        <Button color="primary" onClick={onNext}>Confirmar →</Button>
      </div>
    </div>
  );
}
