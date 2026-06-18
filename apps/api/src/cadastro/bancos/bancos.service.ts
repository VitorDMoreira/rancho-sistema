import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class BancosService {
  constructor(private prisma: PrismaService) {}

  async listar() {
    return this.prisma.db.contaBancaria.findMany({
      where: { ativo: true },
      orderBy: { nome: 'asc' },
    });
  }

  async criar(data: {
    nome: string;
    banco: string;
    agencia?: string;
    conta?: string;
    tipo: string;
  }) {
    return this.prisma.db.contaBancaria.create({ data });
  }

  async atualizar(id: string, data: {
    nome?: string;
    banco?: string;
    agencia?: string;
    conta?: string;
    tipo?: string;
  }) {
    return this.prisma.db.contaBancaria.update({ where: { id }, data });
  }

  async remover(id: string) {
    return this.prisma.db.contaBancaria.update({
      where: { id },
      data: { ativo: false },
    });
  }

  async listarComSaldo() {
    const contas = await this.prisma.db.contaBancaria.findMany({
      where: { ativo: true },
      orderBy: { nome: 'asc' },
    });

    const resultado = await Promise.all(contas.map(async (conta) => {
      const [recebido, pago, transfEntrada, transfSaida] = await Promise.all([
        this.prisma.db.contaReceber.aggregate({
          where: { contaBancariaId: conta.id, status: 'RECEBIDO' },
          _sum: { valor: true },
        }),
        this.prisma.db.contaPagar.aggregate({
          where: { contaBancariaId: conta.id, status: 'PAGO' },
          _sum: { valor: true },
        }),
        this.prisma.db.transferencia.aggregate({
          where: { contaDestinoId: conta.id },
          _sum: { valor: true },
        }),
        this.prisma.db.transferencia.aggregate({
          where: { contaOrigemId: conta.id },
          _sum: { valor: true },
        }),
      ]);

      const saldo =
        Number(conta.saldoInicial) +
        Number(recebido._sum.valor ?? 0) -
        Number(pago._sum.valor ?? 0) +
        Number(transfEntrada._sum.valor ?? 0) -
        Number(transfSaida._sum.valor ?? 0);

      return { ...conta, saldo };
    }));

    return resultado;
  }
}
