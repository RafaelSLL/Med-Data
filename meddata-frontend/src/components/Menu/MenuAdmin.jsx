import React from 'react'
import { Container, Nav, Navbar, NavDropdown } from 'react-bootstrap'
import { FaSignOutAlt, FaUserCircle } from 'react-icons/fa'
import { Link,  useNavigate } from 'react-router-dom'
import logo from '../../assets/logotipo.png'


const MenuAdmin = () => {

    const usuario = JSON.parse(
        localStorage.getItem("usuarioLogado"));

    const navigate = useNavigate()

    const handleLogout = () => {
        localStorage.removeItem("usuarioLogado")
        navigate('/') // redireciona para a tela de login
    }

  return (
    <Navbar bg="dark" variant="dark" expand="lg" sticky="top" className="shadow">
        <Container>
        <Navbar.Brand as={Link} to="/" className="fw-bold">
           <img src={logo} alt="Logo" style={{ height: '40px' }} />
        </Navbar.Brand>

        <Navbar.Toggle aria-controls="menu-principal"/>

        <Navbar.Collapse id="menu-principal">

            <Nav className="me-auto">
                <Nav.Link as={Link} to="listar-medicos">Medicos</Nav.Link>
                <Nav.Link as={Link} to="listar-pacientes">Pacientes</Nav.Link>
                <Nav.Link as={Link} to="listar-consultas">Consultas</Nav.Link>
            </Nav>
            <Nav>
                <span className="navbar-text text-white d-flex align-items-center me-3">
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

export default MenuAdmin