/*
  Warnings:

  - A unique constraint covering the columns `[title,userId]` on the table `Todo` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateEnum
CREATE TYPE "Role" AS ENUM ('USER', 'ADMIN');

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "role" "Role" NOT NULL DEFAULT 'USER';

-- CreateIndex
CREATE UNIQUE INDEX "Todo_title_userId_key" ON "Todo"("title", "userId");
