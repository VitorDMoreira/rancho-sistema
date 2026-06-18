import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../features/auth/AuthContext';

export function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [erro, setErro] = useState('');
  const [carregando, setCarregando] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErro('');
    setCarregando(true);
    try {
      await login(email, senha);
      navigate('/dashboard');
    } catch {
      setErro('E-mail ou senha inválidos');
    } finally {
      setCarregando(false);
    }
  }

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="bg-white rounded-xl shadow-lg p-8 w-full max-w-sm">
        <h1 className="text-xl font-bold text-green-700 text-center mb-1">🏡 Rancho Sistema</h1>
        <p className="text-sm text-gray-400 text-center mb-6">Entre com seu e-mail e senha</p>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label className="block text-xs text-gray-500 mb-1">E-mail</label>
            <input type="email" required value={email} onChange={e => setEmail(e.target.value)}
              className="w-full border rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-400" />
          </div>
          <div>
            <label className="block text-xs text-gray-500 mb-1">Senha</label>
            <input type="password" required value={senha} onChange={e => setSenha(e.target.value)}
              className="w-full border rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-400" />
          </div>

          {erro && <p className="text-red-500 text-sm text-center">{erro}</p>}

          <button type="submit" disabled={carregando}
            className="bg-green-600 hover:bg-green-700 text-white py-2 rounded text-sm font-medium disabled:opacity-50">
            {carregando ? 'Entrando...' : 'Entrar'}
          </button>
        </form>
      </div>
    </div>
  );
}
