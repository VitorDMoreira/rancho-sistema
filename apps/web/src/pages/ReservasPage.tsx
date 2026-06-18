import { useState } from 'react';
import { ListaReservasTab } from '../features/reservas/ListaReservasTab';
import { NovaReservaTab } from '../features/reservas/NovaReservaTab';
import { CalendarioTab } from '../features/reservas/CalendarioTab';

type Aba = 'lista' | 'nova' | 'calendario';

export function ReservasPage() {
  const [aba, setAba] = useState<Aba>('calendario');

  const abas: { id: Aba; label: string; icone: string }[] = [
    { id: 'calendario', label: 'Calendário',   icone: '🗓️' },
    { id: 'lista',      label: 'Reservas',     icone: '📋' },
    { id: 'nova',       label: 'Nova Reserva', icone: '➕' },
  ];

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Reservas</h1>

      <div className="flex gap-3 mb-6">
        {abas.map(a => (
          <button key={a.id} onClick={() => setAba(a.id)}
            className={`flex items-center gap-2 px-5 py-3 rounded-lg font-medium text-sm transition-all ${
              aba === a.id
                ? 'bg-green-600 text-white shadow'
                : 'bg-white text-gray-600 border hover:bg-gray-50'
            }`}>
            <span>{a.icone}</span>{a.label}
          </button>
        ))}
      </div>

      {aba === 'lista'      && <ListaReservasTab onEditar={() => setAba('nova')} />}
      {aba === 'nova'       && <NovaReservaTab onSalvar={() => setAba('lista')} />}
      {aba === 'calendario' && <CalendarioTab />}
    </div>
  );
}
