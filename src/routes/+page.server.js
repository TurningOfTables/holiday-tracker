import { getHolidays, addHoliday, deleteHoliday, getAllowance, changeAllowance, getExcludedDays } from '$lib/server/db/index.js';
import { totalHolidayDays } from '$lib/dateutils/index.js';
import { fail } from '@sveltejs/kit'

export function load({ params }) {
    const holidays = getHolidays();
    const totalDays = totalHolidayDays(holidays)
    const allowanceDays = getAllowance()
    const excludedDays = getExcludedDays()
    return {
        allowanceDays,
        totalDays,
        holidays,
        excludedDays
    }
}

export const actions = {
    add: async ({ request }) => {
        const data = await request.formData();
        const allowanceDays = getAllowance()

        try {
            addHoliday(data.get('start-date'), data.get('end-date'), allowanceDays)
        } catch (error) {
            return fail(422, {
                error: error.message
            })
        }
    },

    delete: async ({ request }) => {
        const data = await request.formData();
        deleteHoliday(data.get('id'))
    },

    changeAllowance: async ({ request }) => {
        const data = await request.formData();

        try{
            changeAllowance(data.get('change-allowance'))
        } catch (error) {
            return fail(422, {
                error: error.message
            })
        }
    }
}