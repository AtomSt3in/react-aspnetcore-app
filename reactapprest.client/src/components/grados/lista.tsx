import React from 'react';
import { Link } from 'react-router-dom';
import { Container, Row, Col, Table, Button, Card } from 'reactstrap';
import { useGradoList } from '../../hooks/grados/useListaGrados';

export const GradoList: React.FC = () => {
  const { grados, loading, handleEliminar } = useGradoList();

  if (loading) {
    return (
      <Container className="mt-5">
        <Row className="justify-content-center">
          <Col md="8" className="text-center">
            <div className="text-muted">Cargando grados...</div>
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
                    Lista de Grados
                  </h4>
                  <p className="mb-0 text-white opacity-75">
                    Gestión integral de grados académicos
                  </p>
                </Col>
                <Col xs="auto">
                  <Link
                    to="/nuevogrado"
                    className="btn btn-light custom-btn-primary fw-semibold px-4"
                  >
                    + Nuevo Grado
                  </Link>
                </Col>
              </Row>
            </div>

            <div className="p-4">
              {grados.length === 0 ? (
                <div className="text-center py-5">
                  <div className="text-muted mb-3">
                    No hay grados registrados
                  </div>
                  <Link to="/nuevogrado" className="btn custom-btn-primary">
                    Agregar Primer Grado
                  </Link>
                </div>
              ) : (
                <div className="table-responsive">
                  <Table hover className="align-middle custom-table">
                    <thead className="custom-table-header">
                      <tr>
                        <th>Descripción</th>
                        <th className="text-end">Acciones</th>
                      </tr>
                    </thead>
                    <tbody>
                      {grados.map((grado) => (
                        <tr
                          key={grado.caGradoNId}
                          className="custom-table-row"
                        >
                          <td>
                            <div className="fw-semibold text-dark">
                              {grado.caGradoTDescripcion}
                            </div>
                          </td>
                          <td>
                            <div className="d-flex justify-content-end gap-2">
                              <Link
                                to={`/editargrado/${grado.caGradoNId}`}
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
                                    grado.caGradoNId,
                                    grado.caGradoTDescripcion
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