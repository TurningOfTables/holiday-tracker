import Database from 'better-sqlite3';
import bcrypt from 'bcrypt'
const saltRounds = 10;

const db_path = './data/holidays.db';

const db = new Database(db_path);

export function getHolidays() {
	const sql = `SELECT * FROM holidays`;
	const stmnt = db.prepare(sql);
	const rows = stmnt.all();
	return rows;
}

export function addHoliday(from, to) {
	const sql = `INSERT INTO holidays ('from', 'to') VALUES ($from, $to)`;
	const stmnt = db.prepare(sql);
	stmnt.run({ from, to });
}

export function deleteHoliday(id) {
	const sql = `DELETE FROM holidays WHERE id = $id`;
	const stmnt = db.prepare(sql);
	stmnt.run({ id });
}

export function getAllowance() {
	const sql = `SELECT allowance_days FROM config`;
	const stmnt = db.prepare(sql);
	const res = stmnt.get();
	return res?.allowance_days ?? 0;
}

export function changeAllowance(newAllowance) {
	const deleteSql = `DELETE FROM config`;
	const deleteStmnt = db.prepare(deleteSql);
	deleteStmnt.run();

	const insertSql = `INSERT INTO config (allowance_days) VALUES ($newAllowance)`;
	const insertStmnt = db.prepare(insertSql);
	insertStmnt.run({ newAllowance });
}

export function getExcludedDays() {
	const sql = `SELECT * FROM excluded_days`;
	const stmnt = db.prepare(sql);
	const rows = stmnt.all();
	return rows;
}

export function createUser(username, password) {
	const hash = bcrypt.hashSync(password, saltRounds)
	const sql = `INSERT INTO users (username, password) VALUES ($username, $hash)`
	const stmnt = db.prepare(sql)
	stmnt.run({username, hash})
}

export function authenticateUser(username, password) {
	const sql = `SELECT * from users WHERE username=$username`
	const stmnt = db.prepare(sql)
	const res = stmnt.get({ username })
	
	if (!res) {
		return false
	}

	if (bcrypt.compareSync(password, res.password)) {
		return res
	}
	return false
}

export function setUserSession(auth, uuid) {
	const username = auth.username
	const sql = `UPDATE users SET session = $uuid WHERE username=$username`
	const stmnt = db.prepare(sql)
	stmnt.run({ uuid, username })
}

export function getUserBySession(uuid) {
	const sql = `SELECT * from users WHERE session = $uuid`
	const stmnt = db.prepare(sql)
	const res = stmnt.get({ uuid })
	if (!res) {
		return false
	}

	return res
}

export function clearUserSession(uuid) {
	const sql = `UPDATE users SET session = null WHERE session = $uuid`
	const stmnt = db.prepare(sql)
	stmnt.run({ uuid })
}