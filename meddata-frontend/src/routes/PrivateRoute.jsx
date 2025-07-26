import React from "react";
import { Navigate } from "react-router-dom";

const PrivateRoute = ({ filho, tipoPermitido }) => {
    const usuario = JSON.parse(
        localStorage.getItem("usuarioLogado"));

    if (!usuario) {
        return <Navigate to="/" />;
    }

    if (usuario.tipo !== tipoPermitido) {
        return <Navigate to="/" />;
    } 

   return filho;
};

export default PrivateRoute;