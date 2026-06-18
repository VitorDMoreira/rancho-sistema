import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../../lib/api';

export interface ContaPagar {
  id: string;
  categoriaId: string;
  fornecedorId?: string;
  ranchoId?: string;
  descricao: string;
  numeroNota?: string;
  dataEmissao?: string;
  valor: number;
  vencimento: string;
  dataPagamento?: string;
  formaPagamento?: string;
  contaBancariaId?: string;
  desconto?: number;
  multa?: number;
  juros?: number;
  nRecibo?: string;
  observacoesPagamento?: string;
  status: 'EM_ABERTO' | 'PAGO' | 'ATRASADO';
  observacoes?: string;
  categoria?: { nome: string };
  rancho?: { nome: string; codigoInterno: string };
  fornecedor?: { nome: string };
  contaBancaria?: { id: string; nome: string; banco: string };
}

export interface Categoria {
  id: string;
  nome: string;
}

export interface ResumoPagar {
  totalEmAberto: number;
  qtdEmAberto: number;
  totalPago: number;
  qtdPago: number;
}

export function useContasPagar(status?: string) {
  return useQuery({
    queryKey: ['contas-pagar', status ?? 'todos'],
    queryFn: async () => (await api.get<ContaPagar[]>('/contas-pagar', { params: status ? { status } : {} })).data,
  });
}

export function useResumoPagar() {
  return useQuery({
    queryKey: ['contas-pagar-resumo'],
    queryFn: async () => (await api.get<ResumoPagar>('/contas-pagar/resumo')).data,
  });
}

export function useCategorias() {
  return useQuery({
    queryKey: ['categorias-despesa'],
    queryFn: async () => (await api.get<Categoria[]>('/categorias-despesa')).data,
  });
}

export function useCriarCategoria() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (nome: string) => api.post('/categorias-despesa', { nome }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['categorias-despesa'] }),
  });
}

export function useCriarContaPagar() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: Partial<ContaPagar>) => api.post('/contas-pagar', data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['contas-pagar'] });
      qc.invalidateQueries({ queryKey: ['contas-pagar-resumo'] });
    },
  });
}

export interface PagarContaPagarPayload {
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

export function useMarcarPago() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, ...body }: PagarContaPagarPayload) =>
      api.put(`/contas-pagar/${id}/pagar`, body),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['contas-pagar'] });
      qc.invalidateQueries({ queryKey: ['contas-pagar-resumo'] });
    },
  });
}

export function useRemoverContaPagar() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => api.delete(`/contas-pagar/${id}`),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['contas-pagar'] });
      qc.invalidateQueries({ queryKey: ['contas-pagar-resumo'] });
    },
  });
}
