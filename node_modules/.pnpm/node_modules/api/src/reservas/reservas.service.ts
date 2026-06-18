import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateReservaDto } from './dto/create-reserva.dto';

@Injectable()
export class ReservasService {
  constructor(private prisma: PrismaService) {}

  private calcularDiarias(entrada: Date, saida: Date): number {
    const ms = saida.getTime() - entrada.getTime();
    const dias = Math.ceil(ms / (1000 * 60 * 60 * 24));
    if (dias < 1) throw new BadRequestException('Data de saída deve ser após a entrada');
    return dias;
  }

  private async verificarDisponibilidade(ranchoId: string, entrada: Date, saida: Date, ignorarId?: string) {
    const conflito = await this.prisma.db.reserva.findFirst({
      where: {
        ranchoId,
        id: ignorarId ? { not: ignorarId } : undefined,
        status: { in: ['CONFIRMADA', 'EM_ANDAMENTO', 'AGUARDANDO_SINAL'] },
        dataEntrada: { lt: saida },
        dataSaida: { gt: entrada },
      },
    });
    if (conflito) throw new BadRequestException('Já existe reserva nesse período para este rancho');
  }

  async listar() {
    return this.prisma.db.reserva.findMany({
      include: {
        cliente: { select: { nomeCompleto: true } },
        rancho: { select: { nome: true, codigoInterno: true } },
      },
      orderBy: { dataEntrada: 'asc' },
    });
  }

  async buscarPorId(id: string) {
    return this.prisma.db.reserva.findUniqueOrThrow({
      where: { id },
      include: { cliente: true, rancho: true },
    });
  }

  async criar(dto: CreateReservaDto) {
    const entrada = new Date(dto.dataEntrada);
    const saida = new Date(dto.dataSaida);
    const diarias = this.calcularDiarias(entrada, saida);
    await this.verificarDisponibilidade(dto.ranchoId, entrada, saida);

    const valorTotal = Number(dto.valorNegociado) * diarias;
    const sinal = Number(dto.sinalRecebido ?? 0);

    return this.prisma.db.reserva.create({
      data: {
        clienteId: dto.clienteId,
        ranchoId: dto.ranchoId,
        dataEntrada: entrada,
        dataSaida: saida,
        qtdHospedes: Number(dto.qtdHospedes),
        numDiarias: diarias,
        valorNegociado: dto.valorNegociado,
        valorTotal,
        sinalRecebido: sinal,
        formaPagamento: dto.formaPagamento as any,
        observacoes: dto.observacoes,
        status: sinal > 0 ? 'AGUARDANDO_SINAL' : 'ORCAMENTO',
      },
      include: {
        cliente: { select: { nomeCompleto: true } },
        rancho: { select: { nome: true } },
      },
    });
  }

  async atualizar(id: string, dto: Partial<CreateReservaDto>) {
    const entrada = new Date(dto.dataEntrada!);
    const saida = new Date(dto.dataSaida!);
    const diarias = this.calcularDiarias(entrada, saida);
    await this.verificarDisponibilidade(dto.ranchoId!, entrada, saida, id);

    const valorTotal = Number(dto.valorNegociado) * diarias;
    const sinal = Number(dto.sinalRecebido ?? 0);

    return this.prisma.db.reserva.update({
      where: { id },
      data: {
        clienteId: dto.clienteId,
        ranchoId: dto.ranchoId,
        dataEntrada: entrada,
        dataSaida: saida,
        qtdHospedes: Number(dto.qtdHospedes),
        numDiarias: diarias,
        valorNegociado: dto.valorNegociado,
        valorTotal,
        sinalRecebido: sinal,
        formaPagamento: dto.formaPagamento as any,
        observacoes: dto.observacoes,
      },
      include: {
        cliente: { select: { nomeCompleto: true } },
        rancho: { select: { nome: true } },
      },
    });
  }

  async atualizarStatus(id: string, status: string) {
    return this.prisma.db.reserva.update({
      where: { id },
      data: { status: status as any },
    });
  }

  // Confirma a reserva e gera parcelas automaticamente no Contas a Receber
  async confirmar(id: string, parcelas: { valor: number; vencimento: string; tipo: string }[]) {
    const reserva = await this.prisma.db.reserva.findUniqueOrThrow({
      where: { id },
      include: { rancho: { select: { nome: true } } },
    });

    // Remove lançamentos antigos desta reserva para não duplicar
    await this.prisma.db.contaReceber.deleteMany({ where: { reservaId: id } });

    // Cria cada parcela no Contas a Receber
    const total = parcelas.length; // total de lançamentos (entrada + parcelas)
    await this.prisma.db.contaReceber.createMany({
      data: parcelas.map((p, i) => {
        const numero = i + 1; // 1-based
        const descricao = p.tipo === 'SINAL'
          ? `Entrada (1/${total})`
          : `Parcela ${numero}/${total}`;
        return {
          reservaId: id,
          clienteId: reserva.clienteId,
          descricao,
          tipo: p.tipo as any,
          valor: p.valor,
          vencimento: new Date(p.vencimento + 'T12:00:00'),
          status: 'EM_ABERTO' as any,
        };
      }),
    });

    // Atualiza status da reserva para CONFIRMADA
    return this.prisma.db.reserva.update({
      where: { id },
      data: { status: 'CONFIRMADA' },
      include: {
        cliente: { select: { nomeCompleto: true } },
        rancho: { select: { nome: true } },
      },
    });
  }

  async remover(id: string) {
    // Remove parcelas vinculadas antes de deletar
    await this.prisma.db.contaReceber.deleteMany({ where: { reservaId: id } });
    return this.prisma.db.reserva.delete({ where: { id } });
  }
}
