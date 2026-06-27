import { expect, test, type Page } from '@playwright/test';

const E2E_URL = process.env.E2E_URL;

if (!E2E_URL) throw new Error('E2E_URL env var required.');

type RadioState = {
  activeValue: string | null;
  documentActive: string | null;
  groupValue: string;
  radios: Array<{
    checked: boolean;
    hostTabIndex: number;
    inputTabIndex: number;
    shadowActive: string | null;
    value: string;
  }>;
};

async function openFixture(page: Page): Promise<void> {
  await page.goto(`${E2E_URL}/e2e/fixtures/components.html`);
  await page.waitForFunction(
    () =>
      customElements.get('tyui-radio') !== undefined &&
      customElements.get('tyui-radio-group') !== undefined,
  );
  await page.waitForSelector('tyui-radio-group');
}

async function radioState(page: Page): Promise<RadioState> {
  return page.evaluate(() => {
    const group = document.querySelector('tyui-radio-group') as HTMLElement & { value: string };
    const radios = Array.from(document.querySelectorAll('tyui-radio')) as Array<
      HTMLElement & { value: string }
    >;

    return {
      activeValue:
        radios.find((radio) => radio.shadowRoot?.activeElement?.tagName === 'INPUT')?.value ?? null,
      documentActive: document.activeElement?.tagName ?? null,
      groupValue: group.value,
      radios: radios.map((radio) => ({
        checked: radio.hasAttribute('checked'),
        hostTabIndex: radio.tabIndex,
        inputTabIndex: radio.shadowRoot?.querySelector('input')?.tabIndex ?? Number.NaN,
        shadowActive: radio.shadowRoot?.activeElement?.tagName ?? null,
        value: radio.value,
      })),
    };
  });
}

test('tab enters the selected radio input and arrow keys move focus and selection', async ({
  page,
}) => {
  await openFixture(page);

  const initial = await radioState(page);
  expect(initial.documentActive).toBe('BODY');
  expect(initial.radios).toEqual([
    {
      checked: false,
      hostTabIndex: -1,
      inputTabIndex: -1,
      shadowActive: null,
      value: 'a',
    },
    {
      checked: true,
      hostTabIndex: 0,
      inputTabIndex: 0,
      shadowActive: null,
      value: 'b',
    },
    {
      checked: false,
      hostTabIndex: -1,
      inputTabIndex: -1,
      shadowActive: null,
      value: 'c',
    },
  ]);

  await page.keyboard.press('Tab');

  const afterTab = await radioState(page);
  expect(afterTab.documentActive).toBe('TYUI-RADIO');
  expect(afterTab.activeValue).toBe('b');
  expect(afterTab.radios[1]?.shadowActive).toBe('INPUT');

  await page.keyboard.press('ArrowRight');

  const afterArrow = await radioState(page);
  expect(afterArrow.groupValue).toBe('c');
  expect(afterArrow.activeValue).toBe('c');
  expect(afterArrow.radios).toEqual([
    {
      checked: false,
      hostTabIndex: -1,
      inputTabIndex: -1,
      shadowActive: null,
      value: 'a',
    },
    {
      checked: false,
      hostTabIndex: -1,
      inputTabIndex: -1,
      shadowActive: null,
      value: 'b',
    },
    {
      checked: true,
      hostTabIndex: 0,
      inputTabIndex: 0,
      shadowActive: 'INPUT',
      value: 'c',
    },
  ]);
});
