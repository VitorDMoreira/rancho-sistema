import { useState } from 'react';
import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { useRanchos } from '../ranchos/useRanchos';
import { useClientes } from '../clientes/useClientes';
import { useFornecedores } from '../cadastro/useFornecedores';
import { useCentrosCusto } from '../cadastro/useCentrosCusto';
import { useRelatorio, type FiltroRelatorio, type TipoRelatorio } from './useRelatorios';

function fmtValor(v: number) {
  return Number(v ?? 0).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}
function fmtData(d?: string) {
  if (!d) return '—';
  const [ano, mes, dia] = d.slice(0, 10).split('-');
  return `${dia}/${mes}/${ano}`;
}

const CATEGORIAS: { id: TipoRelatorio; label: string; icone: string }[] = [
  { id: 'contas-pagar', label: 'Contas a Pagar / Pagas', icone: '📤' },
  { id: 'contas-receber', label: 'Contas a Receber / Recebidas', icone: '📥' },
  { id: 'locacoes', label: 'Relatório de Locações', icone: '🏡' },
  { id: 'centros-custo', label: 'Gastos por Centro de Custo (Gráfico)', icone: '📊' },
];

export function RelatoriosTab() {
  const [categoria, setCategoria] = useState<TipoRelatorio>('contas-pagar');

  const [dataIni, setDataIni] = useState('');
  const [dataFim, setDataFim] = useState('');
  const [ranchoId, setRanchoId] = useState('');
  const [categoriaId, setCategoriaId] = useState('');
  const [fornecedorId, setFornecedorId] = useState('');
  const [clienteId, setClienteId] = useState('');
  const [status, setStatus] = useState('');

  const [filtroAplicado, setFiltroAplicado] = useState<FiltroRelatorio | null>(null);

  const { data: ranchos = [] } = useRanchos();
  const { data: clientes = [] } = useClientes();
  const { data: fornecedores = [] } = useFornecedores();
  const { data: centros = [] } = useCentrosCusto();

  const { data, isFetching } = useRelatorio(categoria, filtroAplicado ?? {}, !!filtroAplicado);

  function gerar() {
    setFiltroAplicado({
      dataIni: dataIni || undefined,
      dataFim: dataFim || undefined,
      ranchoId: ranchoId || undefined,
      categoriaId: categoriaId || undefined,
      fornecedorId: fornecedorId || undefined,
      clienteId: clienteId || undefined,
      status: status || undefined,
    });
  }
  function limpar() {
    setDataIni(''); setDataFim(''); setRanchoId(''); setCategoriaId(''); setFornecedorId(''); setClienteId(''); setStatus('');
    setFiltroAplicado(null);
  }

  // ─── Monta linhas/colunas conforme categoria ───────────────────────────────
  function linhas(): { colunas: string[]; rows: any[][] } {
    if (!data) return { colunas: [], rows: [] };
    if (categoria === 'contas-pagar') {
      return {
        colunas: ['Vencimento', 'Descrição', 'Centro de Custo', 'Fornecedor', 'Imóvel', 'Status', 'Valor'],
        rows: data.lista.map((c: any) => [fmtData(c.vencimento), c.descricao, c.categoria?.nome ?? '—', c.fornecedor?.nome ?? '—', c.rancho?.nome ?? '—', c.status, fmtValor(c.valor)]),
      };
    }
    if (categoria === 'contas-receber') {
      return {
        colunas: ['Vencimento', 'Descrição', 'Cliente', 'Imóvel', 'Status', 'Valor'],
        rows: data.lista.map((c: any) => [fmtData(c.vencimento), c.descricao, c.cliente?.nomeCompleto ?? '—', c.reserva?.rancho?.nome ?? '—', c.status, fmtValor(c.valor)]),
      };
    }
    if (categoria === 'locacoes') {
      return {
        colunas: ['Entrada', 'Saída', 'Cliente', 'Imóvel', 'Diárias', 'Status', 'Valor Total'],
        rows: data.lista.map((r: any) => [fmtData(r.dataEntrada), fmtData(r.dataSaida), r.cliente?.nomeCompleto ?? '—', r.rancho?.nome ?? '—', r.numDiarias, r.status, fmtValor(r.valorTotal)]),
      };
    }
    // centros-custo
    return {
      colunas: ['Centro de Custo', 'Quantidade', 'Total'],
      rows: data.grupo.map((g: any) => [g.nome, g.qtd, fmtValor(g.total)]),
    };
  }

  function exportarExcel() {
    const { colunas, rows } = linhas();
    const ws = XLSX.utils.aoa_to_sheet([colunas, ...rows]);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Relatório');
    XLSX.writeFile(wb, `relatorio-${categoria}.xlsx`);
  }

  function exportarPdf() {
    const { colunas, rows } = linhas();
    const doc = new jsPDF();
    const titulo = CATEGORIAS.find(c => c.id === categoria)?.label ?? 'Relatório';
    doc.setFontSize(14);
    doc.text(titulo, 14, 15);
    autoTable(doc, { head: [colunas], body: rows, startY: 20, styles: { fontSize: 8 } });
    doc.save(`relatorio-${categoria}.pdf`);
  }

  const { colunas, rows } = linhas();

  return (
    <div className="flex flex-col gap-4">
      {/* Seletor de categoria */}
      <div className="flex flex-wrap gap-2">
        {CATEGORIAS.map(c => (
          <button key={c.id}
            onClick={() => { setCategoria(c.id); setFiltroAplicado(null); }}
            className={`px-4 py-2 rounded-lg text-sm font-medium border ${categoria === c.id ? 'bg-blue-500 text-white border-blue-500' : 'bg-white text-gray-600 hover:bg-gray-50'}`}>
            {c.icone} {c.label}
          </button>
        ))}
      </div>

      {/* Filtros */}
      <div className="bg-white rounded-lg shadow p-4">
        <div className="flex flex-wrap items-end gap-3">
          <div className="flex flex-col">
            <label className="text-xs text-gray-400 mb-1">Data Inicial</label>
            <input type="date" value={dataIni} onChange={e => setDataIni(e.target.value)}
              className="border rounded px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400" />
          </div>
          <div className="flex flex-col">
            <label className="text-xs text-gray-400 mb-1">Data Final</label>
            <input type="date" value={dataFim} onChange={e => setDataFim(e.target.value)}
              className="border rounded px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400" />
          </div>

          {(categoria === 'contas-pagar' || categoria === 'locacoes' || categoria === 'centros-custo') && (
            <div className="flex flex-col min-w-[160px]">
              <label className="text-xs text-gray-400 mb-1">Imóvel</label>
              <select value={ranchoId} onChange={e => setRanchoId(e.target.value)}
                className="border rounded px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400">
                <option value="">Todos</option>
                {ranchos.map((r: any) => <option key={r.id} value={r.id}>{r.nome}</option>)}
              </select>
            </div>
          )}

          {(categoria === 'contas-pagar' || categoria === 'centros-custo') && (
            <div className="flex flex-col min-w-[160px]">
              <label className="text-xs text-gray-400 mb-1">Centro de Custo</label>
              <select value={categoriaId} onChange={e => setCategoriaId(e.target.value)}
                className="border rounded px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400">
                <option value="">Todos</option>
                {centros.map((c: any) => <option key={c.id} value={c.id}>{c.nome}</option>)}
              </select>
            </div>
          )}

          {categoria === 'contas-pagar' && (
            <div className="flex flex-col min-w-[160px]">
              <label className="text-xs text-gray-400 mb-1">Fornecedor</label>
              <select value={fornecedorId} onChange={e => setFornecedorId(e.target.value)}
                className="border rounded px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400">
                <option value="">Todos</option>
                {fornecedores.map((f: any) => <option key={f.id} value={f.id}>{f.nome}</option>)}
              </select>
            </div>
          )}

          {(categoria === 'contas-receber' || categoria === 'locacoes') && (
            <div className="flex flex-col min-w-[160px]">
              <label className="text-xs text-gray-400 mb-1">Cliente</label>
              <select value={clienteId} onChange={e => setClienteId(e.target.value)}
                className="border rounded px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400">
                <option value="">Todos</option>
                {clientes.map((c: any) => <option key={c.id} value={c.id}>{c.nomeCompleto}</option>)}
              </select>
            </div>
          )}

          {categoria === 'contas-pagar' && (
            <div className="flex flex-col min-w-[140px]">
              <label className="text-xs text-gray-400 mb-1">Status</label>
              <select value={status} onChange={e => setStatus(e.target.value)}
                className="border rounded px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400">
                <option value="">Todos</option>
                <option value="EM_ABERTO">Em aberto</option>
                <option value="PAGO">Pago</option>
                <option value="ATRASADO">Atrasado</option>
                <option value="CANCELADO">Cancelado</option>
              </select>
            </div>
          )}

          {categoria === 'contas-receber' && (
            <div className="flex flex-col min-w-[140px]">
              <label className="text-xs text-gray-400 mb-1">Status</label>
              <select value={status} onChange={e => setStatus(e.target.value)}
                className="border rounded px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400">
                <option value="">Todos</option>
                <option value="EM_ABERTO">Em aberto</option>
                <option value="RECEBIDO">Recebido</option>
                <option value="ATRASADO">Atrasado</option>
                <option value="CANCELADO">Cancelado</option>
              </select>
            </div>
          )}

          {categoria === 'locacoes' && (
            <div className="flex flex-col min-w-[140px]">
              <label className="text-xs text-gray-400 mb-1">Status</label>
              <select value={status} onChange={e => setStatus(e.target.value)}
                className="border rounded px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400">
                <option value="">Todos</option>
                <option value="ORCAMENTO">Orçamento</option>
                <option value="AGUARDANDO_SINAL">Aguardando sinal</option>
                <option value="CONFIRMADA">Confirmada</option>
                <option value="EM_ANDAMENTO">Em andamento</option>
                <option value="FINALIZADA">Finalizada</option>
                <option value="CANCELADA">Cancelada</option>
              </select>
            </div>
          )}

          <button onClick={gerar} className="bg-blue-500 hover:bg-blue-600 text-white px-5 py-1.5 rounded text-sm font-medium">
            Gerar Relatório
          </button>
          <button onClick={limpar} className="px-4 py-1.5 border rounded text-sm text-gray-600 hover:bg-gray-50">
            Limpar
          </button>
        </div>
      </div>

      {/* Resultado */}
      {filtroAplicado && (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="flex items-center justify-between px-4 py-3 border-b">
            <h3 className="font-semibold text-gray-700">
              Resultado {data && `(${categoria === 'centros-custo' ? data.grupo.length : data.qtd} ${categoria === 'locacoes' ? 'locações' : 'itens'})`}
            </h3>
            {data && rows.length > 0 && (
              <div className="flex gap-2">
                <button onClick={exportarExcel} className="bg-green-600 hover:bg-green-700 text-white px-4 py-1.5 rounded text-sm font-medium">
                  📊 Exportar Excel
                </button>
                <button onClick={exportarPdf} className="bg-red-500 hover:bg-red-600 text-white px-4 py-1.5 rounded text-sm font-medium">
                  📄 Exportar PDF
                </button>
              </div>
            )}
          </div>

          {isFetching && <p className="p-6 text-center text-gray-400">Carregando...</p>}

          {!isFetching && data && (
            <>
              {categoria === 'centros-custo' && (
                <div className="p-4 flex flex-col gap-2">
                  {data.grupo.map((g: any) => (
                    <div key={g.nome} className="flex items-center gap-3">
                      <span className="w-40 text-sm text-gray-600 truncate">{g.nome}</span>
                      <div className="flex-1 bg-gray-100 rounded h-5 overflow-hidden">
                        <div className="bg-blue-500 h-5" style={{ width: `${data.total ? (g.total / data.total) * 100 : 0}%` }} />
                      </div>
                      <span className="w-32 text-right text-sm font-medium">{fmtValor(g.total)}</span>
                      <span className="w-16 text-right text-xs text-gray-400">{g.qtd}x</span>
                    </div>
                  ))}
                  {data.grupo.length === 0 && <p className="text-center text-gray-400 py-8">Nenhum dado encontrado</p>}
                </div>
              )}

              {categoria !== 'centros-custo' && (
                <table className="w-full text-sm">
                  <thead className="bg-gray-50 text-gray-500 text-left">
                    <tr>{colunas.map(c => <th key={c} className="px-4 py-3">{c}</th>)}</tr>
                  </thead>
                  <tbody>
                    {rows.length === 0 && (
                      <tr><td colSpan={colunas.length} className="px-4 py-8 text-center text-gray-400">Nenhum registro encontrado</td></tr>
                    )}
                    {rows.map((row, i) => (
                      <tr key={i} className="border-t hover:bg-gray-50">
                        {row.map((cell, j) => <td key={j} className="px-4 py-3">{cell}</td>)}
                      </tr>
                    ))}
                  </tbody>
                  {rows.length > 0 && (
                    <tfoot>
                      <tr className="border-t-2 bg-gray-50 font-bold">
                        <td className="px-4 py-3" colSpan={colunas.length - 1}>
                          {categoria === 'locacoes' ? `Total de diárias: ${data.totalDiarias}` : 'Total'}
                        </td>
                        <td className="px-4 py-3 text-right">{fmtValor(data.total)}</td>
                      </tr>
                    </tfoot>
                  )}
                </table>
              )}
            </>
          )}
        </div>
      )}
    </div>
  );
}
