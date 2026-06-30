/*
  Warnings:

  - Made the column `categoriaId` on table `Movimiento` required. This step will fail if there are existing NULL values in that column.
  - Made the column `cuentaId` on table `Movimiento` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "Movimiento" DROP CONSTRAINT "Movimiento_categoriaId_fkey";

-- DropForeignKey
ALTER TABLE "Movimiento" DROP CONSTRAINT "Movimiento_cuentaId_fkey";

-- AlterTable
ALTER TABLE "Movimiento" ALTER COLUMN "categoriaId" SET NOT NULL,
ALTER COLUMN "cuentaId" SET NOT NULL;

-- AddForeignKey
ALTER TABLE "Movimiento" ADD CONSTRAINT "Movimiento_categoriaId_fkey" FOREIGN KEY ("categoriaId") REFERENCES "Categoria"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Movimiento" ADD CONSTRAINT "Movimiento_cuentaId_fkey" FOREIGN KEY ("cuentaId") REFERENCES "Cuenta"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
