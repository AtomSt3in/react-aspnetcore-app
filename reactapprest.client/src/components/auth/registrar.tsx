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
} from "reactstrap";
import { useRegistro } from "../../hooks/auth/useRegistrar";
import { useNavigate } from "react-router-dom";

export const Registro: React.FC = () => {
  const {
    registro,
    loading,
    handleInputChange,
    registrarUsuario,
  } = useRegistro();

  const navigate = useNavigate();

  return (
    <Container className="mt-4">
      <Row className="justify-content-center">
        <Col lg="8" xl="6">
          <Card className="shadow-sm border-0 custom-card">
            <div className="custom-header p-4 rounded-top">
              <Row className="align-items-center">
                <Col>
                  <h4 className="mb-0 fw-semibold text-white">Registrarse</h4>
                  <p className="mb-0 text-white opacity-75">
                    Crea una nueva cuenta
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
                        for="CaUsuaTNombre"
                        className="fw-semibold text-dark mb-2"
                      >
                        Nombre
                      </Label>
                      <Input
                        id="CaUsuaTNombre"
                        type="text"
                        name="CaUsuaTNombre"
                        onChange={handleInputChange}
                        value={registro.CaUsuaTNombre || ''} // Asegurar valor controlado
                        className="custom-form-control"
                        placeholder="Ingrese su nombre"
                        disabled={loading}
                      />
                    </FormGroup>
                  </Col>
                  <Col md="6">
                    <FormGroup>
                      <Label
                        for="CaUsuaTApP"
                        className="fw-semibold text-dark mb-2"
                      >
                        Apellido Paterno
                      </Label>
                      <Input
                        id="CaUsuaTApP"
                        type="text"
                        name="CaUsuaTApP"
                        onChange={handleInputChange}
                        value={registro.CaUsuaTApP || ''} // Asegurar valor controlado
                        className="custom-form-control"
                        placeholder="Ingrese su apellido paterno"
                        disabled={loading}
                      />
                    </FormGroup>
                  </Col>
                </Row>

                <Row>
                  <Col md="6">
                    <FormGroup>
                      <Label
                        for="CaUsuaTApM"
                        className="fw-semibold text-dark mb-2"
                      >
                        Apellido Materno
                      </Label>
                      <Input
                        id="CaUsuaTApM"
                        type="text"
                        name="CaUsuaTApM"
                        onChange={handleInputChange}
                        value={registro.CaUsuaTApM || ''} // Asegurar valor controlado
                        className="custom-form-control"
                        placeholder="Ingrese su apellido materno"
                        disabled={loading}
                      />
                    </FormGroup>
                  </Col>
                  <Col md="6">
                    <FormGroup className="required">
                      <Label
                        for="CaUsuaTEmail"
                        className="fw-semibold text-dark mb-2"
                      >
                        Email
                      </Label>
                      <Input
                        id="CaUsuaTEmail"
                        type="email"
                        name="CaUsuaTEmail"
                        onChange={handleInputChange}
                        value={registro.CaUsuaTEmail || ''} // Asegurar valor controlado
                        className="custom-form-control"
                        placeholder="Ingrese su email"
                        disabled={loading}
                      />
                    </FormGroup>
                  </Col>
                </Row>

                <Row>
                  <Col md="6">
                    <FormGroup className="required">
                      <Label
                        for="CaUsuaTContraseña"
                        className="fw-semibold text-dark mb-2"
                      >
                        Contraseña
                      </Label>
                      <Input
                        id="CaUsuaTContraseña"
                        type="password"
                        name="CaUsuaTContraseña"
                        onChange={handleInputChange}
                        value={registro.CaUsuaTContraseña || ''} // Asegurar valor controlado
                        className="custom-form-control"
                        placeholder="Ingrese su contraseña"
                        disabled={loading}
                      />
                    </FormGroup>
                  </Col>
                  <Col md="6">
                    <FormGroup className="required">
                      <Label
                        for="CaUsuaTConfirmarContraseña"
                        className="fw-semibold text-dark mb-2"
                      >
                        Confirmar Contraseña
                      </Label>
                      <Input
                        id="CaUsuaTConfirmarContraseña"
                        type="password"
                        name="CaUsuaTConfirmarContraseña"
                        onChange={handleInputChange}
                        value={registro.CaUsuaTConfirmarContraseña || ''} // Asegurar valor controlado
                        className="custom-form-control"
                        placeholder="Confirme su contraseña"
                        disabled={loading}
                      />
                    </FormGroup>
                  </Col>
                </Row>

                <hr className="my-4" />

                <div className="d-flex justify-content-between align-items-center">
                  <Button
                    color="outline-secondary"
                    onClick={() => navigate('/login')}
                    className="custom-btn-outline px-4"
                    disabled={loading}
                  >
                    ← Volver
                  </Button>
                  <Button
                    color="primary"
                    onClick={registrarUsuario}
                    className="custom-btn-primary px-4"
                    disabled={loading}
                  >
                    {loading ? "Registrando..." : "Registrarse"}
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