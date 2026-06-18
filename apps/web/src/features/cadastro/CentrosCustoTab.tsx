import { useState } from 'react';
import { useCentrosCusto, useCriarCentroCusto, useAtualizarCentroCusto, useRemoverCentroCusto } from './useCentrosCusto';
import type { CentroCusto } from './useCentrosCusto';

const camposVazios = { nome: '', observacoes: '' };

export function CentrosCustoTab() {
  const { data: centros, isLoading } = useCentrosCusto();
  const criar = useCriarCentroCusto();
  const atualizar = useAtualizarCentroCusto();
  const remover = useRemoverCentroCusto();
  const [mostrarForm, setMostrarForm] = useState(false);
  const [editandoId, setEditandoId] = useState<string | null>(null);
  const [form, setForm] = useState(camposVazios);

  function handleSalvar(e: React.FormEvent) {
    e.preventDefault();
    if (!form.nome.trim()) return;
    if (editandoId) {
      atualizar.mutate({ id: editandoId, data: form }, {
        onSuccess: () => { setForm(camposVazios); setEditandoId(null); setMostrarForm(false); }
      });
    } else {
      criar.mutate(form, { onSuccess: () => { setForm(camposVazios); setMostrarForm(false); } });
    }
  }

  function handleEditar(c: CentroCusto) {
    setForm({ nome: c.nome ?? '', observacoes: c.observacoes ?? '' });
    setEditandoId(c.id);
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
        <h2 className="text-lg font-semibold text-gray-700">Centros de Custo</h2>
        <button onClick={() => mostrarForm ? handleCancelar() : setMostrarForm(true)}
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 text-sm">
          {mostrarForm ? 'Cancelar' : '+ Novo Centro de Custo'}
        </button>
      </div>

      {mostrarForm && (
      <form onSubmit={handleSalvar} className="bg-white rounded-lg shadow p-6 mb-6">
        {editandoId && <p className="text-sm text-blue-600 mb-3">Editando centro de custo...</p>}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm text-gray-600 mb-1">Nome *</label>
            <input required value={form.nome} onChange={e => setForm({ ...form, nome: e.target.value })}
              placeholder="Ex: Manutenção, Energia, Funcionários"
              className="w-full border rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-400" />
          </div>
          <div>
            <label className="block text-sm text-gray-600 mb-1">Observações</label>
            <input value={form.observacoes} onChange={e => setForm({ ...form, observacoes: e.target.value })}
              placeholder="O que se encaixa nesse centro de custo"
              className="w-full border rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-400" />
          </div>
        </div>
        <div className="flex gap-2 mt-4">
          <button type="submit" disabled={criar.isPending || atualizar.isPending}
            className="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700 disabled:opacity-50 text-sm">
            {(criar.isPending || atualizar.isPending) ? 'Salvando...' : editandoId ? 'Atualizar' : 'Adicionar'}
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
              <th className="px-4 py-3">Observações</th>
              <th className="px-4 py-3"></th>
            </tr>
          </thead>
          <tbody>
            {centros?.length === 0 && (
              <tr><td colSpan={3} className="px-4 py-8 text-center text-gray-400">Nenhum centro de custo cadastrado</td></tr>
            )}
            {centros?.map(c => (
              <tr key={c.id} className="border-t hover:bg-gray-50">
                <td className="px-4 py-3 font-medium">{c.nome}</td>
                <td className="px-4 py-3 text-gray-500 text-xs">{c.observacoes || '—'}</td>
                <td className="px-4 py-3 text-right space-x-3">
                  <button onClick={() => handleEditar(c)}
                    className="text-blue-500 hover:text-blue-700 text-xs">Editar</button>
                  <button onClick={() => { if (confirm('Remover este centro de custo?')) remover.mutate(c.id); }}
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
