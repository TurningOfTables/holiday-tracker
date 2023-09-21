import Database from 'better-sqlite3';
import bcrypt from 'bcrypt'
import { v4 as uuidv4 } from 'uuid';
const saltRounds = 10;

const db_path = './data/holidays.db';

const db = new Database(db_path);

export function getHolidays(userid) {
	const sql = `SELECT * FROM holidays WHERE userid = $userid`;
	const stmnt = db.prepare(sql);
	const rows = stmnt.all({ userid });
	return rows;
}

export function addHoliday(userid, from, to) {
	const sql = `INSERT INTO holidays ('userid', 'from', 'to') VALUES ($userid, $from, $to)`;
	const stmnt = db.prepare(sql);
	stmnt.run({ userid, from, to });
}

export function deleteHoliday(userid, id) {
	const sql = `DELETE FROM holidays WHERE id = $id AND userid = $userid`;
	const stmnt = db.prepare(sql);
	stmnt.run({ userid, id });
}

export function getAllowance(userid) {
	const sql = `SELECT allowance_days FROM config WHERE userid = $userid`;
	const stmnt = db.prepare(sql);
	const res = stmnt.get({ userid });
	return res?.allowance_days ?? 0;
}

export function changeAllowance(userid, newAllowance) {
	const deleteSql = `DELETE FROM config WHERE userid= $userid`;
	const deleteStmnt = db.prepare(deleteSql);
	deleteStmnt.run({ userid });

	const insertSql = `INSERT INTO config (userid, allowance_days) VALUES ($userid, $newAllowance)`;
	const insertStmnt = db.prepare(insertSql);
	insertStmnt.run({ userid, newAllowance });
}

export function getExcludedDays(userid) {
	const sql = `SELECT * FROM excluded_days WHERE userid = $userid`;
	const stmnt = db.prepare(sql);
	const rows = stmnt.all({ userid });
	return rows;
}

export function addExcludedDays(userid, from, to) {
	const sql = `INSERT INTO excluded_days ('userid', 'from', 'to') VALUES ($userid, $from, $to)`;
	const stmnt = db.prepare(sql);
	stmnt.run({ userid, from, to });
}

export function deleteExcludedDays(userid, id) {
	const sql = `DELETE FROM excluded_days WHERE id = $id AND userid = $userid`
	const stmnt = db.prepare(sql)
	stmnt.run({ userid, id })
}

export function createUser(username, password) {
	const hash = bcrypt.hashSync(password, saltRounds)
	const userid = uuidv4()
	const sql = `INSERT INTO users (userid, username, password) VALUES ($userid, $username, $hash)`
	const stmnt = db.prepare(sql)
	stmnt.run({ userid, username, hash })
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

export function getUserByUsername(username) {
	const sql = `SELECT * from users WHERE username = $username`
	const stmnt = db.prepare(sql)
	const res = stmnt.get({ username })
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