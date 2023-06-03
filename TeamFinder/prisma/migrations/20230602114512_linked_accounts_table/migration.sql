-- CreateTable
CREATE TABLE "LinkedAccounts" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "Discord" JSONB,
    "userId" TEXT,

    CONSTRAINT "LinkedAccounts_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "LinkedAccounts" ADD CONSTRAINT "LinkedAccounts_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
