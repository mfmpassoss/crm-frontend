import { useEffect, useState } from "react";
import api from "../services/api";

import "./../styles/Dashboard.css";
import { useNavigate } from "react-router-dom";

export default function Dashboard() {


  const [filaModal, setFilaModal] =
  useState(false);

const [filaEnvio, setFilaEnvio] =
  useState([]);

const [enviando, setEnviando] =
  useState(false);

  const navigate = useNavigate();

  const [dados, setDados] =
    useState({
      vencemHoje: 0,
      atrasados: 0,
      totalMes: 0,
      despesas: 0,
    });

    const [qr, setQr] = useState("");

const buscarQr = async () => {

  try {

    await api.post(
      "/whatsapp/start"
    );

    setTimeout(async () => {

      const response =
        await api.get(
          "/whatsapp/qrcode"
        );

      if (response.data.conectado) {

        alert(
          "WhatsApp já conectado 🚀"
        );

        return;
      }

      setQr(response.data.qr);

    }, 3000);

  } catch (error) {

    console.log(error);
  }
};

  const [modal, setModal] =
    useState(false);

  const [tipoModal, setTipoModal] =
    useState("");

  const [lista, setLista] =
    useState([]);

  useEffect(() => {

    buscarDashboard();

  }, []);

  const buscarDashboard = async () => {

    try {

      const response =
        await api.get(
          "/dashboard"
        );

      setDados(response.data);

    } catch (error) {

      console.log(error);
    }
  };

  const sair = () => {

  localStorage.removeItem(
    "token"
  );

  navigate("/");
};

const cobrarAtrasados = async () => {

  try {

    setEnviando(true);

    setFilaModal(true);

    setFilaEnvio([]);

    const response =
      await api.post(
        "/cobrar-atrasados"
      );

    setFilaEnvio(
      response.data.resultados
    );

  } catch (error) {

    console.log(error);

    alert("Erro ao cobrar");

  } finally {

    setEnviando(false);
  }
};

const lembrarVencimento = async () => {

  try {

    setEnviando(true);

    setFilaModal(true);

    const response =
      await api.post(
        "/lembrar-vencimento"
      );

    setFilaEnvio(
      response.data.resultados
    );

  } catch (error) {

    console.log(error);

    alert("Erro ao lembrar");

  } finally {

    setEnviando(false);
  }
};

const desconectarWhats =
  async () => {

    await api.post(
      "/whatsapp/logout"
    );

    alert(
      "Whats desconectado"
    );
};

  const abrirModal = async (tipo) => {

    try {

      const response =
        await api.get(
          `/dashboard/${tipo}`
        );

      setLista(response.data);

      setTipoModal(tipo);

      setModal(true);

    } catch (error) {

      console.log(error);
    }
  };

  return (
    <div className="dashboard-container">

       <button
      className="logout-btn"
      onClick={sair}
    >
      X
    </button>

     <div className="dashboard-topo">

  <h1>
    Painel Principal
  </h1>

 

</div>


      <div className="dashboard-cards">

        <div
          className="dashboard-card"
          onClick={() =>
            navigate("/clientes")
          }
        >
          Clientes
        </div>

        <div
          className="dashboard-card"
          onClick={() =>
            navigate("/financeiro")
          }
        >
          Financeiro
        </div>

      </div>

      <div className="dashboard-info">

        <div
          className="info-card azul"
          onClick={() =>
            abrirModal("vencem-hoje")
          }
        >

          <h3>Vencem Hoje</h3>

          <p>
            {dados.vencemHoje}
          </p>

        </div>

        <div
          className="info-card vermelho"
          onClick={() =>
            abrirModal("atrasados")
          }
        >

          <h3>Atrasados</h3>

          <p>
            {dados.atrasados}
          </p>

        </div>

        <div className="info-card verde">

          <h3>Total do Mês</h3>

          <p>
            R$
            {" "}
            {Number(
              dados.totalMes
            ).toFixed(2)}
          </p>

        </div>

        <div className="info-card amarelo">

          <h3>Despesas</h3>

          <p>
            R$
            {" "}
            {Number(
              dados.despesas
            ).toFixed(2)}
          </p>

        </div>

      </div>

      <div className="dashboard-acoes">

      <button onClick={buscarQr}>
  Conectar WhatsApp
</button>

<button onClick={desconectarWhats}>
  Trocar Número
</button>


        <button
  className="btn-dashboard cobrar"
  onClick={cobrarAtrasados}
>
          Cobrar Atrasados
        </button>

        <button
  className="btn-dashboard lembrar"
  onClick={lembrarVencimento}
>
          Lembrar Vencimento
        </button>

        



      </div>

   {qr && (

  <div className="qr-container">

    <img
      src={qr}
      alt="QR Code"
      width={300}
    />

  </div>
)}

{filaModal && (

  <div className="modal-overlay">

    <div className="modal-dashboard">

      <div className="modal-topo">

        <h2>
          Fila de Cobrança
        </h2>

        <button
          onClick={() =>
            setFilaModal(false)
          }
        >
          X
        </button>

      </div>

      {enviando && (
        <p>
          Enviando mensagens...
        </p>
      )}

      <div className="modal-lista">

        {filaEnvio.map((item, index) => (

          <div
            key={index}
            className="modal-item"
          >

            <strong>
              {item.nome}
            </strong>

            <p>
              {item.telefone}
            </p>

            <p>
              {item.status}
            </p>

          </div>
        ))}

      </div>

      <div
        style={{
          marginTop: 20,
          fontWeight: "bold"
        }}
      >

        Total:
        {" "}
        {filaEnvio.length}

      </div>

    </div>

  </div>
)}

      {modal && (

        <div className="modal-overlay">

          <div className="modal-dashboard">

            <div className="modal-topo">

              <h2>

                {tipoModal === "vencem-hoje"
                  ? "Vencem Hoje"
                  : "Atrasados"}

              </h2>

              <button
                onClick={() =>
                  setModal(false)
                }
              >
                X
              </button>

            </div>

            <div className="modal-lista">

              {lista.map((item) => (

                <div
                  key={item.id}
                  className="modal-item"
                >

                  <strong>
                    {item.nome}
                  </strong>

                  <p>
                    {item.descricao}
                  </p>

                  <p>
                    Parcela:
                    {" "}
                    {item.parcelaAtual}/
                    {item.totalParcelas}
                  </p>

                  <span>
                    R$ {item.valor}
                  </span>

                </div>
              ))}

            </div>

          </div>

        </div>
      )}

    </div>
  );
}