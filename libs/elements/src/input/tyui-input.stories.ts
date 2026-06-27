import type { Meta, StoryObj } from '@storybook/web-components';
import { html } from 'lit';
// nx-ignore-next-line
import { defineTyuiInput } from '@tyui/define/input';
import '../../../../design/alternatives/atmospheric-glass/theme.css';
import '../../../../design/alternatives/atmospheric-glass/component-variants.css';
import '../../../../design/alternatives/fluent-web/theme.css';
import '../../../../design/alternatives/fluent-web/component-variants.css';

defineTyuiInput();

const appearances = ['outline', 'filled-darker', 'filled-lighter'] as const;
const sizes = ['small', 'medium', 'large'] as const;

const searchIcon = html`
  <svg slot="contentBefore" viewBox="0 0 20 20" aria-hidden="true">
    <path
      fill="currentColor"
      d="M8.5 3a5.5 5.5 0 0 1 4.38 8.83l3.15 3.15-1.06 1.06-3.15-3.15A5.5 5.5 0 1 1 8.5 3Zm0 1.5a4 4 0 1 0 0 8 4 4 0 0 0 0-8Z"
    ></path>
  </svg>
`;

const statusIcon = html`
  <svg slot="contentAfter" viewBox="0 0 20 20" aria-hidden="true">
    <path
      fill="currentColor"
      d="M10 2a8 8 0 1 1 0 16 8 8 0 0 1 0-16Zm3.36 5.65-4.2 4.2-1.95-1.96-1.06 1.06 3.01 3.01 5.26-5.25-1.06-1.06Z"
    ></path>
  </svg>
`;

const meta: Meta = {
  title: 'Components/Input',
  component: 'tyui-input',
  tags: ['autodocs', 'visual'],
  argTypes: {
    appearance: { control: 'select', options: appearances },
    disabled: { control: 'boolean' },
    invalid: { control: 'boolean' },
    placeholder: { control: 'text' },
    readonly: { control: 'boolean' },
    required: { control: 'boolean' },
    size: { control: 'inline-radio', options: sizes },
    type: {
      control: 'select',
      options: ['text', 'email', 'password', 'search', 'tel', 'url', 'number'],
    },
    value: { control: 'text' },
  },
};

export default meta;

type Story = StoryObj;

export const Default: Story = {
  render: () => html`<tyui-input placeholder="Project name"></tyui-input>`,
};

export const AppearanceMatrix: Story = {
  tags: ['visual'],
  render: () => html`
    <div style="display:grid;gap:14px;max-width:360px;">
      ${appearances.map(
        (appearance) => html`
          <tyui-input appearance=${appearance} placeholder=${appearance}></tyui-input>
        `,
      )}
    </div>
  `,
};

export const SizeMatrix: Story = {
  tags: ['visual'],
  render: () => html`
    <div style="display:grid;gap:14px;max-width:360px;">
      ${sizes.map((size) => html`<tyui-input size=${size} placeholder=${size}></tyui-input>`)}
    </div>
  `,
};

export const WithContent: Story = {
  tags: ['visual'],
  render: () => html`
    <div style="display:grid;gap:14px;max-width:420px;">
      <tyui-input type="search" placeholder="Search layers">${searchIcon}</tyui-input>
      <tyui-input value="validated@example.com">${statusIcon}</tyui-input>
    </div>
  `,
};

export const States: Story = {
  tags: ['visual'],
  render: () => html`
    <div style="display:grid;gap:14px;max-width:420px;">
      <tyui-input placeholder="Required" required></tyui-input>
      <tyui-input placeholder="Invalid" invalid value="not enough"></tyui-input>
      <tyui-input placeholder="Readonly" readonly value="Readonly value"></tyui-input>
      <tyui-input placeholder="Disabled" disabled value="Disabled value"></tyui-input>
    </div>
  `,
};

export const AtmosphericGlass: Story = {
  tags: ['visual'],
  render: () => html`
    <div
      data-design-system="atmospheric-glass"
      style="box-sizing:border-box;min-height:420px;padding:40px;display:flex;align-items:center;justify-content:center;"
    >
      <section
        class="ty-glass-surface"
        data-elevation="elevated"
        data-shine="true"
        style="box-sizing:border-box;width:min(100%,720px);padding:28px;display:grid;gap:20px;"
      >
        <div style="display:grid;gap:8px;">
          <div class="ty-metric-label">Atmospheric Glass</div>
          <div style="font-size:28px;font-weight:700;line-height:1.15;">Input composition</div>
        </div>
        <div style="display:grid;gap:14px;">
          <tyui-input type="search" placeholder="Search weather maps">${searchIcon}</tyui-input>
          <tyui-input appearance="filled-darker" value="North Atlantic system"
            >${statusIcon}</tyui-input
          >
          <tyui-input appearance="outline" placeholder="Optional notes"></tyui-input>
        </div>
      </section>
    </div>
  `,
};

export const FluentWeb: Story = {
  tags: ['visual'],
  render: () => html`
    <div
      data-design-system="fluent-web"
      style="box-sizing:border-box;min-height:420px;padding:32px;background:var(--ty-color-background);"
    >
      <section
        class="ty-fluent-panel"
        data-elevation="raised"
        style="box-sizing:border-box;width:min(100%,760px);padding:20px;display:grid;gap:18px;"
      >
        <div style="display:grid;gap:4px;">
          <div class="ty-fluent-title">Fluent Web inputs</div>
          <div class="ty-fluent-caption">
            Outline by default, Fluent underline for density, and filled search fields for app
            chrome.
          </div>
        </div>
        <div class="ty-fluent-form-grid">
          <tyui-input placeholder="Display name" value="Adele Vance"></tyui-input>
          <tyui-input type="email" placeholder="Email" value="adele@example.com"></tyui-input>
          <tyui-input
            class="ty-fluent-input-underline"
            placeholder="Alias"
            value="adelev"
          ></tyui-input>
          <tyui-input appearance="filled-lighter" type="search" placeholder="Search people"
            >${searchIcon}</tyui-input
          >
        </div>
      </section>
    </div>
  `,
};
