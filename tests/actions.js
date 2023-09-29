import { expect } from '@playwright/test';
import { selectors } from "./selectors"
import { paths, queryParams } from "./paths"
import { format, add } from 'date-fns'
const dateFormatToType = "yyyy-MM-dd"

export async function createTestUser(page) {
    const username = "test_" + (new Date()).getTime()
    const password = "password"
    await page.goto(paths.register)
    await page.getByTestId(selectors.register.username).fill(username)
    await page.getByTestId(selectors.register.password).fill(password)
    await page.getByTestId(selectors.register.confirmPassword).fill(password)
    await page.getByTestId(selectors.register.submit).click()
    await expect(page).toHaveURL(queryParams.registerSuccess)
    await expect(page.getByTestId(selectors.login.registerSuccess)).toBeVisible()
    return { username, password }
}

export async function login(page, username, password) {
    await page.goto(paths.login)
    await page.getByTestId(selectors.login.username).fill(username)
    await page.getByTestId(selectors.login.password).fill(password)
    await page.getByTestId(selectors.login.submit).click()
}

export async function addBooking(page, duration) {
    const startDate = format(new Date(), dateFormatToType)
    const endDate = format(add(new Date(), { days: duration }), dateFormatToType)
    await page.getByTestId(selectors.account.bookings.addStartDate).fill(startDate)
    await page.getByTestId(selectors.account.bookings.addEndDate).fill(endDate)
    await page.getByTestId(selectors.account.bookings.addSubmit).click()
}