import type { Preview } from '@storybook/web-components';

const preview: Preview = {
  globalTypes: {
    theme: {
      description: 'Theme',
      defaultValue: 'light',
      toolbar: {
        title: 'Theme',
        items: [
          { value: 'light', title: 'Light' },
          { value: 'dark', title: 'Dark' },
        ],
      },
    },
  },
  decorators: [
    (story, context) => {
      document.documentElement.dataset.theme = String(context.globals.theme ?? 'light');
      return story();
    },
  ],
  parameters: {
    options: {
      storySort: {
        order: ['Components', 'Unimplemented components'],
      },
    },
    backgrounds: {
      default: 'surface',
      values: [{ name: 'surface', value: 'Canvas' }],
    },
    viewport: {
      options: {
        narrow: {
          name: 'Narrow',
          styles: { width: '360px', height: '720px' },
          type: 'mobile',
        },
        mobile: {
          name: 'Mobile',
          styles: { width: '390px', height: '844px' },
          type: 'mobile',
        },
        tablet: {
          name: 'Tablet',
          styles: { width: '768px', height: '1024px' },
          type: 'tablet',
        },
        desktop: {
          name: 'Desktop',
          styles: { width: '1280px', height: '720px' },
          type: 'desktop',
        },
      },
    },
  },
  initialGlobals: {
    viewport: { value: 'desktop', isRotated: false },
  },
};

export default preview;
