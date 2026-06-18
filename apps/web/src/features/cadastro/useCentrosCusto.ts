import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../../lib/api';

export interface CentroCusto {
  id: string;
  nome: string;
  observacoes?: string;
  ativo: boolean;
}

export function useCentrosCusto() {
  return useQuery({
    queryKey: ['categorias-despesa'],
    queryFn: async () => (await api.get<CentroCusto[]>('/categorias-despesa')).data,
  });
}

export function useCriarCentroCusto() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: { nome: string; observacoes?: string }) => api.post('/categorias-despesa', data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['categorias-despesa'] }),
  });
}

export function useAtualizarCentroCusto() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: { nome?: string; observacoes?: string } }) =>
      api.put(`/categorias-despesa/${id}`, data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['categorias-despesa'] }),
  });
}

export function useRemoverCentroCusto() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => api.delete(`/categorias-despesa/${id}`),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['categorias-despesa'] }),
  });
}
