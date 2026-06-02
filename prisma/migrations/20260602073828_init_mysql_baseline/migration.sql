-- CreateTable
CREATE TABLE `requirements` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `requirementNo` INTEGER NOT NULL,
    `createdAt` DATETIME(3) NOT NULL,
    `requirementName` TEXT NOT NULL,
    `requirementType` ENUM('PRODUCT_PLANNING', 'PRODUCT_ITERATION', 'CUSTOMER_CUSTOMIZATION', 'DATA_AND_OPERATION') NOT NULL,
    `requirementBelong` ENUM('TWO_POINT_ZERO', 'THREE_POINT_ZERO', 'SMALL_POT') NOT NULL,
    `priority` ENUM('VERY_HIGH', 'HIGH', 'MEDIUM') NOT NULL,
    `currentStatus` ENUM('DEMAND_CREATED', 'PRODUCT_INTAKE', 'IMPLEMENTATION_DELIVERY', 'CLOSED') NOT NULL,
    `currentOwner` VARCHAR(191) NULL,
    `relatedProject` VARCHAR(255) NULL,
    `createdBy` VARCHAR(191) NOT NULL,
    `relatedCustomer` VARCHAR(255) NULL,
    `isFinished` BOOLEAN NOT NULL DEFAULT false,
    `totalDurationValue` INTEGER NULL,
    `totalDurationIsManual` BOOLEAN NOT NULL DEFAULT false,
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `requirements_requirementNo_key`(`requirementNo`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `requirement_stages` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `requirementId` INTEGER NOT NULL,
    `stageName` ENUM('DEMAND_CREATED', 'PRODUCT_INTAKE', 'IMPLEMENTATION_DELIVERY') NOT NULL,
    `stageOrder` INTEGER NOT NULL,
    `stageReached` BOOLEAN NOT NULL DEFAULT false,
    `ownerName` VARCHAR(191) NULL,
    `startTime` DATETIME(3) NULL,
    `endTime` DATETIME(3) NULL,
    `relatedCustomer` VARCHAR(255) NULL,
    `blockingReason` TEXT NULL,
    `outputProductRequirement` ENUM('YES', 'NO') NULL,
    `outputSolution` ENUM('YES', 'NO') NULL,
    `planCompleted` ENUM('YES', 'NO') NULL,
    `deliveryCompleted` ENUM('YES', 'NO') NULL,
    `feedbackStatus` ENUM('FEEDBACK_RECEIVED', 'FEEDBACK_PENDING') NULL,
    `feedbackContent` TEXT NULL,
    `includeNextProduct` ENUM('YES', 'NO') NULL,
    `targetProduct` VARCHAR(255) NULL,
    `durationValue` INTEGER NULL,
    `durationIsManual` BOOLEAN NOT NULL DEFAULT false,
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `requirement_stages_requirementId_stageName_key`(`requirementId`, `stageName`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `field_options` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `fieldName` VARCHAR(191) NOT NULL,
    `optionValue` VARCHAR(191) NOT NULL,
    `optionLabel` VARCHAR(255) NOT NULL,
    `optionGroup` VARCHAR(191) NULL,
    `optionOrder` INTEGER NOT NULL,
    `isActive` BOOLEAN NOT NULL DEFAULT true,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `requirement_stages` ADD CONSTRAINT `requirement_stages_requirementId_fkey` FOREIGN KEY (`requirementId`) REFERENCES `requirements`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
