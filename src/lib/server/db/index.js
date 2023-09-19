import Database from 'better-sqlite3';
import dayjs from 'dayjs';
import { totalHolidayDays, dateRangesIntersect } from '../../dateutils';
const db_path = "./data/holidays.db"
const numberRegex = /^[0-9]+$/

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
    const holidays = getHolidays();
    const totalDays = totalHolidayDays(holidays)
    const excludedDays = getExcludedDays()

    if (fromObj.isAfter(toObj)) {
        throw new Error('Holiday end date is before start date')
    }

    if (fromObj.get('year') != currentYear || toObj.get('year') != currentYear) {
        throw new Error('Holiday can only be booked for the current year')
    }

    if (totalDays + holidayDuration > allowanceDays) {
        throw new Error('Holiday cannot exceed remaining allowance')
    }

    for (const excluded of excludedDays) {
        if (dateRangesIntersect({from: from, to: to}, excluded)) {
            throw new Error('Holiday cannot overlap excluded dates')
        }
    }

    for (const holiday of holidays) {
        if (dateRangesIntersect({from: from, to: to}, holiday)) {
            throw new Error('Holiday cannot overlap a previous booking')
        }
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