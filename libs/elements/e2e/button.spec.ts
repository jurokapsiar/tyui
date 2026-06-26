import { expect, test } from '@playwright/test';

const STORYBOOK_URL = process.env.STORYBOOK_URL;

if (!STORYBOOK_URL) throw new Error('STORYBOOK_URL env var required.');

test('button story exposes the expected label and disabled state', async ({ page }) => {
  await page.goto(`${STORYBOOK_URL}/iframe.html?viewMode=story&id=components-button--states`);

  await expect(page.getByRole('button', { name: 'Default' })).toBeVisible();
  await expect(page.getByRole('button', { name: 'Pressed' })).toHaveAttribute(
    'aria-pressed',
    'true',
  );
  await expect(page.getByRole('button', { name: 'Disabled' })).toBeDisabled();
});
