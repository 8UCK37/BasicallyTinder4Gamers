-- CreateTable
CREATE TABLE "UserGameStats" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "userId" TEXT,
    "csgoStats" JSONB,

    CONSTRAINT "UserGameStats_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "UserGameStats_userId_key" ON "UserGameStats"("userId");

-- AddForeignKey
ALTER TABLE "UserGameStats" ADD CONSTRAINT "UserGameStats_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
