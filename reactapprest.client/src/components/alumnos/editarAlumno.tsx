import React from 'react';
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
  Badge
} from 'reactstrap';
import { useEditarAlumno } from '../../hooks/alumnos/useEditarAlumno';

export const EditarAlumno: React.FC = () => {
  const {
    alumno,
    grados,
    loading,
    saving,
    handleInputChange,
    handleSelectChange,
    toggleEstado,
    guardarCambios,
    volverALista
  } = useEditarAlumno();

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
                  <h4 className="mb-0 fw-semibold text-white">Editar Alumno</h4>
                  <p className="mb-0 text-white opacity-75">
                    Actualice los datos del alumno
                  </p>
                </Col>
              </Row>
            </div>

            <div className="p-4">
              <Form>
                <Row>
                  <Col md="6">
                    <FormGroup className="required">
                      <Label for="caAlumnTNombre" className="fw-semibold text-dark mb-2">
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
                      <Label for="caAlumnTApellidoPaterno" className="fw-semibold text-dark mb-2">
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
                      <Label for="caAlumnTApellidoMaterno" className="fw-semibold text-dark mb-2">
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
                      <Label for="caAlumnTTelefono" className="fw-semibold text-dark mb-2">
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
                      <Label for="caGradNId" className="fw-semibold text-dark mb-2">
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
                          <option key={grado.caGradoNId} value={grado.caGradoNId}>
                            {grado.caGradoTDescripcion}
                          </option>
                        ))}
                      </Input>
                    </FormGroup>
                  </Col>
                  <Col md="6">
                    <FormGroup>
                      <Label className="fw-semibold text-dark mb-2 d-block">
                        Estado
                      </Label>
                      <div className="d-flex align-items-center gap-3">
                        <FormGroup check className="mb-0">
                          <Label check className="custom-switch">
                            <Input
                              type="switch"
                              checked={alumno.caAlumnBActivo}
                              onChange={toggleEstado}
                              disabled={saving}
                            />
                            <span className="custom-switch-slider"></span>
                          </Label>
                        </FormGroup>
                        <Badge 
                          color={alumno.caAlumnBActivo ? "success" : "secondary"} 
                          className="px-3 py-2 fs-6"
                        >
                          {alumno.caAlumnBActivo ? 'Activo' : 'Inactivo'}
                        </Badge>
                      </div>
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
                    onClick={guardarCambios}
                    className="custom-btn-primary px-4"
                    disabled={saving}
                  >
                    {saving ? 'Guardando...' : 'Guardar Cambios'}
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