import { useState } from 'react';
import { ContasReceberTab } from '../features/financeiro/ContasReceberTab';
import { ContasPagarTab } from '../features/financeiro/ContasPagarTab';
import { CaixaTab } from '../features/financeiro/CaixaTab';

type Aba = 'receber' | 'pagar' | 'caixa';

export function FinanceiroPage() {
  const [aba, setAba] = useState<Aba>('receber');

  const abas: { id: Aba; label: string; icone: string }[] = [
    { id: 'receber', label: 'Contas a Receber', icone: '💰' },
    { id: 'pagar',   label: 'Contas a Pagar',   icone: '💸' },
    { id: 'caixa',   label: 'Movimentação de Caixa', icone: '🏦' },
  ];

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Financeiro</h1>

      {/* Botões de aba */}
      <div className="flex gap-3 mb-6">
        {abas.map(a => (
          <button
            key={a.id}
            onClick={() => setAba(a.id)}
            className={`flex items-center gap-2 px-5 py-3 rounded-lg font-medium text-sm transition-all ${
              aba === a.id
                ? 'bg-green-600 text-white shadow'
                : 'bg-white text-gray-600 border hover:bg-gray-50'
            }`}
          >
            <span>{a.icone}</span>
            {a.label}
          </button>
        ))}
      </div>

      {/* Conteúdo da aba */}
      {aba === 'receber' && <ContasReceberTab />}
      {aba === 'pagar'   && <ContasPagarTab />}
      {aba === 'caixa'   && <CaixaTab />}
    </div>
  );
}
