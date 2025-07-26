import React from 'react'
import { BrowserRouter, Routes, Route } from "react-router-dom"
import Login from "./pages/Login"
import InicialAdmin from './pages/InicialAdmin'
import Inicio from './pages/Inicio'
import MedicoForm from './pages/Medico/MedicoForm'
import PacienteForm from './pages/Paciente/PacienteForm'
import ConsultaForm from './pages/Consulta/ConsultaForm'
import MedicoList from './pages/Medico/MedicoList'
import PacienteList from './pages/Paciente/PacienteList'
import ConsultaList from './pages/Consulta/ConsultaList'
import PrivateRoute from "./routes/PrivateRoute"
import MenuGlobal from './components/Menu/MenuGlobal'

const App = () => {
  return (
     <BrowserRouter>
      <MenuGlobal/>
      <Routes>
        <Route path="/" element={<Login />} />

        <Route path="/inicio-admin" element={
          <PrivateRoute tipoPermitido="admin">
            <InicialAdmin />
          </PrivateRoute>
        } />

        <Route path="/inicio" element={
          <PrivateRoute tipoPermitido="medico">
            <Inicio/>
          </PrivateRoute>
        } />

        <Route path="/inicio" element={
          <PrivateRoute tipoPermitido="paciente">
            <Inicio />
          </PrivateRoute>
        } />
        
        <Route path="/cadastrar-medico" element={<MedicoForm/>} />
        <Route path="/cadastrar-paciente" element={<PacienteForm />} />
        <Route path="/cadastrar-consulta" element={<ConsultaForm />} />
        <Route path="/listar-medicos" element={<MedicoList/>} />
        <Route path="/listar-pacientes" element={<PacienteList />} />
        <Route path="/listar-consultas" element={<ConsultaList />} />
        <Route path="/editar-medico/:id" element={<MedicoForm/>} />
        <Route path="/editar-paciente/:id" element={<PacienteForm />} />
        <Route path="/editar-consulta/:id" element={<ConsultaForm />} />

      </Routes>
    </BrowserRouter>
  )
}

export default App