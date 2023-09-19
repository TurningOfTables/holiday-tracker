import { expect, test, describe } from 'vitest'
import { businessDaysInclusive, totalHolidayDays } from './index'

describe('businessDaysInclusive', () => {
    test('all days are business days', () => {
        const from = '2023-09-18'
        const to = '2023-09-20'

        const res = businessDaysInclusive(from, to)
        expect(res).toBe(3)
    })

    test('no days are business days', () => {
        const from = '2023-09-16'
        const to = '2023-09-17'

        const res = businessDaysInclusive(from, to)
        expect(res).toBe(0)
    })

    test('some days are business days', () => {
        const from = '2023-09-18'
        const to = '2023-09-25'

        const res = businessDaysInclusive(from, to)
        expect(res).toBe(6)
    })

    test('end day is not business day', () => {
        const from = '2023-09-18'
        const to = '2023-09-23'

        const res = businessDaysInclusive(from, to)
        expect(res).toBe(5)
    })

    test('start day is not business day', () => {
        const from = '2023-09-17'
        const to = '2023-09-20'

        const res = businessDaysInclusive(from, to)
        expect(res).toBe(3)
    })
})

describe('totalHolidayDays', () => {
    test('adds total days correctly', () => {
        const testData = [
            { from: "2023-09-18", to: "2023-09-20" },
            { from: "2023-09-16", to: "2023-09-17" },
            { from: "2023-09-18", to: "2023-09-25" },
            { from: "2023-09-18", to: "2023-09-23" },
            { from: "2023-09-17", to: "2023-09-20" }
        ]

        const res = totalHolidayDays(testData)
        expect(res).toBe(17)
    })
})
