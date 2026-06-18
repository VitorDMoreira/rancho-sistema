import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class MovimentosService {
  constructor(private prisma: PrismaService) {}

  async listar(filtros: {
    contaBancariaId?: string;
    dataIni?: string;
    dataFim?: string;
    busca?: string;
  }) {
    const dataIni = filtros.dataIni ? new Date(filtros.dataIni + 'T00:00:00') : undefined;
    const dataFim = filtros.dataFim ? new Date(filtros.dataFim + 'T23:59:59') : undefined;
    const busca = filtros.busca?.trim().toLowerCase();

    const [recebimentos, pagamentos, transferencias] = await Promise.all([
      this.prisma.db.contaReceber.findMany({
        where: {
          status: 'RECEBIDO',
          contaBancariaId: filtros.contaBancariaId || undefined,
          dataPagamento: (dataIni || dataFim) ? { gte: dataIni, lte: dataFim } : undefined,
        },
        include: {
          cliente: { select: { nomeCompleto: true } },
          contaBancaria: { select: { id: true, nome: true } },
        },
      }),
      this.prisma.db.contaPagar.findMany({
        where: {
          status: 'PAGO',
          contaBancariaId: filtros.contaBancariaId || undefined,
          dataPagamento: (dataIni || dataFim) ? { gte: dataIni, lte: dataFim } : undefined,
        },
        include: {
          fornecedor: { select: { nome: true } },
          categoria: { select: { nome: true } },
          contaBancaria: { select: { id: true, nome: true } },
        },
      }),
      this.prisma.db.transferencia.findMany({
        where: {
          data: (dataIni || dataFim) ? { gte: dataIni, lte: dataFim } : undefined,
          OR: filtros.contaBancariaId
            ? [{ contaOrigemId: filtros.contaBancariaId }, { contaDestinoId: filtros.contaBancariaId }]
            : undefined,
        },
        include: {
          contaOrigem: { select: { id: true, nome: true } },
          contaDestino: { select: { id: true, nome: true } },
        },
      }),
    ]);

    let movimentos = [
      ...recebimentos.map(r => ({
        id: `receber-${r.id}`,
        data: r.dataPagamento!,
        tipo: 'ENTRADA' as const,
        descricao: r.descricao,
        contraparte: r.cliente?.nomeCompleto ?? '',
        planoConta: 'Receita',
        contaBancariaId: r.contaBancaria?.id ?? '',
        contaBancariaNome: r.contaBancaria?.nome ?? '',
        valor: Number(r.valor),
      })),
      ...pagamentos.map(p => ({
        id: `pagar-${p.id}`,
        data: p.dataPagamento!,
        tipo: 'SAIDA' as const,
        descricao: p.descricao,
        contraparte: p.fornecedor?.nome ?? '',
        planoConta: p.categoria?.nome ?? '',
        contaBancariaId: p.contaBancaria?.id ?? '',
        contaBancariaNome: p.contaBancaria?.nome ?? '',
        valor: Number(p.valor),
      })),
      ...transferencias.flatMap(t => {
        const linhas: any[] = [];
        if (!filtros.contaBancariaId || t.contaOrigemId === filtros.contaBancariaId) {
          linhas.push({
            id: `transf-saida-${t.id}`,
            data: t.data,
            tipo: 'SAIDA' as const,
            descricao: `Transferência para ${t.contaDestino.nome}`,
            contraparte: t.contaDestino.nome,
            planoConta: 'Transferência',
            contaBancariaId: t.contaOrigem.id,
            contaBancariaNome: t.contaOrigem.nome,
            valor: Number(t.valor),
          });
        }
        if (!filtros.contaBancariaId || t.contaDestinoId === filtros.contaBancariaId) {
          linhas.push({
            id: `transf-entrada-${t.id}`,
            data: t.data,
            tipo: 'ENTRADA' as const,
            descricao: `Transferência de ${t.contaOrigem.nome}`,
            contraparte: t.contaOrigem.nome,
            planoConta: 'Transferência',
            contaBancariaId: t.contaDestino.id,
            contaBancariaNome: t.contaDestino.nome,
            valor: Number(t.valor),
          });
        }
        return linhas;
      }),
    ];

    if (busca) {
      movimentos = movimentos.filter(m =>
        m.descricao?.toLowerCase().includes(busca) ||
        m.contraparte?.toLowerCase().includes(busca) ||
        m.planoConta?.toLowerCase().includes(busca)
      );
    }

    movimentos.sort((a, b) => new Date(b.data).getTime() - new Date(a.data).getTime());

    return movimentos;
  }
}
