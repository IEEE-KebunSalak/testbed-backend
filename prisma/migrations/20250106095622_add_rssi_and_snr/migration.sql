/*
  Warnings:

  - Added the required column `rssi` to the `NandoNode` table without a default value. This is not possible if the table is not empty.
  - Added the required column `snr` to the `NandoNode` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `nandonode` ADD COLUMN `rssi` INTEGER NOT NULL,
    ADD COLUMN `snr` DOUBLE NOT NULL;
