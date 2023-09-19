import pkg from 'sqlite3';
const sqlite3 = pkg.verbose();
const db = new sqlite3.Database('./data/holidays.db');

db.serialize(() => {
	db.run(
		`CREATE TABLE "config" ( "id" INTEGER, "allowance_days" INTEGER, PRIMARY KEY("id" AUTOINCREMENT) )`
	);
	db.run(`CREATE TABLE holidays (id INTEGER PRIMARY KEY AUTOINCREMENT, 'from' DATE, 'to' DATE)`);
	db.run(
		`CREATE TABLE excluded_days (id INTEGER PRIMARY KEY AUTOINCREMENT, 'from' DATE, 'to' DATE)`
	);
});

db.close();
