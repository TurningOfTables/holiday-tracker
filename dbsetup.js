import Database from 'better-sqlite3'
import fs from 'fs'

const dbDir = "./data"
const dbPath = dbDir + "/holidays.db"

if (!fs.existsSync(dbDir)) {
	fs.mkdirSync(dbDir)
}

const db = new Database(dbPath);

db.exec(`CREATE TABLE config ( 'id' INTEGER, 'allowance_days' INTEGER, 'userid' TEXT );
	CREATE TABLE holidays ('id' INTEGER PRIMARY KEY AUTOINCREMENT, 'userid' TEXT, 'start_date' DATE, 'end_date' DATE);
	CREATE TABLE excluded_days ('id' INTEGER PRIMARY KEY AUTOINCREMENT, 'userid' TEXT, 'start_date' DATE, 'end_date' DATE);
	CREATE TABLE users ( 'id' INTEGER PRIMARY KEY AUTOINCREMENT, 'userid' TEXT, 'username' TEXT, 'password' TEXT, 'session' TEXT )`)

db.close();
