import React, { useState } from 'react'
import { useNavigate } from "react-router-dom"
import axios from 'axios'
import { Button, Form } from 'react-bootstrap'
import './css/Login.css';

const Login = () => {

    const [login, setLogin] = useState("")
    const [senha, setSenha] = useState("")
    const navigate = useNavigate()

    const apiUrl = import.meta.env.VITE_API_URL

    const handleLogin = async (e) => {
        e.preventDefault()

        try{
            const request = await axios.get(`${apiUrl}/usuarios?login=${login}&senha=${senha}`)

            if(request.data.length ===1){
                const usuario = request.data[0]
                localStorage.setItem("usuarioLogado", JSON.stringify(usuario))

                if(usuario.tipo === "admin") navigate("/inicio-admin");
                else if(usuario.tipo === "medico") navigate("/inicio")
                else if(usuario.tipo === "paciente") navigate("/inicio")

            } else {
                alert("Credenciais inválidas.")
            }           
        } catch {
            alert("Erro ao tentar login.")
        }
    }

  return (
    <div className="login-wrapper">
      <div className="login-container">
        <h3 className="login-title">Acesso ao Sistema</h3>

        <Form onSubmit={handleLogin}>

          <Form.Group className="mb-3">
            <Form.Label>Login</Form.Label>
            <Form.Control
              type="text"
              required
              value={login}
              onChange={(e) => setLogin(e.target.value)}
              placeholder="Digite seu login"
            />
          </Form.Group>

          <Form.Group className="mb-4">
            <Form.Label>Senha</Form.Label>
            <Form.Control
              type="password"
              required
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
              placeholder="Digite sua senha"
            />
          </Form.Group>

          <Button className="btn-login-personalizado" type="submit">
            Entrar
          </Button>

        </Form>

      </div>
    </div>
  )
}

export default Login