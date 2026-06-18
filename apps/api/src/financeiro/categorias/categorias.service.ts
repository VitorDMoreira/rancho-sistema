import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class CategoriasService {
  constructor(private prisma: PrismaService) {}

  async listar() {
    return this.prisma.db.categoriaDespesa.findMany({
      where: { ativo: true },
      orderBy: { nome: 'asc' },
    });
  }

  async criar(nome: string, observacoes?: string) {
    return this.prisma.db.categoriaDespesa.create({ data: { nome, observacoes: observacoes || null } });
  }

  async atualizar(id: string, data: { nome?: string; observacoes?: string }) {
    return this.prisma.db.categoriaDespesa.update({
      where: { id },
      data: { nome: data.nome, observacoes: data.observacoes || null },
    });
  }

  async remover(id: string) {
    // Não apaga de verdade (pode ter despesas vinculadas), apenas desativa
    return this.prisma.db.categoriaDespesa.update({
      where: { id },
      data: { ativo: false },
    });
  }
}
