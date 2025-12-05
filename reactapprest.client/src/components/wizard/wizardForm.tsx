import { useState, type JSX, useEffect } from "react";
import { Container, Card, CardBody, Button, Row, Col } from "reactstrap";
import UploadStep from "./UploadStep";
import MappingStep from "./MappingStep";
import PreviewStep from "./PreviewStep";
import ConfirmStep from "./ConfirmStep";
import useBulkUpload from "../../hooks/useBulkUpload";

const steps = ["Subir archivo", "Mapear columnas", "Vista previa", "Confirmar y enviar"];

export default function WizardForm(): JSX.Element {
  const [stepIndex, setStepIndex] = useState<number>(() => {
    // restore last step if needed
    const s = sessionStorage.getItem("bulkWizard_step_v3");
    return s ? Number(s) : 0;
  });

  const {
    fileInfo,
    parsedRows,
    rawRows,
    mapping,
    suggestedMapping,
    errors,
    errorsByCell,
    setMapping,
    parseFile,
    autoMapColumns,
    updateCell,
    uploadBulk,
    reset,
  } = useBulkUpload();

  useEffect(() => {
    sessionStorage.setItem("bulkWizard_step_v3", String(stepIndex));
  }, [stepIndex]);

  const next = () => setStepIndex((i) => Math.min(i + 1, steps.length - 1));
  const prev = () => setStepIndex((i) => Math.max(i - 1, 0));
  const goTo = (i: number) => setStepIndex(i);

  return (
    <Container className="mt-4">
      <Row className="justify-content-center">
        <Col lg="10">
          <Card className="custom-card">
            <CardBody>
              <h4 className="mb-3">Carga masiva de Alumnos</h4>
              <p className="text-muted">Wizard: {steps[stepIndex]}</p>

              {stepIndex === 0 && (
                <UploadStep
                  fileInfo={fileInfo}
                  sampleRows={rawRows.slice(0, 3)}
                  onFile={async (file) => {
                    await parseFile(file);
                    // advance automatically on new file
                    if (file) setTimeout(() => next(), 250);
                  }}
                  onContinue={() => next()}
                />
              )}

              {stepIndex === 1 && (
                <MappingStep
                  sampleRow={rawRows[0]}
                  mapping={mapping}
                  setMapping={setMapping}
                  suggestedMapping={suggestedMapping}
                  autoMap={(columns) => {
                    const auto = autoMapColumns(columns);
                    // apply if confident, but let user edit
                    setMapping((prev) => ({ ...Object.keys(prev).reduce((acc, k) => ({ ...acc, [k]: auto[k] ?? prev[k] }), {}) }));
                  }}
                  onNext={() => next()}
                  onBack={() => prev()}
                />
              )}

              {stepIndex === 2 && (
                <PreviewStep
                  rows={parsedRows}
                  mapping={mapping}
                  errors={errors}
                  errorsByCell={errorsByCell}
                  updateCell={updateCell}
                  onBack={() => prev()}
                  onNext={() => next()}
                />
              )}

              {stepIndex === 3 && (
                <ConfirmStep
                  rows={parsedRows}
                  mapping={mapping}
                  errors={errors}
                  onBack={() => prev()}
                  onConfirm={async () => {
                    try {
                      await uploadBulk();
                      alert("Carga finalizada con éxito.");
                      reset();
                      goTo(0);
                    } catch (err: any) {
                      alert(err?.message || "Error al subir");
                    }
                  }}
                />
              )}

              <div className="mt-3 d-flex justify-content-between">
                <Button
                  color="secondary"
                  onClick={() => {
                    reset();
                    goTo(0);
                  }}
                  outline
                >
                  Cancelar
                </Button>
                <div>
                  <small className="text-muted">
                    Paso {stepIndex + 1} de {steps.length}
                  </small>
                </div>
              </div>
            </CardBody>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}
