-- CreateTable
CREATE TABLE "turtle" (
    "label" TEXT NOT NULL PRIMARY KEY
);

-- CreateTable
CREATE TABLE "inventory" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "turtleLabel" TEXT NOT NULL,
    CONSTRAINT "inventory_turtleLabel_fkey" FOREIGN KEY ("turtleLabel") REFERENCES "turtle" ("label") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "slot" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "inventoryId" INTEGER NOT NULL,
    CONSTRAINT "slot_inventoryId_fkey" FOREIGN KEY ("inventoryId") REFERENCES "inventory" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "turtle_label_key" ON "turtle"("label");
