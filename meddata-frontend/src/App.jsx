import React from 'react'
import { BrowserRouter, Routes, Route } from "react-router-dom"
import MedicoForm from './pages/Medico/MedicoForm'
import PacienteForm from './pages/Paciente/PacienteForm'
import ConsultaForm from './pages/Consulta/ConsultaForm'
import MedicoList from './pages/Medico/MedicoList'
import PacienteList from './pages/Paciente/PacienteList'
import ConsultaList from './pages/Consulta/ConsultaList'
import Inicial from './pages/Inicial'
import Menu from './components/Menu/Menu'

const App = () => {
  return (
     <BrowserRouter>
     <Menu/>
      <Routes>
        <Route path="/" element={<Inicial />} />
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