import { useState, type JSX } from "react";
import { Container, Card, CardBody, Button, Row, Col } from "reactstrap";
import UploadStep from "./UploadStep";
import MappingStep from "./MappingStep";
import PreviewStep from "./PreviewStep";
import ConfirmStep from "./ConfirmStep";
import useBulkUpload from "../../hooks/useBulkUpload";

const steps = [
  "Subir archivo",
  "Mapear columnas",
  "Vista previa",
  "Confirmar y enviar",
];

export default function WizardForm(): JSX.Element {
  const [stepIndex, setStepIndex] = useState(0);
  const {
    fileInfo,
    parsedRows,
    mapping,
    setMapping,
    errors,
    setFileInfo,
    parseFile,
    uploadBulk,
    reset,
  } = useBulkUpload();

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
                  onFile={async (file) => {
                    setFileInfo(
                      file ? { name: file.name, size: file.size } : null
                    );
                    await parseFile(file);
                    next();
                  }}
                />
              )}

              {stepIndex === 1 && (
                <MappingStep
                  sampleRow={parsedRows[0]}
                  mapping={mapping}
                  setMapping={setMapping}
                  onNext={() => next()}
                  onBack={() => prev()}
                />
              )}

              {stepIndex === 2 && (
                <PreviewStep
                  rows={parsedRows}
                  mapping={mapping}
                  errors={errors}
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
                    await uploadBulk();
                    reset();
                    goTo(0);
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
