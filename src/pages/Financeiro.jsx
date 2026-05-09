import { useEffect, useState } from "react";
import api from "../services/api";

import "./../styles/FinanceiroGeral.css";

export default function Financeiro() {

  const hoje = new Date();

  const mesAtual =
    hoje.getMonth() + 1;

  const anoAtual =
    hoje.getFullYear();

  const primeiroDia =
    `${anoAtual}-${String(mesAtual)
      .padStart(2,"0")}-01`;

  const ultimoDia =
    `${anoAtual}-${String(mesAtual)
      .padStart(2,"0")}-31`;

  const [inicio, setInicio] =
    useState(primeiroDia);

  const [fim, setFim] =
    useState(ultimoDia);

  const [contas, setContas] =
    useState([]);

  const [despesas, setDespesas] =
    useState([]);

  const [form, setForm] = useState({
    descricao: "",
    valor: "",
  });
  const [modalFechar, setModalFechar] =
  useState(false);

const [historicoModal, setHistoricoModal] =
  useState(false);

const [historico, setHistorico] =
  useState([]);

  useEffect(() => {

    buscarContas();

    buscarDespesas();

  }, []);

  const buscarContas = async () => {

    const response = await api.get(
      "/contas",
      {
        params: {
          inicio,
          fim,
        },
      }
    );

    setContas(response.data);
  };

  const excluirDespesa =
  async (id) => {

    const confirmar =
      window.confirm(
        "Excluir despesa?"
      );

    if (!confirmar) return;

    try {

      await api.delete(
        `/despesas/${id}`
      );

      setDespesas(
        despesas.filter(
          (d) => d.id !== id
        )
      );

    } catch (error) {

      console.log(error);

      alert(
        "Erro ao excluir"
      );
    }
};


const fecharPeriodo =
  async () => {

    try {

      await api.post(
        "/fechar-periodo"
      );

      setModalFechar(false);

      buscarContas();

      buscarDespesas();

      window.location.reload();

    } catch (error) {

      console.log(error);
    }
};

const buscarHistorico =
  async () => {

    try {

      const response =
        await api.get(
          "/historico-fechamentos"
        );

      setHistorico(
        response.data
      );

      setHistoricoModal(true);

    } catch (error) {

      console.log(error);
    }
};

  const buscarDespesas = async () => {

    const response = await api.get(
      "/despesas"
    );

    setDespesas(response.data);
  };

  const salvarDespesa = async () => {

    await api.post(
      "/despesas",
      form
    );

    setForm({
      descricao: "",
      valor: "",
    });

    buscarDespesas();
  };

  const totalRecebido =
    contas
      .filter(
        (item) =>
          item.status === "pago"
      )
      .reduce(
        (acc, item) =>
          acc + Number(item.valor),
        0
      );

  const totalPendente =
    contas
      .filter(
        (item) =>
          item.status === "pendente"
      )
      .reduce(
        (acc, item) =>
          acc + Number(item.valor),
        0
      );

  const totalDespesas =
    despesas.reduce(
      (acc, item) =>
        acc + Number(item.valor),
      0
    );

  const lucro =
    totalRecebido - totalDespesas;

  return (
    <div className="financeiro-geral-container">

      <h1>Financeiro</h1>

      <div className="financeiro-resumo">

        <div className="resumo-card verde">
          <h3>Recebido</h3>

          <p>
            R$ {totalRecebido.toFixed(2)}
          </p>
        </div>

        <div className="resumo-card amarelo">
          <h3>Pendente</h3>

          <p>
            R$ {totalPendente.toFixed(2)}
          </p>
        </div>

        <div className="resumo-card vermelho">
          <h3>Despesas</h3>

          <p>
            R$ {totalDespesas.toFixed(2)}
          </p>
        </div>

        <div className="resumo-card azul">
          <h3>Lucro</h3>

          <p>
            R$ {lucro.toFixed(2)}
          </p>
        </div>

      </div>

      <div className="financeiro-acoes">

  <button
    className="fechar-btn"
    onClick={() =>
      setModalFechar(true)
    }
  >
    Fechar Período
  </button>

  <button
    className="historico-btn"
    onClick={buscarHistorico}
  >
    Histórico
  </button>

</div>

      <div className="financeiro-geral-cards">

        <div className="financeiro-geral-card">

          <h2>Contas a Receber</h2>

          <input
            type="date"
            value={inicio}
            onChange={(e) =>
              setInicio(e.target.value)
            }
          />

          <input
            type="date"
            value={fim}
            onChange={(e) =>
              setFim(e.target.value)
            }
          />

         <button
  type="button"
  onClick={buscarContas}
>
            Filtrar
          </button>

          <div className="lista-financeira">

            {contas
  .filter(
    (item) => item.status === "pendente"
  )
  .map((item) => (

              <div
                key={item.id}
                className="linha-financeira"
              >
                

                <div>
                  <strong>
    {item.nome}
  </strong>

  <p>
    {item.descricao}
  </p>
                  <p>
                    {item.parcelaAtual}/
                    {item.totalParcelas}
                  </p>
                </div>

                <div>
                  R$ {item.valor}
                </div>

              </div>
            ))}

          </div>

        </div>

        <div className="financeiro-geral-card">

          <h2>Lançar Despesa</h2>

          <input
            placeholder="Descrição"
            value={form.descricao}
            onChange={(e) =>
              setForm({
                ...form,
                descricao:
                  e.target.value,
              })
            }
          />

          <input
            placeholder="Valor"
            value={form.valor}
            onChange={(e) =>
              setForm({
                ...form,
                valor:
                  e.target.value,
              })
            }
          />

          <button
  type="button"
  onClick={salvarDespesa}
>
            Salvar
          </button>

          <div className="lista-financeira">

            {despesas.map((item) => (

              <div
                key={item.id}
                className="linha-financeira"
              >
                 <button
      className="excluir-despesa-btn"
      onClick={() =>
        excluirDespesa(item.id)
      }
    >
      X
    </button>

                 <strong>
    {item.nome}
  </strong>

  <p>
    {item.descricao}
  </p>
                <span>
                  R$ {item.valor}
                </span>

              </div>
            ))}

          </div>

        </div>

      </div>


      {modalFechar && (

  <div className="modal-overlay">

    <div className="modal-dashboard">

      <h2>
        Fechar Período
      </h2>

      <p>
        Recebido:
        {" "}
        R$
        {totalRecebido.toFixed(2)}
      </p>

      <p>
        Despesas:
        {" "}
        R$
        {totalDespesas.toFixed(2)}
      </p>

      <p>
        Lucro:
        {" "}
        R$
        {lucro.toFixed(2)}
      </p>

      <button
        onClick={fecharPeriodo}
      >
        Confirmar
      </button>

      <button
        onClick={() =>
          setModalFechar(false)
        }
      >
        Cancelar
      </button>

    </div>

  </div>
)}

{historicoModal && (

  <div className="modal-overlay">

    <div className="modal-dashboard">

      <div className="modal-topo">

        <h2>
          Histórico
        </h2>

        <button
          onClick={() =>
            setHistoricoModal(false)
          }
        >
          X
        </button>

      </div>

      {historico.map((item) => (

        <div
          key={item.id}
          className="modal-item"
        >

          <p>
            Recebido:
            {" "}
            R$
            {Number(
              item.recebido
            ).toFixed(2)}
          </p>

          <p>
            Despesas:
            {" "}
            R$
            {Number(
              item.despesas
            ).toFixed(2)}
          </p>

          <p>
            Lucro:
            {" "}
            R$
            {Number(
              item.lucro
            ).toFixed(2)}
          </p>

          <small>
            {new Date(
              item.data
            ).toLocaleDateString()}
          </small>

        </div>
      ))}

    </div>

  </div>
)}

    </div>
  );
}