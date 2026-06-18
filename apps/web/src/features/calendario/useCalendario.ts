import { useQuery } from '@tanstack/react-query';
import { api } from '../../lib/api';
import type { Reserva } from '../reservas/useReservas';

export function useCalendario(ano: number, mes: number, ranchoId?: string) {
  return useQuery({
    queryKey: ['calendario', ano, mes, ranchoId ?? 'todos'],
    queryFn: async () => {
      const params: Record<string, string> = { ano: String(ano), mes: String(mes) };
      if (ranchoId) params.ranchoId = ranchoId;
      return (await api.get<Reserva[]>('/calendario', { params })).data;
    },
  });
}
