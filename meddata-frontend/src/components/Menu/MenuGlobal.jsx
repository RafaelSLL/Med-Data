import React from 'react'
import MenuAdmin from './MenuAdmin'
import MenuMedico from './MenuMedico'
import MenuPaciente from './MenuPaciente'

const MenuGlobal = () => {
  const usuario = JSON.parse(localStorage.getItem("usuarioLogado"))

  if (!usuario) return null

  switch (usuario.tipo) {
    case 'admin':
      return <MenuAdmin />
    case 'medico':
      return <MenuMedico/>
    case 'paciente':
      return <MenuPaciente />
    default:
      return null
  }
}

export default MenuGlobal