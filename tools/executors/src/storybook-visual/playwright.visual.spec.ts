import { expect, test } from '@playwright/test';

interface StorybookStoriesIndex {
  entries: Record<string, { id: string; title: string; name: string; tags?: string[] }>;
}

interface ViewportSpec {
  key: string;
  width: number;
  height: number;
}

const STORYBOOK_URL = process.env.STORYBOOK_URL;
const THEMES = (process.env.TYUI_VISUAL_THEMES ?? 'light,dark').split(',').filter(Boolean);
const VIEWPORTS: ViewportSpec[] = process.env.TYUI_VISUAL_VIEWPORTS
  ? (JSON.parse(process.env.TYUI_VISUAL_VIEWPORTS) as ViewportSpec[])
  : [{ key: 'desktop', width: 1280, height: 720 }];

if (!STORYBOOK_URL) throw new Error('STORYBOOK_URL env var required.');

const indexResponse = await fetch(`${STORYBOOK_URL}/index.json`);
const index = (await indexResponse.json()) as StorybookStoriesIndex;
const visualStories = Object.values(index.entries).filter((entry) =>
  entry.tags?.includes('visual'),
);

if (visualStories.length === 0) {
  throw new Error(`No visual-tagged stories found at ${STORYBOOK_URL}/index.json.`);
}

const defaultViewport = 'desktop';
const responsiveTheme = THEMES[0] ?? 'light';

for (const story of visualStories) {
  for (const viewport of VIEWPORTS) {
    const isDesktop = viewport.key === defaultViewport;
    const themesForViewport = isDesktop ? THEMES : [responsiveTheme];

    for (const theme of themesForViewport) {
      test(`${story.id} - ${theme} - ${viewport.key}`, async ({ page }) => {
        await page.setViewportSize({ width: viewport.width, height: viewport.height });
        await page.goto(
          `${STORYBOOK_URL}/iframe.html?viewMode=story&id=${story.id}&globals=theme:${theme};viewport:${viewport.key}`,
        );

        const root = page.locator('#storybook-root');
        await root.waitFor();

        await page.waitForFunction(
          () => {
            const collect = (node: Document | ShadowRoot, out: HTMLImageElement[]): void => {
              for (const image of node.querySelectorAll('img')) out.push(image);
              for (const element of node.querySelectorAll<HTMLElement>('*')) {
                if (element.shadowRoot) collect(element.shadowRoot, out);
              }
            };

            const images: HTMLImageElement[] = [];
            collect(document, images);
            return images.every((image) => image.complete);
          },
          undefined,
          { timeout: 10_000 },
        );

        const [groupAndComponent, ...variantParts] = story.id.split('--');
        const component = (groupAndComponent ?? '').replace(/^components-/, '');
        const variant = variantParts.join('--') || story.name.toLowerCase().replace(/\s+/g, '-');
        const filename = isDesktop ? `${variant}--${theme}.png` : `${variant}--${viewport.key}.png`;

        await expect(root).toHaveScreenshot([component, filename], {
          animations: 'disabled',
        });
      });
    }
  }
}
