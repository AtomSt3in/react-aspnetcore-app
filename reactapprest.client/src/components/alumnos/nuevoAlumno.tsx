import React from "react";
import {
  Container,
  Row,
  Col,
  Form,
  FormGroup,
  Label,
  Input,
  Button,
  Card,
} 
from "reactstrap";
import { useNuevoAlumno } from "../../hooks/alumnos/useNuevoAlumno";

export const NuevoAlumno: React.FC = () => {
  const {
    alumno,
    grados,
    loading,
    saving,
    handleInputChange,
    handleSelectChange,
    guardarAlumno,
    volverALista,
  } = useNuevoAlumno();

  if (loading) {
    return (
      <Container className="mt-5">
        <Row className="justify-content-center">
          <Col md="8" className="text-center">
            <div className="text-muted">Cargando formulario...</div>
          </Col>
        </Row>
      </Container>
    );
  }

  return (
    <Container className="mt-4">
      <Row className="justify-content-center">
        <Col lg="8" xl="6">
          <Card className="shadow-sm border-0 custom-card">
            <div className="custom-header p-4 rounded-top">
              <Row className="align-items-center">
                <Col>
                  <h4 className="mb-0 fw-semibold text-white">Nuevo Alumno</h4>
                  <p className="mb-0 text-white opacity-75">
                    Complete los datos del nuevo alumno
                  </p>
                </Col>
              </Row>
            </div>

            <div className="p-4">
              <Form>
                <Row>
                  <Col md="6">
                    <FormGroup className="required">
                      <Label
                        for="caAlumnTNombre"
                        className="fw-semibold text-dark mb-2"
                      >
                        Nombre
                      </Label>
                      <Input
                        id="caAlumnTNombre"
                        type="text"
                        name="caAlumnTNombre"
                        onChange={handleInputChange}
                        value={alumno.caAlumnTNombre}
                        className="custom-form-control"
                        placeholder="Ingrese el nombre"
                        disabled={saving}
                      />
                    </FormGroup>
                  </Col>
                  <Col md="6">
                    <FormGroup className="required">
                      <Label
                        for="caAlumnTApellidoPaterno"
                        className="fw-semibold text-dark mb-2"
                      >
                        Apellido Paterno
                      </Label>
                      <Input
                        id="caAlumnTApellidoPaterno"
                        type="text"
                        name="caAlumnTApellidoPaterno"
                        onChange={handleInputChange}
                        value={alumno.caAlumnTApellidoPaterno}
                        className="custom-form-control"
                        placeholder="Ingrese el apellido paterno"
                        disabled={saving}
                      />
                    </FormGroup>
                  </Col>
                </Row>

                <Row>
                  <Col md="6">
                    <FormGroup>
                      <Label
                        for="caAlumnTApellidoMaterno"
                        className="fw-semibold text-dark mb-2"
                      >
                        Apellido Materno
                      </Label>
                      <Input
                        id="caAlumnTApellidoMaterno"
                        type="text"
                        name="caAlumnTApellidoMaterno"
                        onChange={handleInputChange}
                        value={alumno.caAlumnTApellidoMaterno}
                        className="custom-form-control"
                        placeholder="Ingrese el apellido materno"
                        disabled={saving}
                      />
                    </FormGroup>
                  </Col>
                  <Col md="6">
                    <FormGroup>
                      <Label
                        for="caAlumnTTelefono"
                        className="fw-semibold text-dark mb-2"
                      >
                        Teléfono
                      </Label>
                      <Input
                        id="caAlumnTTelefono"
                        type="text"
                        name="caAlumnTTelefono"
                        onChange={handleInputChange}
                        value={alumno.caAlumnTTelefono}
                        className="custom-form-control"
                        placeholder="Ingrese el teléfono"
                        disabled={saving}
                      />
                    </FormGroup>
                  </Col>
                </Row>

                <Row>
                  <Col md="6">
                    <FormGroup className="required">
                      <Label
                        for="caGradNId"
                        className="fw-semibold text-dark mb-2"
                      >
                        Grado
                      </Label>
                      <Input
                        id="caGradNId"
                        type="select"
                        name="caGradNId"
                        onChange={handleSelectChange}
                        value={alumno.caGradNId}
                        className="custom-form-control"
                        disabled={saving}
                      >
                        <option value={0}>Selecciona un grado</option>
                        {grados.map((grado) => (
                          <option
                            key={grado.caGradoNId}
                            value={grado.caGradoNId}
                          >
                            {grado.caGradoTDescripcion}
                          </option>
                        ))}
                      </Input>
                    </FormGroup>
                  </Col>
                </Row>

                <hr className="my-4" />

                <div className="d-flex justify-content-between align-items-center">
                  <Button
                    color="outline-secondary"
                    onClick={volverALista}
                    className="custom-btn-outline px-4"
                    disabled={saving}
                  >
                    ← Volver
                  </Button>
                  <Button
                    color="primary"
                    onClick={guardarAlumno}
                    className="custom-btn-primary px-4"
                    disabled={saving}
                  >
                    {saving ? "Guardando..." : "Guardar Alumno"}
                  </Button>
                </div>
              </Form>
            </div>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};
