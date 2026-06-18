import { useState } from 'react';
import { useFornecedores, useCriarFornecedor, useAtualizarFornecedor, useRemoverFornecedor } from './useFornecedores';
import type { Fornecedor } from './useFornecedores';

const camposVazios = {
  nome: '', documento: '', contato: '',
  cep: '', rua: '', numero: '', bairro: '', cidade: '', estado: '',
  observacoes: '',
};

export function FornecedoresTab() {
  const { data: fornecedores, isLoading } = useFornecedores();
  const criar = useCriarFornecedor();
  const atualizar = useAtualizarFornecedor();
  const remover = useRemoverFornecedor();
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

  function handleEditar(f: Fornecedor) {
    setForm({
      nome: f.nome ?? '', documento: f.documento ?? '', contato: f.contato ?? '',
      cep: f.cep ?? '', rua: f.rua ?? '', numero: f.numero ?? '', bairro: f.bairro ?? '',
      cidade: f.cidade ?? '', estado: f.estado ?? '', observacoes: f.observacoes ?? '',
    });
    setEditandoId(f.id);
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
        <h2 className="text-lg font-semibold text-gray-700">Fornecedores</h2>
        <button onClick={() => mostrarForm ? handleCancelar() : setMostrarForm(true)}
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 text-sm">
          {mostrarForm ? 'Cancelar' : '+ Novo Fornecedor'}
        </button>
      </div>

      {mostrarForm && (
        <form onSubmit={handleSalvar} className="bg-white rounded-lg shadow p-6 mb-6">
          {editandoId && <p className="text-sm text-blue-600 mb-3">Editando fornecedor...</p>}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-gray-600 mb-1">Nome *</label>
              <input required value={form.nome} placeholder="Ex: João Elétrica"
                onChange={e => setForm({ ...form, nome: e.target.value })}
                className="w-full border rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-400" />
            </div>
            <div>
              <label className="block text-sm text-gray-600 mb-1">CPF / CNPJ</label>
              <input value={form.documento} onChange={e => setForm({ ...form, documento: e.target.value })}
                className="w-full border rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-400" />
            </div>
            <div>
              <label className="block text-sm text-gray-600 mb-1">Telefone / WhatsApp</label>
              <input value={form.contato} onChange={e => setForm({ ...form, contato: e.target.value })}
                className="w-full border rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-400" />
            </div>
            {[
              { label: 'CEP', campo: 'cep' },
              { label: 'Rua', campo: 'rua' },
              { label: 'Número', campo: 'numero' },
              { label: 'Bairro', campo: 'bairro' },
              { label: 'Cidade', campo: 'cidade' },
              { label: 'Estado (UF)', campo: 'estado' },
            ].map(({ label, campo }) => (
              <div key={campo}>
                <label className="block text-sm text-gray-600 mb-1">{label}</label>
                <input value={(form as any)[campo]}
                  onChange={e => setForm({ ...form, [campo]: e.target.value })}
                  className="w-full border rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-400" />
              </div>
            ))}
            <div className="md:col-span-2">
              <label className="block text-sm text-gray-600 mb-1">Observações</label>
              <textarea value={form.observacoes} onChange={e => setForm({ ...form, observacoes: e.target.value })}
                className="w-full border rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-400" rows={2} />
            </div>
          </div>
          <div className="flex gap-2 mt-4">
            <button type="submit" disabled={criar.isPending || atualizar.isPending}
              className="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700 disabled:opacity-50 text-sm">
              {(criar.isPending || atualizar.isPending) ? 'Salvando...' : editandoId ? 'Atualizar Fornecedor' : 'Salvar Fornecedor'}
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
              <th className="px-4 py-3">CPF / CNPJ</th>
              <th className="px-4 py-3">Contato</th>
              <th className="px-4 py-3">Observações</th>
              <th className="px-4 py-3"></th>
            </tr>
          </thead>
          <tbody>
            {fornecedores?.length === 0 && (
              <tr><td colSpan={5} className="px-4 py-8 text-center text-gray-400">Nenhum fornecedor cadastrado</td></tr>
            )}
            {fornecedores?.map((f: Fornecedor) => (
              <tr key={f.id} className="border-t hover:bg-gray-50">
                <td className="px-4 py-3 font-medium">{f.nome}</td>
                <td className="px-4 py-3 text-gray-500">{f.documento || '—'}</td>
                <td className="px-4 py-3 text-gray-500">{f.contato || '—'}</td>
                <td className="px-4 py-3 text-gray-500 text-xs">{f.observacoes || '—'}</td>
                <td className="px-4 py-3 text-right space-x-3">
                  <button onClick={() => handleEditar(f)}
                    className="text-blue-500 hover:text-blue-700 text-xs">Editar</button>
                  <button onClick={() => { if (confirm('Remover este fornecedor?')) remover.mutate(f.id); }}
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
