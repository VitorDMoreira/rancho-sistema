import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class ContasReceberService {
  constructor(private prisma: PrismaService) {}

  async listar(status?: string) {
    return this.prisma.db.contaReceber.findMany({
      where: status ? { status: status as any } : undefined,
      include: {
        cliente: { select: { nomeCompleto: true } },
        reserva: { select: { dataEntrada: true, dataSaida: true, rancho: { select: { nome: true } } } },
        contaBancaria: { select: { id: true, nome: true, banco: true } },
      },
      orderBy: { vencimento: 'asc' },
    });
  }

  async criar(data: {
    reservaId?: string;
    clienteId: string;
    descricao: string;
    tipo: string;
    valor: number;
    vencimento: string;
    formaPagamento?: string;
  }) {
    return this.prisma.db.contaReceber.create({
      data: {
        reservaId: data.reservaId || null,
        clienteId: data.clienteId,
        descricao: data.descricao,
        tipo: data.tipo as any,
        valor: data.valor,
        vencimento: new Date(data.vencimento + 'T12:00:00'),
        formaPagamento: data.formaPagamento as any || null,
        status: 'EM_ABERTO',
      },
    });
  }

  async marcarPago(id: string, body: {
    dataPagamento: string;
    formaPagamento?: string;
    contaBancariaId?: string;
    desconto?: number;
    multa?: number;
    juros?: number;
    nRecibo?: string;
    observacoesPagamento?: string;
  }) {
    return this.prisma.db.contaReceber.update({
      where: { id },
      data: {
        status: 'RECEBIDO',
        dataPagamento: new Date(body.dataPagamento + 'T12:00:00'),
        formaPagamento: body.formaPagamento as any || undefined,
        contaBancariaId: body.contaBancariaId || null,
        desconto: body.desconto ?? 0,
        multa: body.multa ?? 0,
        juros: body.juros ?? 0,
        nRecibo: body.nRecibo || null,
        observacoesPagamento: body.observacoesPagamento || null,
      },
    });
  }

  async remover(id: string) {
    return this.prisma.db.contaReceber.delete({ where: { id } });
  }

  async resumo() {
    const [emAberto, recebido] = await Promise.all([
      this.prisma.db.contaReceber.aggregate({
        where: { status: { in: ['EM_ABERTO', 'ATRASADO'] } },
        _sum: { valor: true },
        _count: true,
      }),
      this.prisma.db.contaReceber.aggregate({
        where: { status: 'RECEBIDO' },
        _sum: { valor: true },
        _count: true,
      }),
    ]);
    return {
      totalEmAberto: Number(emAberto._sum.valor ?? 0),
      qtdEmAberto: emAberto._count,
      totalRecebido: Number(recebido._sum.valor ?? 0),
      qtdRecebido: recebido._count,
    };
  }
}
