/*
  Warnings:

  - Added the required column `beforeAPIHit` to the `RicatGateway` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `ricatgateway` ADD COLUMN `beforeAPIHit` DATETIME(3) NOT NULL;
