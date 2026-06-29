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
    code: '<tyui-grid min-item-size="14rem" gap="4">\n  <section style="padding:16px;border:1px solid CanvasText;">Alpha</section>\n  <section style="padding:16px;border:1px solid CanvasText;">Beta</section>\n  <section style="padding:16px;border:1px solid CanvasText;">Gamma</section>\n  <section style="padding:16px;border:1px solid CanvasText;">Delta</section>\n</tyui-grid>',
    title: 'Auto Fit Cards',
  },
  {
    code: '<tyui-grid min-item-size="18rem" gap="3">\n  <tyui-flex direction="column" gap="2">\n    <strong>Account</strong>\n    <tyui-input label="Display name" value="Ada"></tyui-input>\n  </tyui-flex>\n  <tyui-flex direction="column" gap="2">\n    <strong>Notifications</strong>\n    <tyui-checkbox checked>Email updates</tyui-checkbox>\n  </tyui-flex>\n</tyui-grid>',
    title: 'Settings Panels',
  },
  {
    code: '<tyui-grid min-item-size="10rem" align="start" justify="center" gap="2">\n  <tyui-button>One</tyui-button>\n  <tyui-button>Two</tyui-button>\n  <tyui-button>Three</tyui-button>\n</tyui-grid>',
    title: 'Centered Items',
  },
];
const designs: Array<{ title: string; code: string }> = [];

const meta: Meta = {
  title: 'Components/Grid',
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
    <h1>Grid Examples</h1>
    ${examples.length > 0
      ? examples.map(renderExample)
      : html`<p>No Storybook examples are marked in the component spec yet.</p>`}
  </article>`;
}

function designsPage() {
  return html`<article class="ty-spec-doc">
    ${styles}
    <h1>Grid Designs</h1>
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
      '<h1>Grid</h1>\n<h2>Identity</h2>\n<ul>\n<li>Tag: <code>tyui-grid</code></li>\n<li>Define: <code>@tyui/define/grid</code></li>\n<li>Status: implemented</li>\n<li>Native substrate: native custom element extending <code>HTMLElement</code>.</li>\n<li>Shadow DOM: none.</li>\n<li>Utility class: <code>.ty-grid</code></li>\n<li>Category: layout primitive</li>\n<li>Component family: intrinsic layout</li>\n<li>Pattern type: responsive two-dimensional collection layout</li>\n</ul>\n<h2>Intent</h2>\n<p>Use Grid for repeated peer items that should form responsive columns from the container width and an item minimum size: cards, tiles, metric panels, image groups, and settings panels.</p>\n<p>Do not use Grid for tabular data, one-axis action rows, or arbitrary page shells. Prefer native table/data-grid components for data, <code>tyui-cluster</code> for wrapping action rows, and <code>tyui-sidebar</code> for two-region layouts.</p>\n<h2>Selection Guidance</h2>\n<ul>\n<li>Use when: each item is a peer, columns should auto-fit, and the parent owns gaps and minimum item width.</li>\n<li>Do not use when: rows and columns carry data relationships, cells need headers, or keyboard grid navigation is required.</li>\n<li>Prefer instead: <code>tyui-table</code> or future <code>tyui-data-grid</code> for data, <code>tyui-flex</code> for one axis, <code>tyui-container</code> for page width.</li>\n<li>Product-level variant preferences: generated design layers may set <code>min-item-size</code> by content type.</li>\n<li>Agent rule: choose Grid when the layout question is &quot;how many columns fit here?&quot;</li>\n</ul>',
    ),
};

export const API: Story = {
  render: () =>
    markdownPage(
      '<h1>Grid API</h1>\n<h2>API</h2>\n<h3>Attributes</h3>\n<table><thead><tr><th>Name</th><th>Type</th><th>Reflects</th><th>Default</th><th>Notes</th></tr></thead><tbody><tr><td><code>min-item-size</code></td><td>CSS length token or length string</td><td>yes</td><td><code>16rem</code></td><td>Minimum track size before wrapping.</td></tr><tr><td><code>gap</code></td><td><code>0 | 1 | 2 | 3 | 4</code></td><td>yes</td><td><code>4</code></td><td>Row and column gap.</td></tr><tr><td><code>row-gap</code></td><td><code>0 | 1 | 2 | 3 | 4</code></td><td>yes</td><td><code>gap</code></td><td>Optional row gap override.</td></tr><tr><td><code>align</code></td><td><code>stretch | start | center | end</code></td><td>yes</td><td><code>stretch</code></td><td>Maps to <code>align-items</code>.</td></tr><tr><td><code>justify</code></td><td><code>stretch | start | center | end</code></td><td>yes</td><td><code>stretch</code></td><td>Maps to <code>justify-items</code>.</td></tr><tr><td><code>dense</code></td><td><code>boolean</code></td><td>yes</td><td><code>false</code></td><td>Maps to <code>grid-auto-flow: dense</code>; use only when visual reordering is acceptable.</td></tr></tbody></table>\n<h3>Properties</h3>\n<p>Mirror attributes with typed properties.</p>\n<h3>Events</h3>\n<p>None. Grid is layout only.</p>\n<h3>Event Semantics</h3>\n<p>Child events pass through light DOM. Grid must not implement keyboard grid behavior.</p>\n<h3>Slots</h3>\n<table><thead><tr><th>Name</th><th>Description</th><th>Fallback</th><th>Slotted Styling Rules</th></tr></thead><tbody><tr><td>default</td><td>grid items</td><td>none</td><td>children are grid items; parent owns track sizing</td></tr></tbody></table>\n<h3>CSS Parts</h3>\n<p>None.</p>\n<h3>CSS Custom Properties</h3>\n<p><code>--ty-grid-min-item-size</code>, <code>--ty-grid-gap</code>, <code>--ty-grid-row-gap</code>, <code>--ty-grid-align</code>, <code>--ty-grid-justify</code>.</p>\n<h3>Attribute To CSS Mapping</h3>\n<p>The element maps attributes to the public CSS variables consumed by both <code>tyui-grid</code> and <code>.ty-grid</code>:</p>\n<table><thead><tr><th>Attribute</th><th>CSS Variable</th><th>Mapping</th></tr></thead><tbody><tr><td><code>min-item-size</code></td><td><code>--ty-grid-min-item-size</code></td><td>valid CSS length string; absent uses <code>16rem</code></td></tr><tr><td><code>gap</code></td><td><code>--ty-grid-gap</code></td><td><code>0..4</code> -&gt; <code>var(--ty-space-*, fallback)</code>; invalid values fall back to <code>4</code></td></tr><tr><td><code>row-gap</code></td><td><code>--ty-grid-row-gap</code></td><td><code>0..4</code> -&gt; <code>var(--ty-space-*, fallback)</code>; absent uses <code>gap</code></td></tr><tr><td><code>align</code></td><td><code>--ty-grid-align</code></td><td>valid enum value</td></tr><tr><td><code>justify</code></td><td><code>--ty-grid-justify</code></td><td>valid enum value</td></tr><tr><td><code>dense</code></td><td><code>--ty-grid-auto-flow</code></td><td>absent -&gt; <code>row</code>; present -&gt; <code>row dense</code></td></tr></tbody></table>\n<h2>Slots</h2>\n<table><thead><tr><th>Name</th><th>Description</th><th>Fallback</th><th>Slotted Styling Rules</th></tr></thead><tbody><tr><td>default</td><td>grid items</td><td>none</td><td>children are grid items; parent owns track sizing</td></tr></tbody></table>\n<h2>CSS Parts</h2>\n<p>None.</p>\n<h2>Events</h2>\n<p>None. Grid is layout only.</p>\n<h2>Event Semantics</h2>\n<p>Child events pass through light DOM. Grid must not implement keyboard grid behavior.</p>',
    ),
};

export const Examples: Story = {
  tags: ['visual'],
  render: () => examplesPage(),
};

export const ImplementationSpec: Story = {
  name: 'Implementation Spec',
  render: () =>
    markdownPage(
      '<h1>Grid Implementation Spec</h1>\n<h2>Composition Contract</h2>\n<ul>\n<li>Allowed children: cards, panels, images, form sections, and other block-level peer items.</li>\n<li>Required parent: none.</li>\n<li>Required child components: none.</li>\n<li>Optional child components: <code>tyui-card</code>, <code>tyui-image</code>, form sections.</li>\n<li>Disallowed nested interactive content: none beyond child rules.</li>\n<li>Composition anti-patterns: using Grid for data tables, creating fake rows with visual order, hiding overflow instead of allowing wrapping.</li>\n</ul>\n<h2>Behavior</h2>\n<h3>State Model</h3>\n<ul>\n<li>Controlled state: min-item-size, gap, row-gap, align, justify, dense.</li>\n<li>Uncontrolled/default state: auto-fit columns with <code>16rem</code> minimum.</li>\n<li>Parent-owned state: available inline size.</li>\n<li>Child-owned state: intrinsic block size and semantics.</li>\n<li>Programmatic update behavior: update CSS values without reparenting children.</li>\n</ul>\n<h3>Focus Model</h3>\n<p>Grid itself is not focusable. Tab order follows DOM order, not visual column position. Interactive grid keyboard behavior belongs to data-grid/table components, not this primitive.</p>\n<h3>Keyboard Contract</h3>\n<p>No keyboard behavior. Arrow keys remain owned by child controls or composite components inside grid items.</p>\n<h2>Layout Contract</h2>\n<ul>\n<li>Display: grid.</li>\n<li>Intrinsic size: block size from items; inline size from parent.</li>\n<li>Track policy: <code>repeat(auto-fit, minmax(min(100%, var(--ty-grid-min-item-size)), 1fr))</code>.</li>\n<li>Shrink policy: tracks shrink to container width before wrapping; children should set <code>min-inline-size: 0</code> when their content may shrink.</li>\n<li>Wrap policy: automatic track wrapping.</li>\n<li>Flexible slots: all default children as grid items.</li>\n<li>Fixed slots: none.</li>\n<li>Parent owns: available width and placement.</li>\n<li>Component owns: track creation, gap, item alignment.</li>\n<li>Container-query thresholds: none; CSS grid auto-fit handles the response.</li>\n<li>Container behavior: must not set <code>container-type</code>; consumers may add containment outside the primitive when needed.</li>\n<li>Scroll / overflow policy: no internal scroll; parent owns horizontal scroll if content cannot shrink.</li>\n</ul>\n<h2>Styling Contract</h2>\n<h3>Public Tokens</h3>\n<p>Use <code>--ty-grid-*</code> tokens. Design layers may set different minimum item sizes for dashboards, forms, and galleries.</p>\n<h3>Private Implementation Variables</h3>\n<p>Private variables use <code>--_ty-*</code>.</p>\n<h3>Styling State Surface</h3>\n<p>Attributes and public tokens only.</p>\n<ul>\n<li>Forced-colors behavior: none beyond children.</li>\n<li>Reduced-motion behavior: no motion.</li>\n<li>App-variant hooks: host attributes, utility class, public tokens.</li>\n</ul>\n<h2>Accessibility</h2>\n<ul>\n<li>Role: none by default.</li>\n<li>Accessible name: none.</li>\n<li>ARIA attributes: do not add <code>role=&quot;grid&quot;</code> to this primitive.</li>\n<li>Reading order: DOM order is the accessible order. Avoid <code>dense</code> when visual order must match reading order.</li>\n</ul>\n<h2>Implementation Requirements</h2>\n<ul>\n<li>Implement as a native custom element with no shadow DOM.</li>\n<li>Follow <code>spec/behavior.md</code> by preserving native child semantics, focus order, and event propagation; Grid adds no interaction and does not implement ARIA grid behavior.</li>\n<li>Define idempotently through <code>defineTyuiGrid</code>.</li>\n<li>Export <code>@tyui/elements/grid</code> and <code>@tyui/define/grid</code>.</li>\n<li>Provide <code>.ty-grid</code> utility CSS.</li>\n<li>Use CSS Grid auto-fit; do not calculate columns in JavaScript.</li>\n<li>Do not add ARIA grid semantics.</li>\n</ul>\n<h2>Tests</h2>\n<table><thead><tr><th>Requirement</th><th>Setup</th><th>Action</th><th>Expected Result</th></tr></thead><tbody><tr><td>Auto-fit works</td><td>Render four items</td><td>Resize container</td><td>Column count changes without JS.</td></tr><tr><td>Min item size maps</td><td>Set <code>min-item-size=&quot;20rem&quot;</code></td><td>Read computed grid template</td><td>Tracks respect 20rem minimum.</td></tr><tr><td>No grid role</td><td>Render Grid</td><td>Inspect accessibility tree/DOM</td><td>Host has no ARIA grid role by default.</td></tr><tr><td>DOM order stays stable</td><td>Render interactive children</td><td>Press Tab</td><td>Focus follows DOM order.</td></tr><tr><td>Element/utility parity</td><td>Compare <code>.ty-grid</code> with matching CSS variables and <code>tyui-grid</code> with attributes</td><td>Read core styles</td><td>Core grid rules match.</td></tr></tbody></table>\n<h2>Agent Guidance</h2>\n<ul>\n<li>Use <code>tyui-grid</code> for peer cards and panels.</li>\n<li>Do not use it for data with headers or arrow-key cell navigation.</li>\n<li>Set <code>min-item-size</code> from content, not viewport width.</li>\n<li>Keep item semantics inside the child elements.</li>\n</ul>',
    ),
};
