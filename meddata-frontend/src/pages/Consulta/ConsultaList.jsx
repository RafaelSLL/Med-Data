import React, { useEffect, useState } from 'react'
import { Button, Container, Table, Modal, OverlayTrigger, Tooltip, Badge } from 'react-bootstrap'
import { FaEdit, FaTrash, FaExclamationTriangle, FaPlus, FaQuestionCircle } from 'react-icons/fa'
import { Link } from 'react-router-dom'
import axios from 'axios'

const ConsultaList = () => {
  const [consultas, setConsultas] = useState([])
  const [pacientes, setPacientes] = useState([])
  const [medicos, setMedicos] = useState([])
  const [modalAberto, setModalAberto] = useState(false)
  const [consultaSelecionada, setConsultaSelecionada] = useState(null)
  const apiUrl = import.meta.env.VITE_API_URL

  useEffect(() => {
    const fetchAllData = async () => {
      try {
        const [consultasRes, pacientesRes, medicosRes] = await Promise.all([
          axios.get(`${apiUrl}/consultas`),
          axios.get(`${apiUrl}/pacientes`),
          axios.get(`${apiUrl}/medicos`)
        ]);

        setConsultas(consultasRes.data);
        setPacientes(pacientesRes.data);
        setMedicos(medicosRes.data);
      } catch (err) {
        console.error("Erro ao buscar dados:", err);
      }
    };

    fetchAllData();
  }, [apiUrl]);

  const abrirModal = (consulta) => {
    setConsultaSelecionada(consulta)
    setModalAberto(true)
  }

  const fecharModal = () => {
    setModalAberto(false)
    setConsultaSelecionada(null)
  }

  const removerConsulta = () => {
    axios.delete(`${apiUrl}/consultas/${consultaSelecionada.id}`)
      .then(() => {
        setConsultas(prev => prev.filter(c => c.id !== consultaSelecionada.id))
        fecharModal()
      })
  }

  return (
    <Container className="mt-5">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2
          className="mb-0 d-flex align-items-center"
          style={{
            background: 'linear-gradient(to right, #6E85B7, #85a3d4ff)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          }}
        >
          Lista de Consultas
          <OverlayTrigger
            placement="right"
            overlay={<Tooltip>Visualize, Edite ou Exclua Consultas</Tooltip>}
          >
            <span className="ms-2" style={{ cursor: 'pointer' }}>
              <FaQuestionCircle />
            </span>
          </OverlayTrigger>
        </h2>

        <Button
          as={Link}
          to="/cadastrar-consulta"
          style={{ background: 'linear-gradient(to right, #6E85B7, #B2C2DB)', border: 'none' }}
        >
          <FaPlus className="me-2" /> Agendar Consulta
        </Button>
      </div>

      <Table striped bordered hover responsive>
        <thead>
          <tr>
            <th>Paciente</th>
            <th>Médico</th>
            <th>Data/Hora</th>
            <th>Status</th>
            <th>Ações</th>
          </tr>
        </thead>
        <tbody>
          {consultas.map(consulta => {
            const paciente = pacientes.find(p => p.id === consulta.pacienteId);
            const medico = medicos.find(m => m.id === consulta.medicoId);

            return (
              <tr key={consulta.id}>
                <td>{paciente?.nome || 'N/A'}</td>
                <td>{medico?.nome || 'N/A'}</td>
                <td>{new Date(consulta.dhConsulta).toLocaleString('pt-BR')}</td>
                <td>
                  <Badge bg={consulta.status === 'agendada' ? 'info' : 'success'} className="text-uppercase">
                    {consulta.status}
                  </Badge>
                </td>
                <td>
                  <Button
                    as={Link}
                    to={`/editar-consulta/${consulta.id}`}
                    variant="warning"
                    size="sm"
                    className="me-2"
                  >
                    <FaEdit className="me-1" /> Editar
                  </Button>
                  <Button
                    variant="danger"
                    size="sm"
                    onClick={() => abrirModal(consulta)}
                  >
                    <FaTrash className="me-1" /> Excluir
                  </Button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </Table>

      <Modal show={modalAberto} onHide={fecharModal} centered>
        <Modal.Header closeButton>
          <Modal.Title>
            <FaExclamationTriangle className="text-danger me-2" /> Confirmar exclusão
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Tem certeza que deseja excluir a consulta com o paciente:
          <strong> {consultaSelecionada?.paciente?.nome}</strong>?
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={fecharModal}>Cancelar</Button>
          <Button variant="danger" onClick={removerConsulta}>Excluir</Button>
        </Modal.Footer>
      </Modal>
    </Container>
  )
}

export default ConsultaList