/*
  Warnings:

  - Made the column `date` on table `meet` required. This step will fail if there are existing NULL values in that column.
  - Made the column `title` on table `meet` required. This step will fail if there are existing NULL values in that column.
  - Made the column `email` on table `user` required. This step will fail if there are existing NULL values in that column.
  - Made the column `password` on table `user` required. This step will fail if there are existing NULL values in that column.
  - Made the column `username` on table `user` required. This step will fail if there are existing NULL values in that column.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_meet" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "title" TEXT NOT NULL,
    "date" TEXT NOT NULL,
    "description" TEXT
);
INSERT INTO "new_meet" ("date", "description", "id", "title") SELECT "date", "description", "id", "title" FROM "meet";
DROP TABLE "meet";
ALTER TABLE "new_meet" RENAME TO "meet";
Pragma writable_schema=1;
CREATE UNIQUE INDEX "sqlite_autoindex_meet_1" ON "meet"("id");
Pragma writable_schema=0;
CREATE TABLE "new_user" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "email" TEXT NOT NULL,
    "emailVerified" DATETIME,
    "username" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "role" TEXT
);
INSERT INTO "new_user" ("email", "emailVerified", "id", "password", "role", "username") SELECT "email", "emailVerified", "id", "password", "role", "username" FROM "user";
DROP TABLE "user";
ALTER TABLE "new_user" RENAME TO "user";
Pragma writable_schema=1;
CREATE UNIQUE INDEX "sqlite_autoindex_user_1" ON "user"("id");
Pragma writable_schema=0;
CREATE UNIQUE INDEX "user_email_key" ON "user"("email");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
