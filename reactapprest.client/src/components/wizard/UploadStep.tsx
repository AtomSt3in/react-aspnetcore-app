import { useRef } from "react";
import { Button, Form, FormGroup, Input, Row, Col } from "reactstrap";

type Props = {
  fileInfo: { name: string; size: number } | null;
  onFile: (file: File | null) => Promise<void>;
};

export default function UploadStep({ fileInfo, onFile }: Props) {
  const inputRef = useRef<HTMLInputElement | null>(null);

  return (
    <div>
      <Form>
        <FormGroup>
          <label htmlFor="file">
            Selecciona un archivo (.csv, .xlsx, .json)
          </label>
          <Input
            id="file"
            type="file"
            accept=".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/json, .json"
            innerRef={inputRef}
            onChange={async (e) => {
              const file =
                e.target.files && e.target.files[0] ? e.target.files[0] : null;
              await onFile(file);
            }}
          />
        </FormGroup>

        {fileInfo && (
          <Row>
            <Col>
              <div className="text-muted">
                Archivo cargado: <strong>{fileInfo.name}</strong> (
                {Math.round(fileInfo.size / 1024)} KB)
              </div>
            </Col>
            <Col className="text-end">
              <Button
                color="primary"
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
        )}
      </Form>
    </div>
  );
}
