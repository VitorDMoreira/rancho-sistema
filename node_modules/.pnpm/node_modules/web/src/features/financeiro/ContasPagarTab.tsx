import { useState, useMemo } from 'react';
import {
  useContasPagar, useResumoPagar, useCategorias,
  useCriarContaPagar, useMarcarPago, useRemoverContaPagar,
  type PagarContaPagarPayload,
} from './useContasPagar';
import { useRanchos } from '../ranchos/useRanchos';
import { useFornecedores } from '../cadastro/useFornecedores';
import { useBancos } from '../cadastro/useBancos';

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
function isAtrasado(vencimento: string, status: string) {
  if (status === 'PAGO') return false;
  return vencimento.slice(0, 10) < hoje();
}

const FORMAS = [
  { valor: 'DINHEIRO',      label: 'Dinheiro',     icone: '💵' },
  { valor: 'PIX',           label: 'PIX/TED',      icone: '📲' },
  { valor: 'TRANSFERENCIA', label: 'Transferência',icone: '🏦' },
  { valor: 'CARTAO_CREDITO',label: 'Cartão',       icone: '💳' },
  { valor: 'BOLETO',        label: 'Boleto',       icone: '📄' },
];

const camposVazios = {
  categoriaId: '', fornecedorId: '', ranchoId: '',
  numeroNota: '', dataEmissao: '',
  valor: 0, vencimento: '', observacoes: '',
};

// ─── Modal de Pagamento ──────────────────────────────────────────────────────
interface ModalProps {
  conta: any;
  bancos: any[];
  onFechar: () => void;
  onConfirmar: (payload: Omit<PagarContaPagarPayload, 'id'>) => void;
  salvando: boolean;
}

function ModalPagamento({ conta, bancos, onFechar, onConfirmar, salvando }: ModalProps) {
  const [dataPagamento, setDataPagamento]     = useState(hoje());
  const [formaPagamento, setFormaPagamento]   = useState('PIX');
  const [contaBancariaId, setContaBancariaId] = useState('');
  const [desconto, setDesconto] = useState(0);
  const [multa, setMulta]       = useState(0);
  const [juros, setJuros]       = useState(0);
  const [nRecibo, setNRecibo]   = useState('');
  const [obs, setObs]           = useState('');

  const valorParcela = Number(conta.valor);
  const valorTotal   = valorParcela - desconto + multa + juros;

  function handleSalvar() {
    onConfirmar({
      dataPagamento,
      formaPagamento,
      contaBancariaId: contaBancariaId || undefined,
      desconto, multa, juros,
      nRecibo: nRecibo || undefined,
      observacoesPagamento: obs || undefined,
    });
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b">
          <div>
            <h2 className="font-bold text-gray-800 text-base">Registrar Pagamento</h2>
            <p className="text-sm text-gray-500 mt-0.5">{conta.descricao} — {conta.fornecedor?.nome ?? conta.categoria?.nome}</p>
          </div>
          <button onClick={onFechar} className="text-gray-400 hover:text-gray-600 text-xl leading-none">✕</button>
        </div>

        <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Coluna esquerda */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider">Saída do Pagamento</h3>

            <div>
              <label className="block text-xs text-gray-500 mb-1">Banco / Conta *</label>
              <select value={contaBancariaId} onChange={e => setContaBancariaId(e.target.value)}
                className="w-full border rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-400">
                <option value="">Selecione o banco</option>
                {bancos.filter(b => b.ativo).map(b => (
                  <option key={b.id} value={b.id}>{b.nome} — {b.banco}</option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs text-gray-500 mb-1">Data do Pagamento *</label>
                <input type="date" value={dataPagamento} onChange={e => setDataPagamento(e.target.value)}
                  className="w-full border rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-400" />
              </div>
              <div>
                <label className="block text-xs text-gray-500 mb-1">Nº Recibo</label>
                <input type="text" value={nRecibo} onChange={e => setNRecibo(e.target.value)}
                  placeholder="Opcional"
                  className="w-full border rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-400" />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs text-gray-500 mb-1">Valor da Conta</label>
                <div className="border rounded px-3 py-2 text-sm bg-gray-50 text-gray-700 font-medium">
                  {fmtValor(valorParcela)}
                </div>
              </div>
              <div>
                <label className="block text-xs text-gray-500 mb-1">Valor em Aberto</label>
                <div className="border rounded px-3 py-2 text-sm bg-gray-50 text-gray-700 font-medium">
                  {fmtValor(valorParcela)}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs text-gray-500 mb-1">Desconto (R$)</label>
                <input type="number" min={0} step="0.01" value={desconto}
                  onChange={e => setDesconto(Number(e.target.value))}
                  className="w-full border rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-400" />
              </div>
              <div>
                <label className="block text-xs text-gray-500 mb-1">Multa (R$)</label>
                <input type="number" min={0} step="0.01" value={multa}
                  onChange={e => setMulta(Number(e.target.value))}
                  className="w-full border rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-400" />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs text-gray-500 mb-1">Juros (R$)</label>
                <input type="number" min={0} step="0.01" value={juros}
                  onChange={e => setJuros(Number(e.target.value))}
                  className="w-full border rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-400" />
              </div>
              <div>
                <label className="block text-xs text-gray-500 mb-1">Total a Pagar</label>
                <div className="border-2 border-red-400 text-red-700 bg-red-50 rounded px-3 py-2 text-sm font-bold">
                  {fmtValor(valorTotal)}
                </div>
              </div>
            </div>

            <div>
              <label className="block text-xs text-gray-500 mb-1">Observações</label>
              <textarea value={obs} onChange={e => setObs(e.target.value)} rows={2}
                placeholder="Opcional"
                className="w-full border rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-400" />
            </div>
          </div>

          {/* Coluna direita */}
          <div>
            <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">Tipo de Pagamento</h3>
            <div className="grid grid-cols-2 gap-2 mb-4">
              {FORMAS.map(f => (
                <button key={f.valor} type="button"
                  onClick={() => setFormaPagamento(f.valor)}
                  className={`flex items-center gap-2 px-3 py-2.5 rounded-lg border-2 text-sm font-medium transition-all ${
                    formaPagamento === f.valor
                      ? 'bg-red-500 border-red-500 text-white'
                      : 'bg-white border-gray-200 text-gray-600 hover:border-red-400'
                  }`}>
                  <span>{f.icone}</span>
                  <span>{f.label}</span>
                </button>
              ))}
            </div>

            <div className="bg-gray-50 rounded-lg p-4 mt-4">
              <p className="text-xs text-gray-500 mb-2">Resumo</p>
              <div className="space-y-1 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Valor da conta:</span>
                  <span className="font-medium">{fmtValor(valorParcela)}</span>
                </div>
                {desconto > 0 && (
                  <div className="flex justify-between text-blue-600">
                    <span>Desconto:</span>
                    <span>- {fmtValor(desconto)}</span>
                  </div>
                )}
                {multa > 0 && (
                  <div className="flex justify-between text-red-600">
                    <span>Multa:</span>
                    <span>+ {fmtValor(multa)}</span>
                  </div>
                )}
                {juros > 0 && (
                  <div className="flex justify-between text-red-600">
                    <span>Juros:</span>
                    <span>+ {fmtValor(juros)}</span>
                  </div>
                )}
                <div className="flex justify-between font-bold text-red-700 border-t pt-1 mt-1">
                  <span>Total:</span>
                  <span>{fmtValor(valorTotal)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-3 px-6 py-4 border-t bg-gray-50 rounded-b-xl">
          <button onClick={onFechar}
            className="px-6 py-2 border rounded text-sm text-gray-600 hover:bg-gray-100">
            Cancelar
          </button>
          <button onClick={handleSalvar} disabled={salvando || !dataPagamento}
            className="bg-red-500 text-white px-6 py-2 rounded text-sm font-medium hover:bg-red-600 disabled:opacity-50">
            {salvando ? 'Salvando...' : '💾 Salvar Pagamento'}
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Aba principal ────────────────────────────────────────────────────────────
export function ContasPagarTab() {
  const [filtroTipo, setFiltroTipo] = useState<'aberto' | 'pago' | 'todos'>('todos');
  const [filtroDataIni, setFiltroDataIni] = useState('');
  const [filtroDataFim, setFiltroDataFim] = useState('');
  const [filtroFornecedor, setFiltroFornecedor] = useState('');
  const [filtroImovel, setFiltroImovel] = useState('');
  const [filtroAplicado, setFiltroAplicado] = useState({
    tipo: 'todos' as 'aberto' | 'pago' | 'todos',
    dataIni: '', dataFim: '', fornecedor: '', imovel: '',
  });

  const [mostrarForm, setMostrarForm] = useState(false);
  const [temNota, setTemNota] = useState(false);
  const [form, setForm] = useState(camposVazios);
  const [contaPagando, setContaPagando] = useState<any | null>(null);

  const { data: todasContas, isLoading } = useContasPagar();
  useResumoPagar();
  const { data: categorias } = useCategorias();
  const { data: ranchos = [] } = useRanchos();
  const { data: fornecedores = [] } = useFornecedores();
  const { data: bancos = [] } = useBancos();
  const criar = useCriarContaPagar();
  const marcar = useMarcarPago();
  const remover = useRemoverContaPagar();

  function aplicarFiltros() {
    setFiltroAplicado({ tipo: filtroTipo, dataIni: filtroDataIni, dataFim: filtroDataFim, fornecedor: filtroFornecedor, imovel: filtroImovel });
  }
  function limparFiltros() {
    setFiltroTipo('todos'); setFiltroDataIni(''); setFiltroDataFim(''); setFiltroFornecedor(''); setFiltroImovel('');
    setFiltroAplicado({ tipo: 'todos', dataIni: '', dataFim: '', fornecedor: '', imovel: '' });
  }

  const contas = useMemo(() => {
    if (!todasContas) return [];
    return todasContas.filter(c => {
      if (filtroAplicado.tipo === 'aberto' && c.status === 'PAGO') return false;
      if (filtroAplicado.tipo === 'pago' && c.status !== 'PAGO') return false;
      if (filtroAplicado.dataIni && c.vencimento.slice(0, 10) < filtroAplicado.dataIni) return false;
      if (filtroAplicado.dataFim && c.vencimento.slice(0, 10) > filtroAplicado.dataFim) return false;
      if (filtroAplicado.fornecedor && c.fornecedorId !== filtroAplicado.fornecedor) return false;
      if (filtroAplicado.imovel && c.ranchoId !== filtroAplicado.imovel) return false;
      return true;
    });
  }, [todasContas, filtroAplicado]);

  const totais = useMemo(() => {
    const base = todasContas ?? [];
    const pagas    = base.filter(c => c.status === 'PAGO').reduce((s, c) => s + Number(c.valor), 0);
    const vencidas = base.filter(c => c.status !== 'PAGO' && isAtrasado(c.vencimento, c.status)).reduce((s, c) => s + Number(c.valor), 0);
    const aVencer  = base.filter(c => c.status !== 'PAGO' && !isAtrasado(c.vencimento, c.status)).reduce((s, c) => s + Number(c.valor), 0);
    return { pagas, aPagar: vencidas + aVencer, vencidas, aVencer };
  }, [todasContas]);

  function handleSalvar(e: React.FormEvent) {
    e.preventDefault();
    const payload = {
      ...form,
      numeroNota: temNota ? form.numeroNota : '',
      dataEmissao: temNota ? form.dataEmissao : '',
    };
    criar.mutate(payload as any, {
      onSuccess: () => { setForm(camposVazios); setTemNota(false); setMostrarForm(false); }
    });
  }

  function handleConfirmarPagamento(payload: Omit<PagarContaPagarPayload, 'id'>) {
    if (!contaPagando) return;
    marcar.mutate({ id: contaPagando.id, ...payload }, {
      onSuccess: () => setContaPagando(null),
    });
  }

  return (
    <div className="flex flex-col gap-4">

      {/* Modal de pagamento */}
      {contaPagando && (
        <ModalPagamento
          conta={contaPagando}
          bancos={bancos}
          onFechar={() => setContaPagando(null)}
          onConfirmar={handleConfirmarPagamento}
          salvando={marcar.isPending}
        />
      )}

      {/* Cards de resumo */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg shadow p-4">
          <p className="text-xs text-gray-500 mb-1">A Pagar</p>
          <p className="text-xl font-bold text-yellow-600">{fmtValor(totais.aPagar)}</p>
        </div>
        <div className="bg-white rounded-lg shadow p-4">
          <p className="text-xs text-gray-500 mb-1">Já Pago</p>
          <p className="text-xl font-bold text-green-600">{fmtValor(totais.pagas)}</p>
        </div>
        <div className="bg-white rounded-lg shadow p-4">
          <p className="text-xs text-gray-500 mb-1">Vencidas</p>
          <p className="text-xl font-bold text-red-600">{fmtValor(totais.vencidas)}</p>
        </div>
        <div className="bg-white rounded-lg shadow p-4">
          <p className="text-xs text-gray-500 mb-1">A Vencer</p>
          <p className="text-xl font-bold text-blue-600">{fmtValor(totais.aVencer)}</p>
        </div>
      </div>

      {/* Filtros */}
      <div className="bg-white rounded-lg shadow p-4">
        <div className="flex flex-wrap items-end gap-3">
          <div className="flex items-center gap-4 mr-2">
            {(['aberto', 'pago', 'todos'] as const).map(v => (
              <label key={v} className="flex items-center gap-1 cursor-pointer text-sm text-gray-700">
                <input type="radio" name="filtroTipo" value={v} checked={filtroTipo === v}
                  onChange={() => setFiltroTipo(v)} className="accent-red-500" />
                {v === 'aberto' ? 'Em Aberto' : v === 'pago' ? 'Pagas' : 'Todas'}
              </label>
            ))}
          </div>
          <div className="flex flex-col">
            <label className="text-xs text-gray-400 mb-1">Venc. Inicial</label>
            <input type="date" value={filtroDataIni} onChange={e => setFiltroDataIni(e.target.value)}
              className="border rounded px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-red-400" />
          </div>
          <div className="flex flex-col">
            <label className="text-xs text-gray-400 mb-1">Venc. Final</label>
            <input type="date" value={filtroDataFim} onChange={e => setFiltroDataFim(e.target.value)}
              className="border rounded px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-red-400" />
          </div>
          <div className="flex flex-col flex-1 min-w-[150px]">
            <label className="text-xs text-gray-400 mb-1">Fornecedor</label>
            <select value={filtroFornecedor} onChange={e => setFiltroFornecedor(e.target.value)}
              className="border rounded px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-red-400">
              <option value="">Todos</option>
              {fornecedores.map((f: any) => <option key={f.id} value={f.id}>{f.nome}</option>)}
            </select>
          </div>
          <div className="flex flex-col min-w-[160px]">
            <label className="text-xs text-gray-400 mb-1">Imóvel</label>
            <select value={filtroImovel} onChange={e => setFiltroImovel(e.target.value)}
              className="border rounded px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-red-400">
              <option value="">Todos</option>
              {ranchos.map((r: any) => <option key={r.id} value={r.id}>{r.nome}</option>)}
            </select>
          </div>
          <button onClick={aplicarFiltros}
            className="bg-red-500 hover:bg-red-600 text-white px-5 py-1.5 rounded text-sm font-medium">
            Filtrar
          </button>
          <button onClick={limparFiltros}
            className="px-4 py-1.5 border rounded text-sm text-gray-600 hover:bg-gray-50">
            Limpar
          </button>
        </div>
      </div>

      {/* Botão novo */}
      <div>
        <button onClick={() => setMostrarForm(!mostrarForm)}
          className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded text-sm font-medium">
          + Nova Despesa
        </button>
      </div>

      {/* Formulário */}
      {mostrarForm && (
        <form onSubmit={handleSalvar} className="bg-white rounded-lg shadow p-5 border border-red-200">
          <h3 className="font-semibold text-gray-700 mb-3">Nova Despesa</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div>
              <label className="block text-xs text-gray-500 mb-1">Fornecedor</label>
              <select value={form.fornecedorId} onChange={e => setForm({ ...form, fornecedorId: e.target.value })}
                className="w-full border rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-400">
                <option value="">Nenhum</option>
                {fornecedores.map((f: any) => <option key={f.id} value={f.id}>{f.nome}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs text-gray-500 mb-1">Centro de Custo *</label>
              <select required value={form.categoriaId} onChange={e => setForm({ ...form, categoriaId: e.target.value })}
                className="w-full border rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-400">
                <option value="">Selecione</option>
                {categorias?.map(c => <option key={c.id} value={c.id}>{c.nome}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs text-gray-500 mb-1">Imóvel (opcional)</label>
              <select value={form.ranchoId} onChange={e => setForm({ ...form, ranchoId: e.target.value })}
                className="w-full border rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-400">
                <option value="">Geral</option>
                {ranchos.map((r: any) => <option key={r.id} value={r.id}>{r.codigoInterno} — {r.nome}</option>)}
              </select>
            </div>

            <div className={temNota ? '' : 'md:col-span-1'}>
              <label className="block text-xs text-gray-500 mb-1">Nota Fiscal</label>
              <div className="flex gap-4 border rounded px-3 py-2 text-sm">
                <label className="flex items-center gap-1 cursor-pointer">
                  <input type="radio" name="temNota" checked={!temNota}
                    onChange={() => setTemNota(false)} className="accent-red-500" />
                  Sem nota
                </label>
                <label className="flex items-center gap-1 cursor-pointer">
                  <input type="radio" name="temNota" checked={temNota}
                    onChange={() => setTemNota(true)} className="accent-red-500" />
                  Com nota
                </label>
              </div>
            </div>
            {temNota && (
              <div>
                <label className="block text-xs text-gray-500 mb-1">Nº da Nota Fiscal *</label>
                <input required={temNota} value={form.numeroNota} onChange={e => setForm({ ...form, numeroNota: e.target.value })}
                  placeholder="Ex: 12345"
                  className="w-full border rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-400" />
              </div>
            )}
            {temNota && (
              <div>
                <label className="block text-xs text-gray-500 mb-1">Emissão *</label>
                <input required={temNota} type="date" value={form.dataEmissao}
                  onChange={e => setForm({ ...form, dataEmissao: e.target.value })}
                  className="w-full border rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-400" />
              </div>
            )}

            <div>
              <label className="block text-xs text-gray-500 mb-1">Vencimento *</label>
              <input required type="date" value={form.vencimento}
                onChange={e => setForm({ ...form, vencimento: e.target.value })}
                className="w-full border rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-400" />
            </div>
            <div>
              <label className="block text-xs text-gray-500 mb-1">Valor (R$) *</label>
              <input required type="number" min={0} step="0.01" value={form.valor || ''}
                onChange={e => setForm({ ...form, valor: Number(e.target.value) })}
                className="w-full border rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-400" />
            </div>
            <div className="md:col-span-3">
              <label className="block text-xs text-gray-500 mb-1">Observações (opcional)</label>
              <input value={form.observacoes} onChange={e => setForm({ ...form, observacoes: e.target.value })}
                className="w-full border rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-400" />
            </div>
          </div>
          <div className="flex gap-2 mt-3">
            <button type="submit" disabled={criar.isPending}
              className="bg-red-500 text-white px-5 py-2 rounded hover:bg-red-600 disabled:opacity-50 text-sm">
              {criar.isPending ? 'Salvando...' : 'Salvar'}
            </button>
            <button type="button" onClick={() => { setForm(camposVazios); setMostrarForm(false); }}
              className="px-5 py-2 border rounded text-sm text-gray-600 hover:bg-gray-50">
              Cancelar
            </button>
          </div>
        </form>
      )}

      {/* Tabela */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="px-4 py-3 text-left text-gray-500 font-medium">Vencimento</th>
              <th className="px-4 py-3 text-left text-gray-500 font-medium">Centro de Custo</th>
              <th className="px-4 py-3 text-left text-gray-500 font-medium">Descrição</th>
              <th className="px-4 py-3 text-left text-gray-500 font-medium">Fornecedor</th>
              <th className="px-4 py-3 text-left text-gray-500 font-medium">Imóvel</th>
              <th className="px-4 py-3 text-right text-gray-500 font-medium">Valor</th>
              <th className="px-4 py-3 text-center text-gray-500 font-medium">Status</th>
              <th className="px-4 py-3 text-center text-gray-500 font-medium">Ações</th>
            </tr>
          </thead>
          <tbody>
            {isLoading && (
              <tr><td colSpan={8} className="px-4 py-10 text-center text-gray-400">Carregando...</td></tr>
            )}
            {!isLoading && contas.length === 0 && (
              <tr><td colSpan={8} className="px-4 py-10 text-center text-gray-400">Nenhuma despesa encontrada</td></tr>
            )}
            {contas.map(c => {
              const atrasado = isAtrasado(c.vencimento, c.status);
              const pago = c.status === 'PAGO';
              const rowBg = atrasado ? 'bg-red-50 hover:bg-red-100' : pago ? 'bg-green-50 hover:bg-green-100' : 'hover:bg-gray-50';

              return (
                <tr key={c.id} className={`border-t ${rowBg}`}>
                  <td className="px-4 py-3">
                    <span className={atrasado ? 'text-red-600 font-semibold' : 'text-gray-700'}>
                      {fmtData(c.vencimento)}
                    </span>
                    {atrasado && <span className="ml-1 text-xs text-red-400">atrasada</span>}
                  </td>
                  <td className="px-4 py-3 text-gray-500">{c.categoria?.nome}</td>
                  <td className="px-4 py-3 text-gray-700">{c.descricao}</td>
                  <td className="px-4 py-3 text-gray-700">{c.fornecedor?.nome ?? '—'}</td>
                  <td className="px-4 py-3 text-gray-500">{c.rancho?.nome ?? 'Geral'}</td>
                  <td className="px-4 py-3 text-right font-semibold">{fmtValor(c.valor)}</td>
                  <td className="px-4 py-3 text-center">
                    {pago && <span className="bg-green-100 text-green-700 text-xs px-2 py-1 rounded-full">Pago</span>}
                    {!pago && atrasado && <span className="bg-red-100 text-red-600 text-xs px-2 py-1 rounded-full">Vencida</span>}
                    {!pago && !atrasado && <span className="bg-yellow-100 text-yellow-700 text-xs px-2 py-1 rounded-full">Em Aberto</span>}
                  </td>
                  <td className="px-4 py-3 text-center">
                    {!pago && (
                      <div className="flex justify-center gap-2">
                        <button onClick={() => setContaPagando(c)}
                          className="text-red-500 hover:text-red-700 text-xs font-medium border border-red-300 rounded px-2 py-1 hover:bg-red-50">
                          ✓ Pagar
                        </button>
                        <button onClick={() => { if (confirm('Excluir esta despesa?')) remover.mutate(c.id); }}
                          className="text-gray-400 hover:text-gray-600 text-xs border border-gray-200 rounded px-2 py-1 hover:bg-gray-50">
                          ✕
                        </button>
                      </div>
                    )}
                    {pago && (
                      <div className="text-xs text-gray-500 space-y-0.5">
                        <div>{c.dataPagamento ? `Pago ${fmtData(c.dataPagamento)}` : 'Pago'}</div>
                        {c.contaBancaria && <div className="text-gray-400">{c.contaBancaria.nome}</div>}
                      </div>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Rodapé totais */}
      <div className="bg-white rounded-lg shadow px-6 py-3 flex flex-wrap gap-6 text-sm">
        <div><span className="text-gray-500 uppercase text-xs">Pagas: </span><span className="font-bold text-green-600">{fmtValor(totais.pagas)}</span></div>
        <div><span className="text-gray-500 uppercase text-xs">A Pagar: </span><span className="font-bold text-yellow-600">{fmtValor(totais.aPagar)}</span></div>
        <div><span className="text-gray-500 uppercase text-xs">Vencidas: </span><span className="font-bold text-red-600">{fmtValor(totais.vencidas)}</span></div>
        <div><span className="text-gray-500 uppercase text-xs">A Vencer: </span><span className="font-bold text-blue-600">{fmtValor(totais.aVencer)}</span></div>
      </div>

    </div>
  );
}
