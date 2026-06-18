-- CreateEnum
CREATE TYPE "PerfilUsuario" AS ENUM ('ADMIN', 'FINANCEIRO', 'ATENDENTE');

-- CreateEnum
CREATE TYPE "EstadoCivil" AS ENUM ('SOLTEIRO', 'CASADO', 'DIVORCIADO', 'VIUVO', 'UNIAO_ESTAVEL');

-- CreateEnum
CREATE TYPE "StatusRancho" AS ENUM ('DISPONIVEL', 'RESERVADO', 'MANUTENCAO', 'BLOQUEADO');

-- CreateEnum
CREATE TYPE "StatusReserva" AS ENUM ('ORCAMENTO', 'AGUARDANDO_SINAL', 'CONFIRMADA', 'EM_ANDAMENTO', 'FINALIZADA', 'CANCELADA');

-- CreateEnum
CREATE TYPE "FormaPagamento" AS ENUM ('DINHEIRO', 'PIX', 'CARTAO_CREDITO', 'CARTAO_DEBITO', 'TRANSFERENCIA', 'BOLETO');

-- CreateEnum
CREATE TYPE "StatusContrato" AS ENUM ('RASCUNHO', 'GERADO', 'ASSINADO', 'CANCELADO');

-- CreateEnum
CREATE TYPE "TipoReceber" AS ENUM ('SINAL', 'PARCELA', 'PAGAMENTO_FINAL', 'CAUCAO', 'OUTRO');

-- CreateEnum
CREATE TYPE "StatusReceber" AS ENUM ('EM_ABERTO', 'RECEBIDO', 'ATRASADO', 'CANCELADO');

-- CreateEnum
CREATE TYPE "StatusPagar" AS ENUM ('EM_ABERTO', 'PAGO', 'ATRASADO');

-- CreateEnum
CREATE TYPE "TipoBloqueio" AS ENUM ('MANUTENCAO', 'BLOQUEADO');

-- CreateEnum
CREATE TYPE "TipoChecklist" AS ENUM ('ENTRADA', 'SAIDA');

-- CreateTable
CREATE TABLE "usuarios" (
    "id" TEXT NOT NULL,
    "nome" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "senha_hash" TEXT NOT NULL,
    "perfil" "PerfilUsuario" NOT NULL DEFAULT 'ATENDENTE',
    "ativo" BOOLEAN NOT NULL DEFAULT true,
    "ultimo_acesso" TIMESTAMP(3),
    "criado_em" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "atualizado_em" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "usuarios_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "audit_logs" (
    "id" TEXT NOT NULL,
    "usuario_id" TEXT,
    "acao" TEXT NOT NULL,
    "entidade" TEXT NOT NULL,
    "entidade_id" TEXT,
    "dados" JSONB,
    "criado_em" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "audit_logs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "clientes" (
    "id" TEXT NOT NULL,
    "nome_completo" TEXT NOT NULL,
    "cpf" TEXT NOT NULL,
    "rg" TEXT,
    "data_nascimento" DATE,
    "estado_civil" "EstadoCivil",
    "telefone" TEXT,
    "whatsapp" TEXT,
    "email" TEXT,
    "cep" TEXT,
    "rua" TEXT,
    "numero" TEXT,
    "bairro" TEXT,
    "cidade" TEXT,
    "estado" TEXT,
    "observacoes" TEXT,
    "criado_em" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "atualizado_em" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "clientes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ranchos" (
    "id" TEXT NOT NULL,
    "nome" TEXT NOT NULL,
    "codigo_interno" TEXT NOT NULL,
    "endereco" TEXT,
    "cidade" TEXT,
    "estado" TEXT,
    "capacidade_maxima" INTEGER NOT NULL,
    "qtd_quartos" INTEGER NOT NULL DEFAULT 0,
    "qtd_banheiros" INTEGER NOT NULL DEFAULT 0,
    "valor_diaria" DECIMAL(10,2) NOT NULL,
    "valor_fim_semana" DECIMAL(10,2),
    "valor_feriado" DECIMAL(10,2),
    "status" "StatusRancho" NOT NULL DEFAULT 'DISPONIVEL',
    "observacoes" TEXT,
    "criado_em" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "atualizado_em" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ranchos_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "rancho_fotos" (
    "id" TEXT NOT NULL,
    "rancho_id" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "ordem" INTEGER NOT NULL DEFAULT 0,
    "descricao" TEXT,

    CONSTRAINT "rancho_fotos_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "bloqueios" (
    "id" TEXT NOT NULL,
    "rancho_id" TEXT NOT NULL,
    "data_inicio" DATE NOT NULL,
    "data_fim" DATE NOT NULL,
    "tipo" "TipoBloqueio" NOT NULL,
    "motivo" TEXT,
    "criado_em" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "bloqueios_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "reservas" (
    "id" TEXT NOT NULL,
    "cliente_id" TEXT NOT NULL,
    "rancho_id" TEXT NOT NULL,
    "data_entrada" DATE NOT NULL,
    "data_saida" DATE NOT NULL,
    "qtd_hospedes" INTEGER NOT NULL,
    "num_diarias" INTEGER NOT NULL,
    "valor_negociado" DECIMAL(10,2) NOT NULL,
    "valor_total" DECIMAL(10,2) NOT NULL,
    "sinal_recebido" DECIMAL(10,2) NOT NULL DEFAULT 0,
    "caucao_valor" DECIMAL(10,2),
    "caucao_devolvida" BOOLEAN NOT NULL DEFAULT false,
    "forma_pagamento" "FormaPagamento",
    "status" "StatusReserva" NOT NULL DEFAULT 'ORCAMENTO',
    "observacoes" TEXT,
    "criado_em" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "atualizado_em" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "reservas_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "contratos" (
    "id" TEXT NOT NULL,
    "reserva_id" TEXT NOT NULL,
    "numero" TEXT NOT NULL,
    "pdf_url" TEXT,
    "status" "StatusContrato" NOT NULL DEFAULT 'RASCUNHO',
    "assinado_em" TIMESTAMP(3),
    "provider_id" TEXT,
    "criado_em" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "contratos_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "contas_receber" (
    "id" TEXT NOT NULL,
    "reserva_id" TEXT,
    "cliente_id" TEXT NOT NULL,
    "descricao" TEXT NOT NULL,
    "tipo" "TipoReceber" NOT NULL DEFAULT 'PARCELA',
    "valor" DECIMAL(10,2) NOT NULL,
    "vencimento" DATE NOT NULL,
    "data_pagamento" DATE,
    "forma_pagamento" "FormaPagamento",
    "status" "StatusReceber" NOT NULL DEFAULT 'EM_ABERTO',
    "criado_em" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "atualizado_em" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "contas_receber_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "categorias_despesa" (
    "id" TEXT NOT NULL,
    "nome" TEXT NOT NULL,
    "ativo" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "categorias_despesa_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "fornecedores" (
    "id" TEXT NOT NULL,
    "nome" TEXT NOT NULL,
    "documento" TEXT,
    "contato" TEXT,
    "observacoes" TEXT,

    CONSTRAINT "fornecedores_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "contas_pagar" (
    "id" TEXT NOT NULL,
    "fornecedor_id" TEXT,
    "categoria_id" TEXT NOT NULL,
    "rancho_id" TEXT,
    "descricao" TEXT NOT NULL,
    "valor" DECIMAL(10,2) NOT NULL,
    "vencimento" DATE NOT NULL,
    "data_pagamento" DATE,
    "status" "StatusPagar" NOT NULL DEFAULT 'EM_ABERTO',
    "observacoes" TEXT,
    "criado_em" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "atualizado_em" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "contas_pagar_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "checklists" (
    "id" TEXT NOT NULL,
    "reserva_id" TEXT NOT NULL,
    "tipo" "TipoChecklist" NOT NULL,
    "itens" JSONB NOT NULL,
    "realizado_por" TEXT,
    "realizado_em" TIMESTAMP(3),
    "observacoes" TEXT,
    "criado_em" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "checklists_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "usuarios_email_key" ON "usuarios"("email");

-- CreateIndex
CREATE INDEX "audit_logs_entidade_entidade_id_idx" ON "audit_logs"("entidade", "entidade_id");

-- CreateIndex
CREATE UNIQUE INDEX "clientes_cpf_key" ON "clientes"("cpf");

-- CreateIndex
CREATE UNIQUE INDEX "ranchos_codigo_interno_key" ON "ranchos"("codigo_interno");

-- CreateIndex
CREATE INDEX "reservas_rancho_id_data_entrada_data_saida_idx" ON "reservas"("rancho_id", "data_entrada", "data_saida");

-- CreateIndex
CREATE INDEX "reservas_status_idx" ON "reservas"("status");

-- CreateIndex
CREATE UNIQUE INDEX "contratos_reserva_id_key" ON "contratos"("reserva_id");

-- CreateIndex
CREATE UNIQUE INDEX "contratos_numero_key" ON "contratos"("numero");

-- CreateIndex
CREATE INDEX "contas_receber_status_vencimento_idx" ON "contas_receber"("status", "vencimento");

-- CreateIndex
CREATE UNIQUE INDEX "categorias_despesa_nome_key" ON "categorias_despesa"("nome");

-- CreateIndex
CREATE INDEX "contas_pagar_status_vencimento_idx" ON "contas_pagar"("status", "vencimento");

-- AddForeignKey
ALTER TABLE "audit_logs" ADD CONSTRAINT "audit_logs_usuario_id_fkey" FOREIGN KEY ("usuario_id") REFERENCES "usuarios"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "rancho_fotos" ADD CONSTRAINT "rancho_fotos_rancho_id_fkey" FOREIGN KEY ("rancho_id") REFERENCES "ranchos"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "bloqueios" ADD CONSTRAINT "bloqueios_rancho_id_fkey" FOREIGN KEY ("rancho_id") REFERENCES "ranchos"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "reservas" ADD CONSTRAINT "reservas_cliente_id_fkey" FOREIGN KEY ("cliente_id") REFERENCES "clientes"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "reservas" ADD CONSTRAINT "reservas_rancho_id_fkey" FOREIGN KEY ("rancho_id") REFERENCES "ranchos"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "contratos" ADD CONSTRAINT "contratos_reserva_id_fkey" FOREIGN KEY ("reserva_id") REFERENCES "reservas"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "contas_receber" ADD CONSTRAINT "contas_receber_reserva_id_fkey" FOREIGN KEY ("reserva_id") REFERENCES "reservas"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "contas_receber" ADD CONSTRAINT "contas_receber_cliente_id_fkey" FOREIGN KEY ("cliente_id") REFERENCES "clientes"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "contas_pagar" ADD CONSTRAINT "contas_pagar_fornecedor_id_fkey" FOREIGN KEY ("fornecedor_id") REFERENCES "fornecedores"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "contas_pagar" ADD CONSTRAINT "contas_pagar_categoria_id_fkey" FOREIGN KEY ("categoria_id") REFERENCES "categorias_despesa"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "contas_pagar" ADD CONSTRAINT "contas_pagar_rancho_id_fkey" FOREIGN KEY ("rancho_id") REFERENCES "ranchos"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "checklists" ADD CONSTRAINT "checklists_reserva_id_fkey" FOREIGN KEY ("reserva_id") REFERENCES "reservas"("id") ON DELETE CASCADE ON UPDATE CASCADE;
