import { useState } from 'react';
import { useBancos, useCriarBanco, useAtualizarBanco, useRemoverBanco } from './useBancos';
import type { Banco } from './useBancos';

const camposVazios = { nome: '', banco: '', agencia: '', conta: '', tipo: 'CORRENTE' };

const TIPO_LABEL: Record<string, string> = {
  CORRENTE: 'Conta Corrente',
  POUPANCA: 'Poupança',
  CAIXA:    'Caixa (dinheiro)',
};

export function BancosTab() {
  const { data: bancos, isLoading } = useBancos();
  const criar = useCriarBanco();
  const atualizar = useAtualizarBanco();
  const remover = useRemoverBanco();
  const [mostrarForm, setMostrarForm] = useState(false);
  const [editandoId, setEditandoId] = useState<string | null>(null);
  const [form, setForm] = useState(camposVazios);

  function handleSalvar(e: React.FormEvent) {
    e.preventDefault();
    if (editandoId) {
      atualizar.mutate({ id: editandoId, data: form }, {
        onSuccess: () => { setForm(camposVazios); setEditandoId(null); setMostrarForm(false); }
      });
    } else {
      criar.mutate(form, {
        onSuccess: () => { setForm(camposVazios); setMostrarForm(false); }
      });
    }
  }

  function handleEditar(b: Banco) {
    setForm({
      nome: b.nome ?? '', banco: b.banco ?? '', agencia: b.agencia ?? '',
      conta: b.conta ?? '', tipo: b.tipo ?? 'CORRENTE',
    });
    setEditandoId(b.id);
    setMostrarForm(true);
  }

  function handleCancelar() {
    setForm(camposVazios);
    setEditandoId(null);
    setMostrarForm(false);
  }

  if (isLoading) return <p className="p-8">Carregando...</p>;

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold text-gray-700">Contas Bancárias</h2>
        <button onClick={() => mostrarForm ? handleCancelar() : setMostrarForm(true)}
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 text-sm">
          {mostrarForm ? 'Cancelar' : '+ Nova Conta'}
        </button>
      </div>

      {mostrarForm && (
        <form onSubmit={handleSalvar} className="bg-white rounded-lg shadow p-6 mb-6">
          {editandoId && <p className="text-sm text-blue-600 mb-3">Editando conta...</p>}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-gray-600 mb-1">Nome da Conta *</label>
              <input required value={form.nome} placeholder="Ex: Conta Principal"
                onChange={e => setForm({ ...form, nome: e.target.value })}
                className="w-full border rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-400" />
            </div>
            <div>
              <label className="block text-sm text-gray-600 mb-1">Banco *</label>
              <input required value={form.banco} placeholder="Ex: Bradesco, Nubank, Itaú"
                onChange={e => setForm({ ...form, banco: e.target.value })}
                className="w-full border rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-400" />
            </div>
            <div>
              <label className="block text-sm text-gray-600 mb-1">Tipo</label>
              <select value={form.tipo} onChange={e => setForm({ ...form, tipo: e.target.value })}
                className="w-full border rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-400">
                <option value="CORRENTE">Conta Corrente</option>
                <option value="POUPANCA">Poupança</option>
                <option value="CAIXA">Caixa (dinheiro)</option>
              </select>
            </div>
            <div>
              <label className="block text-sm text-gray-600 mb-1">Agência</label>
              <input value={form.agencia} onChange={e => setForm({ ...form, agencia: e.target.value })}
                className="w-full border rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-400" />
            </div>
            <div>
              <label className="block text-sm text-gray-600 mb-1">Conta / Nº</label>
              <input value={form.conta} onChange={e => setForm({ ...form, conta: e.target.value })}
                className="w-full border rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-400" />
            </div>
          </div>
          <div className="flex gap-2 mt-4">
            <button type="submit" disabled={criar.isPending || atualizar.isPending}
              className="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700 disabled:opacity-50 text-sm">
              {(criar.isPending || atualizar.isPending) ? 'Salvando...' : editandoId ? 'Atualizar Conta' : 'Salvar Conta'}
            </button>
            {editandoId && (
              <button type="button" onClick={handleCancelar}
                className="px-6 py-2 border rounded text-sm text-gray-600 hover:bg-gray-50">
                Cancelar Edição
              </button>
            )}
          </div>
        </form>
      )}

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 text-gray-500 text-left">
            <tr>
              <th className="px-4 py-3">Nome</th>
              <th className="px-4 py-3">Banco</th>
              <th className="px-4 py-3">Tipo</th>
              <th className="px-4 py-3">Agência</th>
              <th className="px-4 py-3">Conta</th>
              <th className="px-4 py-3"></th>
            </tr>
          </thead>
          <tbody>
            {bancos?.length === 0 && (
              <tr><td colSpan={6} className="px-4 py-8 text-center text-gray-400">Nenhuma conta bancária cadastrada</td></tr>
            )}
            {bancos?.map((b: Banco) => (
              <tr key={b.id} className="border-t hover:bg-gray-50">
                <td className="px-4 py-3 font-medium">{b.nome}</td>
                <td className="px-4 py-3 text-gray-600">{b.banco}</td>
                <td className="px-4 py-3">
                  <span className="bg-blue-100 text-blue-700 text-xs px-2 py-1 rounded-full">
                    {TIPO_LABEL[b.tipo] ?? b.tipo}
                  </span>
                </td>
                <td className="px-4 py-3 text-gray-500">{b.agencia || '—'}</td>
                <td className="px-4 py-3 text-gray-500">{b.conta || '—'}</td>
                <td className="px-4 py-3 text-right space-x-3">
                  <button onClick={() => handleEditar(b)}
                    className="text-blue-500 hover:text-blue-700 text-xs">Editar</button>
                  <button onClick={() => { if (confirm('Remover esta conta?')) remover.mutate(b.id); }}
                    className="text-red-400 hover:text-red-600 text-xs">Remover</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
