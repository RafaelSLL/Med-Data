import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import axios from 'axios'
import { Container, Form, OverlayTrigger, Tooltip, Button, Modal, Row, Col, Card } from 'react-bootstrap'
import { FaExclamationTriangle, FaQuestionCircle, FaCheckCircle, FaCheckSquare, FaRegSquare, FaSave } from 'react-icons/fa'

const MedicoForm = () => {

  // Estou verificando se existe ID na URL
  const { id } = useParams()
  const navigate = useNavigate()
  const apiUrl = import.meta.env.VITE_API_URL

  useEffect(() => {
    axios.get(`${apiUrl}/especialidades`)
      .then(response => setEspecialidades(response.data))
      .catch(error => console.error("Houve um erro ao carregar as especialidades", error))
  }, [])

  // useEffect para carregar as informações para editar
  useEffect(() => {
    if (id) {
      axios.get(`${apiUrl}/medicos/${id}`)
        .then(response => setMedico(response.data))
        .catch(error => console.error("Houve um erro ao carregar o medico: ", error))
    }
  }, [id])

  const [modalAberto, setModalAberto] = useState(false)
  const [modalErroAberto, setModalErroAberto] = useState(false)

  const diasSemana = ['segunda', 'terca', 'quarta', 'quinta', 'sexta', 'sabado']
  const turnos = ['manha', 'tarde', 'noite']

  const [especialidades, setEspecialidades] = useState([])

  const [medico, setMedico] = useState({
    nome: "",
    crm: "",
    especialidade: "",
    email: "",
    disponibilidade: diasSemana.reduce((acc, dia) => ({ ...acc, [dia]: [] }), {}),
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

  // Função responsavel por alterar todo o endereço apos a consulta do CEP
  const handleEndereco = (campo, valor) => {
    setMedico((prev) => ({
      ...prev,
      endereco: { ...prev.endereco, [campo]: valor }
    }))
  }

  // Consulta um endereço por uma API por meio de CEP
  const handleCepChange = (e) => {
    // Tem que estar pronto para mudar também o endereço completo
    handleEndereco('cep', e.target.value)
  }

  useEffect(() => {
    //Metodo que remove caracteres especiais do CEP, pois a API que consulta ele não aceita
    const cep = medico.endereco.cep.replace(/\D/g, '')
    if (cep.length === 8) {
      axios.get(`https://viacep.com.br/ws/${cep}/json/`)
        .then(response => {
          handleEndereco('logradouro', response.data.logradouro)
          handleEndereco('bairro', response.data.bairro)
          handleEndereco('cidade', response.data.localidade)
          handleEndereco('estado', response.data.estado)
        })
        .catch(error => console.error("Houve um erro ao buscar o endereço no viacep: ", error))
    }
  }, [medico.endereco.cep])

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
      <h2 className="mb-4 text-center">
        {id ? 'Editar Médico' : 'Cadastrar Médico'}

        <OverlayTrigger
          placement="right"
          overlay={<Tooltip>Preencha os dados do médico</Tooltip>}
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
            <Form.Group className="mb-3">
              <Form.Label>Nome</Form.Label>
              <Form.Control
                type="text"
                required
                value={medico.nome}
                onChange={e => setMedico({ ...medico, nome: e.target.value })}
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>CRM</Form.Label>
              <Form.Control
                type="text"
                required
                value={medico.crm}
                onChange={e => setMedico({ ...medico, crm: e.target.value })}
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="email"
                required
                value={medico.email}
                onChange={e => setMedico({ ...medico, email: e.target.value })}
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Especialidade</Form.Label>
              <Form.Select
                name="especialidade"
                value={medico.especialidade}
                onChange={e => setMedico({ ...medico, especialidade: e.target.value })}
              >
                <option value="">Selecione uma especialidade</option>
                {especialidades.map(esp => (
                  <option key={esp.id} value={esp.nome}>
                    {esp.nome}
                  </option>
                ))}
              </Form.Select>
            </Form.Group>

            <Form.Group className="mb-4">
              <Form.Label>Disponibilidade</Form.Label>
              <Row className="border rounded p-3">
                {turnos.map(turno => (
                  <Row key={turno} className="align-items-center mb-2">
                    <Col xs={3}><strong>{turno.charAt(0).toUpperCase() + turno.slice(1)}</strong></Col>
                    {diasSemana.map(dia => {
                      const checked = medico.disponibilidade[dia].includes(turno)
                      return (
                        <Col key={dia} xs="auto">
                          <Button
                            variant={checked ? 'success' : 'outline-secondary'}
                            size="sm"
                            onClick={() => handleCheckboxChange(dia, turno)}
                          >
                            {dia.slice(0, 3)}
                          </Button>
                        </Col>
                      )
                    })}
                  </Row>
                ))}
              </Row>
            </Form.Group>
          </Card.Body>
        </Card>

        <Card className="mb-4">
          <Card.Body>
            <Card.Title>Dados Endereço</Card.Title>
            <Row>
              <Col md={4}>
                <Form.Group className="mb-3">
                  <Form.Label>CEP</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Ex: 58000-000"
                    value={medico.endereco.cep}
                    onChange={handleCepChange}
                    autoComplete="off"
                    required
                  />
                </Form.Group>
              </Col>

              <Col md={8}>
                <Form.Group className="mb-3">
                  <Form.Label>Logradouro</Form.Label>
                  <Form.Control
                    type="text"
                    value={medico.endereco.logradouro}
                    onChange={e => handleEndereco('logradouro', e.target.value)}
                    autoComplete="off"
                    required
                  />

                </Form.Group>
              </Col>
            </Row>
            <Row>
              <Col md={4}>
                <Form.Group className="mb-3">
                  <Form.Label>Número</Form.Label>
                  <Form.Control
                    type="text"
                    value={medico.endereco.numero}
                    onChange={e => handleEndereco('numero', e.target.value)}
                    required
                  />
                </Form.Group>
              </Col>
              <Col md={8}>
                <Form.Group className="mb-3">
                  <Form.Label>Complemento</Form.Label>
                  <Form.Control
                    type="text"
                    value={medico.endereco.complemento}
                    onChange={e => handleEndereco('complemento', e.target.value)}
                    required
                  />
                </Form.Group>
              </Col>
            </Row>

            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Bairro</Form.Label>
                  <Form.Control
                    type="text"
                    value={medico.endereco.bairro}
                    onChange={e => handleEndereco('bairro', e.target.value)}
                    required
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Cidade</Form.Label>
                  <Form.Control
                    type="text"
                    value={medico.endereco.cidade}
                    onChange={e => handleEndereco('cidade', e.target.value)}
                    required
                  />
                </Form.Group>
              </Col>
            </Row>

            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Estado</Form.Label>
                  <Form.Control
                    type="text"
                    value={medico.endereco.estado}
                    onChange={e => handleEndereco('estado', e.target.value)}
                    required
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>País</Form.Label>
                  <Form.Control
                    type="text"
                    value={medico.endereco.pais}
                    onChange={e => handleEndereco('pais', e.target.value)}
                    required
                  />
                </Form.Group>
              </Col>
            </Row>
          </Card.Body>
        </Card>

        <Row className="mt-4">
          <Col md={8} className="mx-auto">
            <Button type="submit"
              style={{ backgroundColor: "#009688", border: "none" }}
              className="w-100 py-3 fs-5 fw-semibold rounded-3 shadow-sm text-center"
            >
              <FaSave size={20} /> {id ? 'Atualizar' : 'Salvar'}
            </Button>
          </Col>
        </Row>

      </Form>

      <Modal show={modalAberto} onHide={() => {
        setModalAberto(false);
        navigate('/listar-medicos')
      }}>
        <Modal.Header closeButton>
          <Modal.Title>
            <FaCheckCircle className="text-success me-2" />Sucesso:
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

      <Modal show={modalErroAberto} onHide={() => { setModalErroAberto(false) }}>
        <Modal.Header closeButton>
          <Modal.Title>
            <FaExclamationTriangle className="text-danger me-2" />Erro:
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