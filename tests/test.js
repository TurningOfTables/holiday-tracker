process.env.DB_MODE = "test"


import { expect, test } from '@playwright/test';
import { selectors } from './selectors'
import { paths, queryParams } from './paths'
import { createTestUser, login, addBooking, addExcludedPeriod } from './actions'
import { createDb, clearDb } from '../src/lib/server/db/dbsetup';

const dbPath = "./data/test.db"

test.beforeAll(() => {
	createDb(dbPath)
	clearDb(dbPath)
})

test.describe('Page loads', () => {
	test('/', async ({ page }) => {
		await page.goto(paths.login);
		await expect(page.getByTestId(selectors.login.username)).toBeVisible()
		await expect(page.getByTestId(selectors.login.password)).toBeVisible();
		await expect(page.getByTestId(selectors.login.submit)).toBeVisible();
	});

	test('/register', async ({ page }) => {
		await page.goto(paths.register);
		await expect(page.getByTestId(selectors.register.username)).toBeVisible()
		await expect(page.getByTestId(selectors.register.password)).toBeVisible();
		await expect(page.getByTestId(selectors.register.confirmPassword)).toBeVisible();
		await expect(page.getByTestId(selectors.register.submit)).toBeVisible();
	});

	test('Load account page with expected elements', async ({ page }) => {
		const testUser = await createTestUser(page)

		await page.getByTestId(selectors.login.username).fill(testUser.username)
		await page.getByTestId(selectors.login.password).fill(testUser.password)
		await page.getByTestId(selectors.login.submit).click()

		await expect(page.getByTestId(selectors.account.overview.container)).toBeVisible()
		await expect(page.getByTestId(selectors.account.overview.header)).toBeVisible()
		await expect(page.getByTestId(selectors.account.overview.content)).toBeVisible()

		await expect(page.getByTestId(selectors.account.bookings.container)).toBeVisible()
		await expect(page.getByTestId(selectors.account.bookings.addForm)).toBeVisible()

		await expect(page.getByTestId(selectors.account.configuration.container)).toBeVisible()
	})
})

test.describe('Sessions', () => {
	test('Login', async ({ page }) => {
		const testUser = await createTestUser(page)
		await login(page, testUser.username, testUser.password)
		await expect(page).toHaveURL(paths.account)
	})
	test('Login - incorrect password', async ({ page }) => {
		const testUser = await createTestUser(page)
		await login(page, testUser.username, "wrongpassword")

		await expect(page.getByTestId(selectors.formError.content)).toHaveText("Username or password is incorrect")
	})
	test('Logout', async ({ page }) => {
		const testUser = await createTestUser(page)
		await login(page, testUser.username, testUser.password)
		await page.getByTestId(selectors.header.logout).click()
		await expect(page).toHaveURL(queryParams.logoutSuccess)
	})
	test('Navigate to account page while logged out', async ({ page }) => {
		await page.goto(paths.account)
		await expect(page).toHaveURL(paths.login)
	})
	test('Navigate to account page after logging out', async ({ page }) => {
		const testUser = await createTestUser(page)
		await login(page, testUser.username, testUser.password)
		await page.getByTestId(selectors.header.logout).click()
		await expect(page).toHaveURL(queryParams.logoutSuccess)
		await page.goto(paths.account)
		await expect(page).toHaveURL(paths.login)
	})
})
test.describe('Registration', () => {
	test('Register', async ({ page }) => {
		await createTestUser(page)
	})

	test('Register - User already exists', async ({ page }) => {
		const testUser = await createTestUser(page)
		await page.goto(paths.register)
		await page.getByTestId(selectors.register.username).fill(testUser.username)
		await page.getByTestId(selectors.register.password).fill(testUser.password)
		await page.getByTestId(selectors.register.confirmPassword).fill(testUser.password)
		await page.getByTestId(selectors.register.submit).click()
		await expect(page.getByTestId(selectors.formError.content)).toHaveText("User already exists with that username")
	})
})

test.describe('Account', () => {
	test('Add booking', async ({ page }) => {
		const testUser = await createTestUser(page)
		await login(page, testUser.username, testUser.password)
		await expect(page.getByTestId(selectors.account.bookings.booking)).toHaveCount(0)
		await addBooking(page, 10)
		await expect(page.getByTestId(selectors.account.bookings.booking)).toHaveCount(1)
	})

	test('Delete booking', async ({ page }) => {
		const testUser = await createTestUser(page)
		await login(page, testUser.username, testUser.password)
		await expect(page.getByTestId(selectors.account.bookings.booking)).toHaveCount(0)
		await addBooking(page, 10)
		await expect(page.getByTestId(selectors.account.bookings.booking)).toHaveCount(1)
		await page.getByTestId(selectors.account.bookings.bookingDelete).click()
		await expect(page.getByTestId(selectors.account.bookings.booking)).toHaveCount(0)
	})

	test('Change allowance', async ({ page }) => {
		const testAllowance = "999"
		const testUser = await createTestUser(page)
		await login(page, testUser.username, testUser.password)
		await page.getByTestId(selectors.account.configuration.container).click()
		await page.getByTestId(selectors.account.configuration.allowance.daysInput).fill(testAllowance)
		await page.getByTestId(selectors.account.configuration.allowance.saveButton).click()
		await expect(page.getByTestId(selectors.account.overview.allowance_remaining)).toHaveText(testAllowance)
		await expect(page.getByTestId(selectors.account.overview.allowance_total)).toHaveText(testAllowance)
	})

	test('Add excluded period', async ({ page }) => {
		const testUser = await createTestUser(page)
		await login(page, testUser.username, testUser.password)
		await page.getByTestId(selectors.account.configuration.container).click()
		await expect(page.getByTestId(selectors.account.configuration.excludedPeriods.excludedPeriod)).toHaveCount(0)
		await addExcludedPeriod(page, 10)
		await expect(page.getByTestId(selectors.account.configuration.excludedPeriods.excludedPeriod)).toHaveCount(1)
	})

	test('Delete excluded period', async ({ page }) => {
		const testUser = await createTestUser(page)
		await login(page, testUser.username, testUser.password)
		await page.getByTestId(selectors.account.configuration.container).click()
		await expect(page.getByTestId(selectors.account.configuration.excludedPeriods.excludedPeriod)).toHaveCount(0)
		await addExcludedPeriod(page, 10)
		await expect(page.getByTestId(selectors.account.configuration.excludedPeriods.excludedPeriod)).toHaveCount(1)
		await page.getByTestId(selectors.account.configuration.excludedPeriods.excludedPeriodDelete).click()
		await expect(page.getByTestId(selectors.account.configuration.excludedPeriods.excludedPeriod)).toHaveCount(0)
	})
})









