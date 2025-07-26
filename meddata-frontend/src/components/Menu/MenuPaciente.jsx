import React from 'react'
import { Container, Nav, Navbar, NavDropdown } from 'react-bootstrap'
import { FaSignOutAlt, FaUserCircle } from 'react-icons/fa'
import { Link,  useNavigate } from 'react-router-dom'

const MenuPaciente = () => {
  const usuario = JSON.parse(localStorage.getItem("usuarioLogado"))

  const navigate = useNavigate()

  const handleLogout = () => {
        localStorage.removeItem("usuarioLogado")
        navigate("/") // redireciona para a tela de login
    }

  return (
    <Navbar bg="success" variant="dark" expand="lg" sticky="top" className="shadow">
      <Container>
        <Navbar.Brand as={Link} to="/inicio">Paciente</Navbar.Brand>
        <Navbar.Toggle aria-controls="menu-principal"/>
        <Navbar.Collapse id="menu-principal">
          <Nav className="me-auto">
            <Nav.Link as={Link} to="/listar-consulta-paci">Minhas Consultas</Nav.Link>
          </Nav>
          <Nav>
            <span className="navbar-text text-white me-3">
              Olá, {usuario.nome}
            </span>
          </Nav>
          <Nav>
            <NavDropdown
                    title={
                        <span>
                                <FaUserCircle className="me-2"/>
                                {usuario.nome}
                        </span>
                    }>
                <NavDropdown.Item>                                                   
                    Meu Perfil
                </NavDropdown.Item>
                <NavDropdown.Divider/>
                <NavDropdown.Item onClick={handleLogout}>
                    <FaSignOutAlt className="me-2"/> Sair
                </NavDropdown.Item>
            </NavDropdown>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  )
}

export default MenuPaciente