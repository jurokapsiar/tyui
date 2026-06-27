import type { Meta, StoryObj } from '@storybook/web-components';
import { html } from 'lit';
// nx-ignore-next-line
import { defineTyuiButton } from '@tyui/define/button';
import '../../../../design/alternatives/atmospheric-glass/theme.css';
import '../../../../design/alternatives/atmospheric-glass/component-variants.css';
import '../../../../design/alternatives/fluent-web/theme.css';
import '../../../../design/alternatives/fluent-web/component-variants.css';

defineTyuiButton();

const appearances = ['default', 'primary', 'outline', 'subtle', 'transparent'] as const;
const sizes = ['small', 'medium', 'large'] as const;
const shapes = ['rounded', 'circular', 'square'] as const;

const searchIcon = html`
  <svg slot="icon" viewBox="0 0 20 20" aria-hidden="true">
    <path
      fill="currentColor"
      d="M8.5 3a5.5 5.5 0 0 1 4.38 8.83l3.15 3.15-1.06 1.06-3.15-3.15A5.5 5.5 0 1 1 8.5 3Zm0 1.5a4 4 0 1 0 0 8 4 4 0 0 0 0-8Z"
    ></path>
  </svg>
`;

const meta: Meta = {
  title: 'Components/Button',
  component: 'tyui-button',
  tags: ['autodocs', 'visual'],
  argTypes: {
    appearance: { control: 'select', options: appearances },
    disabled: { control: 'boolean' },
    disabledFocusable: { control: 'boolean', name: 'disabled-focusable' },
    iconPosition: { control: 'inline-radio', options: ['before', 'after'], name: 'icon-position' },
    shape: { control: 'select', options: shapes },
    size: { control: 'inline-radio', options: sizes },
    type: { control: 'inline-radio', options: ['button', 'submit', 'reset'] },
  },
};

export default meta;

type Story = StoryObj;

export const Default: Story = {
  render: () => html`<tyui-button>Save changes</tyui-button>`,
};

export const AppearanceMatrix: Story = {
  tags: ['visual'],
  render: () => html`
    <div style="display:flex;flex-wrap:wrap;gap:12px;align-items:center;">
      ${appearances.map(
        (appearance) => html` <tyui-button appearance=${appearance}>${appearance}</tyui-button> `,
      )}
    </div>
  `,
};

export const SizeMatrix: Story = {
  tags: ['visual'],
  render: () => html`
    <div style="display:flex;flex-wrap:wrap;gap:12px;align-items:center;">
      ${sizes.map((size) => html`<tyui-button size=${size}>${size}</tyui-button>`)}
    </div>
  `,
};

export const ShapeMatrix: Story = {
  tags: ['visual'],
  render: () => html`
    <div style="display:flex;flex-wrap:wrap;gap:12px;align-items:center;">
      ${shapes.map((shape) => html`<tyui-button shape=${shape}>${shape}</tyui-button>`)}
    </div>
  `,
};

export const WithIcon: Story = {
  tags: ['visual'],
  render: () => html`
    <div style="display:flex;flex-wrap:wrap;gap:12px;align-items:center;">
      <tyui-button appearance="primary">${searchIcon}Search</tyui-button>
      <tyui-button icon-position="after">Next${searchIcon}</tyui-button>
      <tyui-button appearance="subtle" aria-label="Search">${searchIcon}</tyui-button>
    </div>
  `,
};

export const DisabledStates: Story = {
  tags: ['visual'],
  render: () => html`
    <div style="display:flex;flex-wrap:wrap;gap:12px;align-items:center;">
      <tyui-button disabled>Disabled</tyui-button>
      <tyui-button disabled-focusable>Focusable disabled</tyui-button>
      <tyui-button appearance="primary" disabled>Primary disabled</tyui-button>
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
        style="box-sizing:border-box;width:min(100%,720px);padding:28px;display:grid;gap:20px;"
      >
        <div style="display:grid;gap:8px;">
          <div class="ty-metric-label">Atmospheric Glass</div>
          <div style="font-size:28px;font-weight:700;line-height:1.15;">Command surfaces</div>
        </div>
        <div style="display:flex;flex-wrap:wrap;gap:12px;align-items:center;">
          <tyui-button appearance="primary">Start session</tyui-button>
          <tyui-button appearance="subtle">Tune forecast</tyui-button>
          <tyui-button appearance="transparent">${searchIcon}Explore</tyui-button>
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
      style="box-sizing:border-box;min-height:360px;padding:32px;background:var(--ty-color-background);"
    >
      <section
        class="ty-fluent-panel"
        data-elevation="raised"
        style="box-sizing:border-box;width:min(100%,760px);padding:20px;display:grid;gap:18px;"
      >
        <div style="display:grid;gap:4px;">
          <div class="ty-fluent-title">Fluent Web commands</div>
          <div class="ty-fluent-caption">
            Neutral surfaces, compact spacing, and a single brand-blue primary action.
          </div>
        </div>
        <div class="ty-fluent-toolbar">
          <tyui-button appearance="primary">Save changes</tyui-button>
          <tyui-button>Preview</tyui-button>
          <tyui-button appearance="subtle">${searchIcon}Find</tyui-button>
          <tyui-button appearance="transparent">Cancel</tyui-button>
        </div>
        <div class="ty-fluent-toolbar">
          <tyui-button size="small">Small</tyui-button>
          <tyui-button size="medium">Medium</tyui-button>
          <tyui-button size="large">Large</tyui-button>
          <tyui-button shape="circular" aria-label="Search">${searchIcon}</tyui-button>
        </div>
      </section>
    </div>
  `,
};
