import type { Meta, StoryObj } from '@storybook/web-components';
import { html } from 'lit';
import { unsafeHTML } from 'lit/directives/unsafe-html.js';
// nx-ignore-next-line
import { defineTyuiElements } from '@tyui/define/all';
import '../../../../../design/alternatives/atmospheric-glass/theme.css';
import '../../../../../design/alternatives/atmospheric-glass/component-variants.css';
import '../../../../../design/alternatives/fluent-web/theme.css';
import '../../../../../design/alternatives/fluent-web/component-variants.css';

defineTyuiElements();

const examples: Array<{ title: string; code: string }> = [
  {
    code: '<tyui-checkbox>Receive notifications</tyui-checkbox>',
    title: 'Default',
  },
  {
    code: '<div style="display:grid;gap:12px;align-items:start;">\n  <tyui-checkbox>Unchecked</tyui-checkbox>\n  <tyui-checkbox checked>Checked</tyui-checkbox>\n  <tyui-checkbox indeterminate>Indeterminate</tyui-checkbox>\n  <tyui-checkbox disabled>Disabled</tyui-checkbox>\n  <tyui-checkbox disabled checked>Disabled checked</tyui-checkbox>\n  <tyui-checkbox disabled indeterminate>Disabled indeterminate</tyui-checkbox>\n  <tyui-checkbox required>Required</tyui-checkbox>\n</div>',
    title: 'States',
  },
];
const designs: Array<{ title: string; code: string }> = [
  {
    code: '<div\n  data-design-system="atmospheric-glass"\n  style="box-sizing:border-box;min-height:320px;padding:40px;display:flex;align-items:center;justify-content:center;"\n>\n  <section\n    class="ty-glass-surface"\n    data-elevation="elevated"\n    data-shine="true"\n    style="box-sizing:border-box;width:min(100%,560px);padding:28px;display:grid;gap:16px;"\n  >\n    <div class="ty-metric-label">Atmospheric Glass</div>\n    <tyui-checkbox checked>Include wind alerts</tyui-checkbox>\n    <tyui-checkbox indeterminate>Some regions selected</tyui-checkbox>\n    <tyui-checkbox>Show experimental layers</tyui-checkbox>\n  </section>\n</div>',
    title: 'Atmospheric Glass',
  },
  {
    code: '<div\n  data-design-system="fluent-web"\n  style="box-sizing:border-box;min-height:320px;padding:32px;background:var(--ty-color-background);"\n>\n  <section\n    class="ty-fluent-panel"\n    data-elevation="raised"\n    style="box-sizing:border-box;width:min(100%,560px);padding:20px;display:grid;gap:14px;"\n  >\n    <div>\n      <div class="ty-fluent-title">Preferences</div>\n      <div class="ty-fluent-caption">Independent choices use checkboxes.</div>\n    </div>\n    <tyui-checkbox checked>Email me updates</tyui-checkbox>\n    <tyui-checkbox>Enable preview features</tyui-checkbox>\n    <tyui-checkbox indeterminate>Some teams selected</tyui-checkbox>\n  </section>\n</div>',
    title: 'Fluent Web',
  },
];

const meta: Meta = {
  title: 'Components/Checkbox',
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
      font:
        14px/1.55 system-ui,
        sans-serif;
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
    <h1>Checkbox Examples</h1>
    ${examples.length > 0
      ? examples.map(renderExample)
      : html`<p>No Storybook examples are marked in the component spec yet.</p>`}
  </article>`;
}

function designsPage() {
  return html`<article class="ty-spec-doc">
    ${styles}
    <h1>Checkbox Designs</h1>
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
  render: () =>
    markdownPage(
      '<h1>Checkbox</h1>\n<h2>Identity</h2>\n<ul>\n<li>Component name: Checkbox</li>\n<li>Tag name: <code>tyui-checkbox</code></li>\n<li>Package entry point: <code>@tyui/elements/checkbox</code></li>\n<li>Status: planned / implementation-ready</li>\n<li>Source file: <code>libs/elements/src/checkbox/tyui-checkbox.ts</code></li>\n<li>Component family: form controls</li>\n<li>Pattern type: native-like form-associated control</li>\n<li>Closest native element or ARIA pattern: <code>&lt;input type=&quot;checkbox&quot;&gt;</code></li>\n<li>Fluent / reference analogue: Fluent UI v9 Checkbox</li>\n<li>Related components: <code>tyui-input</code>, <code>tyui-radio</code>, <code>tyui-radio-group</code></li>\n</ul>\n<h2>Intent</h2>\n<p>Checkbox captures an independent yes/no choice, optionally with an indeterminate mixed state for parent/child selection summaries. It must preserve native checkbox semantics through an inner checkbox input while exposing TYUI styling hooks for generated design bundles.</p>\n<p>Do not use Checkbox for mutually exclusive choices; use <code>tyui-radio-group</code> with <code>tyui-radio</code> children instead.</p>\n<h2>Selection Guidance</h2>\n<ul>\n<li>Use when: the user can toggle one independent option, accept a term, or mark an item as included.</li>\n<li>Do not use when: exactly one option from a set must be selected.</li>\n<li>Prefer instead: <code>tyui-radio-group</code> for mutually exclusive choices.</li>\n<li>Product-level variant preferences: generated themes may tune box, color, spacing, and focus tokens.</li>\n<li>One semantic target / one action rule: the label and box activate the same checkbox only.</li>\n</ul>',
    ),
};

export const API: Story = {
  render: () =>
    markdownPage(
      "<h1>Checkbox API</h1>\n<h2>API</h2>\n<h3>Attributes</h3>\n<table><thead><tr><th>Name</th><th>Type</th><th>Reflected Property</th><th>Default</th><th>Description</th></tr></thead><tbody><tr><td><code>checked</code></td><td>boolean</td><td><code>checked</code></td><td><code>false</code></td><td>Checked state.</td></tr><tr><td><code>indeterminate</code></td><td>boolean</td><td><code>indeterminate</code></td><td><code>false</code></td><td>Mixed visual state. Does not submit.</td></tr><tr><td><code>disabled</code></td><td>boolean</td><td><code>disabled</code></td><td><code>false</code></td><td>Disables native input and removes host from tab order.</td></tr><tr><td><code>required</code></td><td>boolean</td><td><code>required</code></td><td><code>false</code></td><td>Requires checked state for validity.</td></tr><tr><td><code>name</code></td><td>string</td><td><code>name</code></td><td><code>''</code></td><td>Submitted form field name.</td></tr><tr><td><code>value</code></td><td>string</td><td><code>value</code></td><td><code>'on'</code></td><td>Submitted value when checked and not indeterminate.</td></tr></tbody></table>\n<h3>Events</h3>\n<table><thead><tr><th>Name</th><th>Detail Type</th><th>Bubbles</th><th>Composed</th><th>Description</th></tr></thead><tbody><tr><td><code>change</code></td><td>none</td><td>yes</td><td>yes</td><td>Fired after user toggles checked/indeterminate state.</td></tr></tbody></table>\n<p>Programmatic property or attribute changes do not emit <code>change</code>.</p>\n<h2>Slots</h2>\n<table><thead><tr><th>Name</th><th>Description</th></tr></thead><tbody><tr><td>default</td><td>Label text/content.</td></tr></tbody></table>\n<h2>CSS Parts</h2>\n<table><thead><tr><th>Name</th><th>Description</th></tr></thead><tbody><tr><td><code>control</code></td><td>Internal label/control row.</td></tr><tr><td><code>box</code></td><td>Decorative checkbox square.</td></tr><tr><td><code>label</code></td><td>Label content wrapper.</td></tr></tbody></table>\n<h2>Events</h2>\n<table><thead><tr><th>Name</th><th>Detail Type</th><th>Bubbles</th><th>Composed</th><th>Description</th></tr></thead><tbody><tr><td><code>change</code></td><td>none</td><td>yes</td><td>yes</td><td>Fired after user toggles checked/indeterminate state.</td></tr></tbody></table>\n<p>Programmatic property or attribute changes do not emit <code>change</code>.</p>",
    ),
};

export const Examples: Story = {
  tags: ['visual'],
  render: () => examplesPage(),
};

export const Designs: Story = {
  name: 'Examples/Designs',
  tags: ['visual'],
  render: () => designsPage(),
};

export const ImplementationSpec: Story = {
  name: 'Implementation Spec',
  render: () =>
    markdownPage(
      "<h1>Checkbox Implementation Spec</h1>\n<h2>Composition Contract</h2>\n<ul>\n<li>Allowed children: phrasing content in the default slot.</li>\n<li>Required parent: none.</li>\n<li>Required child components: none.</li>\n<li>Optional child components: none.</li>\n<li>Allowed slots: default label slot.</li>\n<li>Disallowed nested interactive content: links, buttons, inputs, checkboxes, radios, menus, or any focusable controls inside the label slot.</li>\n<li>Composition anti-patterns: using <code>indeterminate</code> as a submitted third value; indeterminate is visual/semantic mixed state and does not submit.</li>\n</ul>\n<h2>Styling Contract</h2>\n<h3>Slots</h3>\n<table><thead><tr><th>Name</th><th>Description</th></tr></thead><tbody><tr><td>default</td><td>Label text/content.</td></tr></tbody></table>\n<h3>CSS Parts</h3>\n<table><thead><tr><th>Name</th><th>Description</th></tr></thead><tbody><tr><td><code>control</code></td><td>Internal label/control row.</td></tr><tr><td><code>box</code></td><td>Decorative checkbox square.</td></tr><tr><td><code>label</code></td><td>Label content wrapper.</td></tr></tbody></table>\n<h3>Public Tokens</h3>\n<table><thead><tr><th>Name</th><th>Default</th><th>Description</th></tr></thead><tbody><tr><td><code>--ty-checkbox-size</code></td><td><code>1rem</code></td><td>Visual box size.</td></tr><tr><td><code>--ty-checkbox-radius</code></td><td><code>--ty-radius-1</code></td><td>Box radius.</td></tr><tr><td><code>--ty-checkbox-gap</code></td><td><code>--ty-space-2</code></td><td>Box-label gap.</td></tr><tr><td><code>--ty-checkbox-border-color</code></td><td><code>--ty-color-border-strong</code></td><td>Resting box border.</td></tr><tr><td><code>--ty-checkbox-background</code></td><td><code>--ty-color-surface</code></td><td>Resting box background.</td></tr><tr><td><code>--ty-checkbox-checked-background</code></td><td><code>--ty-color-accent</code></td><td>Checked box background.</td></tr><tr><td><code>--ty-checkbox-checked-foreground</code></td><td><code>--ty-color-on-accent</code></td><td>Check mark color.</td></tr><tr><td><code>--ty-checkbox-indeterminate-foreground</code></td><td><code>--ty-color-accent</code></td><td>Mixed mark color.</td></tr><tr><td><code>--ty-checkbox-disabled-foreground</code></td><td><code>--ty-color-disabled-text</code></td><td>Disabled label and mark color.</td></tr></tbody></table>\n<p>Private helper variables use <code>--_ty-checkbox-*</code> and are not consumer hooks.</p>\n<h3>Styling State Surface</h3>\n<table><thead><tr><th>State</th><th>Surface</th><th>Public</th><th>Notes</th></tr></thead><tbody><tr><td>checked</td><td>host <code>[checked]</code> and native input checked</td><td>yes</td><td>Selection styling hook.</td></tr><tr><td>indeterminate</td><td>host <code>[indeterminate]</code> and native input indeterminate</td><td>yes</td><td>Mixed styling hook.</td></tr><tr><td>disabled</td><td>host <code>[disabled]</code> and native input disabled</td><td>yes</td><td>Removes normal interaction.</td></tr><tr><td>required</td><td>host <code>[required]</code> and native input required</td><td>yes</td><td>Validation styling hook.</td></tr><tr><td>focus</td><td><code>:host(:focus-within)</code></td><td>yes</td><td>Used because focus delegates to hidden native input.</td></tr></tbody></table>\n<h2>Behavior</h2>\n<ul>\n<li>Native element used: internal <code>&lt;input type=&quot;checkbox&quot;&gt;</code> wrapped by a <code>&lt;label&gt;</code>.</li>\n<li>Native behavior preserved: role, checked/mixed semantics, disabled, label click, Space toggle.</li>\n<li>Custom behavior added: host <code>.click()</code> forwards to the native input for programmatic/test activation; shadow <code>change</code> is re-dispatched from the host.</li>\n<li>Focus owner: host delegates focus to the native input.</li>\n<li>Tabbable elements: host is <code>tabIndex=0</code> when enabled, <code>-1</code> when disabled; inner input is visually hidden.</li>\n<li>Keyboard: Space toggles natively when focused; synthetic Space may be forwarded for deterministic tests.</li>\n<li>Pointer: clicking the host or label toggles when enabled.</li>\n<li>Indeterminate interaction: user toggle clears <code>indeterminate</code> and updates <code>checked</code>.</li>\n<li>Form-associated: yes.</li>\n<li>Submitted value: <code>name=value</code> only when checked and not indeterminate.</li>\n<li>Validity: required unchecked is <code>valueMissing</code>; checked is valid.</li>\n<li>Disabled: disabled controls do not submit and are valid.</li>\n</ul>\n<h2>Layout Contract</h2>\n<ul>\n<li>Display: <code>inline-flex</code>.</li>\n<li>Intrinsic size: content-sized from box, gap, and label.</li>\n<li>Wrap policy: label can wrap; box is fixed.</li>\n<li>Minimum visual target: component should remain at least token-sized and may be enlarged by product tokens.</li>\n<li>Parent owns: outer margin, stretching, row/column arrangement.</li>\n<li>Component owns: internal label alignment, box size, gap, focus ring.</li>\n</ul>\n<h2>Accessibility</h2>\n<ul>\n<li>The native input owns checkbox semantics.</li>\n<li>The slotted label is associated through the wrapping label.</li>\n<li>Decorative box is <code>aria-hidden</code>.</li>\n<li>Preserve consumer ARIA on the host unless a field wrapper supplies explicit relationships in the future.</li>\n<li>Forced-colors mode must use system colors for box, disabled, and focus.</li>\n</ul>\n<h2>Tests</h2>\n<table><thead><tr><th>Requirement</th><th>Setup</th><th>Action</th><th>Validation</th></tr></thead><tbody><tr><td>Native checkbox exists.</td><td>Mount <code>&lt;tyui-checkbox&gt;Label&lt;/tyui-checkbox&gt;</code>.</td><td>Query shadow DOM.</td><td><code>input[type='checkbox']</code> exists; host is tabbable.</td></tr><tr><td>Click toggles.</td><td>Mount enabled checkbox with change spy.</td><td>Call host <code>.click()</code>.</td><td><code>checked=true</code>; one composed bubbling <code>change</code> fires.</td></tr><tr><td>Space toggles.</td><td>Focus checkbox.</td><td>Dispatch Space keydown.</td><td>State toggles and <code>change</code> fires.</td></tr><tr><td>Indeterminate clears on user toggle.</td><td>Mount <code>indeterminate</code>.</td><td>Click host.</td><td><code>indeterminate=false</code>; <code>checked=true</code>.</td></tr><tr><td>Disabled blocks interaction.</td><td>Mount <code>disabled</code>.</td><td>Click host.</td><td>State does not change; input disabled; host <code>tabIndex=-1</code>.</td></tr><tr><td>Form submission.</td><td>Put named checked checkbox in a form.</td><td>Construct <code>FormData</code>.</td><td>Submitted value is <code>on</code> by default.</td></tr><tr><td>Required validity.</td><td>Mount required unchecked then checked.</td><td>Call <code>checkValidity()</code>.</td><td>Unchecked is invalid; checked is valid.</td></tr><tr><td>Styling hooks exist.</td><td>Mount states.</td><td>Inspect shadow parts and host attrs.</td><td><code>control</code>, <code>box</code>, <code>label</code> parts exist and state attrs reflect.</td></tr></tbody></table>",
    ),
};
