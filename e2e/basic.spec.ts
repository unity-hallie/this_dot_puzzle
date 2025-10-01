import { test, expect } from '@playwright/test'

test('Basics > First Value puzzle solves by clicking lines and running', async ({ page }) => {
  await page.goto('/')

  // Navigate to Basics level
  await page.getByRole('button', { name: 'Basics' }).click()

  // Open first puzzle: First Value
  await page.getByRole('button', { name: /First Value/i }).click()

  // Ensure puzzle view loaded: headers present
  await expect(page.getByText('available')).toBeVisible()
  await expect(page.getByText('your solution')).toBeVisible()

  // Click available lines to add to solution
  await page.getByText('this.value = 10', { exact: true }).click()
  await page.getByText('this.value += 3', { exact: true }).click()

  // Run
  await page.getByRole('button', { name: 'run' }).click()

  // Check output success text
  await expect(page.getByText('✓ a baker\'s dozen')).toBeVisible()
})

