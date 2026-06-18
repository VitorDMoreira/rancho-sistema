import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../../lib/api';

export interface Reserva {
  id: string;
  clienteId: string;
  ranchoId: string;
  dataEntrada: string;
  dataSaida: string;
  qtdHospedes: number;
  numDiarias: number;
  valorNegociado: number;
  valorTotal: number;
  sinalRecebido: number;
  formaPagamento?: string;
  status: string;
  observacoes?: string;
  cliente?: { nomeCompleto: string };
  rancho?: { nome: string; codigoInterno: string };
}

export function useReservas() {
  return useQuery({
    queryKey: ['reservas'],
    queryFn: async () => (await api.get<Reserva[]>('/reservas')).data,
  });
}

export function useCriarReserva() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: Partial<Reserva>) => api.post('/reservas', data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['reservas'] }),
  });
}

export function useAtualizarReserva() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Reserva> }) =>
      api.put(`/reservas/${id}`, data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['reservas'] }),
  });
}

export function useConfirmarReserva() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, parcelas }: { id: string; parcelas: { valor: number; vencimento: string; tipo: string }[] }) =>
      api.put(`/reservas/${id}/confirmar`, { parcelas }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['reservas'] });
      queryClient.invalidateQueries({ queryKey: ['contas-receber'] });
      queryClient.invalidateQueries({ queryKey: ['contas-receber-resumo'] });
    },
  });
}

export function useRemoverReserva() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => api.delete(`/reservas/${id}`),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['reservas'] }),
  });
}
