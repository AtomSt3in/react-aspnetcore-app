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
import { useLogin } from "../../hooks/auth/useLogin";
import { useNavigate } from "react-router-dom";

export const Login: React.FC = () => {
  const { login, loading, handleInputChange, iniciarSesion } = useLogin();

  const navigate = useNavigate();

  return (
    <Container className="mt-4">
      <Row className="justify-content-center">
        <Col lg="6" xl="4">
          <Card className="shadow-sm border-0 custom-card">
            <div className="custom-header p-4 rounded-top">
              <Row className="align-items-center">
                <Col>
                  <h4 className="mb-0 fw-semibold text-white">
                    Iniciar Sesión
                  </h4>
                  <p className="mb-0 text-white opacity-75">
                    Ingresa a tu cuenta
                  </p>
                </Col>
              </Row>
            </div>

            <div className="p-4">
              <Form>
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
                    value={login.CaUsuaTEmail || ""} // Asegurar valor controlado
                    className="custom-form-control"
                    placeholder="Ingrese su email"
                    disabled={loading}
                  />
                </FormGroup>

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
                    value={login.CaUsuaTContraseña || ""} // Asegurar valor controlado
                    className="custom-form-control"
                    placeholder="Ingrese su contraseña"
                    disabled={loading}
                  />
                </FormGroup>

                <hr className="my-4" />

                <div className="d-flex justify-content-between align-items-center">
                  <Button
                    color="outline-secondary"
                    onClick={() => navigate("/registro")}
                    className="custom-btn-outline px-4"
                    disabled={loading}
                  >
                    Registrarse
                  </Button>
                  <Button
                    color="primary"
                    onClick={iniciarSesion}
                    className="custom-btn-primary px-4"
                    disabled={loading}
                  >
                    {loading ? "Iniciando sesión..." : "Iniciar Sesión"}
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
