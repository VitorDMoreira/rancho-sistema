import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../../lib/api';

export interface Banco {
  id: string;
  nome: string;
  banco: string;
  agencia?: string;
  conta?: string;
  tipo: string;
  saldoInicial?: number;
  ativo: boolean;
}

export interface BancoComSaldo extends Banco {
  saldo: number;
}

export function useBancos() {
  return useQuery({
    queryKey: ['bancos'],
    queryFn: async () => (await api.get<Banco[]>('/bancos')).data,
  });
}

export function useBancosComSaldo() {
  return useQuery({
    queryKey: ['bancos-saldos'],
    queryFn: async () => (await api.get<BancoComSaldo[]>('/bancos/saldos')).data,
  });
}

export function useCriarBanco() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: Partial<Banco>) => api.post('/bancos', data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['bancos'] }),
  });
}

export function useAtualizarBanco() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Banco> }) => api.put(`/bancos/${id}`, data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['bancos'] }),
  });
}

export function useRemoverBanco() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => api.delete(`/bancos/${id}`),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['bancos'] }),
  });
}
