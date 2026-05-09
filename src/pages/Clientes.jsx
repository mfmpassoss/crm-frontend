import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

import "./../styles/Clientes.css";

export default function Clientes() {

  const navigate = useNavigate();

  const [clientes, setClientes] = useState([]);

  const [form, setForm] = useState({
    nome: "",
    endereco: "",
    telefone: "",
    cpf: "",
    rg: "",
  });

  /* =========================
     BUSCAR CLIENTES
  ========================= */

  useEffect(() => {
    buscarClientes();
  }, []);

  const buscarClientes = async () => {

    try {

      const response = await api.get(
        "/clientes"
      );

      setClientes(response.data);

    } catch (error) {

      console.log(error);
    }
  };


  const excluirCliente =
  async (id) => {

    const confirmar =
      window.confirm(
        "Deseja excluir este cliente?"
      );

    if (!confirmar) return;

    try {

      await api.delete(
        `/clientes/${id}`
      );

      setClientes(
        clientes.filter(
          (c) => c.id !== id
        )
      );

    } catch (error) {

      console.log(error);

      alert(
        "Erro ao excluir"
      );
    }
};
  /* =========================
     INPUTS
  ========================= */

  const handleChange = (e) => {

    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  /* =========================
     SALVAR CLIENTE
  ========================= */

  const salvarCliente = async (e) => {

    e.preventDefault();

    try {

      await api.post(
        "/clientes",
        form
      );

      await buscarClientes();

      setForm({
        nome: "",
        endereco: "",
        telefone: "",
        cpf: "",
        rg: "",
      });

    } catch (error) {

      console.log(error);
    }
  };

  return (
    <div className="clientes-container">

      <h1>Clientes</h1>

      <form
        className="clientes-form"
        onSubmit={salvarCliente}
      >

        <input
          name="nome"
          placeholder="Nome"
          value={form.nome}
          onChange={handleChange}
        />

        <input
          name="endereco"
          placeholder="Endereço"
          value={form.endereco}
          onChange={handleChange}
        />

        <input
          name="telefone"
          placeholder="Telefone"
          value={form.telefone}
          onChange={handleChange}
        />

        <input
          name="cpf"
          placeholder="CPF"
          value={form.cpf}
          onChange={handleChange}
        />

        <input
          name="rg"
          placeholder="RG"
          value={form.rg}
          onChange={handleChange}
        />

        <button type="submit">
          Salvar Cliente
        </button>

      </form>

      <div className="clientes-lista">

        {clientes.map((cliente) => (

          <div
            key={cliente.id}
            className="cliente-card"
          >
            <button
  className="excluir-btn"
  onClick={() =>
    excluirCliente(cliente.id)
  }
>
  X
</button>

            <h3>{cliente.nome}</h3>

            <div className="cliente-acoes">

              <a
                className="whatsapp-btn"
                href={`https://wa.me/55${cliente.telefone.replace(/\D/g, "")}`}
                target="_blank"
                rel="noreferrer"
              >
                WhatsApp
              </a>

              <button
                className="financeiro-btn"
                onClick={() =>
                  navigate(
                    `/cliente-financeiro/${cliente.id}`
                  )
                }
              >
                Finanças
              </button>

            </div>

          </div>
        ))}

      </div>

    </div>
  );
}