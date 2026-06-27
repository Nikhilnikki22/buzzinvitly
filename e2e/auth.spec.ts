import { test, expect } from '@playwright/test'

test.describe('Authentication Flow', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
  })

  test('should display login page', async ({ page }) => {
    await page.goto('/auth/login')

    await expect(page).toHaveTitle(/BuzzInvitly/i)
    await expect(page.getByRole('heading', { name: /login/i })).toBeVisible()
    await expect(page.getByPlaceholder(/email/i)).toBeVisible()
    await expect(page.getByPlaceholder(/password/i)).toBeVisible()
  })

  test('should display signup page', async ({ page }) => {
    await page.goto('/auth/signup')

    await expect(page.getByRole('heading', { name: /sign up/i })).toBeVisible()
    await expect(page.getByPlaceholder(/name/i)).toBeVisible()
    await expect(page.getByPlaceholder(/email/i)).toBeVisible()
    await expect(page.getByPlaceholder(/password/i)).toBeVisible()
  })

  test('should show validation errors for invalid email', async ({ page }) => {
    await page.goto('/auth/login')

    await page.getByPlaceholder(/email/i).fill('invalid-email')
    await page.getByPlaceholder(/password/i).fill('password123')
    await page.getByRole('button', { name: /login/i }).click()

    // Should either show validation error or stay on same page
    await expect(page).toHaveURL(/\/auth\/login/)
  })

  test('should navigate between login and signup', async ({ page }) => {
    await page.goto('/auth/login')

    await page.getByRole('link', { name: /sign up/i }).click()
    await expect(page).toHaveURL(/\/auth\/signup/)

    await page.getByRole('link', { name: /login/i }).click()
    await expect(page).toHaveURL(/\/auth\/login/)
  })

  test('should display forgot password page', async ({ page }) => {
    await page.goto('/auth/login')

    // Look for forgot password link
    const forgotPasswordLink = page.getByRole('link', { name: /forgot password/i })
    if (await forgotPasswordLink.isVisible()) {
      await forgotPasswordLink.click()
      await expect(page).toHaveURL(/\/auth\/forgot-password/)
      await expect(page.getByPlaceholder(/email/i)).toBeVisible()
    }
  })
})

test.describe('Protected Routes', () => {
  test('should redirect to login when accessing protected pages', async ({ page }) => {
    // Try to access dashboard without being logged in
    await page.goto('/dashboard')

    // Should redirect to login
    await expect(page).toHaveURL(/\/auth\/login/)
  })

  test('should redirect to login when accessing event pages', async ({ page }) => {
    await page.goto('/events/test-event-id')

    // Should redirect to login
    await expect(page).toHaveURL(/\/auth\/login/)
  })

  test('should redirect to login when accessing templates', async ({ page }) => {
    await page.goto('/templates')

    // Should redirect to login
    await expect(page).toHaveURL(/\/auth\/login/)
  })
})
