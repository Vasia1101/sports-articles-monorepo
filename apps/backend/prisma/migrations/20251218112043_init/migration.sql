-- CreateTable
CREATE TABLE "SportsArticle" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "deletedAt" TIMESTAMP(3),
    "imageUrl" TEXT,

    CONSTRAINT "SportsArticle_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "SportsArticle_deletedAt_idx" ON "SportsArticle"("deletedAt");
