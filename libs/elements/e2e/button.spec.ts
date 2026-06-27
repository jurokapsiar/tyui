import { expect, test } from '@playwright/test';

const E2E_URL = process.env.E2E_URL;

if (!E2E_URL) throw new Error('E2E_URL env var required.');

async function openFixture(page: import('@playwright/test').Page): Promise<void> {
  await page.goto(`${E2E_URL}/e2e/fixtures/components.html`);
  await page.waitForFunction(() => customElements.get('tyui-button') !== undefined);
  await page.waitForSelector('tyui-button');
}

test('button exposes the expected label and disabled state', async ({ page }) => {
  await openFixture(page);

  await expect(page.getByRole('button', { name: 'Focusable disabled' })).toHaveAttribute(
    'aria-disabled',
    'true',
  );
  await expect(page.getByRole('button', { name: 'Disabled', exact: true })).toBeDisabled();
});
