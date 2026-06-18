import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../../lib/api';

export interface Fornecedor {
  id: string;
  nome: string;
  documento?: string;
  contato?: string;
  cep?: string;
  rua?: string;
  numero?: string;
  bairro?: string;
  cidade?: string;
  estado?: string;
  observacoes?: string;
}

export function useFornecedores() {
  return useQuery({
    queryKey: ['fornecedores'],
    queryFn: async () => (await api.get<Fornecedor[]>('/fornecedores')).data,
  });
}

export function useCriarFornecedor() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: Partial<Fornecedor>) => api.post('/fornecedores', data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['fornecedores'] }),
  });
}

export function useAtualizarFornecedor() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Fornecedor> }) => api.put(`/fornecedores/${id}`, data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['fornecedores'] }),
  });
}

export function useRemoverFornecedor() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => api.delete(`/fornecedores/${id}`),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['fornecedores'] }),
  });
}
