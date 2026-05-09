import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../services/api";

import "./../styles/Financeiro.css";

export default function ClienteFinanceiro() {

  const { id } = useParams();

  const [registros, setRegistros] = useState([]);

  const [form, setForm] = useState({
    descricao: "",
    valor: "",
    parcelas: "",
    vencimento: "",
  });

  useEffect(() => {
    buscarFinanceiro();
  }, []);

  const buscarFinanceiro = async () => {

    const response = await api.get(
      `/financeiro/${id}`
    );

    setRegistros(response.data);
  };

  const handleChange = (e) => {

    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const salvar = async (e) => {

    e.preventDefault();

    await api.post(
      "/financeiro",
      {
        ...form,
        clienteId: id,
      }
    );

    buscarFinanceiro();

    setForm({
      descricao: "",
      valor: "",
      parcelas: "",
      vencimento: "",
    });
  };

  const marcarPago = async (financeiroId) => {

    await api.put(
      `/financeiro/pago/${financeiroId}`
    );

    buscarFinanceiro();
  };

  const cancelar = async (financeiroId) => {

    await api.delete(
      `/financeiro/${financeiroId}`
    );

    buscarFinanceiro();
  };

  const pagos = registros.filter(
    (item) => item.status === "pago"
  );

  const pendentes = registros.filter(
    (item) => item.status === "pendente"
  );

  return (
    <div className="financeiro-container">

      <h1>Financeiro do Cliente</h1>

      <form
        className="financeiro-form"
        onSubmit={salvar}
      >

        <input
          name="descricao"
          placeholder="Descrição"
          value={form.descricao}
          onChange={handleChange}
        />

        <input
          name="valor"
          placeholder="Valor"
          value={form.valor}
          onChange={handleChange}
        />

        <input
          type="number"
          name="parcelas"
          placeholder="Parcelas"
          value={form.parcelas}
          onChange={handleChange}
        />

        <input
          type="date"
          name="vencimento"
          value={form.vencimento}
          onChange={handleChange}
        />

        <button type="submit">
          Salvar
        </button>

      </form>

      <div className="financeiro-section">

        <h2>Valores Pagos</h2>

        {pagos.map((item) => (

          <div
            key={item.id}
            className="
              financeiro-card
              financeiro-pago
            "
          >

            <div className="financeiro-info">

              <strong>
                {item.descricao}
              </strong>

              <p>
                Parcela:
                {" "}
                {item.parcelaAtual}/
                {item.totalParcelas}
              </p>

              <p>
                R$ {item.valor}
              </p>

              <p>
                Vencimento:
                {" "}
                {
                  new Date(item.vencimento)
                  .toLocaleDateString("pt-BR")
                }
              </p>

            </div>

          </div>
        ))}

      </div>

      <div className="financeiro-section">

        <h2>Valores a Pagar</h2>

        {pendentes.map((item) => (

          <div
            key={item.id}
            className="
              financeiro-card
              financeiro-pendente
            "
          >

            <div className="financeiro-info">

              <strong>
                {item.descricao}
              </strong>

              <p>
                Parcela:
                {" "}
                {item.parcelaAtual}/
                {item.totalParcelas}
              </p>

              <p>
                R$ {item.valor}
              </p>

              <p>
                Vencimento:
                {" "}
                {
                  new Date(item.vencimento)
                  .toLocaleDateString("pt-BR")
                }
              </p>

            </div>

            <div className="financeiro-acoes">

              <button
                className="pago-btn"
                onClick={() =>
                  marcarPago(item.id)
                }
              >
                Pago
              </button>

              <button
                className="cancelar-btn"
                onClick={() =>
                  cancelar(item.id)
                }
              >
                Cancelar
              </button>

            </div>

          </div>
        ))}

      </div>

    </div>
  );
}