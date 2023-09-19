import {
	differenceInBusinessDays,
	isWeekend,
	differenceInCalendarDays,
	addDays,
	format
} from 'date-fns';

export function businessDaysInclusive(from, to) {
	let fromDate = new Date(from);
	let toDate = new Date(to);
	let days = differenceInBusinessDays(toDate, fromDate);

	if (!isWeekend(toDate)) {
		days += 1;
	}
	return days;
}

export function totalHolidayDays(holidays) {
	let totalDays = 0;
	for (const holiday of holidays) {
		totalDays += businessDaysInclusive(holiday.from, holiday.to);
	}
	return totalDays;
}

export function dateRangesIntersect(range1, range2) {
	const resultRange1 = [];
	const resultRange2 = [];

	const daysBetween1 = differenceInCalendarDays(new Date(range1.to), new Date(range1.from));
	const daysBetween2 = differenceInCalendarDays(new Date(range2.to), new Date(range2.from));

	for (let i = 0; i <= daysBetween1; i++) {
		const nextDate = addDays(new Date(range1.from), i);
		resultRange1.push(format(nextDate, 'yyyy-MM-dd'));
	}

	for (let i = 0; i <= daysBetween2; i++) {
		const nextDate = addDays(new Date(range2.from), i);
		resultRange2.push(format(nextDate, 'yyyy-MM-dd'));
	}

	const found = resultRange1.find((r) => {
		return resultRange2.includes(r);
	});

	return found != undefined;
}
