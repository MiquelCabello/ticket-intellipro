import { test, expect } from '@playwright/test';

test.describe('Flujo feliz principal', () => {
  test('homepage loads and displays navigation', async ({ page }) => {
    await page.goto('/');
    
    // Check if the main dashboard loads
    await expect(page).toHaveTitle(/Gestión de Gastos/);
    
    // Check navigation elements
    await expect(page.locator('nav')).toBeVisible();
    
    // Check if main content area is present
    await expect(page.locator('main')).toBeVisible();
    
    // Verify key dashboard elements
    await expect(page.locator('text=ExpenseFlow')).toBeVisible();
    await expect(page.locator('text=Dashboard')).toBeVisible();
  });

  test('navigation between main sections works', async ({ page }) => {
    await page.goto('/');
    
    // Navigate to expenses
    await page.click('text=Gastos');
    await expect(page).toHaveURL(/.*expenses/);
    await expect(page.locator('h1')).toContainText(/Gastos|Expenses/);
    
    // Navigate to settings
    await page.click('text=Configuración');
    await expect(page).toHaveURL(/.*settings/);
    await expect(page.locator('text=Configuración')).toBeVisible();
    
    // Navigate back to dashboard
    await page.click('text=Dashboard');
    await expect(page).toHaveURL('/');
  });

  test('expense management flow', async ({ page }) => {
    await page.goto('/');
    
    // Go to expenses section
    await page.click('text=Gastos');
    await expect(page).toHaveURL(/.*expenses/);
    
    // Try to access upload functionality  
    await page.click('text=Subir Ticket');
    await expect(page).toHaveURL(/.*upload/);
    
    // Verify upload form is present
    await expect(page.locator('text=Subir')).toBeVisible();
  });

  test('settings accessibility', async ({ page }) => {
    await page.goto('/settings');
    
    // Check settings page loads
    await expect(page.locator('text=Configuración')).toBeVisible();
    
    // Verify tabs are accessible
    await expect(page.locator('role=tablist')).toBeVisible();
    
    // Check that forms have proper labels
    await expect(page.locator('label')).toHaveCount({ 'gte': 1 });
  });

  test('accessibility features', async ({ page }) => {
    await page.goto('/');
    
    // Test keyboard navigation
    await page.keyboard.press('Tab');
    
    // Check if focus is visible (basic check)
    const focusedElement = await page.evaluateHandle(() => document.activeElement);
    expect(focusedElement).toBeTruthy();
    
    // Check aria-labels exist on icon buttons
    const menuButton = page.locator('[aria-label*="menú"]').first();
    if (await menuButton.count() > 0) {
      await expect(menuButton).toHaveAttribute('aria-label');
    }
  });

  test('responsive design', async ({ page }) => {
    // Test mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/');
    
    // Check mobile navigation works
    const menuButton = page.locator('[aria-label*="menú"]').first();
    if (await menuButton.count() > 0) {
      await menuButton.click();
      await expect(page.locator('nav')).toBeVisible();
    }
    
    // Test desktop viewport
    await page.setViewportSize({ width: 1024, height: 768 });
    await expect(page.locator('nav')).toBeVisible();
  });
});