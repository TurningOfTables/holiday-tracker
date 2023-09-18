import Database from 'better-sqlite3';
import dayjs from 'dayjs';
const db_path = "./data/holidays.db"

const db = new Database(db_path, { verbose: console.log });

export function getHolidays() {
    const sql = `SELECT * FROM holidays`;
    const stmnt = db.prepare(sql);
    const rows = stmnt.all();
    return rows;
}

export function addHoliday(from, to, allowanceDays) {
    const fromObj = dayjs(from)
    const toObj = dayjs(to)
    const currentYear = dayjs().year()
    const holidayDuration = toObj.diff(from, 'day', false)
    console.log(holidayDuration + " duration")

    if (from === to) {
        throw new Error('Holiday start and end date are the same')
    }

    if (fromObj.isAfter(toObj)) {
        throw new Error('Holiday end date is before start date')
    }

    if (fromObj.get('year') != currentYear || toObj.get('year') != currentYear) {
        throw new Error('Holiday can only be booked for the current year')
    }

    const holidays = getHolidays();
    let totalDays = 0
    for (const holiday of holidays) {
        totalDays += dayjs(holiday.to).diff(dayjs(holiday.from), 'day', false) + 1
    }

    if (totalDays + holidayDuration > allowanceDays) {
        throw new Error('Holiday cannot exceed remaining allowance')
    }


    const sql = `INSERT INTO holidays ('from', 'to') VALUES ($from, $to)`
    const stmnt = db.prepare(sql)
    stmnt.run({ from, to })
}

export function deleteHoliday(id) {
    const sql = `DELETE FROM holidays WHERE id = $id`
    const stmnt = db.prepare(sql)
    stmnt.run({ id })
}