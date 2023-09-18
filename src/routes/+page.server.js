import { getHolidays, addHoliday, deleteHoliday } from '../lib/server/db/index.js';
import dayjs from 'dayjs';

export function load({ params }) {
    let allowanceDays = 25
    let totalDays = 0;
    const holidays = getHolidays();
    for (const holiday of holidays) {
        totalDays += dayjs(holiday.to).diff(dayjs(holiday.from), 'day', false)
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
        addHoliday(data.get('start-date'), data.get('end-date'))
    },

    delete: async ({ request }) => {
        const data = await request.formData();
        deleteHoliday(data.get('id'))
    }
}