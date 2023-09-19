import Database from 'better-sqlite3';

const db_path = "./data/holidays.db"


const db = new Database(db_path, { verbose: console.log });

export function getHolidays() {
    const sql = `SELECT * FROM holidays`;
    const stmnt = db.prepare(sql);
    const rows = stmnt.all();
    return rows;
}

export function addHoliday(from, to) {
    const sql = `INSERT INTO holidays ('from', 'to') VALUES ($from, $to)`
    const stmnt = db.prepare(sql)
    stmnt.run({ from, to })
}

export function deleteHoliday(id) {
    const sql = `DELETE FROM holidays WHERE id = $id`
    const stmnt = db.prepare(sql)
    stmnt.run({ id })
}

export function getAllowance() {
    const sql = `SELECT allowance_days FROM config`
    const stmnt = db.prepare(sql)
    const res = stmnt.get()
    return res.allowance_days
}

export function changeAllowance(newAllowance) {
    if (newAllowance.match(numberRegex) === null) {
        throw new Error('Allowance must contain only numbers')
    }

    if (newAllowance <= 0) {
        throw new Error('Allowance must be more than zero')
    }

    const deleteSql = `DELETE FROM config`
    const deleteStmnt = db.prepare(deleteSql)
    deleteStmnt.run()

    const insertSql = `INSERT INTO config (allowance_days) VALUES($newAllowance)`
    const insertStmnt = db.prepare(insertSql)
    insertStmnt.run({ newAllowance })
}

export function getExcludedDays() {
    const sql = `SELECT * FROM excluded_days`
    const stmnt = db.prepare(sql)
    const rows = stmnt.all()
    return rows
}