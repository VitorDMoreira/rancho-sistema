import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../../lib/api';

export interface Usuario {
  id: string;
  nome: string;
  email: string;
  perfil: 'ADMIN' | 'FINANCEIRO' | 'ATENDENTE';
  ultimoAcesso?: string;
}

export interface UsuarioPayload {
  nome: string;
  email: string;
  senha?: string;
  perfil: string;
}

export function useUsuarios() {
  return useQuery({
    queryKey: ['usuarios'],
    queryFn: async () => (await api.get<Usuario[]>('/usuarios')).data,
  });
}

export function useCriarUsuario() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: UsuarioPayload) => api.post('/usuarios', data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['usuarios'] }),
  });
}

export function useAtualizarUsuario() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UsuarioPayload }) => api.put(`/usuarios/${id}`, data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['usuarios'] }),
  });
}

export function useRemoverUsuario() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => api.delete(`/usuarios/${id}`),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['usuarios'] }),
  });
}
