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