import { useState, useMemo } from 'react';
import { useBancosComSaldo } from '../cadastro/useBancos';
import { useMovimentos, useCriarTransferencia, type TransferenciaPayload } from './useMovimentos';

function fmtValor(v: number) {
  return Number(v).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}
function fmtData(d: string) {
  if (!d) return '—';
  const [ano, mes, dia] = d.slice(0, 10).split('-');
  return `${dia}/${mes}/${ano}`;
}
function hoje() {
  return new Date().toISOString().slice(0, 10);
}

// ─── Modal de Transferência ──────────────────────────────────────────────────
function ModalTransferencia({ bancos, onFechar, onConfirmar, salvando }: {
  bancos: any[];
  onFechar: () => void;
  onConfirmar: (payload: TransferenciaPayload) => void;
  salvando: boolean;
}) {
  const [contaOrigemId, setContaOrigemId] = useState('');
  const [contaDestinoId, setContaDestinoId] = useState('');
  const [valor, setValor] = useState(0);
  const [data, setData] = useState(hoje());
  const [observacoes, setObservacoes] = useState('');

  function handleSalvar() {
    if (!contaOrigemId || !contaDestinoId || contaOrigemId === contaDestinoId || valor <= 0) return;
    onConfirmar({ contaOrigemId, contaDestinoId, valor, data, observacoes: observacoes || undefined });
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-md">
        <div className="flex items-center justify-between px-6 py-4 border-b">
          <h2 className="font-bold text-gray-800 text-base">Transferência entre Contas</h2>
          <button onClick={onFechar} className="text-gray-400 hover:text-gray-600 text-xl leading-none">✕</button>
        </div>
        <div className="p-6 space-y-3">
          <div>
            <label className="block text-xs text-gray-500 mb-1">Conta de Origem *</label>
            <select value={contaOrigemId} onChange={e => setContaOrigemId(e.target.value)}
              className="w-full border rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400">
              <option value="">Selecione</option>
              {bancos.map(b => <option key={b.id} value={b.id}>{b.nome} ({fmtValor(b.saldo)})</option>)}
            </select>
          </div>
          <div>
            <label className="block text-xs text-gray-500 mb-1">Conta de Destino *</label>
            <select value={contaDestinoId} onChange={e => setContaDestinoId(e.target.value)}
              className="w-full border rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400">
              <option value="">Selecione</option>
              {bancos.filter(b => b.id !== contaOrigemId).map(b => <option key={b.id} value={b.id}>{b.nome}</option>)}
            </select>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs text-gray-500 mb-1">Valor (R$) *</label>
              <input type="number" min={0.01} step="0.01" value={valor || ''}
                onChange={e => setValor(Number(e.target.value))}
                className="w-full border rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400" />
            </div>
            <div>
              <label className="block text-xs text-gray-500 mb-1">Data *</label>
              <input type="date" value={data} onChange={e => setData(e.target.value)}
                className="w-full border rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400" />
            </div>
          </div>
          <div>
            <label className="block text-xs text-gray-500 mb-1">Observações</label>
            <input value={observacoes} onChange={e => setObservacoes(e.target.value)}
              className="w-full border rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400" />
          </div>
        </div>
        <div className="flex justify-end gap-3 px-6 py-4 border-t bg-gray-50 rounded-b-xl">
          <button onClick={onFechar} className="px-6 py-2 border rounded text-sm text-gray-600 hover:bg-gray-100">
            Cancelar
          </button>
          <button onClick={handleSalvar} disabled={salvando}
            className="bg-blue-500 text-white px-6 py-2 rounded text-sm font-medium hover:bg-blue-600 disabled:opacity-50">
            {salvando ? 'Salvando...' : '💾 Transferir'}
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Aba principal ────────────────────────────────────────────────────────────
export function CaixaTab() {
  const { data: bancos = [], isLoading } = useBancosComSaldo();
  const [mostrarTransferencia, setMostrarTransferencia] = useState(false);

  const [contaBancariaId, setContaBancariaId] = useState('');
  const [dataIni, setDataIni] = useState('');
  const [dataFim, setDataFim] = useState('');
  const [busca, setBusca] = useState('');
  const [filtroAplicado, setFiltroAplicado] = useState<{ contaBancariaId: string; dataIni: string; dataFim: string; busca: string }>({
    contaBancariaId: '', dataIni: '', dataFim: '', busca: '',
  });

  const { data: movimentos = [] } = useMovimentos(filtroAplicado);
  const criarTransferencia = useCriarTransferencia();

  const saldoTotal = useMemo(() => bancos.reduce((s, b) => s + b.saldo, 0), [bancos]);

  function aplicarFiltros() {
    setFiltroAplicado({ contaBancariaId, dataIni, dataFim, busca });
  }
  function limparFiltros() {
    setContaBancariaId(''); setDataIni(''); setDataFim(''); setBusca('');
    setFiltroAplicado({ contaBancariaId: '', dataIni: '', dataFim: '', busca: '' });
  }

  function handleConfirmarTransferencia(payload: TransferenciaPayload) {
    criarTransferencia.mutate(payload, {
      onSuccess: () => setMostrarTransferencia(false),
    });
  }

  if (isLoading) return <p className="p-8">Carregando...</p>;

  return (
    <div className="flex flex-col gap-4">

      {mostrarTransferencia && (
        <ModalTransferencia
          bancos={bancos}
          onFechar={() => setMostrarTransferencia(false)}
          onConfirmar={handleConfirmarTransferencia}
          salvando={criarTransferencia.isPending}
        />
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Lista de bancos e saldos */}
        <div className="bg-white rounded-lg shadow overflow-hidden lg:col-span-1">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-gray-500 text-left">
              <tr>
                <th className="px-4 py-3">Banco</th>
                <th className="px-4 py-3">Conta</th>
                <th className="px-4 py-3 text-right">Saldo</th>
              </tr>
            </thead>
            <tbody>
              {bancos.length === 0 && (
                <tr><td colSpan={3} className="px-4 py-8 text-center text-gray-400">Nenhuma conta cadastrada</td></tr>
              )}
              {bancos.map(b => (
                <tr key={b.id} className="border-t hover:bg-gray-50">
                  <td className="px-4 py-3 font-medium">{b.nome}</td>
                  <td className="px-4 py-3 text-gray-500">{b.conta || '—'}</td>
                  <td className={`px-4 py-3 text-right font-semibold ${b.saldo < 0 ? 'text-red-600' : 'text-gray-700'}`}>
                    {fmtValor(b.saldo)}
                  </td>
                </tr>
              ))}
            </tbody>
            {bancos.length > 0 && (
              <tfoot>
                <tr className="border-t-2 bg-gray-50">
                  <td className="px-4 py-3 font-bold" colSpan={2}>Saldo Global</td>
                  <td className={`px-4 py-3 text-right font-bold ${saldoTotal < 0 ? 'text-red-600' : 'text-green-700'}`}>
                    {fmtValor(saldoTotal)}
                  </td>
                </tr>
              </tfoot>
            )}
          </table>
        </div>

        {/* Botões de ação + filtros */}
        <div className="lg:col-span-2 flex flex-col gap-4">
          <div className="flex gap-3">
            <button onClick={() => setMostrarTransferencia(true)}
              className="flex items-center gap-2 bg-blue-500 hover:bg-blue-600 text-white px-5 py-3 rounded-lg text-sm font-medium">
              🔄 Transferência
            </button>
            <button onClick={aplicarFiltros}
              className="flex items-center gap-2 bg-cyan-500 hover:bg-cyan-600 text-white px-5 py-3 rounded-lg text-sm font-medium">
              📄 Extrato
            </button>
          </div>

          {/* Filtros */}
          <div className="bg-white rounded-lg shadow p-4">
            <div className="flex flex-wrap items-end gap-3">
              <div className="flex flex-col min-w-[160px]">
                <label className="text-xs text-gray-400 mb-1">Banco</label>
                <select value={contaBancariaId} onChange={e => setContaBancariaId(e.target.value)}
                  className="border rounded px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-cyan-400">
                  <option value="">Todos</option>
                  {bancos.map(b => <option key={b.id} value={b.id}>{b.nome}</option>)}
                </select>
              </div>
              <div className="flex flex-col">
                <label className="text-xs text-gray-400 mb-1">Data Inicial</label>
                <input type="date" value={dataIni} onChange={e => setDataIni(e.target.value)}
                  className="border rounded px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-cyan-400" />
              </div>
              <div className="flex flex-col">
                <label className="text-xs text-gray-400 mb-1">Data Final</label>
                <input type="date" value={dataFim} onChange={e => setDataFim(e.target.value)}
                  className="border rounded px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-cyan-400" />
              </div>
              <div className="flex flex-col flex-1 min-w-[160px]">
                <label className="text-xs text-gray-400 mb-1">Cliente, Fornecedor ou Plano de Contas</label>
                <input value={busca} onChange={e => setBusca(e.target.value)}
                  onKeyDown={e => { if (e.key === 'Enter') aplicarFiltros(); }}
                  placeholder="Buscar..."
                  className="border rounded px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-cyan-400" />
              </div>
              <button onClick={aplicarFiltros}
                className="bg-cyan-500 hover:bg-cyan-600 text-white px-5 py-1.5 rounded text-sm font-medium">
                Filtrar
              </button>
              <button onClick={limparFiltros}
                className="px-4 py-1.5 border rounded text-sm text-gray-600 hover:bg-gray-50">
                Limpar
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Tabela de movimentações */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="px-4 py-3 border-b">
          <h3 className="font-semibold text-gray-700">Movimentações</h3>
        </div>
        <table className="w-full text-sm">
          <thead className="bg-gray-50 text-gray-500 text-left">
            <tr>
              <th className="px-4 py-3">Data</th>
              <th className="px-4 py-3">Descrição</th>
              <th className="px-4 py-3">Cliente / Fornecedor</th>
              <th className="px-4 py-3">Plano de Contas</th>
              <th className="px-4 py-3">Banco</th>
              <th className="px-4 py-3 text-right">Valor</th>
            </tr>
          </thead>
          <tbody>
            {movimentos.length === 0 && (
              <tr><td colSpan={6} className="px-4 py-8 text-center text-gray-400">Nenhuma movimentação encontrada</td></tr>
            )}
            {movimentos.map(m => (
              <tr key={m.id} className="border-t hover:bg-gray-50">
                <td className="px-4 py-3 text-gray-500">{fmtData(m.data)}</td>
                <td className="px-4 py-3 font-medium">{m.descricao}</td>
                <td className="px-4 py-3 text-gray-500">{m.contraparte || '—'}</td>
                <td className="px-4 py-3 text-gray-500">{m.planoConta || '—'}</td>
                <td className="px-4 py-3 text-gray-500">{m.contaBancariaNome || '—'}</td>
                <td className={`px-4 py-3 font-semibold text-right ${m.tipo === 'ENTRADA' ? 'text-green-600' : 'text-red-500'}`}>
                  {m.tipo === 'ENTRADA' ? '+' : '−'} {fmtValor(m.valor)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
