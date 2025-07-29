import React from 'react'
import { Container, Image, Nav, Navbar, NavDropdown } from 'react-bootstrap'
import { FaSignOutAlt, FaUserCircle } from 'react-icons/fa'
import { Link } from 'react-router-dom'
import logo from '../../assets/logomarca.png'

const Menu = () => {

  return (
   <Navbar style={{ height: '80px',  backgroundColor: '#2E3B55'}}
          variant="dark"
          expand="lg"
          sticky="top"
          className="shadow"
        >
        <Container>
            <Navbar.Brand as={Link} to="/" className="fw-bold d-flex align-items-center gap-2">
                <Image 
                src={logo} 
                height={50}
                alt="Logomarca" 
                rounded  
              />
              <span className="fs-4">Med-Data</span>
            </Navbar.Brand>

            <Navbar.Toggle aria-controls="menu-principal"/>

            <Navbar.Collapse id="menu-principal">

                <Nav className="me-auto">
                    <Nav.Link as={Link} to="listar-medicos">Médicos</Nav.Link>
                    <Nav.Link as={Link} to="listar-pacientes">Pacientes</Nav.Link>
                    <Nav.Link as={Link} to="listar-consultas">Consultas</Nav.Link>
                </Nav>
                <Nav>
                    <NavDropdown
                            title={
                                <span>
                                     <FaUserCircle className="me-2"/>
                                     Rafael
                                </span>
                            }>
                        <NavDropdown.Item>                                                   
                            Meu Perfil
                        </NavDropdown.Item>
                        <NavDropdown.Divider/>
                        <NavDropdown.Item>
                            <FaSignOutAlt className="me-2"/> Sair
                        </NavDropdown.Item>
                    </NavDropdown>
                </Nav>

            </Navbar.Collapse>
        </Container>
    </Navbar>
  )
}

export default Menu