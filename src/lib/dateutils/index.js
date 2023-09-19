import { dayjs } from 'svelte-time';
import dayjsBusinessDays from 'dayjs-business-days';

dayjs.extend(dayjsBusinessDays);

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

export function dateRangesIntersect(range1, range2) {
    const resultRange1 = []
    const resultRange2 = []

    const daysBetween1 = dayjs(range1.to).diff(dayjs(range1.from), 'day', false)
    const daysBetween2 = dayjs(range2.to).diff(dayjs(range2.from), 'day', false)

    for (let i = 0; i <= daysBetween1; i++) {
        resultRange1.push(dayjs(range1.from).add(i, 'day').format('YYYY-MM-DD'))
    }

    for (let i = 0; i <= daysBetween2; i++) {
        resultRange2.push(dayjs(range2.from).add(i, 'day').format('YYYY-MM-DD'))
    }

    const found = resultRange1.find((r) => {
        return resultRange2.includes(r)
    })

    return found != undefined
}