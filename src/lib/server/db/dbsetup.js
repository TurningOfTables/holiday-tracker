import Database from 'better-sqlite3'
import fs from 'fs'

const dbDir = "./data"
const dbProdPath = dbDir + "/holidays.db"
const dbTestPath = dbDir + "/test.db"
const createSchema = "src/lib/server/db/holidays.db.sql"
const clearHolidays = "src/lib/server/db/clearHolidays.db.sql"

if (!fs.existsSync(dbDir)) {
	console.log(`Creating directory ${dbDir}`)
	fs.mkdirSync(dbDir)
} else {
	console.log(`Directory ${dbDir} already exists`)
}

if (process.env.DB_MODE === "prod") {
	console.log("Creating prod db")
	createDb(dbProdPath)
} else {
	console.log("Creating test db")
	createDb(dbTestPath)
}

export function createDb(path) {
	const db = new Database(path);
	const migration = fs.readFileSync(createSchema, 'utf8')
	db.exec(migration)
	db.close();
}

export function clearDb(path) {
	const db = new Database(path)
	const migration = fs.readFileSync(clearHolidays, 'utf8')
	db.exec(migration)
	db.close();
}
