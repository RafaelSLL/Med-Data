import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import axios from 'axios'
import { Container, Form, OverlayTrigger, Tooltip, Button, Modal } from 'react-bootstrap'
import { FaExclamationTriangle, FaQuestionCircle, FaCheckCircle } from 'react-icons/fa'

const PacienteForm = () => {

  // Estou verificando se existe ID na URL
  const { id } = useParams()

  // useEffect para carregar as informações para editar
  useEffect(() => {
    if (id) {
      axios.get(`${apiUrl}/pacientes/${id}`)
      .then(response => setPaciente(response.data))
      .catch(error => console.error("Houve um erro ao carregar o paciente: ", error))
    }
  }, [id])

  const navigate = useNavigate()
  const apiUrl = import.meta.env.VITE_API_URL

  const [modalAberto, setModalAberto] = useState(false)
  const [modalErroAberto, setModalErroAberto] = useState(false)

  const [paciente, setPaciente] = useState({
    nome: "",
    cpf: "",
    email: "",
    telefone: "",
    plano: "ND",
    historico: {
      data: "",
      descricao: ""
    }
  })

  const handleSubmit = (e) => {
    e.preventDefault()

    const request = id
    ? axios.put(`${apiUrl}/pacientes/${id}`, paciente)
    : axios.post(`${apiUrl}/pacientes`, paciente)

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

          {id ? 'Editar Paciente' : 'Adicionar Paciente'}

          <OverlayTrigger
              placement="right"
              overlay={<Tooltip>Preencha os dados do paciente</Tooltip>}
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
            value={paciente.nome}
            onChange={e => setPaciente({...paciente, nome: e.target.value})}
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>CPF</Form.Label>
          <Form.Control
            type="text"
            required
            value={paciente.cpf}
            onChange={e => setPaciente({...paciente, cpf: e.target.value})}
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Email</Form.Label>
          <Form.Control
            type="email"
            required
            value={paciente.email}
            onChange={e => setPaciente({...paciente, email: e.target.value})}
          />
        </Form.Group>

         <Form.Group className="mb-3">
          <Form.Label>Telefone</Form.Label>
          <Form.Control
            type="text"
            required
            value={paciente.telefone}
            onChange={e => setPaciente({...paciente, telefone: e.target.value})}
          />
        </Form.Group>

        {/* Select para o plano do Paciente*/}
        <Form.Group className="mb-3">
          <Form.Label>Plano</Form.Label>
          <Form.Select
            value={paciente.plano}
            onChange={e => setPaciente({...paciente, plano: e.target.value})}
          >
            <option value="ND">---</option>
            <option value="UNIMED">Unimed</option>
            <option value="GEAP">GEAP</option>
            <option value="SUL-AMERICA">Sul America</option>
          </Form.Select>
        </Form.Group>

         <Button type="submit" variant="success">
          {id ? 'Atualizar' : 'Salvar'}
        </Button>

      </Form>

       <Modal show={modalAberto} onHide={() => { setModalAberto(false); 
          navigate('/listar-pacientes') }}>
            <Modal.Header closeButton>
              <Modal.Title>
                <FaCheckCircle className="text-success me-2"/>Sucesso:
              </Modal.Title>
            </Modal.Header>  
            <Modal.Body>
              Paciente {id ? 'atualizado' : 'adicionado'} com sucesso!
            </Modal.Body>
            <Modal.Footer>
              <Button 
                variant="success" 
                onClick={() => navigate('/listar-pacientes')}>
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
              Paciente não {id ? 'atualizado' : 'cadastrado'} com êxito!
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

export default PacienteForm