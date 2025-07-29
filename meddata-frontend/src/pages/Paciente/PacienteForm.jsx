import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import axios from 'axios'
import { Container, Form, OverlayTrigger, Tooltip, Button, Modal, Card, Row, Col } from 'react-bootstrap'
import { FaExclamationTriangle, FaQuestionCircle, FaCheckCircle, FaSave } from 'react-icons/fa'

const PacienteForm = () => {

  const { id } = useParams()
  const navigate = useNavigate()
  const apiUrl = import.meta.env.VITE_API_URL

  const [modalAberto, setModalAberto] = useState(false)
  const [modalErroAberto, setModalErroAberto] = useState(false)
  const [planos, setPlanos] = useState([])

  const [paciente, setPaciente] = useState({
    nome: '',
    cpf: '',
    email: '',
    telefone: '',
    dataNascimento: '',
    genero: '',
    tipoSanguineo: '',
    plano: '',
    endereco: {
      cep: '',
      logradouro: '',
      numero: '',
      complemento: '',
      bairro: '',
      cidade: '',
      estado: '',
      pais: 'Brasil'
    }
  })

  useEffect(() => {
    axios.get(`${apiUrl}/planos-saude`)
      .then(response => setPlanos(response.data))
      .catch(error => console.error("Erro ao carregar planos de saúde", error))
  }, [])

  useEffect(() => {
    if (id) {
      axios.get(`${apiUrl}/pacientes/${id}`)
        .then(response => setPaciente(response.data))
        .catch(error => console.error("Erro ao carregar paciente: ", error))
    }
  }, [id])

  const handleEndereco = (campo, valor) => {
    setPaciente(prev => ({
      ...prev,
      endereco: { ...prev.endereco, [campo]: valor }
    }))
  }

  const handleCepChange = e => {
    handleEndereco('cep', e.target.value)
  }

  useEffect(() => {
    const cep = paciente.endereco.cep.replace(/\D/g, '')
    if (cep.length === 8) {
      axios.get(`https://viacep.com.br/ws/${cep}/json/`)
        .then(response => {
          handleEndereco('logradouro', response.data.logradouro)
          handleEndereco('bairro', response.data.bairro)
          handleEndereco('cidade', response.data.localidade)
          handleEndereco('estado', response.data.uf)
        })
        .catch(error => console.error("Erro ao buscar endereço: ", error))
    }
  }, [paciente.endereco.cep])

  const handleSubmit = e => {
    e.preventDefault()
    const request = id
      ? axios.put(`${apiUrl}/pacientes/${id}`, paciente)
      : axios.post(`${apiUrl}/pacientes`, paciente)

    request.then(() => setModalAberto(true))
      .catch(() => setModalErroAberto(true))
  }

  return (
    <Container className="mt-4">
      <h2 className="mb-4 text-center">
        {id ? 'Editar Paciente' : 'Cadastrar Paciente'}

        <OverlayTrigger
          placement="right"
          overlay={<Tooltip>Preencha os dados do paciente</Tooltip>}
        >
          <span className="ms-2" style={{ cursor: 'pointer' }}>
            <FaQuestionCircle />
          </span>
        </OverlayTrigger>
      </h2>

      <Form onSubmit={handleSubmit}>

        <Card className="mb-4">
          <Card.Body>
            <Card.Title>Dados Pessoais</Card.Title>
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Nome</Form.Label>
                  <Form.Control 
                  type="text" 
                  required 
                  value={paciente.nome} 
                  onChange={e => setPaciente({ ...paciente, nome: e.target.value })} />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>CPF</Form.Label>
                  <Form.Control 
                  type="text" 
                  required 
                  placeholder="Ex: 999.999.999-99"
                  value={paciente.cpf} 
                  onChange={e => setPaciente({ ...paciente, cpf: e.target.value })} />
                </Form.Group>
              </Col>
            </Row>

            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Email</Form.Label>
                  <Form.Control type="email" required value={paciente.email} onChange={e => setPaciente({ ...paciente, email: e.target.value })} />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Telefone</Form.Label>
                  <Form.Control type="text" required value={paciente.telefone} onChange={e => setPaciente({ ...paciente, telefone: e.target.value })} />
                </Form.Group>
              </Col>
            </Row>

            <Row>
              <Col md={4}>
                <Form.Group className="mb-3">
                  <Form.Label>Data de Nascimento</Form.Label>
                  <Form.Control type="date" value={paciente.dataNascimento} onChange={e => setPaciente({ ...paciente, dataNascimento: e.target.value })} />
                </Form.Group>
              </Col>
              <Col md={4}>
                <Form.Group className="mb-3">
                  <Form.Label>Gênero</Form.Label>
                  <Form.Select value={paciente.genero} onChange={e => setPaciente({ ...paciente, genero: e.target.value })}>
                    <option value="">Selecione</option>
                    <option value="Masculino">Masculino</option>
                    <option value="Feminino">Feminino</option>
                    <option value="Outro">Outro</option>
                  </Form.Select>
                </Form.Group>
              </Col>
              <Col md={4}>
                <Form.Group className="mb-3">
                  <Form.Label>Tipo Sanguíneo</Form.Label>
                  <Form.Control type="text" value={paciente.tipoSanguineo} onChange={e => setPaciente({ ...paciente, tipoSanguineo: e.target.value })} />
                </Form.Group>
              </Col>
            </Row>

            <Form.Group className="mb-3">
              <Form.Label>Plano de Saúde</Form.Label>
              <Form.Select value={paciente.plano} onChange={e => setPaciente({ ...paciente, plano: e.target.value })}>
                <option value="">Selecione</option>
                {planos.map(plano => (
                  <option key={plano.id} value={plano.nome}>{plano.nome}</option>
                ))}
              </Form.Select>
            </Form.Group>
          </Card.Body>
        </Card>

        <Card className="mb-4">
          <Card.Body>
            <Card.Title>Endereço</Card.Title>
            <Row>
              <Col md={4}>
                <Form.Group className="mb-3">
                  <Form.Label>CEP</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Ex: 58000-000"
                    value={paciente.endereco.cep}
                    onChange={handleCepChange}
                    autoComplete="off"
                    required />
                </Form.Group>
              </Col>
              <Col md={8}>
                <Form.Group className="mb-3">
                  <Form.Label>Logradouro</Form.Label>
                  <Form.Control
                    type="text"
                    value={paciente.endereco.logradouro}
                    onChange={e => handleEndereco('logradouro', e.target.value)}
                    required />
                </Form.Group>
              </Col>
            </Row>

            <Row>
              <Col md={4}>
                <Form.Group className="mb-3">
                  <Form.Label>Número</Form.Label>
                  <Form.Control
                    type="text"
                    value={paciente.endereco.numero}
                    onChange={e => handleEndereco('numero', e.target.value)}
                    required />
                </Form.Group>
              </Col>
              <Col md={8}>
                <Form.Group className="mb-3">
                  <Form.Label>Complemento</Form.Label>
                  <Form.Control
                    type="text"
                    value={paciente.endereco.complemento}
                    onChange={e => handleEndereco('complemento', e.target.value)} />
                </Form.Group>
              </Col>
            </Row>

            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Bairro</Form.Label>
                  <Form.Control
                    type="text"
                    value={paciente.endereco.bairro}
                    onChange={e => handleEndereco('bairro', e.target.value)}
                    required />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Cidade</Form.Label>
                  <Form.Control
                    type="text"
                    value={paciente.endereco.cidade}
                    onChange={e => handleEndereco('cidade', e.target.value)}
                    required />
                </Form.Group>
              </Col>
            </Row>

            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Estado</Form.Label>
                  <Form.Control
                    type="text"
                    value={paciente.endereco.estado}
                    onChange={e => handleEndereco('estado', e.target.value)}
                    required />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>País</Form.Label>
                  <Form.Control
                    type="text"
                    value={paciente.endereco.pais}
                    onChange={e => handleEndereco('pais', e.target.value)}
                    required />
                </Form.Group>
              </Col>
            </Row>
          </Card.Body>
        </Card>

        <Row className="mt-4">
          <Col md={8} className="mx-auto">
            <Button
              type="submit"
              style={{ backgroundColor: "#009688", border: "none" }}
              className="w-100 py-3 fs-5 fw-semibold rounded-3 shadow-sm text-center">
              <FaSave size={20} /> {id ? 'Atualizar' : 'Salvar'}
            </Button>
          </Col>
        </Row>

      </Form>

      <Modal show={modalAberto} onHide={() => { setModalAberto(false); 
        navigate('/listar-pacientes') }}>
        <Modal.Header closeButton>
          <Modal.Title><FaCheckCircle className="text-success me-2" />Sucesso:</Modal.Title>
        </Modal.Header>
        <Modal.Body>Paciente {id ? 'atualizado' : 'adicionado'} com sucesso!</Modal.Body>
        <Modal.Footer>
          <Button variant="success" onClick={() => navigate('/listar-pacientes')}>Fechar</Button>
        </Modal.Footer>
      </Modal>

      <Modal show={modalErroAberto} onHide={() => setModalErroAberto(false)}>
        <Modal.Header closeButton>
          <Modal.Title><FaExclamationTriangle className="text-danger me-2" />Erro:</Modal.Title>
        </Modal.Header>
        <Modal.Body>Paciente não {id ? 'atualizado' : 'cadastrado'} com êxito!</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setModalErroAberto(false)}>Fechar</Button>
        </Modal.Footer>
      </Modal>
    </Container>
  )
}

export default PacienteForm