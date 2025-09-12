import { test, expect } from '@playwright/test';

test('homepage loads and displays navigation', async ({ page }) => {
  await page.goto('/');
  
  // Check if the main dashboard loads
  await expect(page).toHaveTitle(/Gestión de Gastos/);
  
  // Check navigation elements
  await expect(page.locator('nav')).toBeVisible();
  
  // Check if main content area is present
  await expect(page.locator('main')).toBeVisible();
});

test('navigation between main sections works', async ({ page }) => {
  await page.goto('/');
  
  // Navigate to expenses
  await page.click('text=Gastos');
  await expect(page).toHaveURL(/.*expenses/);
  
  // Navigate to settings
  await page.click('text=Configuración');
  await expect(page).toHaveURL(/.*settings/);
  
  // Navigate back to dashboard
  await page.click('text=Dashboard');
  await expect(page).toHaveURL('/');
});