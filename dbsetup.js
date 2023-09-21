import pkg from 'sqlite3';
const sqlite3 = pkg.verbose();
const db = new sqlite3.Database('./data/holidays.db');

db.serialize(() => {
	db.run(`CREATE TABLE config ( 'id' INTEGER, 'allowance_days' INTEGER, 'userid' TEXT )`);
	db.run(`CREATE TABLE holidays ('id' INTEGER PRIMARY KEY AUTOINCREMENT, 'userid' TEXT, 'from' DATE, 'to' DATE)`);
	db.run(`CREATE TABLE excluded_days ('id' INTEGER PRIMARY KEY AUTOINCREMENT, 'userid' TEXT, 'from' DATE, 'to' DATE)`);
	db.run(`CREATE TABLE users ( 'id' INTEGER PRIMARY KEY AUTOINCREMENT, 'userid' TEXT, 'username' TEXT, 'password' TEXT, 'session' TEXT )`)
});

db.close();
