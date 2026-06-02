-- CreateTable
CREATE TABLE "requirements" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "requirementNo" INTEGER NOT NULL,
    "createdAt" DATETIME NOT NULL,
    "requirementName" TEXT NOT NULL,
    "requirementType" TEXT NOT NULL,
    "requirementBelong" TEXT NOT NULL,
    "priority" TEXT NOT NULL,
    "currentStatus" TEXT NOT NULL,
    "currentOwner" TEXT,
    "relatedProject" TEXT,
    "createdBy" TEXT NOT NULL,
    "relatedCustomer" TEXT,
    "isFinished" BOOLEAN NOT NULL DEFAULT false,
    "totalDurationValue" INTEGER,
    "totalDurationIsManual" BOOLEAN NOT NULL DEFAULT false,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "requirement_stages" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "requirementId" INTEGER NOT NULL,
    "stageName" TEXT NOT NULL,
    "stageOrder" INTEGER NOT NULL,
    "stageReached" BOOLEAN NOT NULL DEFAULT false,
    "ownerName" TEXT,
    "startTime" DATETIME,
    "endTime" DATETIME,
    "relatedCustomer" TEXT,
    "outputProductRequirement" TEXT,
    "outputSolution" TEXT,
    "planCompleted" TEXT,
    "deliveryCompleted" TEXT,
    "feedbackStatus" TEXT,
    "feedbackContent" TEXT,
    "includeNextProduct" TEXT,
    "targetProduct" TEXT,
    "durationValue" INTEGER,
    "durationIsManual" BOOLEAN NOT NULL DEFAULT false,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "requirement_stages_requirementId_fkey" FOREIGN KEY ("requirementId") REFERENCES "requirements" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "field_options" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "fieldName" TEXT NOT NULL,
    "optionValue" TEXT NOT NULL,
    "optionLabel" TEXT NOT NULL,
    "optionGroup" TEXT,
    "optionOrder" INTEGER NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "requirements_requirementNo_key" ON "requirements"("requirementNo");

-- CreateIndex
CREATE UNIQUE INDEX "requirement_stages_requirementId_stageName_key" ON "requirement_stages"("requirementId", "stageName");
