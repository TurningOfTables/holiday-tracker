BEGIN TRANSACTION;
CREATE TABLE IF NOT EXISTS "config" (
	"id"	INTEGER,
	"allowance_days"	INTEGER,
	"userid"	TEXT
);
CREATE TABLE IF NOT EXISTS "holidays" (
	"id"	INTEGER,
	"userid"	TEXT,
	"start_date"	DATE,
	"end_date"	DATE,
	PRIMARY KEY("id" AUTOINCREMENT)
);
CREATE TABLE IF NOT EXISTS "excluded_days" (
	"id"	INTEGER,
	"userid"	TEXT,
	"start_date"	DATE,
	"end_date"	DATE,
	PRIMARY KEY("id" AUTOINCREMENT)
);
CREATE TABLE IF NOT EXISTS "users" (
	"id"	INTEGER,
	"userid"	TEXT,
	"username"	TEXT,
	"password"	TEXT,
	"session"	TEXT,
	PRIMARY KEY("id" AUTOINCREMENT)
);
COMMIT;