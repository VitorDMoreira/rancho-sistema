import { useState } from 'react';
import { useUsuarios, useCriarUsuario, useAtualizarUsuario, useRemoverUsuario, type Usuario } from './useUsuarios';

const PERFIS = [
  { value: 'ADMIN', label: 'Administrador (acesso total)' },
  { value: 'FINANCEIRO', label: 'Financeiro (acesso ao módulo financeiro)' },
  { value: 'ATENDENTE', label: 'Atendente (clientes e reservas)' },
];

const camposVazios = { nome: '', email: '', senha: '', perfil: 'ATENDENTE' };

function fmtData(d?: string) {
  if (!d) return '—';
  return new Date(d).toLocaleString('pt-BR');
}

export function UsuariosTab() {
  const { data: usuarios = [], isLoading } = useUsuarios();
  const criar = useCriarUsuario();
  const atualizar = useAtualizarUsuario();
  const remover = useRemoverUsuario();

  const [mostrarForm, setMostrarForm] = useState(false);
  const [editandoId, setEditandoId] = useState<string | null>(null);
  const [campos, setCampos] = useState(camposVazios);

  function handleEditar(u: Usuario) {
    setEditandoId(u.id);
    setCampos({ nome: u.nome, email: u.email, senha: '', perfil: u.perfil });
    setMostrarForm(true);
  }

  function handleCancelar() {
    setEditandoId(null);
    setCampos(camposVazios);
    setMostrarForm(false);
  }

  function handleSalvar() {
    if (!campos.nome.trim() || !campos.email.trim()) return;
    if (!editandoId && !campos.senha.trim()) return;

    const payload = {
      nome: campos.nome.trim(),
      email: campos.email.trim(),
      perfil: campos.perfil,
      ...(campos.senha.trim() ? { senha: campos.senha.trim() } : {}),
    };

    if (editandoId) {
      atualizar.mutate({ id: editandoId, data: payload }, { onSuccess: handleCancelar });
    } else {
      criar.mutate(payload as any, { onSuccess: handleCancelar });
    }
  }

  function handleRemover(id: string) {
    if (confirm('Tem certeza que deseja remover este usuário?')) remover.mutate(id);
  }

  if (isLoading) return <p className="p-8">Carregando...</p>;

  return (
    <div className="flex flex-col gap-4">
      <div className="flex justify-end">
        {!mostrarForm && (
          <button onClick={() => setMostrarForm(true)}
            className="bg-green-600 hover:bg-green-700 text-white px-5 py-2 rounded-lg text-sm font-medium">
            + Novo Usuário
          </button>
        )}
      </div>

      {mostrarForm && (
        <div className="bg-white rounded-lg shadow p-4">
          <h3 className="font-semibold text-gray-700 mb-3">{editandoId ? 'Editar Usuário' : 'Novo Usuário'}</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs text-gray-500 mb-1">Nome *</label>
              <input value={campos.nome} onChange={e => setCampos({ ...campos, nome: e.target.value })}
                className="w-full border rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-400" />
            </div>
            <div>
              <label className="block text-xs text-gray-500 mb-1">E-mail *</label>
              <input type="email" value={campos.email} onChange={e => setCampos({ ...campos, email: e.target.value })}
                className="w-full border rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-400" />
            </div>
            <div>
              <label className="block text-xs text-gray-500 mb-1">
                Senha {editandoId ? '(deixe em branco para não alterar)' : '*'}
              </label>
              <input type="password" value={campos.senha} onChange={e => setCampos({ ...campos, senha: e.target.value })}
                className="w-full border rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-400" />
            </div>
            <div>
              <label className="block text-xs text-gray-500 mb-1">Perfil de Acesso *</label>
              <select value={campos.perfil} onChange={e => setCampos({ ...campos, perfil: e.target.value })}
                className="w-full border rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-400">
                {PERFIS.map(p => <option key={p.value} value={p.value}>{p.label}</option>)}
              </select>
            </div>
          </div>
          <div className="flex gap-3 mt-4">
            <button onClick={handleSalvar} disabled={criar.isPending || atualizar.isPending}
              className="bg-green-600 hover:bg-green-700 text-white px-5 py-2 rounded text-sm font-medium disabled:opacity-50">
              {editandoId ? 'Atualizar Usuário' : 'Salvar'}
            </button>
            <button onClick={handleCancelar} className="px-5 py-2 border rounded text-sm text-gray-600 hover:bg-gray-50">
              Cancelar
            </button>
          </div>
        </div>
      )}

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 text-gray-500 text-left">
            <tr>
              <th className="px-4 py-3">Nome</th>
              <th className="px-4 py-3">E-mail</th>
              <th className="px-4 py-3">Perfil</th>
              <th className="px-4 py-3">Último Acesso</th>
              <th className="px-4 py-3 text-right">Ações</th>
            </tr>
          </thead>
          <tbody>
            {usuarios.length === 0 && (
              <tr><td colSpan={5} className="px-4 py-8 text-center text-gray-400">Nenhum usuário cadastrado</td></tr>
            )}
            {usuarios.map(u => (
              <tr key={u.id} className="border-t hover:bg-gray-50">
                <td className="px-4 py-3 font-medium">{u.nome}</td>
                <td className="px-4 py-3 text-gray-500">{u.email}</td>
                <td className="px-4 py-3 text-gray-500">{PERFIS.find(p => p.value === u.perfil)?.label ?? u.perfil}</td>
                <td className="px-4 py-3 text-gray-400">{fmtData(u.ultimoAcesso)}</td>
                <td className="px-4 py-3 text-right">
                  <button onClick={() => handleEditar(u)} className="text-blue-500 hover:underline text-xs mr-3">Editar</button>
                  <button onClick={() => handleRemover(u.id)} className="text-red-500 hover:underline text-xs">Remover</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
