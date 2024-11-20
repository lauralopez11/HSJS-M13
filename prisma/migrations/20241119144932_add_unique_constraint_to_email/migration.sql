-- CreateTable
CREATE TABLE "meet" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "title" TEXT,
    "date" TEXT,
    "description" TEXT
);

-- CreateTable
CREATE TABLE "meeting" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "user_id" INTEGER NOT NULL,
    "meet_id" INTEGER NOT NULL,
    CONSTRAINT "meeting_meet_id_fkey" FOREIGN KEY ("meet_id") REFERENCES "meet" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION,
    CONSTRAINT "meeting_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION
);

-- CreateTable
CREATE TABLE "user" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "username" TEXT,
    "email" TEXT,
    "password" TEXT,
    "role" TEXT
);

-- CreateIndex
Pragma writable_schema=1;
CREATE UNIQUE INDEX "sqlite_autoindex_meet_1" ON "meet"("id");
Pragma writable_schema=0;

-- CreateIndex
Pragma writable_schema=1;
CREATE UNIQUE INDEX "sqlite_autoindex_meeting_1" ON "meeting"("id");
Pragma writable_schema=0;

-- CreateIndex
CREATE INDEX "idx_meeting_meet_id" ON "meeting"("meet_id");

-- CreateIndex
CREATE INDEX "idx_meeting_user_id" ON "meeting"("user_id");

-- CreateIndex
Pragma writable_schema=1;
CREATE UNIQUE INDEX "sqlite_autoindex_user_1" ON "user"("id");
Pragma writable_schema=0;

-- CreateIndex
CREATE UNIQUE INDEX "user_username_key" ON "user"("username");
