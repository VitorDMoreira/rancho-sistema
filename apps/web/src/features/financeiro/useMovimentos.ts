import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../../lib/api';

export interface Movimento {
  id: string;
  data: string;
  tipo: 'ENTRADA' | 'SAIDA';
  descricao: string;
  contraparte: string;
  planoConta: string;
  contaBancariaId: string;
  contaBancariaNome: string;
  valor: number;
}

export interface FiltroMovimentos {
  contaBancariaId?: string;
  dataIni?: string;
  dataFim?: string;
  busca?: string;
}

export function useMovimentos(filtros: FiltroMovimentos) {
  return useQuery({
    queryKey: ['movimentos', filtros],
    queryFn: async () => (await api.get<Movimento[]>('/movimentos', { params: filtros })).data,
  });
}

export interface TransferenciaPayload {
  contaOrigemId: string;
  contaDestinoId: string;
  valor: number;
  data: string;
  observacoes?: string;
}

export function useCriarTransferencia() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: TransferenciaPayload) => api.post('/transferencias', data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['bancos-saldos'] });
      qc.invalidateQueries({ queryKey: ['movimentos'] });
    },
  });
}
