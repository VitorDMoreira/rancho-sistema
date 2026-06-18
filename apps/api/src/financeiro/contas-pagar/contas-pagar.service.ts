import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class ContasPagarService {
  constructor(private prisma: PrismaService) {}

  async listar(status?: string) {
    return this.prisma.db.contaPagar.findMany({
      where: status ? { status: status as any } : undefined,
      include: {
        categoria: { select: { nome: true } },
        rancho: { select: { nome: true, codigoInterno: true } },
        fornecedor: { select: { nome: true } },
        contaBancaria: { select: { id: true, nome: true, banco: true } },
      },
      orderBy: { vencimento: 'asc' },
    });
  }

  async criar(data: {
    categoriaId: string;
    fornecedorId?: string;
    ranchoId?: string;
    descricao?: string;
    numeroNota?: string;
    dataEmissao?: string;
    valor: number;
    vencimento: string;
    observacoes?: string;
  }) {
    let descricao = data.descricao?.trim();
    if (!descricao) {
      const categoria = await this.prisma.db.categoriaDespesa.findUnique({ where: { id: data.categoriaId } });
      descricao = categoria?.nome ?? 'Despesa';
    }

    return this.prisma.db.contaPagar.create({
      data: {
        categoriaId: data.categoriaId,
        fornecedorId: data.fornecedorId || null,
        ranchoId: data.ranchoId || null,
        descricao,
        numeroNota: data.numeroNota || null,
        dataEmissao: data.dataEmissao ? new Date(data.dataEmissao + 'T12:00:00') : null,
        valor: data.valor,
        vencimento: new Date(data.vencimento + 'T12:00:00'),
        observacoes: data.observacoes || null,
        status: 'EM_ABERTO',
      },
      include: {
        categoria: { select: { nome: true } },
        rancho: { select: { nome: true } },
        fornecedor: { select: { nome: true } },
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
    return this.prisma.db.contaPagar.update({
      where: { id },
      data: {
        status: 'PAGO',
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
    return this.prisma.db.contaPagar.delete({ where: { id } });
  }

  async resumo() {
    const [emAberto, pago] = await Promise.all([
      this.prisma.db.contaPagar.aggregate({
        where: { status: { in: ['EM_ABERTO', 'ATRASADO'] } },
        _sum: { valor: true },
        _count: true,
      }),
      this.prisma.db.contaPagar.aggregate({
        where: { status: 'PAGO' },
        _sum: { valor: true },
        _count: true,
      }),
    ]);
    return {
      totalEmAberto: Number(emAberto._sum.valor ?? 0),
      qtdEmAberto: emAberto._count,
      totalPago: Number(pago._sum.valor ?? 0),
      qtdPago: pago._count,
    };
  }
}
