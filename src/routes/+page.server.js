import { getHolidays, addHoliday, deleteHoliday } from '../lib/server/db/index.js';
import { fail } from '@sveltejs/kit'
import dayjs from 'dayjs';
const allowanceDays = 25

export function load({ params }) {
    let totalDays = 0;
    const holidays = getHolidays();
    for (const holiday of holidays) {
        totalDays += dayjs(holiday.to).diff(dayjs(holiday.from), 'day', false) + 1
    }
    return {
        allowanceDays,
        totalDays,
        holidays
    }
}

export const actions = {
    add: async ({ request }) => {
        const data = await request.formData();

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
    }
}