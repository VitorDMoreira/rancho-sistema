import { useState } from 'react';
import { useCalendario } from '../features/calendario/useCalendario';
import { useRanchos } from '../features/ranchos/useRanchos';
import type { Reserva } from '../features/reservas/useReservas';

const MESES = [
  'Janeiro','Fevereiro','Março','Abril','Maio','Junho',
  'Julho','Agosto','Setembro','Outubro','Novembro','Dezembro',
];

const DIAS_SEMANA = ['Dom','Seg','Ter','Qua','Qui','Sex','Sáb'];

const STATUS_COR: Record<string, string> = {
  ORCAMENTO:        'bg-gray-300 text-gray-700',
  AGUARDANDO_SINAL: 'bg-yellow-300 text-yellow-800',
  CONFIRMADA:       'bg-blue-400 text-white',
  EM_ANDAMENTO:     'bg-green-500 text-white',
  FINALIZADA:       'bg-gray-400 text-white',
};

function formatarValor(valor: number) {
  return Number(valor).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}

function formatarData(data: string) {
  const [ano, mes, dia] = data.slice(0, 10).split('-');
  return `${dia}/${mes}/${ano}`;
}

// Retorna quais reservas cobrem um determinado dia
function reservasNoDia(reservas: Reserva[], ano: number, mes: number, dia: number): Reserva[] {
  // Usa meio-dia para evitar problemas de fuso horário
  const data = new Date(ano, mes - 1, dia, 12, 0, 0);
  return reservas.filter(r => {
    const entrada = new Date(r.dataEntrada.slice(0, 10) + 'T12:00:00');
    const saida = new Date(r.dataSaida.slice(0, 10) + 'T12:00:00');
    return data >= entrada && data <= saida;
  });
}

export function CalendarioPage() {
  const hoje = new Date();
  const [ano, setAno] = useState(hoje.getFullYear());
  const [mes, setMes] = useState(hoje.getMonth() + 1);
  const [ranchoIdFiltro, setRanchoIdFiltro] = useState('');
  const [reservaSelecionada, setReservaSelecionada] = useState<Reserva | null>(null);

  const { data: reservas, isLoading } = useCalendario(ano, mes, ranchoIdFiltro || undefined);
  const { data: ranchos } = useRanchos();

  function navMes(direcao: number) {
    let novoMes = mes + direcao;
    let novoAno = ano;
    if (novoMes < 1) { novoMes = 12; novoAno--; }
    if (novoMes > 12) { novoMes = 1; novoAno++; }
    setMes(novoMes);
    setAno(novoAno);
  }

  // Dias do mês e deslocamento inicial (qual dia da semana começa)
  const primeiroDia = new Date(ano, mes - 1, 1).getDay();
  const ultimoDia = new Date(ano, mes, 0).getDate();

  // Cria array de células: nulls para o offset inicial + dias 1..ultimoDia
  const celulas: (number | null)[] = [
    ...Array(primeiroDia).fill(null),
    ...Array.from({ length: ultimoDia }, (_, i) => i + 1),
  ];

  return (
    <div className="flex gap-4">
      {/* Calendário principal */}
      <div className="flex-1">
        {/* Cabeçalho de navegação */}
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-2xl font-bold text-gray-800">Calendário</h1>
          <div className="flex items-center gap-2">
            <button onClick={() => navMes(-1)}
              className="px-3 py-1 rounded border hover:bg-gray-100 text-gray-600">‹</button>
            <span className="font-semibold text-lg min-w-[160px] text-center">
              {MESES[mes - 1]} {ano}
            </span>
            <button onClick={() => navMes(1)}
              className="px-3 py-1 rounded border hover:bg-gray-100 text-gray-600">›</button>
            <button onClick={() => { setMes(hoje.getMonth() + 1); setAno(hoje.getFullYear()); }}
              className="ml-2 px-3 py-1 rounded border text-sm hover:bg-gray-100 text-gray-500">Hoje</button>
          </div>
        </div>

        {/* Grade do calendário */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          {/* Cabeçalho dias da semana */}
          <div className="grid grid-cols-7">
            {DIAS_SEMANA.map(d => (
              <div key={d} className="bg-gray-50 text-center text-xs font-semibold text-gray-500 py-2 border-b">
                {d}
              </div>
            ))}
          </div>

          {/* Células dos dias */}
          {isLoading ? (
            <div className="p-8 text-center text-gray-400">Carregando...</div>
          ) : (
            <div className="grid grid-cols-7 auto-rows-[80px]">
              {celulas.map((dia, i) => {
                if (dia === null) {
                  return <div key={`vazio-${i}`} className="border-b border-r bg-gray-50" />;
                }
                const eHoje = dia === hoje.getDate() && mes === hoje.getMonth() + 1 && ano === hoje.getFullYear();
                const reservasDia = reservasNoDia(reservas ?? [], ano, mes, dia);

                return (
                  <div key={dia}
                    className={`border-b border-r p-1 relative overflow-hidden ${eHoje ? 'bg-green-50' : 'bg-white hover:bg-gray-50'}`}>
                    <span className={`text-xs font-medium ${eHoje ? 'bg-green-600 text-white w-5 h-5 rounded-full flex items-center justify-center' : 'text-gray-600'}`}>
                      {dia}
                    </span>
                    <div className="mt-0.5 flex flex-col gap-0.5">
                      {reservasDia.map(r => {
                        const cor = STATUS_COR[r.status] ?? 'bg-gray-300 text-gray-700';
                        return (
                          <button key={r.id}
                            onClick={() => setReservaSelecionada(r)}
                            title={`${r.cliente?.nomeCompleto} — ${r.rancho?.nome}`}
                            className={`text-left text-xs px-1 py-0.5 rounded truncate w-full ${cor} hover:opacity-80`}>
                            {r.rancho?.codigoInterno} · {r.cliente?.nomeCompleto?.split(' ')[0]}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Legenda */}
        <div className="flex gap-3 mt-3 text-xs text-gray-500 flex-wrap">
          <span className="flex items-center gap-1"><span className="w-3 h-3 rounded bg-gray-300 inline-block"/>Orçamento</span>
          <span className="flex items-center gap-1"><span className="w-3 h-3 rounded bg-yellow-300 inline-block"/>Aguard. Sinal</span>
          <span className="flex items-center gap-1"><span className="w-3 h-3 rounded bg-blue-400 inline-block"/>Confirmada</span>
          <span className="flex items-center gap-1"><span className="w-3 h-3 rounded bg-green-500 inline-block"/>Em Andamento</span>
          <span className="flex items-center gap-1"><span className="w-3 h-3 rounded bg-gray-400 inline-block"/>Finalizada</span>
        </div>
      </div>

      {/* Painel lateral */}
      <div className="w-64 shrink-0 flex flex-col gap-4">
        {/* Filtro de rancho */}
        <div className="bg-white rounded-lg shadow p-4">
          <h3 className="text-sm font-semibold text-gray-700 mb-2">🏡 Rancho</h3>
          <div className="flex flex-col gap-1">
            <button
              onClick={() => setRanchoIdFiltro('')}
              className={`text-left text-sm px-2 py-1 rounded ${!ranchoIdFiltro ? 'bg-green-100 text-green-700 font-semibold' : 'text-gray-600 hover:bg-gray-100'}`}>
              Todos
            </button>
            {ranchos?.map(r => (
              <button key={r.id}
                onClick={() => setRanchoIdFiltro(r.id)}
                className={`text-left text-sm px-2 py-1 rounded ${ranchoIdFiltro === r.id ? 'bg-green-100 text-green-700 font-semibold' : 'text-gray-600 hover:bg-gray-100'}`}>
                {r.codigoInterno} — {r.nome}
              </button>
            ))}
          </div>
        </div>

        {/* Resumo do mês */}
        {reservas && reservas.length > 0 && (
          <div className="bg-white rounded-lg shadow p-4">
            <h3 className="text-sm font-semibold text-gray-700 mb-2">📊 Resumo do mês</h3>
            <p className="text-sm text-gray-500">{reservas.length} reserva{reservas.length > 1 ? 's' : ''}</p>
          </div>
        )}

        {/* Detalhe da reserva selecionada */}
        {reservaSelecionada && (
          <div className="bg-white rounded-lg shadow p-4">
            <div className="flex justify-between items-start">
              <h3 className="text-sm font-semibold text-gray-700">Reserva</h3>
              <button onClick={() => setReservaSelecionada(null)} className="text-gray-400 hover:text-gray-600 text-lg leading-none">×</button>
            </div>
            <div className="mt-2 text-sm space-y-1">
              <p className="font-semibold text-gray-800">{reservaSelecionada.cliente?.nomeCompleto}</p>
              <p className="text-gray-500">{reservaSelecionada.rancho?.nome}</p>
              <p className="text-gray-500">
                {formatarData(reservaSelecionada.dataEntrada)} → {formatarData(reservaSelecionada.dataSaida)}
              </p>
              <p className="text-gray-500">{reservaSelecionada.numDiarias} diárias</p>
              <p className="font-semibold text-green-700">{formatarValor(reservaSelecionada.valorTotal)}</p>
              <span className={`text-xs px-2 py-0.5 rounded-full inline-block mt-1 ${STATUS_COR[reservaSelecionada.status] ?? 'bg-gray-100 text-gray-500'}`}>
                {reservaSelecionada.status.replace(/_/g, ' ')}
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
