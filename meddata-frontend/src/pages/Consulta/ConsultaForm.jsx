import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import axios from 'axios'
import { Container, Form, OverlayTrigger, Tooltip, Button, Modal, Row, Col, Table } from 'react-bootstrap'
import { FaExclamationTriangle, FaQuestionCircle, FaCheckCircle, FaSave } from 'react-icons/fa'

const ConsultaForm = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const apiUrl = import.meta.env.VITE_API_URL

  const [modalAberto, setModalAberto] = useState(false)
  const [modalErroAberto, setModalErroAberto] = useState(false)

  const [consulta, setConsulta] = useState({
    pacienteId: '',
    medicoId: '',
    status: 'agendada',
    dhConsulta: ''
  })

  const [medicos, setMedicos] = useState([])
  const [pacientes, setPacientes] = useState([])
  const [medicoSelecionado, setMedicoSelecionado] = useState(null)

  useEffect(() => {
    axios.get(`${apiUrl}/medicos`).then(res => setMedicos(res.data))
    axios.get(`${apiUrl}/pacientes`).then(res => setPacientes(res.data))

    if (id) {
      axios.get(`${apiUrl}/consultas/${id}`)
        .then(response => setConsulta(response.data))
        .catch(error => console.error("Erro ao carregar consulta:", error))
    }
  }, [id])

  useEffect(() => {
    if (consulta.medicoId) {
      axios.get(`${apiUrl}/medicos/${consulta.medicoId}`)
        .then(res => setMedicoSelecionado(res.data))
        .catch(err => console.error("Erro ao buscar médico:", err))
    }
  }, [consulta.medicoId])

  const handleSubmit = (e) => {
    e.preventDefault();

    // Verifica se o médico está disponível no dia e horário escolhidos
    const data = new Date(consulta.dhConsulta);
    let dia = data.toLocaleDateString('pt-BR', { weekday: 'long' }).toLowerCase();

    // Remove the "-feira" suffix if it exists
    if (dia.includes('-feira')) {
      dia = dia.split('-')[0];
    }

    const hora = data.getHours();
    const turno = hora < 12 ? 'manha' : hora < 18 ? 'tarde' : 'noite';

    const disponibilidade = medicoSelecionado?.disponibilidade?.[dia] || []

    if (!disponibilidade.includes(turno)) {
      alert(`O médico não está disponível na ${turno} de ${dia}`)
      return
    }

    const request = id
      ? axios.put(`${apiUrl}/consultas/${id}`, consulta)
      : axios.post(`${apiUrl}/consultas`, consulta)

    request.then(() => setModalAberto(true))
      .catch(() => setModalErroAberto(true))
  }

  return (
    <Container className="mt-4">
      <h2 className="mb-4 text-center">
        {id ? 'Editar Consulta' : 'Agendar Consulta'}
        <OverlayTrigger
          placement="right"
          overlay={<Tooltip>Preencha os dados da consulta</Tooltip>}
        >
          <span className="ms-2" style={{ cursor: 'pointer' }}>
            <FaQuestionCircle />
          </span>
        </OverlayTrigger>
      </h2>

      <Form onSubmit={handleSubmit}>

        <Form.Group className="mb-3">
          <Form.Label>Paciente</Form.Label>
          <Form.Select
            value={consulta.pacienteId}
            onChange={(e) => setConsulta({ ...consulta, pacienteId: e.target.value })}
            required
          >
            <option value="">Selecione o paciente</option>
            {pacientes.map(paciente => (
              <option key={paciente.id} value={paciente.id}>{paciente.nome}</option>
            ))}
          </Form.Select>
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Médico</Form.Label>
          <Form.Select
            value={consulta.medicoId}
            onChange={(e) => setConsulta({ ...consulta, medicoId: e.target.value })}
            required
          >
            <option value="">Selecione o médico</option>
            {medicos.map(medico => (
              <option key={medico.id} value={medico.id}>{medico.nome}</option>
            ))}
          </Form.Select>
        </Form.Group>

        {medicoSelecionado && (
          <div className="mb-4">
            <h5>Disponibilidade do Médico</h5>
            <Table bordered size="sm">
              <thead>
                <tr>
                  <th>Turno</th>
                  {['segunda', 'terca', 'quarta', 'quinta', 'sexta', 'sabado'].map(d => (
                    <th key={d}>{d.charAt(0).toUpperCase() + d.slice(1)}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {['manha', 'tarde', 'noite'].map(turno => (
                  <tr key={turno}>
                    <td><strong>{turno.charAt(0).toUpperCase() + turno.slice(1)}</strong></td>
                    {['segunda', 'terca', 'quarta', 'quinta', 'sexta', 'sabado'].map(dia => (
                      <td key={dia} className="text-center">
                        {medicoSelecionado.disponibilidade[dia]?.includes(turno) ? '✔️' : ''}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </Table>
          </div>
        )}

        <Form.Group className="mb-3">
          <Form.Label>Data e Hora da Consulta</Form.Label>
          <Form.Control
            type="datetime-local"
            value={consulta.dhConsulta}
            onChange={(e) => setConsulta({ ...consulta, dhConsulta: e.target.value })}
            required
          />
        </Form.Group>

        <Row className="mt-4">
          <Col md={8} className="mx-auto">
            <Button type="submit"
              style={{ backgroundColor: "#009688", border: "none" }}
              className="w-100 py-3 fs-5 fw-semibold rounded-3 shadow-sm text-center"
            >
              <FaSave size={20} /> {id ? 'Atualizar Consulta' : 'Agendar Consulta'}
            </Button>
          </Col>
        </Row>
      </Form>


      <Modal show={modalAberto} onHide={() => {
        setModalAberto(false)
        navigate('/listar-consultas')
      }}>
        <Modal.Header closeButton>
          <Modal.Title>
            <FaCheckCircle className="text-success me-2" /> Sucesso
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Consulta {id ? 'atualizada' : 'agendada'} com sucesso!
        </Modal.Body>
        <Modal.Footer>
          <Button variant="success" onClick={() => navigate('/listar-consultas')}>Fechar</Button>
        </Modal.Footer>
      </Modal>

      <Modal show={modalErroAberto} onHide={() => setModalErroAberto(false)}>
        <Modal.Header closeButton>
          <Modal.Title>
            <FaExclamationTriangle className="text-danger me-2" /> Erro
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Não foi possível {id ? 'atualizar' : 'agendar'} a consulta.
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setModalErroAberto(false)}>Fechar</Button>
        </Modal.Footer>
      </Modal>
    </Container>
  )
}

export default ConsultaForm