-- CreateEnum
CREATE TYPE "AparienciaTema" AS ENUM ('CLARO', 'OSCURO', 'SISTEMA');

-- CreateEnum
CREATE TYPE "AparienciaColorPrincipal" AS ENUM ('TEAL', 'SKY', 'INDIGO', 'EMERALD');

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "colorPrincipal" "AparienciaColorPrincipal" NOT NULL DEFAULT 'TEAL',
ADD COLUMN     "temaPreferido" "AparienciaTema" NOT NULL DEFAULT 'CLARO';
