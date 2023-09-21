import { expect, test } from '@playwright/test';

test('Load login page with expected elements', async ({ page }) => {
	await page.goto('/');
	await expect(page.getByTestId('login-form__username')).toBeVisible()
	await expect(page.getByTestId('login-form__password')).toBeVisible();
	await expect(page.getByTestId('login-form__submit')).toBeVisible();
});

test('Load register page with expected elements', async ({ page }) => {
	await page.goto('/register');
	await expect(page.getByTestId('register-form__username')).toBeVisible()
	await expect(page.getByTestId('register-form__password')).toBeVisible();
	await expect(page.getByTestId('register-form__confirm_password')).toBeVisible();
	await expect(page.getByTestId('register-form__submit')).toBeVisible();
});

test('Register', async ({ page }) => {
	const testUsername = "test_" + (new Date()).getTime()
	await page.goto('/register')
	await page.getByTestId('register-form__username').fill(testUsername)
	await page.getByTestId('register-form__password').fill('password')
	await page.getByTestId('register-form__confirm_password').fill('password')
	await page.getByTestId('register-form__submit').click()
	await expect(page).toHaveURL('/?registered=true')
	await expect(page.getByTestId('login-form__register_success')).toBeVisible()
})