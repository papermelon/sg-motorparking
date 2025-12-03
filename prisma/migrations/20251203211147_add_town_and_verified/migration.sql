-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Carpark" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "town" TEXT,
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
    "verified" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);
INSERT INTO "new_Carpark" ("address", "carAllowed", "covered", "createdAt", "entranceNotes", "id", "lat", "lng", "motorcycleAllowed", "name", "openingHours", "pricingNotes", "seasonOnly", "totalMotoLots", "type", "updatedAt") SELECT "address", "carAllowed", "covered", "createdAt", "entranceNotes", "id", "lat", "lng", "motorcycleAllowed", "name", "openingHours", "pricingNotes", "seasonOnly", "totalMotoLots", "type", "updatedAt" FROM "Carpark";
DROP TABLE "Carpark";
ALTER TABLE "new_Carpark" RENAME TO "Carpark";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
