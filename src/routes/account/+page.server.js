import {
	getHolidays,
	addHoliday,
	deleteHoliday,
	getAllowance,
	changeAllowance,
	getExcludedDays,
	addExcludedDays
} from '$lib/server/db/index.js';
import { totalHolidayDays, dateRangesIntersect } from '$lib/dateutils';
import { fail } from '@sveltejs/kit';
import { getYear, isAfter } from 'date-fns';
import { businessDaysInclusive } from '$lib/dateutils/index.js';
import { getUserBySession } from '$lib/server/db/index.js';
import { deleteExcludedDays } from '../../lib/server/db/index.js';
const numberRegex = /^[0-9]+$/;

export function load({ locals, cookies }) {
	const sessionId = cookies.get('session_id')
	const user = getUserBySession(sessionId)
	const holidays = getHolidays(user.userid);
	const totalDays = totalHolidayDays(holidays);
	const allowanceDays = getAllowance(user.userid);
	const excludedDays = getExcludedDays(user.userid);

	return {
		user: locals.user,
		allowanceDays,
		totalDays,
		holidays,
		excludedDays
	};
}

export const actions = {
	add: async ({ request, cookies }) => {
		const sessionId = cookies.get('session_id')
		const user = getUserBySession(sessionId)
		const data = await request.formData();
		const from = data.get('start-date');
		const to = data.get('end-date');
		const fromObj = new Date(from);
		const toObj = new Date(to);
		const currentYear = getYear(new Date());
		const holidayDuration = businessDaysInclusive(from, to);
		const holidays = getHolidays(user.userid);
		const totalDays = totalHolidayDays(holidays);
		const excludedDays = getExcludedDays(user.userid);
		const allowanceDays = getAllowance(user.userid);

		try {
			if (isAfter(fromObj, toObj)) {
				throw new Error('Holiday end date is before start date');
			}

			if (getYear(fromObj) != currentYear || getYear(toObj) != currentYear) {
				throw new Error('Holiday can only be booked for the current year');
			}

			if (totalDays + holidayDuration > allowanceDays) {
				throw new Error('Holiday cannot exceed remaining allowance');
			}

			for (const excluded of excludedDays) {
				if (dateRangesIntersect({ from: from, to: to }, excluded)) {
					throw new Error('Holiday cannot overlap excluded dates');
				}
			}

			for (const holiday of holidays) {
				if (dateRangesIntersect({ from: from, to: to }, holiday)) {
					throw new Error('Holiday cannot overlap a previous booking');
				}
			}
			addHoliday(user.userid, from, to);
		} catch (error) {
			return fail(422, {
				error: error.message
			});
		}
	},

	delete: async ({ request, cookies }) => {
		const sessionId = cookies.get('session_id')
		const user = getUserBySession(sessionId)
		const data = await request.formData();
		deleteHoliday(user.userid, data.get('id'));
	},

	changeAllowance: async ({ request, cookies }) => {
		const sessionId = cookies.get('session_id')
		const user = getUserBySession(sessionId)
		const data = await request.formData();
		const newAllowance = data.get('change-allowance');

		try {
			if (newAllowance.match(numberRegex) === null) {
				throw new Error('Allowance must contain only numbers');
			}

			if (newAllowance <= 0) {
				throw new Error('Allowance must be more than zero');
			}
			changeAllowance(user.userid, newAllowance);
		} catch (error) {
			return fail(422, {
				error: error.message
			});
		}
	},

	addExcludedDays: async ({ request, cookies }) => {
		const sessionId = cookies.get('session_id')
		const user = getUserBySession(sessionId)
		const data = await request.formData();
		const from = data.get('start-date');
		const to = data.get('end-date');
		const fromObj = new Date(from);
		const toObj = new Date(to);
		const holidays = getHolidays(user.userid);
		const excludedDays = getExcludedDays(user.userid);

		try {
			if (isAfter(fromObj, toObj)) {
				throw new Error('Excluded end date is before start date');
			}

			for (const holiday of holidays) {
				if (dateRangesIntersect({ from: from, to: to }, holiday)) {
					throw new Error('Excluded dates cannot overlap an existing holiday');
				}
			}

			for (const excluded of excludedDays) {
				if (dateRangesIntersect({ from: from, to: to }, excluded)) {
					throw new Error('Excluded dates cannot overlap a previous exclusion');
				}
			}
			addExcludedDays(user.userid, from, to);
		} catch (error) {
			return fail(422, {
				error: error.message
			});
		}
	},

	deleteExcludedDays: async ({ request, cookies }) => {
		const sessionId = cookies.get('session_id')
		const user = getUserBySession(sessionId)
		const data = await request.formData();
		await new Promise((fulfil) => setTimeout(fulfil, 2000))
		deleteExcludedDays(user.userid, data.get('id'));
	}
};
