-- CreateTable
CREATE TABLE "LearningTrack" (
    "id" SERIAL NOT NULL,
    "slug" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "nameEn" TEXT,
    "description" TEXT NOT NULL,
    "descriptionEn" TEXT,
    "icon" TEXT,
    "level" TEXT,
    "displayOrder" INTEGER NOT NULL DEFAULT 0,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "LearningTrack_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "LearningStage" (
    "id" SERIAL NOT NULL,
    "trackId" INTEGER NOT NULL,
    "slug" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "titleEn" TEXT,
    "description" TEXT NOT NULL,
    "descriptionEn" TEXT,
    "level" TEXT NOT NULL,
    "displayOrder" INTEGER NOT NULL,
    "isOptional" BOOLEAN NOT NULL DEFAULT false,
    "prerequisiteStageIds" INTEGER[],
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "LearningStage_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BookStageMapping" (
    "id" SERIAL NOT NULL,
    "bookId" INTEGER NOT NULL,
    "stageId" INTEGER NOT NULL,
    "recommendationPriority" INTEGER NOT NULL DEFAULT 0,
    "recommendationReason" TEXT,
    "recommendationReasonEn" TEXT,
    "minimumLevel" TEXT,
    "maximumLevel" TEXT,
    "isPrimary" BOOLEAN NOT NULL DEFAULT true,
    "alternativeBookIds" INTEGER[],
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "BookStageMapping_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BookBundle" (
    "id" SERIAL NOT NULL,
    "slug" TEXT NOT NULL,
    "trackId" INTEGER,
    "title" TEXT NOT NULL,
    "titleEn" TEXT,
    "description" TEXT NOT NULL,
    "descriptionEn" TEXT,
    "level" TEXT NOT NULL,
    "discountType" TEXT NOT NULL,
    "discountValue" DECIMAL(12,0) NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "displayOrder" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "BookBundle_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BookBundleItem" (
    "id" SERIAL NOT NULL,
    "bundleId" INTEGER NOT NULL,
    "bookId" INTEGER NOT NULL,
    "isRequired" BOOLEAN NOT NULL DEFAULT true,
    "displayOrder" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "BookBundleItem_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CustomerRoadmapProgress" (
    "id" SERIAL NOT NULL,
    "customerId" INTEGER NOT NULL,
    "trackId" INTEGER NOT NULL,
    "currentStageId" INTEGER,
    "completedStageIds" INTEGER[],
    "ownedBookIds" INTEGER[],
    "assessmentData" JSONB,
    "recommendedLevel" TEXT,
    "lastAccessedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CustomerRoadmapProgress_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "LearningTrack_slug_key" ON "LearningTrack"("slug");

-- CreateIndex
CREATE INDEX "LearningTrack_slug_idx" ON "LearningTrack"("slug");

-- CreateIndex
CREATE INDEX "LearningTrack_displayOrder_idx" ON "LearningTrack"("displayOrder");

-- CreateIndex
CREATE INDEX "LearningStage_trackId_idx" ON "LearningStage"("trackId");

-- CreateIndex
CREATE INDEX "LearningStage_displayOrder_idx" ON "LearningStage"("displayOrder");

-- CreateIndex
CREATE UNIQUE INDEX "LearningStage_trackId_slug_key" ON "LearningStage"("trackId", "slug");

-- CreateIndex
CREATE INDEX "BookStageMapping_stageId_recommendationPriority_idx" ON "BookStageMapping"("stageId", "recommendationPriority");

-- CreateIndex
CREATE UNIQUE INDEX "BookStageMapping_bookId_stageId_key" ON "BookStageMapping"("bookId", "stageId");

-- CreateIndex
CREATE UNIQUE INDEX "BookBundle_slug_key" ON "BookBundle"("slug");

-- CreateIndex
CREATE INDEX "BookBundle_trackId_idx" ON "BookBundle"("trackId");

-- CreateIndex
CREATE INDEX "BookBundle_slug_idx" ON "BookBundle"("slug");

-- CreateIndex
CREATE INDEX "BookBundle_level_idx" ON "BookBundle"("level");

-- CreateIndex
CREATE INDEX "BookBundleItem_bundleId_idx" ON "BookBundleItem"("bundleId");

-- CreateIndex
CREATE UNIQUE INDEX "BookBundleItem_bundleId_bookId_key" ON "BookBundleItem"("bundleId", "bookId");

-- CreateIndex
CREATE INDEX "CustomerRoadmapProgress_customerId_idx" ON "CustomerRoadmapProgress"("customerId");

-- CreateIndex
CREATE UNIQUE INDEX "CustomerRoadmapProgress_customerId_trackId_key" ON "CustomerRoadmapProgress"("customerId", "trackId");

-- AddForeignKey
ALTER TABLE "LearningStage" ADD CONSTRAINT "LearningStage_trackId_fkey" FOREIGN KEY ("trackId") REFERENCES "LearningTrack"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BookStageMapping" ADD CONSTRAINT "BookStageMapping_bookId_fkey" FOREIGN KEY ("bookId") REFERENCES "Book"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BookStageMapping" ADD CONSTRAINT "BookStageMapping_stageId_fkey" FOREIGN KEY ("stageId") REFERENCES "LearningStage"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BookBundle" ADD CONSTRAINT "BookBundle_trackId_fkey" FOREIGN KEY ("trackId") REFERENCES "LearningTrack"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BookBundleItem" ADD CONSTRAINT "BookBundleItem_bundleId_fkey" FOREIGN KEY ("bundleId") REFERENCES "BookBundle"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BookBundleItem" ADD CONSTRAINT "BookBundleItem_bookId_fkey" FOREIGN KEY ("bookId") REFERENCES "Book"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CustomerRoadmapProgress" ADD CONSTRAINT "CustomerRoadmapProgress_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "Customer"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CustomerRoadmapProgress" ADD CONSTRAINT "CustomerRoadmapProgress_trackId_fkey" FOREIGN KEY ("trackId") REFERENCES "LearningTrack"("id") ON DELETE CASCADE ON UPDATE CASCADE;
