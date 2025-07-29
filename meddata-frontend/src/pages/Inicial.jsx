import React from 'react'
import { Container, Card, Button, Row, Col } from 'react-bootstrap'
import { FaUserMd, FaUserInjured, FaStethoscope } from "react-icons/fa"
import { Link } from 'react-router-dom'

const Inicial = () => {
  return (
     <Container className="mt-4">
      <Row className="g-4 justify-content-center">
        <Col xs={12} sm={6} md={4}>
          <Card bg='info' text='white' className="shadow rounded-4">
            <Card.Header className="d-flex align-items-center fs-4">
              <FaUserMd className="me-2" /> Médicos
            </Card.Header>
            <Card.Body className="pb-3 pt-2 px-3">
              <Card.Title className="fs-5 fw-bold text-uppercase">Listar Médicos</Card.Title>
              <Card.Text>
                Tela para listar os <strong>médicos</strong> cadastrados na nossa Clínica.
              </Card.Text>
            </Card.Body>
            <Card.Footer className="text-center">
              <Button variant="light" size="lg" as={Link} to="listar-medicos">
                Ir para a Tela
              </Button>
            </Card.Footer>
          </Card>
        </Col>

        <Col xs={12} sm={6} md={4}>
          <Card bg='warning' text='white' className="shadow rounded-4">
            <Card.Header className="d-flex align-items-center fs-4">
              <FaUserInjured className="me-2" /> Pacientes
            </Card.Header>
            <Card.Body className="pb-3 pt-2 px-3">
              <Card.Title className="fs-5 fw-bold text-uppercase">Listar Pacientes</Card.Title>
              <Card.Text>
                Tela para listar os <strong>pacientes</strong> cadastrados na nossa Clínica.
              </Card.Text>
            </Card.Body>
            <Card.Footer className="text-center">
              <Button variant="light" size="lg" as={Link} to="listar-pacientes">
                Ir para a Tela
              </Button>
            </Card.Footer>
          </Card>
        </Col>

        <Col xs={12} sm={6} md={4}>
          <Card bg='danger' text='white' className="shadow rounded-4">
            <Card.Header className="d-flex align-items-center fs-4">
              <FaStethoscope className="me-2" /> Consultas
            </Card.Header>
            <Card.Body className="pb-3 pt-2 px-3">
              <Card.Title className="fs-5 fw-bold text-uppercase">Listar Consultas</Card.Title>
              <Card.Text>
                Tela para listar as <strong>consultas</strong> cadastradas na nossa Clínica.
              </Card.Text>
            </Card.Body>
            <Card.Footer className="text-center">
              <Button variant="light" size="lg" as={Link} to="listar-consultas">
                Ir para a Tela
              </Button>
            </Card.Footer>
          </Card>
        </Col>
      </Row>
     <footer className="text-center text-muted mt-5">
      Desenvolvido por Rafael • © 2025 MED-DATA
    </footer> 
    </Container>
  )
}

export default Inicial