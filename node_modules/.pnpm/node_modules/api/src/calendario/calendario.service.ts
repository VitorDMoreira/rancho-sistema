import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class CalendarioService {
  constructor(private readonly prisma: PrismaService) {}

  async listarReservasDoMes(ano: number, mes: number, ranchoId?: string) {
    // Primeiro dia e último dia do mês
    const inicio = new Date(ano, mes - 1, 1);
    const fim = new Date(ano, mes, 0, 23, 59, 59);

    const reservas = await this.prisma.db.reserva.findMany({
      where: {
        status: { not: 'CANCELADA' },
        ...(ranchoId ? { ranchoId } : {}),
        AND: [
          { dataEntrada: { lte: fim } },
          { dataSaida: { gte: inicio } },
        ],
      },
      include: {
        cliente: { select: { nomeCompleto: true, telefone: true } },
        rancho: { select: { nome: true, codigoInterno: true } },
      },
      orderBy: { dataEntrada: 'asc' },
    });

    return reservas;
  }
}
