-- CreateTable
CREATE TABLE "contas_bancarias" (
    "id" TEXT NOT NULL,
    "nome" TEXT NOT NULL,
    "banco" TEXT NOT NULL,
    "agencia" TEXT,
    "conta" TEXT,
    "tipo" TEXT NOT NULL DEFAULT 'CORRENTE',
    "ativo" BOOLEAN NOT NULL DEFAULT true,
    "criado_em" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "contas_bancarias_pkey" PRIMARY KEY ("id")
);
