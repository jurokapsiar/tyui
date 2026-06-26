import type { StorybookConfig as WebComponentsConfig } from '@storybook/web-components-vite';

export interface DefineStorybookConfigInput {
  framework: 'web-components' | 'solid';
}

export function defineStorybookConfig(input: DefineStorybookConfigInput): WebComponentsConfig {
  const frameworkName =
    input.framework === 'solid' ? 'storybook-solidjs-vite' : '@storybook/web-components-vite';

  return {
    framework: {
      name: frameworkName,
      options: {},
    },
    stories: ['../src/**/*.stories.@(ts|tsx)'],
    addons: [],
    core: {
      disableTelemetry: true,
    },
    typescript: {
      reactDocgen: false,
    },
  } as WebComponentsConfig;
}
