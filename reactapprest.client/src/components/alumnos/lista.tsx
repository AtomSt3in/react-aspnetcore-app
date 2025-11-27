import React from "react";
import { Link } from "react-router-dom";
import { Container, Row, Col, Table, Button, Card, Badge } from "reactstrap";
import { useAlumnoList } from "../../hooks/alumnos/useListaAlumnos";

export const AlumnoList: React.FC = () => {
  const { alumnos, loading, handleEliminar } = useAlumnoList();

  const getEstadoBadge = (activo: boolean) => {
    return activo ? (
      <Badge color="success" className="px-3 py-2">
        Activo
      </Badge>
    ) : (
      <Badge color="secondary" className="px-3 py-2">
        Inactivo
      </Badge>
    );
  };

  if (loading) {
    return (
      <Container className="mt-5">
        <Row className="justify-content-center">
          <Col md="8" className="text-center">
            <div className="text-muted">Cargando alumnos...</div>
          </Col>
        </Row>
      </Container>
    );
  }

  return (
    <Container className="mt-4">
      <Row className="justify-content-center">
        <Col lg="10" xl="12">
          <Card className="shadow-sm border-0 custom-card">
            <div className="custom-header p-4 rounded-top">
              <Row className="align-items-center">
                <Col>
                  <h4 className="mb-0 fw-semibold text-white">
                    Lista de Alumnos
                  </h4>
                  <p className="mb-0 text-white opacity-75">
                    Gestión integral del alumnado
                  </p>
                </Col>
                <Col xs="auto">
                  <Link
                    to="/nuevoalumno"
                    className="btn btn-light custom-btn-primary fw-semibold px-4"
                  >
                    + Nuevo Alumno
                  </Link>
                </Col>
              </Row>
            </div>

            <div className="p-4">
              {alumnos.length === 0 ? (
                <div className="text-center py-5">
                  <div className="text-muted mb-3">
                    No hay alumnos registrados
                  </div>
                  <Link to="/nuevoalumno" className="btn custom-btn-primary">
                    Agregar Primer Alumno
                  </Link>
                </div>
              ) : (
                <div className="table-responsive">
                  <Table hover className="align-middle custom-table">
                    <thead className="custom-table-header">
                      <tr>
                        <th>Nombre Completo</th>
                        <th>Teléfono</th>
                        <th>Grado</th>
                        <th>Estado</th>
                        <th className="text-end">Acciones</th>
                      </tr>
                    </thead>
                    <tbody>
                      {alumnos.map((alumno) => (
                        <tr
                          key={alumno.caAlumnNId}
                          className="custom-table-row"
                        >
                          <td>
                            <div>
                              <div className="fw-semibold text-dark">
                                {alumno.caAlumnTNombre}
                              </div>
                              <small className="text-muted">
                                {alumno.caAlumnTApellidoPaterno}{" "}
                                {alumno.caAlumnTApellidoMaterno}
                              </small>
                            </div>
                          </td>
                          <td className="text-muted">
                            {alumno.caAlumnTTelefono}
                          </td>
                          <td>
                            <Badge className="custom-badge-primary px-3 py-2">
                              {alumno.gradoDescripcion || `Grado ${alumno.caGradNId}`}
                            </Badge>
                          </td>
                          <td>{getEstadoBadge(alumno.caAlumnBActivo)}</td>
                          <td>
                            <div className="d-flex justify-content-end gap-2">
                              <Link
                                to={`/editaralumno/${alumno.caAlumnNId}`}
                                className="btn btn-outline-primary btn-sm px-3 custom-btn-outline"
                              >
                                Editar
                              </Link>
                              <Button
                                color="outline-danger"
                                size="sm"
                                className="px-3"
                                onClick={() =>
                                  handleEliminar(
                                    alumno.caAlumnNId!,
                                    `${alumno.caAlumnTNombre} ${alumno.caAlumnTApellidoPaterno}`
                                  )
                                }
                              >
                                Eliminar
                              </Button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                </div>
              )}
            </div>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};