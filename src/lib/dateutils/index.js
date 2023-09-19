import dayjs from 'dayjs';
import dayjsBusinessDays from 'dayjs-business-days'

dayjs.extend(dayjsBusinessDays)

export function businessDaysInclusive(from, to) {
    let days = dayjs(to).businessDiff(dayjs(from))
    if (dayjs(to).isBusinessDay()) {
        days += 1
    }
    return days
}

export function totalHolidayDays(holidays) {
    let totalDays = 0
    for (const holiday of holidays) {
        totalDays += businessDaysInclusive(holiday.from, holiday.to)
    }
    return totalDays
}