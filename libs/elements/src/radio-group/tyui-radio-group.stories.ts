import type { Meta, StoryObj } from '@storybook/web-components';
import { html } from 'lit';
// nx-ignore-next-line
import { defineTyuiRadio } from '@tyui/define/radio';
// nx-ignore-next-line
import { defineTyuiRadioGroup } from '@tyui/define/radio-group';
import '../../../../design/alternatives/atmospheric-glass/theme.css';
import '../../../../design/alternatives/atmospheric-glass/component-variants.css';
import '../../../../design/alternatives/fluent-web/theme.css';
import '../../../../design/alternatives/fluent-web/component-variants.css';

defineTyuiRadio();
defineTyuiRadioGroup();

const layouts = ['vertical', 'horizontal', 'horizontal-stacked'] as const;

const meta: Meta = {
  title: 'Components/RadioGroup',
  component: 'tyui-radio-group',
  tags: ['autodocs', 'visual'],
  argTypes: {
    disabled: { control: 'boolean' },
    label: { control: 'text' },
    layout: { control: 'inline-radio', options: layouts },
    required: { control: 'boolean' },
    value: { control: 'text' },
  },
};

export default meta;

type Story = StoryObj;

export const Default: Story = {
  render: () => html`
    <tyui-radio-group label="Pick one" name="choice">
      <tyui-radio value="a">Option A</tyui-radio>
      <tyui-radio value="b">Option B</tyui-radio>
      <tyui-radio value="c">Option C</tyui-radio>
    </tyui-radio-group>
  `,
};

export const Selected: Story = {
  tags: ['visual'],
  render: () => html`
    <tyui-radio-group label="Pick one" name="choice" value="b">
      <tyui-radio value="a">Option A</tyui-radio>
      <tyui-radio value="b">Option B</tyui-radio>
      <tyui-radio value="c">Option C</tyui-radio>
    </tyui-radio-group>
  `,
};

export const Layouts: Story = {
  tags: ['visual'],
  render: () => html`
    <div style="display:grid;gap:24px;">
      ${layouts.map(
        (layout) => html`
          <tyui-radio-group label=${layout} layout=${layout} value="b">
            <tyui-radio value="a">A</tyui-radio>
            <tyui-radio value="b">B</tyui-radio>
            <tyui-radio value="c">C</tyui-radio>
          </tyui-radio-group>
        `,
      )}
    </div>
  `,
};

export const DisabledAndRequired: Story = {
  tags: ['visual'],
  render: () => html`
    <div style="display:grid;gap:24px;">
      <tyui-radio-group label="Disabled group" disabled value="b">
        <tyui-radio value="a">Option A</tyui-radio>
        <tyui-radio value="b">Option B</tyui-radio>
      </tyui-radio-group>
      <tyui-radio-group label="Required group" required>
        <tyui-radio value="a">Option A</tyui-radio>
        <tyui-radio value="b" disabled>Unavailable</tyui-radio>
        <tyui-radio value="c">Option C</tyui-radio>
      </tyui-radio-group>
    </div>
  `,
};

export const AtmosphericGlass: Story = {
  tags: ['visual'],
  render: () => html`
    <div
      data-design-system="atmospheric-glass"
      style="box-sizing:border-box;min-height:360px;padding:40px;display:flex;align-items:center;justify-content:center;"
    >
      <section
        class="ty-glass-surface"
        data-elevation="elevated"
        data-shine="true"
        style="box-sizing:border-box;width:min(100%,640px);padding:28px;display:grid;gap:18px;"
      >
        <div class="ty-metric-label">Atmospheric Glass</div>
        <tyui-radio-group label="Temperature units" layout="horizontal-stacked" value="metric">
          <tyui-radio value="imperial">Fahrenheit</tyui-radio>
          <tyui-radio value="metric">Celsius</tyui-radio>
          <tyui-radio value="kelvin">Kelvin</tyui-radio>
        </tyui-radio-group>
      </section>
    </div>
  `,
};

export const FluentWeb: Story = {
  tags: ['visual'],
  render: () => html`
    <div
      data-design-system="fluent-web"
      style="box-sizing:border-box;min-height:360px;padding:32px;background:var(--ty-color-background);"
    >
      <section
        class="ty-fluent-panel"
        data-elevation="raised"
        style="box-sizing:border-box;width:min(100%,640px);padding:20px;display:grid;gap:18px;"
      >
        <div>
          <div class="ty-fluent-title">Default view</div>
          <div class="ty-fluent-caption">Mutually exclusive choices use a radio group.</div>
        </div>
        <tyui-radio-group label="Startup page" value="dashboard">
          <tyui-radio value="dashboard">Dashboard</tyui-radio>
          <tyui-radio value="activity">Activity</tyui-radio>
          <tyui-radio value="settings">Settings</tyui-radio>
        </tyui-radio-group>
      </section>
    </div>
  `,
};
