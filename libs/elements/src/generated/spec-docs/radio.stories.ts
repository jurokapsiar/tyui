import type { Meta, StoryObj } from '@storybook/web-components';
import { html } from 'lit';
import { unsafeHTML } from 'lit/directives/unsafe-html.js';
// nx-ignore-next-line
import { defineTyuiElements } from '@toyu-ui/define/all';
import '../../../../../design/alternatives/atmospheric-glass/theme.css';
import '../../../../../design/alternatives/atmospheric-glass/component-variants.css';
import '../../../../../design/alternatives/fluent-web/theme.css';
import '../../../../../design/alternatives/fluent-web/component-variants.css';

defineTyuiElements();

const examples: Array<{ title: string; code: string }> = [
  {
    "code": "<tyui-radio value=\"metric\" checked>Metric</tyui-radio>",
    "title": "Standalone Radio"
  },
  {
    "code": "<div style=\"display:flex;flex-wrap:wrap;gap:18px;align-items:start;\">\n  <tyui-radio value=\"after\" checked>Label after</tyui-radio>\n  <tyui-radio value=\"below\" label-position=\"below\" checked>Label below</tyui-radio>\n  <tyui-radio value=\"disabled\" disabled>Disabled</tyui-radio>\n</div>",
    "title": "Label Positions"
  }
];
const designs: Array<{ title: string; code: string }> = [];

const meta: Meta = {
  title: 'Components/Radio',
  tags: ['spec-docs'],
  parameters: {
    options: { showPanel: false },
  },
};

export default meta;

type Story = StoryObj;

const styles = html`
  <style>
    .ty-spec-doc {
      box-sizing: border-box;
      max-width: 920px;
      padding: 32px;
      color: CanvasText;
      font: 14px/1.55 system-ui, sans-serif;
    }

    .ty-spec-doc h1,
    .ty-spec-doc h2,
    .ty-spec-doc h3 {
      line-height: 1.2;
    }

    .ty-spec-doc h1 {
      margin: 0 0 20px;
      font-size: 28px;
    }

    .ty-spec-doc h2 {
      margin: 28px 0 12px;
      font-size: 20px;
    }

    .ty-spec-doc h3 {
      margin: 22px 0 10px;
      font-size: 16px;
    }

    .ty-spec-doc table {
      width: 100%;
      border-collapse: collapse;
      margin: 14px 0 22px;
      font-size: 13px;
    }

    .ty-spec-doc th,
    .ty-spec-doc td {
      border: 1px solid color-mix(in srgb, CanvasText 18%, Canvas);
      padding: 8px 10px;
      text-align: start;
      vertical-align: top;
    }

    .ty-spec-doc th {
      background: color-mix(in srgb, CanvasText 6%, Canvas);
      font-weight: 650;
    }

    .ty-spec-doc code {
      font-family: ui-monospace, SFMono-Regular, Menlo, Consolas, monospace;
      font-size: 0.92em;
    }

    .ty-spec-doc pre {
      overflow: auto;
      padding: 14px;
      border: 1px solid color-mix(in srgb, CanvasText 18%, Canvas);
      border-radius: 6px;
      background: color-mix(in srgb, CanvasText 5%, Canvas);
    }

    .ty-spec-example {
      display: grid;
      gap: 12px;
      margin: 0 0 28px;
    }

    .ty-spec-example-preview {
      padding: 18px;
      border: 1px solid color-mix(in srgb, CanvasText 16%, Canvas);
      border-radius: 6px;
    }
  </style>
`;

function markdownPage(markdown: string) {
  return html`<article class="ty-spec-doc">${styles}${unsafeHTML(markdown)}</article>`;
}

function examplesPage() {
  return html`<article class="ty-spec-doc">
    ${styles}
    <h1>Radio Examples</h1>
    ${examples.length > 0
      ? examples.map(renderExample)
      : html`<p>No Storybook examples are marked in the component spec yet.</p>`}
  </article>`;
}

function designsPage() {
  return html`<article class="ty-spec-doc">
    ${styles}
    <h1>Radio Designs</h1>
    ${designs.length > 0
      ? designs.map(renderExample)
      : html`<p>No design examples are marked in the component spec yet.</p>`}
  </article>`;
}

function renderExample(example: { title: string; code: string }) {
  return html`<section class="ty-spec-example">
    <h2>${example.title}</h2>
    <div class="ty-spec-example-preview">${unsafeHTML(example.code)}</div>
    <pre><code>${example.code}</code></pre>
  </section>`;
}

export const About: Story = {
  render: () => markdownPage("<h1>Radio</h1>\n<h2>Identity</h2>\n<ul>\n<li>Component name: Radio</li>\n<li>Tag name: <code>tyui-radio</code></li>\n<li>Package entry point: <code>@toyu-ui/elements/radio</code></li>\n<li>Status: planned / implementation-ready</li>\n<li>Source file: <code>libs/elements/src/radio/tyui-radio.ts</code></li>\n<li>Component family: form controls</li>\n<li>Pattern type: composite child item</li>\n<li>Closest native element or ARIA pattern: <code>&lt;input type=&quot;radio&quot;&gt;</code> inside a radio group</li>\n<li>Fluent / reference analogue: Fluent UI v9 Radio and <code>ds-radio</code></li>\n<li>Related components: <code>tyui-radio-group</code></li>\n</ul>\n<h2>Intent</h2>\n<p>Radio represents one option in a mutually exclusive set. It renders native radio semantics but delegates coordinated selection, roving tabindex, group value, and form association to <code>tyui-radio-group</code>.</p>\n<h2>Selection Guidance</h2>\n<ul>\n<li>Use when: the component appears as one child option inside <code>tyui-radio-group</code>.</li>\n<li>Do not use when: the user can select more than one option; use <code>tyui-checkbox</code> instead.</li>\n<li>Prefer instead: <code>tyui-radio-group</code> for public app markup because the group owns keyboarding, value, required state, and form submission.</li>\n<li>Product-level variant preferences: generated themes may tune indicator fill, label position, spacing, and focus tokens.</li>\n<li>One semantic target / one action rule: the radio indicator and label select the same option only.</li>\n</ul>"),
};

export const API: Story = {
  render: () => markdownPage("<h1>Radio API</h1>\n<h2>API</h2>\n<table><thead><tr><th>Attribute</th><th>Type</th><th>Reflected Property</th><th>Default</th><th>Description</th></tr></thead><tbody><tr><td><code>checked</code></td><td>boolean</td><td><code>checked</code></td><td><code>false</code></td><td>Whether this option is selected. Usually owned by the group.</td></tr><tr><td><code>disabled</code></td><td>boolean</td><td><code>disabled</code></td><td><code>false</code></td><td>Disables this option.</td></tr><tr><td><code>required</code></td><td>boolean</td><td><code>required</code></td><td><code>false</code></td><td>Propagated from group when required.</td></tr><tr><td><code>label-position</code></td><td><code>'after' | 'below'</code></td><td><code>labelPosition</code></td><td><code>'after'</code></td><td>Label placement.</td></tr><tr><td><code>name</code></td><td>string</td><td><code>name</code></td><td><code>''</code></td><td>Native radio name, usually propagated by group.</td></tr><tr><td><code>value</code></td><td>string</td><td><code>value</code></td><td><code>''</code></td><td>Option value used by group.</td></tr></tbody></table>\n<p>Radio does not dispatch a public <code>change</code> event by itself. The group dispatches <code>change</code> with <code>{ value }</code>.</p>\n<h2>CSS Parts</h2>\n<table><thead><tr><th>Name</th><th>Description</th></tr></thead><tbody><tr><td><code>root</code></td><td>Internal label wrapper.</td></tr><tr><td><code>indicator</code></td><td>Indicator wrapper.</td></tr><tr><td><code>circle</code></td><td>Decorative radio circle.</td></tr><tr><td><code>dot</code></td><td>Decorative selected dot.</td></tr><tr><td><code>label</code></td><td>Label content wrapper.</td></tr></tbody></table>"),
};

export const Examples: Story = {
  tags: ['visual'],
  render: () => examplesPage(),
};


export const ImplementationSpec: Story = {
  name: 'Implementation Spec',
  render: () => markdownPage("<h1>Radio Implementation Spec</h1>\n<h2>Composition Contract</h2>\n<ul>\n<li>Allowed children: phrasing content label in the default slot.</li>\n<li>Required parent: <code>tyui-radio-group</code> for production use.</li>\n<li>Allowed standalone use: only for low-level tests or native-like semantics without group coordination.</li>\n<li>Disallowed nested interactive content: buttons, links, inputs, menus, or focusable controls inside label content.</li>\n</ul>\n<h2>Styling Contract</h2>\n<h3>CSS Parts</h3>\n<table><thead><tr><th>Name</th><th>Description</th></tr></thead><tbody><tr><td><code>root</code></td><td>Internal label wrapper.</td></tr><tr><td><code>indicator</code></td><td>Indicator wrapper.</td></tr><tr><td><code>circle</code></td><td>Decorative radio circle.</td></tr><tr><td><code>dot</code></td><td>Decorative selected dot.</td></tr><tr><td><code>label</code></td><td>Label content wrapper.</td></tr></tbody></table>\n<h3>Public Tokens</h3>\n<table><thead><tr><th>Name</th><th>Default</th><th>Description</th></tr></thead><tbody><tr><td><code>--ty-radio-size</code></td><td><code>1rem</code></td><td>Circle size.</td></tr><tr><td><code>--ty-radio-dot-size</code></td><td><code>0.5rem</code></td><td>Selected dot size.</td></tr><tr><td><code>--ty-radio-gap</code></td><td><code>--ty-space-2</code></td><td>Circle-label gap.</td></tr><tr><td><code>--ty-radio-border-color</code></td><td><code>--ty-color-border-strong</code></td><td>Circle border.</td></tr><tr><td><code>--ty-radio-checked-color</code></td><td><code>--ty-color-accent</code></td><td>Checked circle fill and border.</td></tr><tr><td><code>--ty-radio-checked-dot-color</code></td><td><code>--ty-color-on-accent</code></td><td>Dot color on the checked fill.</td></tr><tr><td><code>--ty-radio-disabled-foreground</code></td><td><code>--ty-color-disabled-text</code></td><td>Disabled label and indicator.</td></tr></tbody></table>\n<h2>Behavior</h2>\n<ul>\n<li>Native element used: internal <code>&lt;input type=&quot;radio&quot;&gt;</code> wrapped by <code>&lt;label&gt;</code>.</li>\n<li>Focus owner: native shadow input. The host uses <code>delegatesFocus</code>, but keyboard focus must land on the internal <code>&lt;input type=&quot;radio&quot;&gt;</code> for reliable browser tabbing.</li>\n<li>Roving tabindex: parent group sets host <code>tabIndex</code>; <code>tyui-radio</code> must preserve a parent-assigned <code>tabIndex=0</code> when it connects and mirror that active tab stop to the inner input. Inactive radios keep both host and input at <code>tabIndex=-1</code>.</li>\n<li>Label click: native label routes click to inner input; group hears the composed click on the host.</li>\n<li>Disabled: inner input disabled and host is removed from group tab order.</li>\n<li>Form: standalone radio is not form-associated; group owns form submission.</li>\n</ul>\n<h2>Keyboard Contract</h2>\n<table><thead><tr><th>Key</th><th>Context</th><th>Action</th><th>Prevent Default</th><th>Event</th><th>Notes</th></tr></thead><tbody><tr><td><code>Space</code></td><td>Standalone focused radio input</td><td>Selects the native radio.</td><td>Native behavior</td><td>Native <code>change</code> on inner input</td><td>Provided by <code>&lt;input type=&quot;radio&quot;&gt;</code>; no custom host handler.</td></tr><tr><td><code>Space</code></td><td>Radio inside <code>tyui-radio-group</code></td><td>Parent group selects the focused radio if unchecked.</td><td>Yes, by group</td><td>Group <code>change</code> with <code>{ value }</code></td><td>Group owns public state and event.</td></tr><tr><td><code>ArrowRight</code> / <code>ArrowDown</code></td><td>Radio inside group</td><td>Move focus and selection to next enabled radio, wrapping.</td><td>Yes, by group</td><td>Group <code>change</code> when value changes</td><td>Both axes are accepted in all layouts.</td></tr><tr><td><code>ArrowLeft</code> / <code>ArrowUp</code></td><td>Radio inside group</td><td>Move focus and selection to previous enabled radio, wrapping.</td><td>Yes, by group</td><td>Group <code>change</code> when value changes</td><td>Disabled radios are skipped.</td></tr><tr><td><code>Tab</code></td><td>Group entry</td><td>Enters the one radio with <code>tabIndex=0</code> and delegates focus to its native input.</td><td>No</td><td>none</td><td>Checked enabled radio wins; otherwise first enabled radio.</td></tr></tbody></table>\n<p>Verification note: standalone Space selection is intentionally delegated to the native shadow <code>&lt;input type=&quot;radio&quot;&gt;</code>. Synthetic unit tests cannot trigger trusted native keyboard defaults reliably, so browser verification must focus the host and press Space. Group arrow/Space behavior is custom and covered by deterministic element tests.</p>\n<h2>Accessibility</h2>\n<p>The native radio input owns the radio semantics. Decorative circle and dot are hidden from assistive technology. <code>label-position</code> changes visual layout only.</p>\n<h2>Tests</h2>\n<table><thead><tr><th>Requirement</th><th>Setup</th><th>Action</th><th>Validation</th></tr></thead><tbody><tr><td>Native radio exists.</td><td>Mount <code>&lt;tyui-radio value=&quot;a&quot;&gt;A&lt;/tyui-radio&gt;</code>.</td><td>Query shadow DOM.</td><td><code>input[type='radio']</code> exists; value is <code>a</code>.</td></tr><tr><td>Checked syncs.</td><td>Mount with <code>checked</code>.</td><td>Inspect input.</td><td>Input is checked.</td></tr><tr><td>Disabled syncs.</td><td>Mount with <code>disabled</code>.</td><td>Inspect input/host.</td><td>Input disabled; host <code>tabIndex=-1</code>.</td></tr><tr><td>Standalone default is not tabbable.</td><td>Mount enabled radio.</td><td>Inspect host/input.</td><td>Host and input are <code>tabIndex=-1</code> unless a group or consumer assigns the tab stop.</td></tr><tr><td>Parent roving tab stop preserved.</td><td>Set <code>radio.tabIndex=0</code> before connecting.</td><td>Append to DOM.</td><td>Host remains <code>tabIndex=0</code>; inner input mirrors <code>tabIndex=0</code>.</td></tr><tr><td>Label position reflects.</td><td>Mount <code>label-position=&quot;below&quot;</code>.</td><td>Inspect part/root data.</td><td>Visual layout state is below.</td></tr><tr><td>Native label activation.</td><td>Mount standalone radio.</td><td>Click slotted label.</td><td>Native input becomes checked.</td></tr><tr><td>Native Space activation.</td><td>Mount standalone radio in a real browser.</td><td>Focus host, press Space.</td><td>Native input becomes checked.</td></tr><tr><td>Browser Tab entry.</td><td>Mount radio group in direct Vite e2e fixture with value <code>b</code>.</td><td>Start from <code>body</code>, press <code>Tab</code>.</td><td>Document focus is the active <code>tyui-radio</code>; its shadow <code>input</code> is focused; inactive radios remain <code>tabIndex=-1</code>.</td></tr><tr><td>Browser arrow movement.</td><td>Continue from focused checked radio in direct Vite e2e fixture.</td><td>Press <code>ArrowRight</code>.</td><td>Group value changes to next enabled radio; focus moves to that radio's shadow <code>input</code>; roving tab stop updates.</td></tr><tr><td>Styling hooks exist.</td><td>Mount radio.</td><td>Query parts.</td><td><code>root</code>, <code>indicator</code>, <code>circle</code>, <code>dot</code>, <code>label</code> exist.</td></tr><tr><td>Checked visual is filled.</td><td>Mount radio with <code>checked</code>.</td><td>Inspect CSS/styling.</td><td>Circle fill uses <code>--ty-radio-checked-color</code>; dot uses <code>--ty-radio-checked-dot-color</code>.</td></tr></tbody></table>"),
};
