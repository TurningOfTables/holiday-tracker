import {
	differenceInBusinessDays,
	isWeekend,
	differenceInCalendarDays,
	addDays,
	format,
	isPast,
	isFuture,
	isToday,
	isWithinInterval
} from 'date-fns';

export function businessDaysInclusive(start_date, end_date) {
	let fromDate = new Date(start_date);
	let toDate = new Date(end_date);
	let days = differenceInBusinessDays(toDate, fromDate);

	if (!isWeekend(toDate)) {
		days += 1;
	}
	return days;
}

export function totalHolidayDays(holidays) {
	let totalDays = 0;
	for (const holiday of holidays) {
		totalDays += businessDaysInclusive(holiday.start_date, holiday.end_date);
	}
	return totalDays;
}

export function dateRangesIntersect(range1, range2) {
	const resultRange1 = [];
	const resultRange2 = [];

	const daysBetween1 = differenceInCalendarDays(new Date(range1.end_date), new Date(range1.start_date));
	const daysBetween2 = differenceInCalendarDays(new Date(range2.end_date), new Date(range2.start_date));

	for (let i = 0; i <= daysBetween1; i++) {
		const nextDate = addDays(new Date(range1.start_date), i);
		resultRange1.push(format(nextDate, 'yyyy-MM-dd'));
	}

	for (let i = 0; i <= daysBetween2; i++) {
		const nextDate = addDays(new Date(range2.start_date), i);
		resultRange2.push(format(nextDate, 'yyyy-MM-dd'));
	}

	const found = resultRange1.find((r) => {
		return resultRange2.includes(r);
	});

	return found != undefined;
}

export function dateRangeState(start_date, end_date) {
	let today = new Date()
	let fromDate = new Date(start_date)
	let toDate = new Date(end_date)

	if (isToday(fromDate) || isToday(toDate) || isWithinInterval(today, { start: fromDate, end: toDate })) {
		return "inprogress"
	}

	if (isPast(toDate)) {
		return "past"
	}

	if (isFuture(fromDate)) {
		return "future"
	}
}
