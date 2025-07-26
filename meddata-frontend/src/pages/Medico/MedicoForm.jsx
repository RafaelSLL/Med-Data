import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import axios from 'axios'
import { Container, Form, OverlayTrigger, Tooltip, Button, Modal, Row, Col } from 'react-bootstrap'
import { FaExclamationTriangle, FaQuestionCircle, FaCheckCircle, FaCheckSquare, FaRegSquare} from 'react-icons/fa'

const MedicoForm = () => {

   // Estou verificando se existe ID na URL
  const { id } = useParams()

  // useEffect para carregar as informações para editar
  useEffect(() => {
    if (id) {
      axios.get(`${apiUrl}/medicos/${id}`)
      .then(response => setMedico(response.data))
      .catch(error => console.error("Houve um erro ao carregar o medico: ", error))
    }
  }, [id])

  const navigate = useNavigate()
  const apiUrl = import.meta.env.VITE_API_URL

  const [modalAberto, setModalAberto] = useState(false)
  const [modalErroAberto, setModalErroAberto] = useState(false)

  const diasSemana = ['segunda', 'terca', 'quarta', 'quinta', 'sexta', 'sabado']
  const turnos = ['manha', 'tarde', 'noite']

  const [medico, setMedico] = useState({
    nome: "",
    crm: "",
    especialidade: "",
    email: "",
     disponibilidade: diasSemana.reduce((acc, dia) => ({ ...acc, [dia]: [] }), {})
  })

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setMedico({ ...medico, [name]: value })
  }

  const handleCheckboxChange = (dia, turno) => {
    setMedico(prev => {
      const turnosSelecionados = prev.disponibilidade[dia]
      const atualizados = turnosSelecionados.includes(turno)
        ? turnosSelecionados.filter(t => t !== turno)
        : [...turnosSelecionados, turno]
      return {
        ...prev,
        disponibilidade: {
          ...prev.disponibilidade,
          [dia]: atualizados
        }
      }
    })
  }

   const handleSubmit = (e) => {
    e.preventDefault()

    const request = id
    ? axios.put(`${apiUrl}/medicos/${id}`, medico)
    : axios.post(`${apiUrl}/medicos`, medico)

    request.then(() => setModalAberto(true))
    .catch(() => setModalErroAberto(true))
  }

  return (
    <Container className="mt-4">
      <h2 className="mb-4 d-flex aling-items-center"
       style={{
          background: 'linear-gradient(to right, #769382, #C0C3B9)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
        }}>

          {id ? 'Editar Médico' : 'Adicionar Médico'}

          <OverlayTrigger
              placement="right"
              overlay={<Tooltip>Preencha os dados do médico</Tooltip>}
          >
            <span className="ms-2" style={{cursor: 'pointer'}}>
                <FaQuestionCircle />
            </span>
          </OverlayTrigger>
      </h2>

       <Form onSubmit={handleSubmit}>

        <Form.Group className="mb-3">
          <Form.Label>Nome</Form.Label>
          <Form.Control
            type="text"
            required
            value={medico.nome}
            onChange={e => setMedico({...medico, nome: e.target.value})}
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>CRM</Form.Label>
          <Form.Control
            type="text"
            required
            value={medico.crm}
            onChange={e => setMedico({...medico, crm: e.target.value})}
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Especialidade</Form.Label>
          <Form.Control
            type="text"
            required
            value={medico.especialidade}
            onChange={e => setMedico({...medico, especialidade: e.target.value})}
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Email</Form.Label>
          <Form.Control
            type="email"
            required
            value={medico.email}
            onChange={e => setMedico({...medico, email: e.target.value})}
          />
        </Form.Group>

        <h5 className="mt-4">Disponibilidade</h5>
          {diasSemana.map(dia => (
            <Row key={dia} className="mb-2">
              <Col md={2}>
                <strong>{dia.charAt(0).toUpperCase() + dia.slice(1)}</strong>
              </Col>
              <Col>
                {turnos.map(turno => {
                  const checked = medico.disponibilidade[dia].includes(turno)
                  return (
                    <Button
                      key={`${dia}-${turno}`}
                      variant={checked ? 'success' : 'outline-secondary'}
                      onClick={() => handleCheckboxChange(dia, turno)}
                      className="me-2 mb-1"
                    >
                      {checked ? <FaCheckSquare className="me-1" /> : <FaRegSquare className="me-1" />}
                      {turno.charAt(0).toUpperCase() + turno.slice(1)}
                    </Button>
                  )
                })}
              </Col>
            </Row>
          ))}

         <Button type="submit" variant="success">
          {id ? 'Atualizar' : 'Salvar'}
        </Button>

      </Form>

        <Modal show={modalAberto} onHide={() => { setModalAberto(false); 
          navigate('/listar-medicos') }}>
            <Modal.Header closeButton>
              <Modal.Title>
                <FaCheckCircle className="text-success me-2"/>Sucesso:
              </Modal.Title>
            </Modal.Header>  
            <Modal.Body>
              Médico {id ? 'atualizado' : 'adicionado'} com sucesso!
            </Modal.Body>
            <Modal.Footer>
              <Button 
                variant="success" 
                onClick={() => navigate('/listar-medicos')}>
                Fechar
              </Button>
            </Modal.Footer>
        </Modal>

        <Modal show={modalErroAberto} onHide={() => {setModalErroAberto(false)}}>
          <Modal.Header closeButton>
            <Modal.Title>
              <FaExclamationTriangle className="text-danger me-2"/>Erro:
            </Modal.Title>
          </Modal.Header>  
          <Modal.Body>
            Médico não {id ? 'atualizado' : 'cadastrado'} com êxito!
          </Modal.Body>
          <Modal.Footer>
            <Button 
              variant="secundary" 
              onClick={() => setModalErroAberto(false)}>
              Fechar
            </Button>
          </Modal.Footer>
        </Modal>
      
    </Container>
  )
}

export default MedicoForm