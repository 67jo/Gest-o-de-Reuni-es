/*
  Warnings:

  - Added the required column `status` to the `Meeting` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `meeting` ADD COLUMN `status` ENUM('PENDENTE', 'DECORRENDO', 'TERMINADA', 'CANCELADA') NOT NULL;
