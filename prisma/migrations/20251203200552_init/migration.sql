-- CreateTable
CREATE TABLE "Carpark" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "lat" REAL NOT NULL,
    "lng" REAL NOT NULL,
    "type" TEXT NOT NULL,
    "motorcycleAllowed" BOOLEAN NOT NULL,
    "carAllowed" BOOLEAN NOT NULL,
    "totalMotoLots" INTEGER,
    "covered" BOOLEAN,
    "seasonOnly" BOOLEAN,
    "pricingNotes" TEXT,
    "openingHours" TEXT,
    "entranceNotes" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "Photo" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "carparkId" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "caption" TEXT,
    "takenAt" DATETIME,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Photo_carparkId_fkey" FOREIGN KEY ("carparkId") REFERENCES "Carpark" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
