import { useQuery } from '@tanstack/react-query';
import { api } from '../../lib/api';

export interface FiltroRelatorio {
  dataIni?: string;
  dataFim?: string;
  ranchoId?: string;
  categoriaId?: string;
  fornecedorId?: string;
  clienteId?: string;
  status?: string;
}

export type TipoRelatorio = 'contas-pagar' | 'contas-receber' | 'locacoes' | 'centros-custo';

export function useRelatorio(tipo: TipoRelatorio, filtros: FiltroRelatorio, habilitado: boolean) {
  return useQuery({
    queryKey: ['relatorio', tipo, filtros],
    queryFn: async () => (await api.get(`/relatorios/${tipo}`, { params: filtros })).data,
    enabled: habilitado,
  });
}
