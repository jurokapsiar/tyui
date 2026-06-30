import type { Meta, StoryObj } from '@storybook/web-components';
import { html } from 'lit';
// nx-ignore-next-line
import { defineTyuiCheckbox } from '@toyu-ui/define/checkbox';
import '../../../../design/alternatives/atmospheric-glass/theme.css';
import '../../../../design/alternatives/atmospheric-glass/component-variants.css';
import '../../../../design/alternatives/fluent-web/theme.css';
import '../../../../design/alternatives/fluent-web/component-variants.css';

defineTyuiCheckbox();

const meta: Meta = {
  title: 'Components/Checkbox',
  component: 'tyui-checkbox',
  tags: ['autodocs', 'visual'],
  argTypes: {
    checked: { control: 'boolean' },
    disabled: { control: 'boolean' },
    indeterminate: { control: 'boolean' },
    required: { control: 'boolean' },
    value: { control: 'text' },
  },
};

export default meta;

type Story = StoryObj;

export const Default: Story = {
  render: () => html`<tyui-checkbox>Receive notifications</tyui-checkbox>`,
};

export const States: Story = {
  tags: ['visual'],
  render: () => html`
    <div style="display:grid;gap:12px;align-items:start;">
      <tyui-checkbox>Unchecked</tyui-checkbox>
      <tyui-checkbox checked>Checked</tyui-checkbox>
      <tyui-checkbox indeterminate>Indeterminate</tyui-checkbox>
      <tyui-checkbox disabled>Disabled</tyui-checkbox>
      <tyui-checkbox disabled checked>Disabled checked</tyui-checkbox>
      <tyui-checkbox disabled indeterminate>Disabled indeterminate</tyui-checkbox>
      <tyui-checkbox required>Required</tyui-checkbox>
    </div>
  `,
};

export const AtmosphericGlass: Story = {
  tags: ['visual'],
  render: () => html`
    <div
      data-design-system="atmospheric-glass"
      style="box-sizing:border-box;min-height:320px;padding:40px;display:flex;align-items:center;justify-content:center;"
    >
      <section
        class="ty-glass-surface"
        data-elevation="elevated"
        data-shine="true"
        style="box-sizing:border-box;width:min(100%,560px);padding:28px;display:grid;gap:16px;"
      >
        <div class="ty-metric-label">Atmospheric Glass</div>
        <tyui-checkbox checked>Include wind alerts</tyui-checkbox>
        <tyui-checkbox indeterminate>Some regions selected</tyui-checkbox>
        <tyui-checkbox>Show experimental layers</tyui-checkbox>
      </section>
    </div>
  `,
};

export const FluentWeb: Story = {
  tags: ['visual'],
  render: () => html`
    <div
      data-design-system="fluent-web"
      style="box-sizing:border-box;min-height:320px;padding:32px;background:var(--ty-color-background);"
    >
      <section
        class="ty-fluent-panel"
        data-elevation="raised"
        style="box-sizing:border-box;width:min(100%,560px);padding:20px;display:grid;gap:14px;"
      >
        <div>
          <div class="ty-fluent-title">Preferences</div>
          <div class="ty-fluent-caption">Independent choices use checkboxes.</div>
        </div>
        <tyui-checkbox checked>Email me updates</tyui-checkbox>
        <tyui-checkbox>Enable preview features</tyui-checkbox>
        <tyui-checkbox indeterminate>Some teams selected</tyui-checkbox>
      </section>
    </div>
  `,
};
