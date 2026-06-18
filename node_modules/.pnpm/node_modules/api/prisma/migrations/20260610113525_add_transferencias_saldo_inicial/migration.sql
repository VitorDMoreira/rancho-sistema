-- AlterTable
ALTER TABLE "contas_bancarias" ADD COLUMN     "saldo_inicial" DECIMAL(10,2) NOT NULL DEFAULT 0;

-- CreateTable
CREATE TABLE "transferencias" (
    "id" TEXT NOT NULL,
    "conta_origem_id" TEXT NOT NULL,
    "conta_destino_id" TEXT NOT NULL,
    "valor" DECIMAL(10,2) NOT NULL,
    "data" DATE NOT NULL,
    "observacoes" TEXT,
    "criado_em" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "transferencias_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "transferencias" ADD CONSTRAINT "transferencias_conta_origem_id_fkey" FOREIGN KEY ("conta_origem_id") REFERENCES "contas_bancarias"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "transferencias" ADD CONSTRAINT "transferencias_conta_destino_id_fkey" FOREIGN KEY ("conta_destino_id") REFERENCES "contas_bancarias"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
