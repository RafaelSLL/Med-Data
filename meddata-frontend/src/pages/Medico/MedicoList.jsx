import React, { useEffect, useState } from 'react'
import { Button, Container, OverlayTrigger, Table, Tooltip, Modal, Badge } from 'react-bootstrap'
import { FaEdit, FaExclamationTriangle, FaPlus, FaQuestionCircle, FaTrash } from 'react-icons/fa'
import { Link } from 'react-router-dom'
import axios from 'axios'

const MedicoList = () => {

  const tabelaDias = ['segunda', 'terca', 'quarta', 'quinta', 'sexta', 'sabado']
  const tabelaTurnos = ['manha', 'tarde', 'noite']

  const apiUrl = import.meta.env.VITE_API_URL
  const [medicos, setMedicos] = useState([])
  const [modalAberto, setModalAberto] = useState(false)
  const [medicoSelecionado, setMedicoSelecionado] = useState(null)

  useEffect(() => {
    axios.get(`${apiUrl}/medicos`)
    .then(response => setMedicos(response.data))
    .catch(error => console.error("Erro ao carregar os medicos: ", error))
  }, [])

   const fecharModal = () => {
    setModalAberto(false)
    setMedicoSelecionado(null)
  }

  const abrirModal = (medico) => {
    setMedicoSelecionado(medico)
    setModalAberto(true)
    
  }

  const removerMedico = () => {
    axios.delete(`${apiUrl}/medicos/${medicoSelecionado.id}`)
    .then(() => {
      setMedicos(prev => prev.filter(m => m.id !== medicoSelecionado.id))
      fecharModal()
    })
  }


  return (
     <Container className="mt-5">
           <div className="d-flex justify-content-between align-items-center mb-4">
              <h2
                className="mb-0 d-flex align-items-center"
                style={{
                  background: 'linear-gradient(to right, #769382, #C0C3B9)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                }}
              >
                Lista de Médicos
                <OverlayTrigger
                  placement="right"
                  overlay={<Tooltip>Visualize, Edite ou Exclua Médicos</Tooltip>}
                >
                  <span className="ms-2" style={{ cursor: 'pointer' }}>
                    <FaQuestionCircle />
                  </span>
                </OverlayTrigger>
              </h2>

              <Button
                  as={Link}
                  to="/cadastrar-medico"
                  style={{ background: 'linear-gradient(to right, #769382, #C0C3B9)' }}
                >
                  <FaPlus className="me-2" /> Adicionar Médicos
                </Button>
              </div>

               <Table striped bordered hover responsive>
                    <thead>
                      <tr>
                        <th>Nome</th>
                        <th>CRM</th>
                        <th>Especialidade</th>
                        <th>Disponibilidade</th>
                        <th>Ações</th>
                      </tr>
                    </thead>
                    <tbody>
                      {
                        medicos.map(medico => (
                          <tr key={medico.id}>
                              <td>{medico.nome}</td>
                              <td>{medico.crm}</td>
                              <td>{medico.especialidade}</td>
                             <td>
                            {tabelaDias.map(dia => {
                              const turnos = medico.disponibilidade?.[dia] || []
                              if (turnos.length === 0) return null

                              return (
                                <div key={dia}>
                                  <strong>{dia.charAt(0).toUpperCase() + dia.slice(1)}:</strong>{' '}
                                  {turnos.map(turno => (
                                    <Badge bg="info" key={turno} className="me-1">
                                      {turno}
                                    </Badge>
                                  ))}
                                </div>
                              )
                            })}
                          </td>
                          <td>
                             <Button 
                              as={Link}
                              to={`/editar-medico/${medico.id}`}
                              variant="warning" 
                              size="sm" 
                              className="me-2">
                              <FaEdit className="me-1" /> Editar
                            </Button>
                            <Button 
                              variant="danger" 
                              size="sm" 
                              className="me-2"
                              onClick={() => abrirModal(medico)}>
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
                    Tem certeza que deseja excluir o médico: {' '}<strong>{medicoSelecionado?.nome}</strong>
                  </Modal.Body>
                  <Modal.Footer>
                    <Button variant="secundary" onClick={fecharModal}>Cancelar</Button>
                    <Button variant="danger" onClick={removerMedico}>Excluir</Button>
                  </Modal.Footer>
                </Modal>
    </Container>
  )
}

export default MedicoList