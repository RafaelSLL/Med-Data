import React from 'react'
import { Container, Row, Col, Card } from 'react-bootstrap'
import { Link } from 'react-router-dom'
import { FaUserMd, FaUserInjured, FaCalendarCheck } from 'react-icons/fa'

const InicialAdmin = () => {
  
  const cards = [
    {
      title: 'Médicos',
      icon: <FaUserMd size={40} />,
      path: '/listar-medicos', // ou "/cadastrar-medico"
      bg: 'primary'
    },
    {
      title: 'Pacientes',
      icon: <FaUserInjured size={40} />,
      path: '/listar-pacientes', // ou "/cadastrar-paciente"
      bg: 'success'
    },
    {
      title: 'Consultas',
      icon: <FaCalendarCheck size={40} />,
      path: '/listar-consultas', // ou "/cadastrar-consulta"
      bg: 'warning'
    }
  ]

  return (
     <Container className="d-flex justify-content-center align-items-center" style={{ minHeight: '80vh' }}>
      <Row className="w-100 justify-content-center">
        {cards.map((card, index) => (
          <Col key={index} xs={12} md={4} className="mb-4 d-flex justify-content-center">
            <Link to={card.path} style={{ textDecoration: 'none' }}>
              <Card
                bg={card.bg.toLowerCase()}
                text="white"
                style={{ width: '18rem', cursor: 'pointer' }}
                className="text-center shadow"
              >
                <Card.Body>
                  <div className="mb-3">{card.icon}</div>
                  <Card.Title>{card.title}</Card.Title>
                </Card.Body>
              </Card>
            </Link>
          </Col>
        ))}
      </Row>
    </Container>
  )
}

export default InicialAdmin