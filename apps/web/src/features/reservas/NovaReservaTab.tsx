import { useState, useEffect } from 'react';
import { useCriarReserva, useConfirmarReserva } from './useReservas';
import { useClientes } from '../clientes/useClientes';
import { useRanchos } from '../ranchos/useRanchos';

function fmtValor(v: number) {
  return Number(v).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}
function fmtData(d: string) {
  const [ano, mes, dia] = d.slice(0, 10).split('-');
  return `${dia}/${mes}/${ano}`;
}
function somarMeses(dataStr: string, meses: number): string {
  const d = new Date(dataStr + 'T12:00:00');
  d.setMonth(d.getMonth() + meses);
  return d.toISOString().slice(0, 10);
}

interface Parcela { numero: number; valor: number; dataVencimento: string; }

const camposVazios = {
  clienteId: '', ranchoId: '', dataEntrada: '', dataSaida: '',
  qtdHospedes: 1, valorNegociado: 0, sinalRecebido: 0,
  percentualEntrada: 20, dataVencimentoEntrada: '', numParcelas: 1,
  formaPagamento: '', observacoes: '',
};

export function NovaReservaTab({ onSalvar }: { onSalvar: () => void }) {
  const { data: clientes } = useClientes();
  const { data: ranchos } = useRanchos();
  const criar = useCriarReserva();
  const confirmar = useConfirmarReserva();
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

  useEffect(() => {
    if (!form.dataEntrada || valorRestante <= 0 || form.numParcelas < 1) { setParcelas([]); return; }
    setParcelas(
      Array.from({ length: form.numParcelas }, (_, i) => ({
        numero: i + 1,
        valor: Number(valorParcelaPadrao.toFixed(2)),
        dataVencimento: somarMeses(form.dataEntrada, i + 1),
      }))
    );
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [form.dataEntrada, form.numParcelas, form.percentualEntrada, form.valorNegociado, form.dataSaida]);

  function handleSalvar(e: React.FormEvent) {
    e.preventDefault();

    // Monta a lista de lançamentos para o Financeiro:
    // 1º → entrada (sinal), com a data de vencimento informada
    // demais → parcelas do restante
    const parcelasFinanceiro = [
      {
        valor: Number(valorEntrada.toFixed(2)),
        vencimento: form.dataVencimentoEntrada,
        tipo: 'SINAL',
      },
      ...parcelas.map(p => ({
        valor: Number(p.valor),
        vencimento: p.dataVencimento,
        tipo: 'PARCELA',
      })),
    ];

    criar.mutate({ ...form, sinalRecebido: valorEntrada }, {
      onSuccess: (res) => {
        const reservaId = res.data?.id;
        if (reservaId && parcelasFinanceiro.every(p => p.vencimento)) {
          // Confirma a reserva já gerando as parcelas no Financeiro
          confirmar.mutate(
            { id: reservaId, parcelas: parcelasFinanceiro },
            { onSuccess: () => { setForm(camposVazios); setParcelas([]); onSalvar(); } }
          );
        } else {
          setForm(camposVazios); setParcelas([]); onSalvar();
        }
      },
    });
  }

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-lg font-semibold mb-6 text-gray-800">Nova Reserva</h2>
      <form onSubmit={handleSalvar}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm text-gray-600 mb-1">Cliente *</label>
            <select required value={form.clienteId} onChange={e => setForm({ ...form, clienteId: e.target.value })}
              className="w-full border rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-400">
              <option value="">Selecione o cliente</option>
              {clientes?.map(c => <option key={c.id} value={c.id}>{c.nomeCompleto}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm text-gray-600 mb-1">Imóvel *</label>
            <select required value={form.ranchoId} onChange={e => setForm({ ...form, ranchoId: e.target.value })}
              className="w-full border rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-400">
              <option value="">Selecione o imóvel</option>
              {ranchos?.map(r => <option key={r.id} value={r.id}>{r.codigoInterno} — {r.nome}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm text-gray-600 mb-1">Data de Entrada *</label>
            <input required type="date" value={form.dataEntrada} onChange={e => setForm({ ...form, dataEntrada: e.target.value })}
              className="w-full border rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-400" />
          </div>
          <div>
            <label className="block text-sm text-gray-600 mb-1">Data de Saída *</label>
            <input required type="date" value={form.dataSaida} onChange={e => setForm({ ...form, dataSaida: e.target.value })}
              className="w-full border rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-400" />
          </div>
          <div>
            <label className="block text-sm text-gray-600 mb-1">Nº de Hóspedes *</label>
            <input required type="number" min={1} value={form.qtdHospedes} onChange={e => setForm({ ...form, qtdHospedes: Number(e.target.value) })}
              className="w-full border rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-400" />
          </div>
          <div>
            <label className="block text-sm text-gray-600 mb-1">Valor por Diária (R$) *</label>
            <input required type="number" min={0} step="0.01" value={form.valorNegociado} onChange={e => setForm({ ...form, valorNegociado: Number(e.target.value) })}
              className="w-full border rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-400" />
          </div>
          <div>
            <label className="block text-sm text-gray-600 mb-1">Entrada (%)</label>
            <input type="number" min={0} max={100} value={form.percentualEntrada} onChange={e => setForm({ ...form, percentualEntrada: Number(e.target.value) })}
              className="w-full border rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-400" />
          </div>
          <div>
            <label className="block text-sm text-gray-600 mb-1">Vencimento da Entrada *</label>
            <input required type="date" value={form.dataVencimentoEntrada} onChange={e => setForm({ ...form, dataVencimentoEntrada: e.target.value })}
              className="w-full border rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-400" />
          </div>
          <div>
            <label className="block text-sm text-gray-600 mb-1">Nº de Parcelas do Restante</label>
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

        {/* Resumo financeiro */}
        {valorTotal > 0 && (
          <div className="mt-5 bg-green-50 border border-green-200 rounded-lg p-4">
            <h3 className="text-sm font-semibold text-green-800 mb-3">📊 Resumo Financeiro</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm mb-4">
              <div><span className="text-gray-500">Diárias:</span> <strong>{diarias}</strong></div>
              <div><span className="text-gray-500">Total:</span> <strong>{fmtValor(valorTotal)}</strong></div>
              <div>
                <span className="text-gray-500">Entrada ({form.percentualEntrada}%):</span>{' '}
                <strong className="text-green-700">{fmtValor(valorEntrada)}</strong>
                {form.dataVencimentoEntrada && (
                  <span className="block text-xs text-gray-400">vence em {fmtData(form.dataVencimentoEntrada)}</span>
                )}
              </div>
              <div><span className="text-gray-500">Restante:</span> <strong className="text-blue-700">{fmtValor(valorRestante)}</strong></div>
            </div>

            {parcelas.length > 0 && (
              <div>
                <p className="text-xs font-semibold text-gray-600 mb-2 uppercase tracking-wide">
                  Parcelas — ajuste valor ou data se necessário:
                </p>
                <table className="w-full text-sm">
                  <thead>
                    <tr className="text-xs text-gray-500 border-b">
                      <th className="text-left py-1 pr-3">Parcela</th>
                      <th className="text-left py-1 pr-3">Valor (R$)</th>
                      <th className="text-left py-1">Vencimento</th>
                    </tr>
                  </thead>
                  <tbody>
                    {parcelas.map((p, i) => (
                      <tr key={i} className="border-b border-green-100">
                        <td className="py-1 pr-3 text-gray-500 font-medium">{p.numero}ª</td>
                        <td className="py-1 pr-3">
                          <input type="number" min={0} step="0.01" value={p.valor}
                            onChange={e => { const n = [...parcelas]; n[i] = { ...n[i], valor: Number(e.target.value) }; setParcelas(n); }}
                            className="w-28 border rounded px-2 py-1 text-sm focus:outline-none focus:ring-1 focus:ring-green-400" />
                        </td>
                        <td className="py-1">
                          <input type="date" value={p.dataVencimento}
                            onChange={e => { const n = [...parcelas]; n[i] = { ...n[i], dataVencimento: e.target.value }; setParcelas(n); }}
                            className="border rounded px-2 py-1 text-sm focus:outline-none focus:ring-1 focus:ring-green-400" />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        <div className="mt-5 flex gap-3">
          <button type="submit" disabled={criar.isPending}
            className="bg-green-600 text-white px-8 py-2 rounded hover:bg-green-700 disabled:opacity-50 font-medium">
            {criar.isPending ? 'Salvando...' : '✅ Salvar Reserva'}
          </button>
          <button type="button" onClick={() => setForm(camposVazios)}
            className="px-6 py-2 rounded border text-gray-600 hover:bg-gray-100">
            Limpar
          </button>
        </div>
      </form>
    </div>
  );
}
