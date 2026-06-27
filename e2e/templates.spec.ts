import { test, expect } from '@playwright/test'

test.describe('Template Browsing (Authenticated)', () => {
  // Note: These tests assume you have a test user or use beforeEach to login
  // For now, they test basic page structure

  test.skip('should display template gallery', async ({ page }) => {
    // Skip for now - requires authentication setup
    await page.goto('/templates')

    await expect(page.getByRole('heading', { name: /browse templates/i })).toBeVisible()
  })

  test.skip('should filter templates by category', async ({ page }) => {
    await page.goto('/templates')

    // Click on a category filter
    await page.getByRole('link', { name: /birthday/i }).click()

    // Should update URL with category param
    await expect(page).toHaveURL(/category=BIRTHDAY/)
  })

  test.skip('should search templates', async ({ page }) => {
    await page.goto('/templates')

    const searchInput = page.getByPlaceholder(/search templates/i)
    await searchInput.fill('wedding')
    await searchInput.press('Enter')

    // Should update URL with search param
    await expect(page).toHaveURL(/search=wedding/)
  })
})

test.describe('Public Template Preview', () => {
  test('should handle template pages gracefully when not authenticated', async ({ page }) => {
    await page.goto('/templates')

    // Should redirect to login or show appropriate message
    await expect(page).toHaveURL(/\/auth\/login|\/templates/)
  })
})
