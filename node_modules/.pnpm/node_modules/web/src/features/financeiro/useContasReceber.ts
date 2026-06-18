import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../../lib/api';

export interface ContaReceber {
  id: string;
  reservaId?: string;
  clienteId: string;
  descricao: string;
  tipo: string;
  valor: number;
  vencimento: string;
  dataPagamento?: string;
  formaPagamento?: string;
  status: 'EM_ABERTO' | 'RECEBIDO' | 'ATRASADO' | 'CANCELADO';
  cliente?: { nomeCompleto: string };
  reserva?: { dataEntrada: string; dataSaida: string; rancho?: { nome: string } };
}

export interface ResumoReceber {
  totalEmAberto: number;
  qtdEmAberto: number;
  totalRecebido: number;
  qtdRecebido: number;
}

export function useContasReceber(status?: string) {
  return useQuery({
    queryKey: ['contas-receber', status ?? 'todos'],
    queryFn: async () => (await api.get<ContaReceber[]>('/contas-receber', { params: status ? { status } : {} })).data,
  });
}

export function useResumoReceber() {
  return useQuery({
    queryKey: ['contas-receber-resumo'],
    queryFn: async () => (await api.get<ResumoReceber>('/contas-receber/resumo')).data,
  });
}

export function useCriarContaReceber() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: Partial<ContaReceber>) => api.post('/contas-receber', data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['contas-receber'] });
      qc.invalidateQueries({ queryKey: ['contas-receber-resumo'] });
    },
  });
}

export interface PagarPayload {
  id: string;
  dataPagamento: string;
  formaPagamento?: string;
  contaBancariaId?: string;
  desconto?: number;
  multa?: number;
  juros?: number;
  nRecibo?: string;
  observacoesPagamento?: string;
}

export function useMarcarRecebido() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, ...body }: PagarPayload) =>
      api.put(`/contas-receber/${id}/pagar`, body),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['contas-receber'] });
      qc.invalidateQueries({ queryKey: ['contas-receber-resumo'] });
    },
  });
}

export function useRemoverContaReceber() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => api.delete(`/contas-receber/${id}`),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['contas-receber'] });
      qc.invalidateQueries({ queryKey: ['contas-receber-resumo'] });
    },
  });
}
