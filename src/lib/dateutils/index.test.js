import { expect, test, describe } from 'vitest'
import { businessDaysInclusive, dateRangesIntersect, totalHolidayDays } from './index'

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

describe('dateRangesIntersect', () => {
    test('range1 partially intersects range2', () => {
        const range1 = {
            from: "2023-12-01",
            to: "2023-12-10"
        }

        const range2 = {
            from: "2023-12-02",
            to: "2023-12-05"
        }
        const res = dateRangesIntersect(range1, range2)
        expect(res).toBe(true)
    })

    test('range2 partially intersects range1', () => {
        const range1 = {
            from: "2023-12-02",
            to: "2023-12-05"
        }
        const range2 = {
            from: "2023-12-01",
            to: "2023-12-10"
        }

        const res = dateRangesIntersect(range1, range2)
        expect(res).toBe(true)
    })

    test('ranges wholly intersect', () => {
        const range1 = {
            from: "2023-12-01",
            to: "2023-12-10"
        }
        const range2 = {
            from: "2023-12-01",
            to: "2023-12-10"
        }

        const res = dateRangesIntersect(range1, range2)
        expect(res).toBe(true)
    })

    test('ranges do not intersect', () => {
        const range1 = {
            from: "2023-12-01",
            to: "2023-12-10"
        }

        const range2 = {
            from: "2023-11-01",
            to: "2023-11-10"
        }

        const res = dateRangesIntersect(range1, range2)
        expect(res).toBe(false)
    })

    test('first day of range1 intersects last day of range2', () => {
        const range1 = {
            from: "2023-12-01",
            to: "2023-12-10"
        }

        const range2 = {
            from: "2023-11-25",
            to: "2023-12-01"
        }

        const res = dateRangesIntersect(range1, range2)
        expect(res).toBe(true)
    })

    test('last day of range1 intersects first day of range2', () => {
        const range1 = {
            from: "2023-12-01",
            to: "2023-12-10"
        }

        const range2 = {
            from: "2023-12-10",
            to: "2023-12-15"
        }

        const res = dateRangesIntersect(range1, range2)
        expect(res).toBe(true)
    })

})