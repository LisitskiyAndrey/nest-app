-- AlterTable: add passwordHash with temporary default for existing rows, then drop the default
ALTER TABLE "User" ADD COLUMN "passwordHash" TEXT NOT NULL DEFAULT '';
ALTER TABLE "User" ALTER COLUMN "passwordHash" DROP DEFAULT;
