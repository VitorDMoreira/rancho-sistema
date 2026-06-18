import { useState } from 'react';
import { useReservas, useAtualizarReserva, useRemoverReserva, useConfirmarReserva } from './useReservas';
import type { Reserva } from './useReservas';
import { useClientes } from '../clientes/useClientes';
import { useRanchos } from '../ranchos/useRanchos';

function fmtData(d: string) {
  const [ano, mes, dia] = d.slice(0, 10).split('-');
  return `${dia}/${mes}/${ano}`;
}
function fmtValor(v: number) {
  return Number(v).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}
function toInputDate(d: string) { return d ? d.slice(0, 10) : ''; }

function somarMeses(dataStr: string, meses: number): string {
  const d = new Date(dataStr + 'T12:00:00');
  d.setMonth(d.getMonth() + meses);
  return d.toISOString().slice(0, 10);
}

const STATUS_LABEL: Record<string, { label: string; cor: string }> = {
  ORCAMENTO:        { label: 'Orçamento',      cor: 'bg-gray-100 text-gray-600' },
  AGUARDANDO_SINAL: { label: 'Aguard. Sinal',  cor: 'bg-yellow-100 text-yellow-700' },
  CONFIRMADA:       { label: 'Confirmada',      cor: 'bg-blue-100 text-blue-700' },
  EM_ANDAMENTO:     { label: 'Em andamento',    cor: 'bg-green-100 text-green-700' },
  FINALIZADA:       { label: 'Finalizada',      cor: 'bg-gray-100 text-gray-500' },
  CANCELADA:        { label: 'Cancelada',       cor: 'bg-red-100 text-red-500' },
};

interface Parcela { numero: number; valor: number; dataVencimento: string; tipo?: string; }

const camposVazios = {
  clienteId: '', ranchoId: '', dataEntrada: '', dataSaida: '',
  qtdHospedes: 1, valorNegociado: 0, sinalRecebido: 0,
  percentualEntrada: 20, dataVencimentoEntrada: '', numParcelas: 1,
  formaPagamento: '', observacoes: '',
};

export function ListaReservasTab({ onEditar }: { onEditar: () => void }) {
  const { data: reservas, isLoading } = useReservas();
  const { data: clientes } = useClientes();
  const { data: ranchos } = useRanchos();
  const atualizar = useAtualizarReserva();
  const confirmar = useConfirmarReserva();
  const remover = useRemoverReserva();

  const [confirmandoReserva, setConfirmandoReserva] = useState<Reserva | null>(null);
  const [parcelasConfirm, setParcelasConfirm] = useState<Parcela[]>([]);
  const [numParcelasConfirm, setNumParcelasConfirm] = useState(1);
  const [percEntradaConfirm, setPercEntradaConfirm] = useState(20);
  const [dataEntradaConfirm, setDataEntradaConfirm] = useState('');
  const [editandoId, setEditandoId] = useState<string | null>(null);
  const [form, setForm] = useState(camposVazios);
  const [parcelas, setParcelas] = useState<Parcela[]>([]);

  const diarias = (() => {
    if (!form.dataEntrada || !form.dataSaida) return 0;
    const e = new Date(form.dataEntrada + 'T12:00:00');
    const s = new Date(form.dataSaida + 'T12:00:00');
    return Math.ceil((s.getTime() - e.getTime()) / (1000 * 60 * 60 * 24));
  })();
  const valorTotal = diarias > 0 && form.valorNegociado > 0 ? diarias * form.valorNegociado : 0;
  const valorEntrada = valorTotal > 0 ? (valorTotal * form.percentualEntrada) / 100 : 0;
  const valorRestante = valorTotal - valorEntrada;
  const valorParcelaPadrao = form.numParcelas > 0 ? valorRestante / form.numParcelas : valorRestante;

  function abrirEdicao(r: Reserva) {
    setEditandoId(r.id);
    const dataEntrada = toInputDate(r.dataEntrada);
    setForm({
      clienteId: r.clienteId, ranchoId: r.ranchoId,
      dataEntrada, dataSaida: toInputDate(r.dataSaida),
      qtdHospedes: r.qtdHospedes, valorNegociado: Number(r.valorNegociado),
      sinalRecebido: Number(r.sinalRecebido),
      percentualEntrada: 20, dataVencimentoEntrada: '', numParcelas: 1,
      formaPagamento: r.formaPagamento ?? '', observacoes: r.observacoes ?? '',
    });
    // Gera parcelas iniciais
    if (dataEntrada) {
      setParcelas([{ numero: 1, valor: 0, dataVencimento: somarMeses(dataEntrada, 1) }]);
    }
  }

  function fecharEdicao() { setEditandoId(null); setForm(camposVazios); setParcelas([]); }

  function gerarParcelasConfirm(r: Reserva, perc: number, numP: number, dataEnt: string) {
    const total = Number(r.valorTotal);
    const entrada = total * (perc / 100);
    const restante = total - entrada;
    const valorParcela = numP > 0 ? restante / numP : restante;
    const dataBase = r.dataEntrada.slice(0, 10);
    const geradas: Parcela[] = [
      { numero: 1, valor: Number(entrada.toFixed(2)), dataVencimento: dataEnt || dataBase, tipo: 'SINAL' },
      ...Array.from({ length: numP }, (_, i) => ({
        numero: i + 2,
        valor: Number(valorParcela.toFixed(2)),
        dataVencimento: somarMeses(dataBase, i + 1),
        tipo: 'PARCELA',
      })),
    ];
    setParcelasConfirm(geradas);
  }

  function abrirConfirmacao(r: Reserva) {
    const perc = 20;
    const numP = 1;
    const dataEnt = r.dataEntrada.slice(0, 10);
    setPercEntradaConfirm(perc);
    setNumParcelasConfirm(numP);
    setDataEntradaConfirm(dataEnt);
    setConfirmandoReserva(r);
    gerarParcelasConfirm(r, perc, numP, dataEnt);
  }

  function handleConfirmar() {
    if (!confirmandoReserva) return;
    const payload = parcelasConfirm.map(p => ({
      valor: p.valor,
      vencimento: p.dataVencimento,
      tipo: p.tipo ?? 'PARCELA',
    }));
    confirmar.mutate({ id: confirmandoReserva.id, parcelas: payload }, {
      onSuccess: () => { setConfirmandoReserva(null); setParcelasConfirm([]); }
    });
  }

  function handleSalvar(e: React.FormEvent) {
    e.preventDefault();
    atualizar.mutate({ id: editandoId!, data: { ...form, sinalRecebido: valorEntrada } }, {
      onSuccess: fecharEdicao,
    });
  }

  if (isLoading) return <p>Carregando...</p>;

  return (
    <div>
      {/* Painel de confirmação */}
      {confirmandoReserva && (
        <div className="bg-white rounded-lg shadow p-6 mb-6 border-l-4 border-blue-500">
          <h2 className="text-lg font-semibold mb-1 text-blue-700">✅ Confirmar Reserva</h2>
          <p className="text-sm text-gray-500 mb-4">
            <strong>{confirmandoReserva.cliente?.nomeCompleto}</strong> — {confirmandoReserva.rancho?.nome} —
            Total: <strong>{fmtValor(confirmandoReserva.valorTotal)}</strong>
          </p>

          {/* Configuração das parcelas */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-4 bg-blue-50 p-3 rounded">
            <div>
              <label className="block text-xs text-gray-500 mb-1">Entrada (%)</label>
              <input type="number" min={0} max={100} value={percEntradaConfirm}
                onChange={e => {
                  const v = Number(e.target.value);
                  setPercEntradaConfirm(v);
                  gerarParcelasConfirm(confirmandoReserva, v, numParcelasConfirm, dataEntradaConfirm);
                }}
                className="w-full border rounded px-3 py-1.5 text-sm focus:outline-none focus:ring-1 focus:ring-blue-400" />
            </div>
            <div>
              <label className="block text-xs text-gray-500 mb-1">Vencimento da Entrada</label>
              <input type="date" value={dataEntradaConfirm}
                onChange={e => {
                  setDataEntradaConfirm(e.target.value);
                  gerarParcelasConfirm(confirmandoReserva, percEntradaConfirm, numParcelasConfirm, e.target.value);
                }}
                className="w-full border rounded px-3 py-1.5 text-sm focus:outline-none focus:ring-1 focus:ring-blue-400" />
            </div>
            <div>
              <label className="block text-xs text-gray-500 mb-1">Nº de Parcelas do Restante</label>
              <input type="number" min={1} max={24} value={numParcelasConfirm}
                onChange={e => {
                  const v = Number(e.target.value);
                  setNumParcelasConfirm(v);
                  gerarParcelasConfirm(confirmandoReserva, percEntradaConfirm, v, dataEntradaConfirm);
                }}
                className="w-full border rounded px-3 py-1.5 text-sm focus:outline-none focus:ring-1 focus:ring-blue-400" />
            </div>
          </div>

          <p className="text-xs font-semibold text-gray-600 uppercase tracking-wide mb-2">
            Ajuste os valores e vencimentos se necessário:
          </p>
          <table className="w-full text-sm mb-4">
            <thead>
              <tr className="text-xs text-gray-500 border-b">
                <th className="text-left py-1 pr-3">Lançamento</th>
                <th className="text-left py-1 pr-3">Valor (R$)</th>
                <th className="text-left py-1">Vencimento</th>
              </tr>
            </thead>
            <tbody>
              {parcelasConfirm.map((p, i) => (
                <tr key={i} className="border-b border-gray-100">
                  <td className="py-2 pr-3 text-gray-600 font-medium">
                    {i === 0 ? '💰 Entrada' : `📄 Parcela ${i}`}
                  </td>
                  <td className="py-2 pr-3">
                    <input type="number" min={0} step="0.01" value={p.valor}
                      onChange={e => { const n = [...parcelasConfirm]; n[i] = { ...n[i], valor: Number(e.target.value) }; setParcelasConfirm(n); }}
                      className="w-32 border rounded px-2 py-1 text-sm focus:outline-none focus:ring-1 focus:ring-blue-400" />
                  </td>
                  <td className="py-2">
                    <input type="date" value={p.dataVencimento}
                      onChange={e => { const n = [...parcelasConfirm]; n[i] = { ...n[i], dataVencimento: e.target.value }; setParcelasConfirm(n); }}
                      className="border rounded px-2 py-1 text-sm focus:outline-none focus:ring-1 focus:ring-blue-400" />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="flex gap-3">
            <button onClick={handleConfirmar} disabled={confirmar.isPending}
              className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 disabled:opacity-50 text-sm font-medium">
              {confirmar.isPending ? 'Confirmando...' : '✅ Confirmar e Gerar Parcelas'}
            </button>
            <button onClick={() => setConfirmandoReserva(null)}
              className="px-6 py-2 rounded border text-gray-600 hover:bg-gray-100 text-sm">
              Cancelar
            </button>
          </div>
        </div>
      )}

      {/* Formulário de edição inline */}
      {editandoId && (
        <div className="bg-white rounded-lg shadow p-6 mb-6 border-l-4 border-yellow-400">
          <h2 className="text-lg font-semibold mb-4 text-yellow-700">✏️ Editando Reserva</h2>
          <form onSubmit={handleSalvar}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-gray-600 mb-1">Cliente *</label>
                <select required value={form.clienteId} onChange={e => setForm({ ...form, clienteId: e.target.value })}
                  className="w-full border rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-400">
                  <option value="">Selecione</option>
                  {clientes?.map(c => <option key={c.id} value={c.id}>{c.nomeCompleto}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm text-gray-600 mb-1">Imóvel *</label>
                <select required value={form.ranchoId} onChange={e => setForm({ ...form, ranchoId: e.target.value })}
                  className="w-full border rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-400">
                  <option value="">Selecione</option>
                  {ranchos?.map(r => <option key={r.id} value={r.id}>{r.codigoInterno} — {r.nome}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm text-gray-600 mb-1">Entrada *</label>
                <input required type="date" value={form.dataEntrada} onChange={e => setForm({ ...form, dataEntrada: e.target.value })}
                  className="w-full border rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-400" />
              </div>
              <div>
                <label className="block text-sm text-gray-600 mb-1">Saída *</label>
                <input required type="date" value={form.dataSaida} onChange={e => setForm({ ...form, dataSaida: e.target.value })}
                  className="w-full border rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-400" />
              </div>
              <div>
                <label className="block text-sm text-gray-600 mb-1">Hóspedes</label>
                <input type="number" min={1} value={form.qtdHospedes} onChange={e => setForm({ ...form, qtdHospedes: Number(e.target.value) })}
                  className="w-full border rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-400" />
              </div>
              <div>
                <label className="block text-sm text-gray-600 mb-1">Valor por Diária (R$)</label>
                <input type="number" min={0} step="0.01" value={form.valorNegociado} onChange={e => setForm({ ...form, valorNegociado: Number(e.target.value) })}
                  className="w-full border rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-400" />
              </div>
              <div>
                <label className="block text-sm text-gray-600 mb-1">Entrada (%)</label>
                <input type="number" min={0} max={100} value={form.percentualEntrada} onChange={e => setForm({ ...form, percentualEntrada: Number(e.target.value) })}
                  className="w-full border rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-400" />
              </div>
              <div>
                <label className="block text-sm text-gray-600 mb-1">Vencimento da Entrada</label>
                <input type="date" value={form.dataVencimentoEntrada} onChange={e => setForm({ ...form, dataVencimentoEntrada: e.target.value })}
                  className="w-full border rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-400" />
              </div>
              <div>
                <label className="block text-sm text-gray-600 mb-1">Nº de Parcelas</label>
                <input type="number" min={1} max={24} value={form.numParcelas} onChange={e => setForm({ ...form, numParcelas: Number(e.target.value) })}
                  className="w-full border rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-400" />
              </div>
              <div>
                <label className="block text-sm text-gray-600 mb-1">Forma de Pagamento</label>
                <select value={form.formaPagamento} onChange={e => setForm({ ...form, formaPagamento: e.target.value })}
                  className="w-full border rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-400">
                  <option value="">Selecione</option>
                  <option value="PIX">PIX</option>
                  <option value="DINHEIRO">Dinheiro</option>
                  <option value="TRANSFERENCIA">Transferência</option>
                  <option value="CARTAO_CREDITO">Cartão de Crédito</option>
                  <option value="CARTAO_DEBITO">Cartão de Débito</option>
                </select>
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm text-gray-600 mb-1">Observações</label>
                <textarea value={form.observacoes} onChange={e => setForm({ ...form, observacoes: e.target.value })}
                  className="w-full border rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-400" rows={2} />
              </div>
            </div>

            {valorTotal > 0 && (
              <div className="mt-4 bg-yellow-50 border border-yellow-200 rounded-lg p-4 text-sm">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  <div><span className="text-gray-500">Diárias:</span> <strong>{diarias}</strong></div>
                  <div><span className="text-gray-500">Total:</span> <strong>{fmtValor(valorTotal)}</strong></div>
                  <div><span className="text-gray-500">Entrada ({form.percentualEntrada}%):</span> <strong className="text-green-700">{fmtValor(valorEntrada)}</strong></div>
                  <div><span className="text-gray-500">Restante:</span> <strong className="text-blue-700">{fmtValor(valorRestante)}</strong></div>
                </div>
              </div>
            )}

            <div className="mt-4 flex gap-3">
              <button type="submit" disabled={atualizar.isPending}
                className="bg-yellow-500 text-white px-6 py-2 rounded hover:bg-yellow-600 disabled:opacity-50 text-sm font-medium">
                {atualizar.isPending ? 'Salvando...' : '💾 Salvar Alterações'}
              </button>
              <button type="button" onClick={fecharEdicao}
                className="px-6 py-2 rounded border text-gray-600 hover:bg-gray-100 text-sm">
                Cancelar
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Tabela */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 text-gray-500 text-left">
            <tr>
              <th className="px-4 py-3">Cliente</th>
              <th className="px-4 py-3">Imóvel</th>
              <th className="px-4 py-3">Entrada</th>
              <th className="px-4 py-3">Saída</th>
              <th className="px-4 py-3">Diárias</th>
              <th className="px-4 py-3">Total</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3"></th>
            </tr>
          </thead>
          <tbody>
            {reservas?.length === 0 && (
              <tr><td colSpan={8} className="px-4 py-8 text-center text-gray-400">Nenhuma reserva cadastrada</td></tr>
            )}
            {reservas?.map((r: Reserva) => {
              const st = STATUS_LABEL[r.status] ?? { label: r.status, cor: 'bg-gray-100 text-gray-500' };
              return (
                <tr key={r.id} className={`border-t ${editandoId === r.id ? 'bg-yellow-50' : 'hover:bg-gray-50'}`}>
                  <td className="px-4 py-3 font-medium">{r.cliente?.nomeCompleto}</td>
                  <td className="px-4 py-3 text-gray-500">{r.rancho?.nome}</td>
                  <td className="px-4 py-3 text-gray-500">{fmtData(r.dataEntrada)}</td>
                  <td className="px-4 py-3 text-gray-500">{fmtData(r.dataSaida)}</td>
                  <td className="px-4 py-3 text-center">{r.numDiarias}</td>
                  <td className="px-4 py-3 font-medium">{fmtValor(r.valorTotal)}</td>
                  <td className="px-4 py-3">
                    <span className={`text-xs px-2 py-1 rounded-full ${st.cor}`}>{st.label}</span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex gap-2 flex-wrap items-center">
                      {(r.status === 'ORCAMENTO' || r.status === 'AGUARDANDO_SINAL') && (
                        <button onClick={() => abrirConfirmacao(r)}
                          className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold px-3 py-1 rounded">
                          ✅ Confirmar
                        </button>
                      )}
                      <button onClick={() => abrirEdicao(r)}
                        className="text-gray-400 hover:text-gray-600 text-xs border border-gray-200 rounded px-2 py-1 hover:bg-gray-50">Editar</button>
                      <button onClick={() => { if (confirm('Remover esta reserva?')) remover.mutate(r.id); }}
                        className="text-red-400 hover:text-red-600 text-xs border border-red-200 rounded px-2 py-1 hover:bg-red-50">Remover</button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
