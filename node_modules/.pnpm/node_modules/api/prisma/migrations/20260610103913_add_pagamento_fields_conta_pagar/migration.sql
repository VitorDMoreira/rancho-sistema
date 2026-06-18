-- AlterTable
ALTER TABLE "contas_pagar" ADD COLUMN     "conta_bancaria_id" TEXT,
ADD COLUMN     "desconto" DECIMAL(10,2) DEFAULT 0,
ADD COLUMN     "forma_pagamento" "FormaPagamento",
ADD COLUMN     "juros" DECIMAL(10,2) DEFAULT 0,
ADD COLUMN     "multa" DECIMAL(10,2) DEFAULT 0,
ADD COLUMN     "n_recibo" TEXT,
ADD COLUMN     "observacoes_pagamento" TEXT;

-- AddForeignKey
ALTER TABLE "contas_pagar" ADD CONSTRAINT "contas_pagar_conta_bancaria_id_fkey" FOREIGN KEY ("conta_bancaria_id") REFERENCES "contas_bancarias"("id") ON DELETE SET NULL ON UPDATE CASCADE;
