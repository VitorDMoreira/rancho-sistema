import { createContext, useContext, useState, type ReactNode } from 'react';
import { api } from '../../lib/api';

export interface UsuarioLogado {
  id: string;
  nome: string;
  email: string;
  perfil: 'ADMIN' | 'FINANCEIRO' | 'ATENDENTE';
}

interface AuthContextType {
  usuario: UsuarioLogado | null;
  login: (email: string, senha: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [usuario, setUsuario] = useState<UsuarioLogado | null>(() => {
    const salvo = localStorage.getItem('usuario');
    return salvo ? JSON.parse(salvo) : null;
  });

  async function login(email: string, senha: string) {
    const res = await api.post('/auth/login', { email, senha });
    localStorage.setItem('token', res.data.token);
    localStorage.setItem('usuario', JSON.stringify(res.data.usuario));
    setUsuario(res.data.usuario);
  }

  function logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('usuario');
    setUsuario(null);
  }

  return <AuthContext.Provider value={{ usuario, login, logout }}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth deve ser usado dentro de AuthProvider');
  return ctx;
}
