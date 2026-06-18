import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

interface FiltroBase {
  dataIni?: string;
  dataFim?: string;
  ranchoId?: string;
  categoriaId?: string;
  fornecedorId?: string;
  clienteId?: string;
  status?: string;
}

function parseData(d?: string) {
  return d ? new Date(d + 'T12:00:00') : undefined;
}

@Injectable()
export class RelatoriosService {
  constructor(private prisma: PrismaService) {}

  async contasPagar(f: FiltroBase) {
    const where: any = {};
    if (f.ranchoId) where.ranchoId = f.ranchoId;
    if (f.categoriaId) where.categoriaId = f.categoriaId;
    if (f.fornecedorId) where.fornecedorId = f.fornecedorId;
    if (f.status) where.status = f.status;
    if (f.dataIni || f.dataFim) {
      where.vencimento = {};
      if (f.dataIni) where.vencimento.gte = parseData(f.dataIni);
      if (f.dataFim) where.vencimento.lte = parseData(f.dataFim);
    }
    const lista = await this.prisma.db.contaPagar.findMany({
      where,
      include: { categoria: { select: { nome: true } }, fornecedor: { select: { nome: true } }, rancho: { select: { nome: true } } },
      orderBy: { vencimento: 'asc' },
    });
    const total = lista.reduce((s, c) => s + Number(c.valor), 0);
    return { lista, total, qtd: lista.length };
  }

  async contasReceber(f: FiltroBase) {
    const where: any = {};
    if (f.clienteId) where.clienteId = f.clienteId;
    if (f.status) where.status = f.status;
    if (f.dataIni || f.dataFim) {
      where.vencimento = {};
      if (f.dataIni) where.vencimento.gte = parseData(f.dataIni);
      if (f.dataFim) where.vencimento.lte = parseData(f.dataFim);
    }
    let lista = await this.prisma.db.contaReceber.findMany({
      where,
      include: { cliente: { select: { nomeCompleto: true } }, reserva: { select: { ranchoId: true, rancho: { select: { nome: true } } } } },
      orderBy: { vencimento: 'asc' },
    });
    if (f.ranchoId) lista = lista.filter((c) => c.reserva?.ranchoId === f.ranchoId);
    const total = lista.reduce((s, c) => s + Number(c.valor), 0);
    return { lista, total, qtd: lista.length };
  }

  async locacoes(f: FiltroBase) {
    const where: any = {};
    if (f.ranchoId) where.ranchoId = f.ranchoId;
    if (f.clienteId) where.clienteId = f.clienteId;
    if (f.status) where.status = f.status;
    if (f.dataIni || f.dataFim) {
      where.dataEntrada = {};
      if (f.dataIni) where.dataEntrada.gte = parseData(f.dataIni);
      if (f.dataFim) where.dataEntrada.lte = parseData(f.dataFim);
    }
    const lista = await this.prisma.db.reserva.findMany({
      where,
      include: { cliente: { select: { nomeCompleto: true } }, rancho: { select: { nome: true } } },
      orderBy: { dataEntrada: 'asc' },
    });
    const totalValor = lista.reduce((s, r) => s + Number(r.valorTotal), 0);
    const totalDiarias = lista.reduce((s, r) => s + r.numDiarias, 0);
    return { lista, total: totalValor, qtd: lista.length, totalDiarias };
  }

  async fluxoCaixaPorCentroCusto(f: FiltroBase) {
    // gastos agrupados por centro de custo (categoria), filtrável por período
    const where: any = {};
    if (f.categoriaId) where.categoriaId = f.categoriaId;
    if (f.ranchoId) where.ranchoId = f.ranchoId;
    if (f.dataIni || f.dataFim) {
      where.vencimento = {};
      if (f.dataIni) where.vencimento.gte = parseData(f.dataIni);
      if (f.dataFim) where.vencimento.lte = parseData(f.dataFim);
    }
    const lista = await this.prisma.db.contaPagar.findMany({
      where,
      include: { categoria: { select: { nome: true } } },
    });
    const grupos: Record<string, { nome: string; total: number; qtd: number }> = {};
    for (const c of lista) {
      const nome = c.categoria?.nome ?? 'Outros';
      if (!grupos[nome]) grupos[nome] = { nome, total: 0, qtd: 0 };
      grupos[nome].total += Number(c.valor);
      grupos[nome].qtd += 1;
    }
    const grupo = Object.values(grupos).sort((a, b) => b.total - a.total);
    const total = grupo.reduce((s, g) => s + g.total, 0);
    return { grupo, total };
  }
}
