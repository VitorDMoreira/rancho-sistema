import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../../lib/api';

export interface Cliente {
  id: string;
  nomeCompleto: string;
  cpf: string;
  rg?: string;
  telefone?: string;
  whatsapp?: string;
  email?: string;
  cep?: string;
  rua?: string;
  numero?: string;
  bairro?: string;
  cidade?: string;
  estado?: string;
  observacoes?: string;
}

export function useClientes() {
  return useQuery({
    queryKey: ['clientes'],
    queryFn: async () => (await api.get<Cliente[]>('/clientes')).data,
  });
}

export function useCriarCliente() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: Omit<Cliente, 'id'>) => api.post('/clientes', data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['clientes'] }),
  });
}

export function useAtualizarCliente() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Cliente> }) => api.put(`/clientes/${id}`, data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['clientes'] }),
  });
}

export function useRemoverCliente() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => api.delete(`/clientes/${id}`),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['clientes'] }),
  });
}
