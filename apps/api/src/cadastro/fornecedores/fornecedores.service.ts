import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class FornecedoresService {
  constructor(private prisma: PrismaService) {}

  async listar() {
    return this.prisma.db.fornecedor.findMany({
      orderBy: { nome: 'asc' },
    });
  }

  async criar(data: {
    nome: string;
    documento?: string;
    contato?: string;
    observacoes?: string;
  }) {
    return this.prisma.db.fornecedor.create({ data });
  }

  async atualizar(id: string, data: {
    nome?: string;
    documento?: string;
    contato?: string;
    observacoes?: string;
  }) {
    return this.prisma.db.fornecedor.update({ where: { id }, data });
  }

  async remover(id: string) {
    return this.prisma.db.fornecedor.delete({ where: { id } });
  }
}
