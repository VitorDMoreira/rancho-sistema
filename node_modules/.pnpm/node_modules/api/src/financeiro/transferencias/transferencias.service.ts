import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class TransferenciasService {
  constructor(private prisma: PrismaService) {}

  async listar() {
    return this.prisma.db.transferencia.findMany({
      include: {
        contaOrigem: { select: { nome: true } },
        contaDestino: { select: { nome: true } },
      },
      orderBy: { data: 'desc' },
    });
  }

  async criar(data: {
    contaOrigemId: string;
    contaDestinoId: string;
    valor: number;
    data: string;
    observacoes?: string;
  }) {
    return this.prisma.db.transferencia.create({
      data: {
        contaOrigemId: data.contaOrigemId,
        contaDestinoId: data.contaDestinoId,
        valor: data.valor,
        data: new Date(data.data + 'T12:00:00'),
        observacoes: data.observacoes || null,
      },
    });
  }

  async remover(id: string) {
    return this.prisma.db.transferencia.delete({ where: { id } });
  }
}
