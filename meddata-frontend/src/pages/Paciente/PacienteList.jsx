import React, { useEffect, useState } from 'react'
import { Button, Container, OverlayTrigger, Table, Tooltip, Modal } from 'react-bootstrap'
import { FaEdit, FaExclamationTriangle, FaPlus, FaQuestionCircle, FaTrash } from 'react-icons/fa'
import { Link } from 'react-router-dom'
import axios from 'axios'

const PacienteList = () => {

  const apiUrl = import.meta.env.VITE_API_URL
  const [pacientes, setPacientes] = useState([])
  const [modalAberto, setModalAberto] = useState(false)
  const [pacienteSelecionado, setPacienteSelecionado] = useState(null)

   useEffect(() => {
    axios.get(`${apiUrl}/pacientes`)
    .then(response => setPacientes(response.data))
    .catch(error => console.error("Erro ao carregar os pacientes: ", error))
  }, [])

  const fecharModal = () => {
    setModalAberto(false)
    setPacienteSelecionado(null)
  }

  const abrirModal = (paciente) => {
    setPacienteSelecionado(paciente)
    setModalAberto(true)
    
  }

   const removerPaciente = () => {
    axios.delete(`${apiUrl}/pacientes/${pacienteSelecionado.id}`)
    .then(() => {
      setPacientes(prev => prev.filter(p => p.id !== pacienteSelecionado.id))
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
            Lista de Pacientes
            <OverlayTrigger
              placement="right"
              overlay={<Tooltip>Visualize, Edite ou Exclua Pacientes</Tooltip>}
            >
              <span className="ms-2" style={{ cursor: 'pointer' }}>
                <FaQuestionCircle />
              </span>
            </OverlayTrigger>
          </h2>

          <Button
            as={Link}
            to="/cadastrar-paciente"
            style={{ background: 'linear-gradient(to right, #6E85B7, #B2C2DB)', border: 'none' }}
          >
            <FaPlus className="me-2" /> Adicionar Paciente
          </Button>
        </div>

        <Table striped bordered hover responsive>
          <thead>
            <tr>
              <th>Nome</th>
              <th>CPF</th>
              <th>Email</th>
              <th>Telefone</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            {
              pacientes.map(paciente => (
                <tr key={paciente.id}>
                  <td>{paciente.nome}</td>
                  <td>{paciente.cpf}</td>
                  <td>{paciente.email}</td>
                  <td>{paciente.telefone}</td>
                  <td>
                    <Button 
                      as={Link}
                      to={`/editar-paciente/${paciente.id}`}
                      variant="warning" 
                      size="sm" 
                      className="me-2">
                      <FaEdit className="me-1" /> Editar
                    </Button>
                    <Button 
                      variant="danger" 
                      size="sm" 
                      className="me-2"
                      onClick={() => abrirModal(paciente)}>
                      <FaTrash className="me-1"/> Excluir
                    </Button>

                  </td>
                </tr>
              ))
            }
          </tbody>

        </Table>

           <Modal show={modalAberto} onHide={fecharModal} centered>
            <Modal.Header closeButton>
              <Modal.Title>
                <FaExclamationTriangle className="text-danger me-2"/>
                Confirmar exclusão
              </Modal.Title>
            </Modal.Header>
            <Modal.Body>
              Tem certeza que deseja excluir o paciente: {' '}<strong>{pacienteSelecionado?.nome}</strong>
            </Modal.Body>
            <Modal.Footer>
              <Button variant="secundary" onClick={fecharModal}>Cancelar</Button>
              <Button variant="danger" onClick={removerPaciente}>Excluir</Button>
            </Modal.Footer>
          </Modal>
      
      </Container>
  )
}

export default PacienteList