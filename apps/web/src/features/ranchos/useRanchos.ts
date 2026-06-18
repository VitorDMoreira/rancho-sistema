import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../../lib/api';

export interface Rancho {
  id: string;
  nome: string;
  codigoInterno: string;
  endereco?: string;
  cidade?: string;
  estado?: string;
  observacoes?: string;
}

export function useRanchos() {
  return useQuery({
    queryKey: ['ranchos'],
    queryFn: async () => (await api.get<Rancho[]>('/ranchos')).data,
  });
}

export function useCriarRancho() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: Omit<Rancho, 'id'>) => api.post('/ranchos', data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['ranchos'] }),
  });
}

export function useAtualizarRancho() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Rancho> }) => api.put(`/ranchos/${id}`, data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['ranchos'] }),
  });
}

export function useRemoverRancho() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => api.delete(`/ranchos/${id}`),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['ranchos'] }),
  });
}
