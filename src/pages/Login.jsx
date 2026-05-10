import { useState } from "react";

import { useNavigate }
from "react-router-dom";

import api
from "../services/api";

import "./../styles/Login.css";

export default function Login() {

  const navigate =
    useNavigate();

  const [usuario, setUsuario] =
    useState("");

  const [senha, setSenha] =
    useState("");

  const entrar = async (e) => {
  e.preventDefault();

  try {
    const response = await api.post("/login", {
      usuario,
      senha
    });

    const token = response.data?.token;

    if (!token) {
      alert("Erro ao fazer login");
      return;
    }

    localStorage.setItem("token", token);

    navigate("/dashboard");

  } catch (error) {
    console.log(error);
    alert("Usuário ou senha inválidos");
  }
};

  return (

    <div className="login-container">

      <form
        className="login-card"
        onSubmit={entrar}
      >

        <h1>Bem-vindo</h1>

        <input
          type="text"
          placeholder="Usuário"
          value={usuario}
          autoComplete="username"
          onChange={(e) =>
            setUsuario(
              e.target.value
            )
          }
        />

        <input
          type="password"
          placeholder="Senha"
          value={senha}
          autoComplete="current-password"
          onChange={(e) =>
            setSenha(
              e.target.value
            )
          }
        />

        <button type="submit">
          Entrar
        </button>

      </form>

    </div>
  );
}