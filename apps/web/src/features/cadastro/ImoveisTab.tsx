import { useState } from 'react';
import { useRanchos, useCriarRancho, useAtualizarRancho, useRemoverRancho } from '../ranchos/useRanchos';
import type { Rancho } from '../ranchos/useRanchos';

const camposVazios = {
  nome: '', codigoInterno: '', endereco: '', cidade: '', estado: '', observacoes: '',
};

export function ImoveisTab() {
  const { data: imoveis, isLoading } = useRanchos();
  const criar = useCriarRancho();
  const atualizar = useAtualizarRancho();
  const remover = useRemoverRancho();
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

  function handleEditar(r: Rancho) {
    setForm({
      nome: r.nome ?? '', codigoInterno: r.codigoInterno ?? '', endereco: r.endereco ?? '',
      cidade: r.cidade ?? '', estado: r.estado ?? '', observacoes: r.observacoes ?? '',
    });
    setEditandoId(r.id);
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
        <h2 className="text-lg font-semibold text-gray-700">Imóveis</h2>
        <button onClick={() => mostrarForm ? handleCancelar() : setMostrarForm(true)}
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 text-sm">
          {mostrarForm ? 'Cancelar' : '+ Novo Imóvel'}
        </button>
      </div>

      {mostrarForm && (
        <form onSubmit={handleSalvar} className="bg-white rounded-lg shadow p-6 mb-6">
          {editandoId && <p className="text-sm text-blue-600 mb-3">Editando imóvel...</p>}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              { label: 'Nome do Imóvel *', campo: 'nome', required: true },
              { label: 'Código Interno *', campo: 'codigoInterno', required: true },
              { label: 'Endereço', campo: 'endereco' },
              { label: 'Cidade', campo: 'cidade' },
              { label: 'Estado (UF)', campo: 'estado' },
            ].map(({ label, campo, required }) => (
              <div key={campo}>
                <label className="block text-sm text-gray-600 mb-1">{label}</label>
                <input required={required} value={(form as any)[campo]}
                  onChange={e => setForm({ ...form, [campo]: e.target.value })}
                  className="w-full border rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-400" />
              </div>
            ))}
            <div className="md:col-span-2">
              <label className="block text-sm text-gray-600 mb-1">Observações</label>
              <textarea value={form.observacoes} onChange={e => setForm({ ...form, observacoes: e.target.value })}
                className="w-full border rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-400" rows={3} />
            </div>
          </div>
          <div className="flex gap-2 mt-4">
            <button type="submit" disabled={criar.isPending || atualizar.isPending}
              className="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700 disabled:opacity-50 text-sm">
              {(criar.isPending || atualizar.isPending) ? 'Salvando...' : editandoId ? 'Atualizar Imóvel' : 'Salvar Imóvel'}
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
              <th className="px-4 py-3">Código</th>
              <th className="px-4 py-3">Nome</th>
              <th className="px-4 py-3">Cidade</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3"></th>
            </tr>
          </thead>
          <tbody>
            {imoveis?.length === 0 && (
              <tr><td colSpan={5} className="px-4 py-8 text-center text-gray-400">Nenhum imóvel cadastrado</td></tr>
            )}
            {imoveis?.map((r: Rancho) => (
              <tr key={r.id} className="border-t hover:bg-gray-50">
                <td className="px-4 py-3 font-mono text-gray-500">{r.codigoInterno}</td>
                <td className="px-4 py-3 font-medium">{r.nome}</td>
                <td className="px-4 py-3 text-gray-500">{r.cidade ? `${r.cidade}/${r.estado}` : '—'}</td>
                <td className="px-4 py-3">
                  <span className="bg-green-100 text-green-700 text-xs px-2 py-1 rounded-full">Disponível</span>
                </td>
                <td className="px-4 py-3 text-right space-x-3">
                  <button onClick={() => handleEditar(r)}
                    className="text-blue-500 hover:text-blue-700 text-xs">Editar</button>
                  <button onClick={() => { if (confirm('Remover este imóvel?')) remover.mutate(r.id); }}
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
