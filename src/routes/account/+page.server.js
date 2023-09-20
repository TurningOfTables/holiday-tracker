import {
	getHolidays,
	addHoliday,
	deleteHoliday,
	getAllowance,
	changeAllowance,
	getExcludedDays
} from '$lib/server/db/index.js';
import { totalHolidayDays, dateRangesIntersect } from '$lib/dateutils';
import { fail, redirect } from '@sveltejs/kit';
import { getYear, isAfter } from 'date-fns';
import { businessDaysInclusive } from '../../lib/dateutils/index.js';
const numberRegex = /^[0-9]+$/;

export function load({locals}) {
	const holidays = getHolidays();
	const totalDays = totalHolidayDays(holidays);
	const allowanceDays = getAllowance();
	const excludedDays = getExcludedDays();

	return {
		user: locals.user,
		allowanceDays,
		totalDays,
		holidays,
		excludedDays
	};
}

export const actions = {
	add: async ({ request }) => {
		const data = await request.formData();
		const from = data.get('start-date');
		const to = data.get('end-date');
		const fromObj = new Date(from);
		const toObj = new Date(to);
		const currentYear = getYear(new Date());
		const holidayDuration = businessDaysInclusive(from, to);
		const holidays = getHolidays();
		const totalDays = totalHolidayDays(holidays);
		const excludedDays = getExcludedDays();
		const allowanceDays = getAllowance();

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
			addHoliday(from, to);
		} catch (error) {
			return fail(422, {
				error: error.message
			});
		}
	},

	delete: async ({ request }) => {
		const data = await request.formData();
		deleteHoliday(data.get('id'));
	},

	changeAllowance: async ({ request }) => {
		const data = await request.formData();
		const newAllowance = data.get('change-allowance');

		try {
			if (newAllowance.match(numberRegex) === null) {
				throw new Error('Allowance must contain only numbers');
			}

			if (newAllowance <= 0) {
				throw new Error('Allowance must be more than zero');
			}
			changeAllowance(newAllowance);
		} catch (error) {
			return fail(422, {
				error: error.message
			});
		}
	},

	logout: async ({ request, cookies }) => {
		cookies.delete('session_id')
		throw redirect(303, '/')
	}
};
