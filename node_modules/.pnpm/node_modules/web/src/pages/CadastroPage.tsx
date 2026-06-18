import { useState } from 'react';
import { ClientesTab } from '../features/cadastro/ClientesTab';
import { ImoveisTab } from '../features/cadastro/ImoveisTab';
import { BancosTab } from '../features/cadastro/BancosTab';
import { FornecedoresTab } from '../features/cadastro/FornecedoresTab';
import { CentrosCustoTab } from '../features/cadastro/CentrosCustoTab';
import { UsuariosTab } from '../features/cadastro/UsuariosTab';

type Aba = 'clientes' | 'imoveis' | 'bancos' | 'fornecedores' | 'centros-custo' | 'usuarios';

export function CadastroPage() {
  const [aba, setAba] = useState<Aba>('clientes');

  const abas: { id: Aba; label: string; icone: string }[] = [
    { id: 'clientes',     label: 'Clientes',     icone: '👥' },
    { id: 'imoveis',      label: 'Imóveis',       icone: '🏡' },
    { id: 'bancos',       label: 'Bancos',        icone: '🏦' },
    { id: 'fornecedores', label: 'Fornecedores',  icone: '🏢' },
    { id: 'centros-custo', label: 'Centro de Custo', icone: '🗂️' },
    { id: 'usuarios',     label: 'Usuários',      icone: '🔑' },
  ];

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Cadastros</h1>

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

      {aba === 'clientes'     && <ClientesTab />}
      {aba === 'imoveis'      && <ImoveisTab />}
      {aba === 'bancos'       && <BancosTab />}
      {aba === 'fornecedores' && <FornecedoresTab />}
      {aba === 'centros-custo' && <CentrosCustoTab />}
      {aba === 'usuarios'     && <UsuariosTab />}
    </div>
  );
}
