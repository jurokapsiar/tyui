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
    "code": "<tyui-radio-group label=\"Pick one\" name=\"choice\">\n  <tyui-radio value=\"a\">Option A</tyui-radio>\n  <tyui-radio value=\"b\">Option B</tyui-radio>\n  <tyui-radio value=\"c\">Option C</tyui-radio>\n</tyui-radio-group>",
    "title": "Default"
  },
  {
    "code": "<tyui-radio-group label=\"Pick one\" name=\"choice\" value=\"b\">\n  <tyui-radio value=\"a\">Option A</tyui-radio>\n  <tyui-radio value=\"b\">Option B</tyui-radio>\n  <tyui-radio value=\"c\">Option C</tyui-radio>\n</tyui-radio-group>",
    "title": "Selected"
  },
  {
    "code": "<div style=\"display:grid;gap:24px;\">\n  <tyui-radio-group label=\"vertical\" layout=\"vertical\" value=\"b\">\n    <tyui-radio value=\"a\">A</tyui-radio>\n    <tyui-radio value=\"b\">B</tyui-radio>\n    <tyui-radio value=\"c\">C</tyui-radio>\n  </tyui-radio-group>\n  <tyui-radio-group label=\"horizontal\" layout=\"horizontal\" value=\"b\">\n    <tyui-radio value=\"a\">A</tyui-radio>\n    <tyui-radio value=\"b\">B</tyui-radio>\n    <tyui-radio value=\"c\">C</tyui-radio>\n  </tyui-radio-group>\n  <tyui-radio-group label=\"horizontal-stacked\" layout=\"horizontal-stacked\" value=\"b\">\n    <tyui-radio value=\"a\">A</tyui-radio>\n    <tyui-radio value=\"b\">B</tyui-radio>\n    <tyui-radio value=\"c\">C</tyui-radio>\n  </tyui-radio-group>\n</div>",
    "title": "Layouts"
  }
];
const designs: Array<{ title: string; code: string }> = [
  {
    "code": "<div\n  data-design-system=\"atmospheric-glass\"\n  style=\"box-sizing:border-box;min-height:360px;padding:40px;display:flex;align-items:center;justify-content:center;\"\n>\n  <section\n    class=\"ty-glass-surface\"\n    data-elevation=\"elevated\"\n    data-shine=\"true\"\n    style=\"box-sizing:border-box;width:min(100%,640px);padding:28px;display:grid;gap:18px;\"\n  >\n    <div class=\"ty-metric-label\">Atmospheric Glass</div>\n    <tyui-radio-group label=\"Temperature units\" layout=\"horizontal-stacked\" value=\"metric\">\n      <tyui-radio value=\"imperial\">Fahrenheit</tyui-radio>\n      <tyui-radio value=\"metric\">Celsius</tyui-radio>\n      <tyui-radio value=\"kelvin\">Kelvin</tyui-radio>\n    </tyui-radio-group>\n  </section>\n</div>",
    "title": "Atmospheric Glass"
  },
  {
    "code": "<div\n  data-design-system=\"fluent-web\"\n  style=\"box-sizing:border-box;min-height:360px;padding:32px;background:var(--ty-color-background);\"\n>\n  <section\n    class=\"ty-fluent-panel\"\n    data-elevation=\"raised\"\n    style=\"box-sizing:border-box;width:min(100%,640px);padding:20px;display:grid;gap:18px;\"\n  >\n    <div>\n      <div class=\"ty-fluent-title\">Default view</div>\n      <div class=\"ty-fluent-caption\">Mutually exclusive choices use a radio group.</div>\n    </div>\n    <tyui-radio-group label=\"Startup page\" value=\"dashboard\">\n      <tyui-radio value=\"dashboard\">Dashboard</tyui-radio>\n      <tyui-radio value=\"activity\">Activity</tyui-radio>\n      <tyui-radio value=\"settings\">Settings</tyui-radio>\n    </tyui-radio-group>\n  </section>\n</div>",
    "title": "Fluent Web"
  }
];

const meta: Meta = {
  title: 'Components/RadioGroup',
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
    <h1>RadioGroup Examples</h1>
    ${examples.length > 0
      ? examples.map(renderExample)
      : html`<p>No Storybook examples are marked in the component spec yet.</p>`}
  </article>`;
}

function designsPage() {
  return html`<article class="ty-spec-doc">
    ${styles}
    <h1>RadioGroup Designs</h1>
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
  render: () => markdownPage("<h1>RadioGroup</h1>\n<h2>Identity</h2>\n<ul>\n<li>Component name: RadioGroup</li>\n<li>Tag name: <code>tyui-radio-group</code></li>\n<li>Package entry point: <code>@toyu-ui/elements/radio-group</code></li>\n<li>Status: planned / implementation-ready</li>\n<li>Source file: <code>libs/elements/src/radio-group/tyui-radio-group.ts</code></li>\n<li>Component family: form controls</li>\n<li>Pattern type: composite form-associated widget</li>\n<li>Closest native element or ARIA pattern: ARIA <code>radiogroup</code> with native radio children</li>\n<li>Fluent / reference analogue: Fluent UI v9 RadioGroup and <code>ds-radio-group</code></li>\n<li>Related components: <code>tyui-radio</code></li>\n</ul>\n<h2>Intent</h2>\n<p>RadioGroup lets the user select exactly one option from a small set. It owns shared value, selection synchronization, roving tabindex, keyboard navigation, required state, disabled state, and form submission for child <code>tyui-radio</code> items.</p>\n<h2>Selection Guidance</h2>\n<ul>\n<li>Use when: the user must choose one option from a small visible set.</li>\n<li>Do not use when: options can be combined, hidden in a long list, or loaded through search.</li>\n<li>Prefer instead: <code>tyui-checkbox</code> for independent choices and future <code>tyui-select</code> for compact long lists.</li>\n<li>Product-level variant preferences: generated themes may tune layout gaps, label treatment, radio indicator tokens, and focus tokens.</li>\n<li>One semantic target / one action rule: each child radio selects exactly one group value.</li>\n</ul>"),
};

export const API: Story = {
  render: () => markdownPage("<h1>RadioGroup API</h1>\n<h2>API</h2>\n<table><thead><tr><th>Attribute</th><th>Type</th><th>Reflected Property</th><th>Default</th><th>Description</th></tr></thead><tbody><tr><td><code>label</code></td><td>string</td><td><code>label</code></td><td><code>''</code></td><td>Internal group label text when no external <code>aria-labelledby</code> is supplied.</td></tr><tr><td><code>name</code></td><td>string</td><td><code>name</code></td><td><code>''</code></td><td>Submitted form field name and child radio name.</td></tr><tr><td><code>value</code></td><td>string</td><td><code>value</code></td><td><code>''</code></td><td>Current selected option value.</td></tr><tr><td><code>layout</code></td><td><code>'vertical' | 'horizontal' | 'horizontal-stacked'</code></td><td><code>layout</code></td><td><code>'vertical'</code></td><td>Group layout.</td></tr><tr><td><code>disabled</code></td><td>boolean</td><td><code>disabled</code></td><td><code>false</code></td><td>Disables the whole group.</td></tr><tr><td><code>required</code></td><td>boolean</td><td><code>required</code></td><td><code>false</code></td><td>Requires one selected value.</td></tr></tbody></table>\n<h3>Events</h3>\n<table><thead><tr><th>Name</th><th>Detail Type</th><th>Bubbles</th><th>Composed</th><th>Description</th></tr></thead><tbody><tr><td><code>change</code></td><td><code>{ value: string }</code></td><td>yes</td><td>yes</td><td>Fired when user selection changes.</td></tr></tbody></table>\n<p>Programmatic <code>value</code> changes do not emit <code>change</code>.</p>\n<h2>Slots</h2>\n<table><thead><tr><th>Name</th><th>Description</th></tr></thead><tbody><tr><td>default</td><td>Child radios.</td></tr><tr><td><code>label</code></td><td>Optional external visual label content.</td></tr></tbody></table>\n<h2>CSS Parts</h2>\n<table><thead><tr><th>Name</th><th>Description</th></tr></thead><tbody><tr><td><code>label</code></td><td>Generated or slotted label wrapper.</td></tr><tr><td><code>items</code></td><td>Wrapper around radio children.</td></tr></tbody></table>\n<h2>Events</h2>\n<table><thead><tr><th>Name</th><th>Detail Type</th><th>Bubbles</th><th>Composed</th><th>Description</th></tr></thead><tbody><tr><td><code>change</code></td><td><code>{ value: string }</code></td><td>yes</td><td>yes</td><td>Fired when user selection changes.</td></tr></tbody></table>\n<p>Programmatic <code>value</code> changes do not emit <code>change</code>.</p>"),
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
  render: () => markdownPage("<h1>RadioGroup Implementation Spec</h1>\n<h2>Composition Contract</h2>\n<ul>\n<li>Allowed children: <code>tyui-radio</code> elements and optional non-interactive text nodes.</li>\n<li>Required child components: one or more <code>tyui-radio</code> for useful interaction.</li>\n<li>Allowed slots: default radios; optional <code>label</code> slot.</li>\n<li>Disallowed nested interactive content: non-radio inputs, buttons, links, or nested composites as selectable items.</li>\n<li>Composition anti-patterns: using checkboxes for mutually exclusive choices; manually setting multiple checked radios after connection.</li>\n</ul>\n<h2>Styling Contract</h2>\n<h3>Slots</h3>\n<table><thead><tr><th>Name</th><th>Description</th></tr></thead><tbody><tr><td>default</td><td>Child radios.</td></tr><tr><td><code>label</code></td><td>Optional external visual label content.</td></tr></tbody></table>\n<h3>CSS Parts</h3>\n<table><thead><tr><th>Name</th><th>Description</th></tr></thead><tbody><tr><td><code>label</code></td><td>Generated or slotted label wrapper.</td></tr><tr><td><code>items</code></td><td>Wrapper around radio children.</td></tr></tbody></table>\n<h3>Public Tokens</h3>\n<table><thead><tr><th>Name</th><th>Default</th><th>Description</th></tr></thead><tbody><tr><td><code>--ty-radio-group-gap</code></td><td><code>--ty-space-2</code></td><td>Gap between label/items or vertical radios.</td></tr><tr><td><code>--ty-radio-group-inline-gap</code></td><td><code>--ty-space-4</code></td><td>Gap for horizontal layouts.</td></tr><tr><td><code>--ty-radio-group-label-color</code></td><td><code>--ty-color-text</code></td><td>Label color.</td></tr><tr><td><code>--ty-radio-group-disabled-foreground</code></td><td><code>--ty-color-disabled-text</code></td><td>Disabled label color.</td></tr></tbody></table>\n<h2>Behavior</h2>\n<ul>\n<li>State owner: group owns <code>value</code>; children expose checked state as synchronized view.</li>\n<li>Initial value: <code>value</code> attribute selects matching radio; if no value is supplied, the first checked child is adopted.</li>\n<li>Click: clicking an enabled child selects it and fires one <code>change</code> unless already selected.</li>\n<li>Keyboard: ArrowRight/ArrowDown select next enabled radio; ArrowLeft/ArrowUp select previous enabled radio; navigation wraps and skips disabled radios. Space selects focused unchecked radio.</li>\n<li>Focus: one enabled radio has <code>tabIndex=0</code>; checked enabled radio wins, otherwise first enabled radio.</li>\n<li>Disabled group: sets <code>aria-disabled=&quot;true&quot;</code>, removes child radios from tab order, and blocks click/key selection.</li>\n<li>Layout: <code>horizontal-stacked</code> propagates <code>label-position=&quot;below&quot;</code> to child radios; other layouts use <code>after</code>.</li>\n<li>Form-associated: yes.</li>\n<li>Submitted value: <code>name=value</code> when a value is selected and group is not disabled.</li>\n<li>Required: host <code>aria-required=&quot;true&quot;</code>, children required, and missing value is invalid.</li>\n<li>Name propagation: explicit group <code>name</code> wins; otherwise unnamed children get a generated shared fallback name while child-supplied names are preserved.</li>\n</ul>\n<h2>Accessibility</h2>\n<ul>\n<li>Host role defaults to <code>radiogroup</code> if consumer did not set one.</li>\n<li>If <code>aria-labelledby</code> is supplied, preserve it. Otherwise generate a stable internal label ID from the <code>label</code> attribute or <code>label</code> slot.</li>\n<li>Child radios keep native radio semantics.</li>\n<li>ID references across shadow boundaries are avoided for child labels; the group label relationship is host-owned.</li>\n</ul>\n<h2>Tests</h2>\n<table><thead><tr><th>Requirement</th><th>Setup</th><th>Action</th><th>Validation</th></tr></thead><tbody><tr><td>Role and label.</td><td>Mount with <code>label</code> and radios.</td><td>Inspect host/shadow label.</td><td><code>role=radiogroup</code>; <code>aria-labelledby</code> points to generated label.</td></tr><tr><td>Value selects child.</td><td>Mount with <code>value=&quot;b&quot;</code>.</td><td>Inspect children.</td><td>Only radio <code>b</code> checked.</td></tr><tr><td>First enabled tab stop.</td><td>Mount no value with first radio disabled.</td><td>Inspect tabIndex.</td><td>First enabled child is <code>0</code>; others <code>-1</code>.</td></tr><tr><td>Click selection.</td><td>Mount with listener.</td><td>Click second radio.</td><td>Value changes, checked states sync, one composed bubbling change has <code>{ value }</code>.</td></tr><tr><td>No duplicate change.</td><td>Mount selected radio.</td><td>Click selected radio.</td><td>No change fires.</td></tr><tr><td>Disabled handling.</td><td>Mount disabled group and disabled child cases.</td><td>Click/keydown.</td><td>Value does not change.</td></tr><tr><td>Form submission.</td><td>Put named group with selected value in form.</td><td>Construct <code>FormData</code>.</td><td>Submitted <code>name=value</code>.</td></tr><tr><td>Programmatic value.</td><td>Set <code>group.value</code>.</td><td>Inspect children/listener.</td><td>Checked syncs; no change fires.</td></tr><tr><td>Arrow navigation.</td><td>Focus active radio.</td><td>Arrow keys.</td><td>Focus and value move, wrapping and skipping disabled radios.</td></tr><tr><td>Space selection.</td><td>Focus unchecked radio.</td><td>Press Space.</td><td>Value updates and change fires once.</td></tr><tr><td>Required validity.</td><td>Mount required without value, then set value.</td><td>Call <code>checkValidity()</code>.</td><td>Missing value invalid; selected value valid.</td></tr><tr><td>Non-radio children ignored.</td><td>Slot an extra checkbox.</td><td>Click extra control.</td><td>Group value remains unchanged.</td></tr></tbody></table>"),
};
