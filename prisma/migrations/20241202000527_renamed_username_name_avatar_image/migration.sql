-- Start migration
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;

-- Create a new "User" table with the updated structure
CREATE TABLE "new_User" (
                          "id" TEXT NOT NULL PRIMARY KEY,
                          "name" TEXT NOT NULL,             -- Renaming 'username' to 'name'
                          "email" TEXT NOT NULL,
                          "image" TEXT,                     -- Renaming 'avatar' to 'image'
                          "password" TEXT NOT NULL,
                          "emailVerified" DATETIME
);

-- Insert data from the old "User" table into the new table
INSERT INTO "new_User" ("id", "name", "email", "image", "password", "emailVerified")
SELECT "id", "username" AS "name", "email", "avatar" AS "image", "password", "emailVerified" FROM "User";

-- Drop the old "User" table
DROP TABLE "User";

-- Rename the new table to "User"
ALTER TABLE "new_User" RENAME TO "User";

-- Add a unique index on the "email" column to maintain uniqueness constraint
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- Re-enable foreign keys
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
