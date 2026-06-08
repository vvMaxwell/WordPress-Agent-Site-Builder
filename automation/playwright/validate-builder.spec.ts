import { expect, test } from '@playwright/test';
import { mkdirSync } from 'node:fs';

const baseUrl = process.env.WP_BASE_URL;
const username = process.env.WP_ADMIN_USER;
const password = process.env.WP_ADMIN_PASSWORD;

test.skip(!baseUrl || !username || !password, 'Set WP_BASE_URL, WP_ADMIN_USER, and WP_ADMIN_PASSWORD to validate a live site.');

test('generated pages open in Themify Builder', async ({ page }) => {
  mkdirSync('build/site-plan/screenshots', { recursive: true });

  await page.goto(`${baseUrl}/wp-login.php`);
  await page.getByLabel('Username or Email Address').fill(username!);
  await page.getByLabel('Password').fill(password!);
  await page.getByRole('button', { name: 'Log In' }).click();
  await expect(page.locator('#wpadminbar')).toBeVisible();

  const paths = ['/', '/services/', '/about/', '/contact/'];

  for (const path of paths) {
    await page.goto(`${baseUrl}${path}#builder_active`, { waitUntil: 'networkidle' });
    await expect(page.locator('body')).toBeVisible();
    await expect(
      page.locator('#tb_toolbar, .tb_toolbar, .themify_builder_active, body.builder-active').first()
    ).toBeVisible({ timeout: 15000 });
    await page.screenshot({
      path: `build/site-plan/screenshots/${path === '/' ? 'home' : path.replaceAll('/', '')}-builder.png`,
      fullPage: true
    });
  }
});
