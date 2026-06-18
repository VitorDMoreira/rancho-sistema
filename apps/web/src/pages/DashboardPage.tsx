import { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useBancosComSaldo } from '../features/cadastro/useBancos';
import { useContasPagar } from '../features/financeiro/useContasPagar';
import { useContasReceber } from '../features/financeiro/useContasReceber';
import { useReservas } from '../features/reservas/useReservas';

function fmtValor(v: number) {
  return Number(v ?? 0).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}
function fmtData(d?: string) {
  if (!d) return '—';
  const [ano, mes, dia] = d.slice(0, 10).split('-');
  return `${dia}/${mes}/${ano}`;
}
function hojeStr() {
  return new Date().toISOString().slice(0, 10);
}
function diasAteHoje(dataStr: string) {
  const hoje = new Date(hojeStr() + 'T12:00:00');
  const data = new Date(dataStr.slice(0, 10) + 'T12:00:00');
  return Math.round((data.getTime() - hoje.getTime()) / 86400000);
}

const PROXIMOS_DIAS = 7;

export function DashboardPage() {
  const { data: bancos = [], isLoading: carregandoBancos } = useBancosComSaldo();
  const { data: contasPagar = [], isLoading: carregandoPagar } = useContasPagar('EM_ABERTO');
  const { data: contasReceber = [], isLoading: carregandoReceber } = useContasReceber('EM_ABERTO');
  const { data: reservas = [], isLoading: carregandoReservas } = useReservas();

  const saldoTotal = useMemo(() => bancos.reduce((s, b) => s + b.saldo, 0), [bancos]);

  const aPagarProximos = useMemo(
    () => contasPagar
      .filter(c => { const d = diasAteHoje(c.vencimento); return d <= PROXIMOS_DIAS; })
      .sort((a, b) => a.vencimento.localeCompare(b.vencimento)),
    [contasPagar],
  );
  const aReceberProximos = useMemo(
    () => contasReceber
      .filter(c => { const d = diasAteHoje(c.vencimento); return d <= PROXIMOS_DIAS; })
      .sort((a, b) => a.vencimento.localeCompare(b.vencimento)),
    [contasReceber],
  );

  const proximasLocacoes = useMemo(
    () => reservas
      .filter(r => ['CONFIRMADA', 'AGUARDANDO_SINAL', 'EM_ANDAMENTO'].includes(r.status) && diasAteHoje(r.dataEntrada) >= -1 && diasAteHoje(r.dataEntrada) <= 30)
      .sort((a, b) => a.dataEntrada.localeCompare(b.dataEntrada))
      .slice(0, 5),
    [reservas],
  );

  const anoAtual = new Date().getFullYear();
  const MESES = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];
  const locacoesPorMes = useMemo(() => {
    const contagem = Array(12).fill(0);
    for (const r of reservas) {
      const data = new Date(r.dataEntrada.slice(0, 10) + 'T12:00:00');
      if (data.getFullYear() === anoAtual) contagem[data.getMonth()]++;
    }
    return contagem;
  }, [reservas, anoAtual]);
  const maxLocacoesMes = Math.max(1, ...locacoesPorMes);

  const totalAPagarProximos = aPagarProximos.reduce((s, c) => s + Number(c.valor), 0);
  const totalAReceberProximos = aReceberProximos.reduce((s, c) => s + Number(c.valor), 0);

  const carregando = carregandoBancos || carregandoPagar || carregandoReceber || carregandoReservas;

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-2xl font-bold text-gray-800">Dashboard</h1>

      {carregando ? (
        <p className="text-gray-400">Carregando...</p>
      ) : (
        <>
          {/* Cards de resumo */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Link to="/financeiro" className="bg-white rounded-lg shadow p-5 hover:shadow-md transition">
              <p className="text-sm text-gray-400">Saldo em Caixa</p>
              <p className={`text-2xl font-bold mt-1 ${saldoTotal < 0 ? 'text-red-600' : 'text-green-700'}`}>{fmtValor(saldoTotal)}</p>
              <p className="text-xs text-gray-400 mt-1">{bancos.length} conta(s) bancária(s)</p>
            </Link>
            <Link to="/financeiro" className="bg-white rounded-lg shadow p-5 hover:shadow-md transition">
              <p className="text-sm text-gray-400">A Pagar (próximos {PROXIMOS_DIAS} dias)</p>
              <p className="text-2xl font-bold mt-1 text-red-500">{fmtValor(totalAPagarProximos)}</p>
              <p className="text-xs text-gray-400 mt-1">{aPagarProximos.length} conta(s)</p>
            </Link>
            <Link to="/financeiro" className="bg-white rounded-lg shadow p-5 hover:shadow-md transition">
              <p className="text-sm text-gray-400">A Receber (próximos {PROXIMOS_DIAS} dias)</p>
              <p className="text-2xl font-bold mt-1 text-green-600">{fmtValor(totalAReceberProximos)}</p>
              <p className="text-xs text-gray-400 mt-1">{aReceberProximos.length} conta(s)</p>
            </Link>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {/* Gráfico mensal de locações */}
            <div className="bg-white rounded-lg shadow overflow-hidden">
              <div className="px-4 py-3 border-b">
                <h3 className="font-semibold text-gray-700">Locações por Mês — {anoAtual}</h3>
              </div>
              <div className="p-4 flex items-end gap-2 h-48">
                {locacoesPorMes.map((qtd, i) => (
                  <div key={i} className="flex-1 flex flex-col items-center justify-end h-full">
                    {qtd > 0 && <span className="text-xs text-gray-500 mb-1">{qtd}</span>}
                    <div className="w-full bg-blue-500 rounded-t" style={{ height: `${(qtd / maxLocacoesMes) * 100}%`, minHeight: qtd > 0 ? 4 : 0 }} />
                    <span className="text-xs text-gray-400 mt-1">{MESES[i]}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Próximas locações */}
            <div className="bg-white rounded-lg shadow overflow-hidden">
              <div className="px-4 py-3 border-b">
                <h3 className="font-semibold text-gray-700">Próximas Locações</h3>
              </div>
              <table className="w-full text-sm">
                <thead className="bg-gray-50 text-gray-500 text-left">
                  <tr>
                    <th className="px-4 py-2">Entrada</th>
                    <th className="px-4 py-2">Saída</th>
                    <th className="px-4 py-2">Cliente</th>
                    <th className="px-4 py-2">Imóvel</th>
                  </tr>
                </thead>
                <tbody>
                  {proximasLocacoes.map(r => (
                    <tr key={r.id} className="border-t hover:bg-gray-50">
                      <td className="px-4 py-2 text-gray-500">{fmtData(r.dataEntrada)}</td>
                      <td className="px-4 py-2 text-gray-500">{fmtData(r.dataSaida)}</td>
                      <td className="px-4 py-2 font-medium">{r.cliente?.nomeCompleto ?? '—'}</td>
                      <td className="px-4 py-2 text-gray-500">{r.rancho?.nome ?? '—'}</td>
                    </tr>
                  ))}
                  {proximasLocacoes.length === 0 && (
                    <tr><td colSpan={4} className="px-4 py-8 text-center text-gray-400">Nenhuma locação prevista para os próximos 30 dias</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
