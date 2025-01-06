-- CreateTable
CREATE TABLE `RicatGateway` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `node_id` INTEGER NOT NULL,
    `latitude` DOUBLE NOT NULL,
    `longitude` DOUBLE NOT NULL,
    `rssi` INTEGER NOT NULL,
    `snr` DOUBLE NOT NULL,
    `receivedAt` DATETIME(3) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `RicatNodeDebug` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `node_id` INTEGER NOT NULL,
    `before_wifi_ntp_millis` INTEGER NOT NULL,
    `after_wifi_ntp_millis` INTEGER NOT NULL,
    `before_gps_setup_epoch` DATETIME(3) NOT NULL,
    `data_gps_ready_epoch` DATETIME(3) NOT NULL,
    `before_send_epoch` DATETIME(3) NOT NULL,
    `after_send_epoch` DATETIME(3) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `NandoNode` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `node_id` INTEGER NOT NULL,
    `gateway_id` INTEGER NOT NULL,
    `temperature` DOUBLE NOT NULL,
    `humidity` DOUBLE NOT NULL,
    `lux` DOUBLE NOT NULL,
    `tips` INTEGER NOT NULL,
    `raw` LONGBLOB NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
