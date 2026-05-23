-- CreateTable
CREATE TABLE "AircraftMovement" (
    "id" TEXT NOT NULL,
    "logDate" TIMESTAMP(3) NOT NULL,
    "registration" TEXT NOT NULL,
    "aircraftType" TEXT NOT NULL,
    "amcOfficer" TEXT NOT NULL,
    "entryDate" TIMESTAMP(3) NOT NULL,
    "entryTime" TEXT NOT NULL,
    "exitDate" TIMESTAMP(3) NOT NULL,
    "exitTime" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AircraftMovement_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "AircraftMovement_registration_idx" ON "AircraftMovement"("registration");

-- CreateIndex
CREATE INDEX "AircraftMovement_aircraftType_idx" ON "AircraftMovement"("aircraftType");

-- CreateIndex
CREATE INDEX "AircraftMovement_amcOfficer_idx" ON "AircraftMovement"("amcOfficer");

-- CreateIndex
CREATE INDEX "AircraftMovement_logDate_idx" ON "AircraftMovement"("logDate");
