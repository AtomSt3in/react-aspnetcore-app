import { useRef } from "react";
import { Button, Form, FormGroup, Input, Row, Col } from "reactstrap";

type Props = {
  fileInfo: { name: string; size: number } | null;
  sampleRows?: Record<string, any>[];
  onFile: (file: File | null) => Promise<void>;
  onContinue: () => void;
};

export default function UploadStep({ fileInfo, sampleRows = [], onFile, onContinue }: Props) {
  const inputRef = useRef<HTMLInputElement | null>(null);

  return (
    <div>
      <Form>
        <FormGroup>
          <label htmlFor="file">Selecciona un archivo (.csv, .xlsx, .json)</label>
          <Input
            id="file"
            type="file"
            accept=".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/json, .json"
            innerRef={inputRef}
            onChange={async (e) => {
              const file = e.target.files && e.target.files[0] ? e.target.files[0] : null;
              await onFile(file);
            }}
          />
        </FormGroup>

        {fileInfo && (
          <>
            <Row className="mb-2">
              <Col>
                <div className="text-muted">
                  Archivo cargado: <strong>{fileInfo.name}</strong> ({Math.round(fileInfo.size / 1024)} KB)
                </div>
              </Col>
              <Col className="text-end">
                <Button
                  color="danger"
                  onClick={async () => {
                    if (inputRef.current) {
                      inputRef.current.value = "";
                      await onFile(null);
                    }
                  }}
                >
                  Eliminar
                </Button>
              </Col>
            </Row>

            {/* small sample preview */}
            {sampleRows.length > 0 && (
              <div className="mb-3">
                <div className="text-muted mb-1">Vista rápida (primeras {sampleRows.length} filas):</div>
                <div style={{ overflowX: "auto", background: "var(--bg-card)", padding: 8, borderRadius: 8 }}>
                  <table className="custom-table" style={{ width: "100%" }}>
                    <thead>
                      <tr>
                        {Object.keys(sampleRows[0]).map((c) => (
                          <th key={c} style={{ fontSize: 12 }}>{c}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {sampleRows.map((r, i) => (
                        <tr key={i}>
                          {Object.values(r).map((v, j) => (
                            <td key={j} style={{ fontSize: 12 }}>{String(v ?? "")}</td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            <div className="d-flex justify-content-end mt-2">
              <Button color="primary" onClick={onContinue}>
                Continuar →
              </Button>
            </div>
          </>
        )}
      </Form>
    </div>
  );
}
