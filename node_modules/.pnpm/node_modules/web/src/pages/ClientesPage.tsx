import { useState } from 'react';
import { useClientes, useCriarCliente, useRemoverCliente } from '../features/clientes/useClientes';
import type { Cliente } from '../features/clientes/useClientes';

const camposVazios = {
  nomeCompleto: '', cpf: '', rg: '', telefone: '', whatsapp: '',
  email: '', cep: '', rua: '', numero: '', bairro: '', cidade: '', estado: '', observacoes: '',
};

export function ClientesPage() {
  const { data: clientes, isLoading } = useClientes();
  const criar = useCriarCliente();
  const remover = useRemoverCliente();
  const [mostrarForm, setMostrarForm] = useState(false);
  const [form, setForm] = useState(camposVazios);

  function handleSalvar(e: React.FormEvent) {
    e.preventDefault();
    criar.mutate(form, {
      onSuccess: () => { setForm(camposVazios); setMostrarForm(false); }
    });
  }

  if (isLoading) return <p className="p-8">Carregando...</p>;

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Clientes</h1>
        <button
          onClick={() => setMostrarForm(!mostrarForm)}
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
        >
          {mostrarForm ? 'Cancelar' : '+ Novo Cliente'}
        </button>
      </div>

      {mostrarForm && (
        <form onSubmit={handleSalvar} className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-lg font-semibold mb-4">Novo Cliente</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              { label: 'Nome Completo *', campo: 'nomeCompleto', required: true },
              { label: 'CPF *', campo: 'cpf', required: true },
              { label: 'RG', campo: 'rg' },
              { label: 'Telefone', campo: 'telefone' },
              { label: 'WhatsApp', campo: 'whatsapp' },
              { label: 'E-mail', campo: 'email' },
              { label: 'CEP', campo: 'cep' },
              { label: 'Rua', campo: 'rua' },
              { label: 'Número', campo: 'numero' },
              { label: 'Bairro', campo: 'bairro' },
              { label: 'Cidade', campo: 'cidade' },
              { label: 'Estado (UF)', campo: 'estado' },
            ].map(({ label, campo, required }) => (
              <div key={campo}>
                <label className="block text-sm text-gray-600 mb-1">{label}</label>
                <input
                  required={required}
                  value={(form as any)[campo]}
                  onChange={e => setForm({ ...form, [campo]: e.target.value })}
                  className="w-full border rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-400"
                />
              </div>
            ))}
            <div className="md:col-span-2">
              <label className="block text-sm text-gray-600 mb-1">Observações</label>
              <textarea
                value={form.observacoes}
                onChange={e => setForm({ ...form, observacoes: e.target.value })}
                className="w-full border rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-400"
                rows={3}
              />
            </div>
          </div>
          <button
            type="submit"
            disabled={criar.isPending}
            className="mt-4 bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700 disabled:opacity-50"
          >
            {criar.isPending ? 'Salvando...' : 'Salvar Cliente'}
          </button>
        </form>
      )}

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 text-gray-500 text-left">
            <tr>
              <th className="px-4 py-3">Nome</th>
              <th className="px-4 py-3">CPF</th>
              <th className="px-4 py-3">Telefone</th>
              <th className="px-4 py-3">Cidade</th>
              <th className="px-4 py-3"></th>
            </tr>
          </thead>
          <tbody>
            {clientes?.length === 0 && (
              <tr><td colSpan={5} className="px-4 py-8 text-center text-gray-400">Nenhum cliente cadastrado</td></tr>
            )}
            {clientes?.map((c: Cliente) => (
              <tr key={c.id} className="border-t hover:bg-gray-50">
                <td className="px-4 py-3 font-medium">{c.nomeCompleto}</td>
                <td className="px-4 py-3 text-gray-500">{c.cpf}</td>
                <td className="px-4 py-3 text-gray-500">{c.telefone || c.whatsapp || '—'}</td>
                <td className="px-4 py-3 text-gray-500">{c.cidade ? `${c.cidade}/${c.estado}` : '—'}</td>
                <td className="px-4 py-3">
                  <button
                    onClick={() => { if (confirm('Remover este cliente?')) remover.mutate(c.id); }}
                    className="text-red-400 hover:text-red-600 text-xs"
                  >
                    Remover
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
