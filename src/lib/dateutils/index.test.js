import { expect, test, describe, beforeAll } from 'vitest';
import { add, format } from 'date-fns'
import { businessDaysInclusive, dateRangeState, dateRangesIntersect, totalHolidayDays } from './index';

let testTodayDate
let testFutureDate5d
let testFutureDate10d
let testPastDate

beforeAll(() => {
	const testDateFormat = 'yyyy-MM-dd'
	testTodayDate = format(new Date(), testDateFormat)
	testFutureDate5d = format(add(new Date(), { days: 5 }), testDateFormat)
	testFutureDate10d = format(add(new Date(), { days: 10 }), testDateFormat)
	testPastDate = format(new Date('2023-01-01'), testDateFormat)
})

describe('businessDaysInclusive', () => {
	test('all days are business days', () => {
		const from = '2023-09-18';
		const to = '2023-09-20';

		const res = businessDaysInclusive(from, to);
		expect(res).toBe(3);
	});

	test('no days are business days', () => {
		const from = '2023-09-16';
		const to = '2023-09-17';

		const res = businessDaysInclusive(from, to);
		expect(res).toBe(0);
	});

	test('some days are business days', () => {
		const from = '2023-09-18';
		const to = '2023-09-25';

		const res = businessDaysInclusive(from, to);
		expect(res).toBe(6);
	});

	test('end day is not business day', () => {
		const from = '2023-09-18';
		const to = '2023-09-23';

		const res = businessDaysInclusive(from, to);
		expect(res).toBe(5);
	});

	test('start day is not business day', () => {
		const from = '2023-09-17';
		const to = '2023-09-20';

		const res = businessDaysInclusive(from, to);
		expect(res).toBe(3);
	});
});

describe('totalHolidayDays', () => {
	test('adds total days correctly', () => {
		const testData = [
			{ start_date: '2023-09-18', end_date: '2023-09-20' },
			{ start_date: '2023-09-16', end_date: '2023-09-17' },
			{ start_date: '2023-09-18', end_date: '2023-09-25' },
			{ start_date: '2023-09-18', end_date: '2023-09-23' },
			{ start_date: '2023-09-17', end_date: '2023-09-20' }
		];

		const res = totalHolidayDays(testData);
		expect(res).toBe(17);
	});
});

describe('dateRangesIntersect', () => {
	test('range1 partially intersects range2', () => {
		const range1 = {
			start_date: '2023-12-01',
			end_date: '2023-12-10'
		};

		const range2 = {
			start_date: '2023-12-02',
			end_date: '2023-12-05'
		};
		const res = dateRangesIntersect(range1, range2);
		expect(res).toBe(true);
	});

	test('range2 partially intersects range1', () => {
		const range1 = {
			start_date: '2023-12-02',
			end_date: '2023-12-05'
		};
		const range2 = {
			start_date: '2023-12-01',
			end_date: '2023-12-10'
		};

		const res = dateRangesIntersect(range1, range2);
		expect(res).toBe(true);
	});

	test('ranges wholly intersect', () => {
		const range1 = {
			start_date: '2023-12-01',
			end_date: '2023-12-10'
		};
		const range2 = {
			start_date: '2023-12-01',
			end_date: '2023-12-10'
		};

		const res = dateRangesIntersect(range1, range2);
		expect(res).toBe(true);
	});

	test('ranges do not intersect', () => {
		const range1 = {
			start_date: '2023-12-01',
			end_date: '2023-12-10'
		};

		const range2 = {
			start_date: '2023-11-01',
			end_date: '2023-11-10'
		};

		const res = dateRangesIntersect(range1, range2);
		expect(res).toBe(false);
	});

	test('first day of range1 intersects last day of range2', () => {
		const range1 = {
			start_date: '2023-12-01',
			end_date: '2023-12-10'
		};

		const range2 = {
			start_date: '2023-11-25',
			end_date: '2023-12-01'
		};

		const res = dateRangesIntersect(range1, range2);
		expect(res).toBe(true);
	});

	test('last day of range1 intersects first day of range2', () => {
		const range1 = {
			start_date: '2023-12-01',
			end_date: '2023-12-10'
		};

		const range2 = {
			start_date: '2023-12-10',
			end_date: '2023-12-15'
		};

		const res = dateRangesIntersect(range1, range2);
		expect(res).toBe(true);
	});
});

describe('dateRangeState', () => {
	test('start date is past, end date is past', () => {
		const start_date = testPastDate
		const end_date = '2023-01-05'

		const res = dateRangeState(start_date, end_date)
		expect(res).toBe('past')
	})

	test('start date is past, end date is future', () => {
		const start_date = testPastDate
		const end_date = testFutureDate5d


		const res = dateRangeState(start_date, end_date)
		expect(res).toBe('inprogress')
	})

	test('start date is today, end date is today', () => {
		const start_date = testTodayDate
		const end_date = testTodayDate

		const res = dateRangeState(start_date, end_date)
		expect(res).toBe('inprogress')
	})

	test('start date is past, end date is today', () => {
		const start_date = testPastDate
		const end_date = testTodayDate

		const res = dateRangeState(start_date, end_date)
		expect(res).toBe('inprogress')
	})

	test('start date is today, end date is future', () => {
		const start_date = testTodayDate
		const end_date = testFutureDate5d

		const res = dateRangeState(start_date, end_date)
		expect(res).toBe('inprogress')
	})

	test('start date is future, end date is future', () => {
		const start_date = testFutureDate5d
		const end_date = testFutureDate10d

		const res = dateRangeState(start_date, end_date)
		expect(res).toBe('future')
	})
})
