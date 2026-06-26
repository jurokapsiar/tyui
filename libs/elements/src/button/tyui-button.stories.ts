import type { Meta, StoryObj } from '@storybook/web-components';
import { html } from 'lit';
// nx-ignore-next-line
import { defineTyuiButton } from '@tyui/define/button';

defineTyuiButton();

const meta: Meta = {
  title: 'Components/Button',
  component: 'tyui-button',
  tags: ['autodocs', 'visual'],
  argTypes: {
    disabled: { control: 'boolean' },
    pressed: { control: 'boolean' },
  },
};

export default meta;

type Story = StoryObj;

export const Default: Story = {
  render: () => html`<tyui-button>Press me</tyui-button>`,
};

export const States: Story = {
  tags: ['visual'],
  render: () => html`
    <div style="display:grid;gap:12px;justify-items:start;">
      <tyui-button>Default</tyui-button>
      <tyui-button pressed>Pressed</tyui-button>
      <tyui-button disabled>Disabled</tyui-button>
    </div>
  `,
};
