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
    "code": "<tyui-center measure=\"48rem\">\n  <tyui-flex direction=\"column\" gap=\"3\">\n    <h2>Profile</h2>\n    <tyui-input label=\"Name\" value=\"Ada Lovelace\"></tyui-input>\n    <tyui-input label=\"Email\" value=\"ada@example.com\"></tyui-input>\n    <tyui-cluster>\n      <tyui-button appearance=\"primary\">Save</tyui-button>\n      <tyui-button>Cancel</tyui-button>\n    </tyui-cluster>\n  </tyui-flex>\n</tyui-center>",
    "title": "Readable Form"
  },
  {
    "code": "<tyui-center measure=\"38rem\" intrinsic>\n  <tyui-flex direction=\"column\" gap=\"2\" align=\"center\">\n    <h2>No results</h2>\n    <p>Try a different search term.</p>\n    <tyui-button>Clear search</tyui-button>\n  </tyui-flex>\n</tyui-center>",
    "title": "Narrow Empty State"
  }
];
const designs: Array<{ title: string; code: string }> = [];

const meta: Meta = {
  title: 'Components/Center',
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
    <h1>Center Examples</h1>
    ${examples.length > 0
      ? examples.map(renderExample)
      : html`<p>No Storybook examples are marked in the component spec yet.</p>`}
  </article>`;
}

function designsPage() {
  return html`<article class="ty-spec-doc">
    ${styles}
    <h1>Center Designs</h1>
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
  render: () => markdownPage("<h1>Center</h1>\n<h2>Identity</h2>\n<ul>\n<li>Tag: <code>tyui-center</code></li>\n<li>Define: <code>@toyu-ui/define/center</code></li>\n<li>Status: implemented</li>\n<li>Native substrate: native custom element extending <code>HTMLElement</code>.</li>\n<li>Shadow DOM: none.</li>\n<li>Utility class: <code>.ty-center</code></li>\n<li>Category: layout primitive</li>\n<li>Component family: intrinsic layout</li>\n<li>Pattern type: readable measure container</li>\n</ul>\n<h2>Intent</h2>\n<p>Use Center to constrain readable content to a maximum inline measure and center it inside the available space. It is for prose, forms, narrow settings pages, and focused empty states.</p>\n<p>Do not use Center for full app shells, card grids, or controls that should size to content. Prefer <code>tyui-container</code> for page gutters and wider regions, <code>tyui-grid</code> for repeated cards, and natural block flow for unconstrained content.</p>\n<h2>Selection Guidance</h2>\n<ul>\n<li>Use when: content should be readable and centered with a maximum measure.</li>\n<li>Do not use when: content should fill a dashboard region, wrap as a row, or form repeated columns.</li>\n<li>Prefer instead: <code>tyui-container</code> for page width, <code>tyui-grid</code> for columns, <code>tyui-flex</code> for one-axis arrangement.</li>\n<li>Product-level variant preferences: generated design layers may set default measure and gutter.</li>\n<li>Agent rule: choose Center when the layout question is &quot;how wide should this single column be for reading?&quot;</li>\n</ul>"),
};

export const API: Story = {
  render: () => markdownPage("<h1>Center API</h1>\n<h2>API</h2>\n<h3>Attributes</h3>\n<table><thead><tr><th>Name</th><th>Type</th><th>Reflects</th><th>Default</th><th>Notes</th></tr></thead><tbody><tr><td><code>measure</code></td><td>CSS length token or length string</td><td>yes</td><td><code>65ch</code></td><td>Maximum inline size.</td></tr><tr><td><code>gutter</code></td><td><code>0 | 1 | 2 | 3 | 4 | page</code></td><td>yes</td><td><code>page</code></td><td>Inline padding token.</td></tr><tr><td><code>intrinsic</code></td><td><code>boolean</code></td><td>yes</td><td><code>false</code></td><td>Centers children using flex when content itself should center.</td></tr></tbody></table>\n<h3>Properties</h3>\n<p>Mirror attributes with typed properties.</p>\n<h3>Events</h3>\n<p>None.</p>\n<h3>Event Semantics</h3>\n<p>Child events pass through light DOM.</p>\n<h3>Slots</h3>\n<table><thead><tr><th>Name</th><th>Description</th><th>Fallback</th><th>Slotted Styling Rules</th></tr></thead><tbody><tr><td>default</td><td>centered content</td><td>none</td><td>children keep normal document flow</td></tr></tbody></table>\n<h3>CSS Parts</h3>\n<p>None.</p>\n<h3>CSS Custom Properties</h3>\n<p><code>--ty-center-measure</code>, <code>--ty-center-gutter</code>, <code>--ty-layout-content-measure</code>, <code>--ty-page-gutter</code>.</p>\n<h3>Attribute To CSS Mapping</h3>\n<p>The element maps attributes to the public CSS variables consumed by both <code>tyui-center</code> and <code>.ty-center</code>:</p>\n<table><thead><tr><th>Attribute</th><th>CSS Variable</th><th>Mapping</th></tr></thead><tbody><tr><td><code>measure</code></td><td><code>--ty-center-measure</code></td><td>valid CSS length string; absent uses <code>65ch</code></td></tr><tr><td><code>gutter</code></td><td><code>--ty-center-gutter</code></td><td><code>page</code> -&gt; <code>var(--ty-page-gutter, 1rem)</code>; <code>0..4</code> -&gt; <code>var(--ty-space-*, fallback)</code></td></tr><tr><td><code>intrinsic</code></td><td><code>--ty-center-display</code></td><td>handled by selector; present uses flex centering</td></tr></tbody></table>\n<h2>Slots</h2>\n<table><thead><tr><th>Name</th><th>Description</th><th>Fallback</th><th>Slotted Styling Rules</th></tr></thead><tbody><tr><td>default</td><td>centered content</td><td>none</td><td>children keep normal document flow</td></tr></tbody></table>\n<h2>CSS Parts</h2>\n<p>None.</p>\n<h2>Events</h2>\n<p>None.</p>\n<h2>Event Semantics</h2>\n<p>Child events pass through light DOM.</p>"),
};

export const Examples: Story = {
  tags: ['visual'],
  render: () => examplesPage(),
};


export const ImplementationSpec: Story = {
  name: 'Implementation Spec',
  render: () => markdownPage("<h1>Center Implementation Spec</h1>\n<h2>Composition Contract</h2>\n<ul>\n<li>Allowed children: headings, prose, forms, empty states, simple vertical sections, and component groups.</li>\n<li>Required parent: none.</li>\n<li>Required child components: none.</li>\n<li>Optional child components: <code>tyui-flex</code>, <code>tyui-cluster</code>, form controls.</li>\n<li>Disallowed nested interactive content: none beyond child rules.</li>\n<li>Composition anti-patterns: wrapping every component in Center, nesting Center inside Center without a specific measure change.</li>\n</ul>\n<h2>Behavior</h2>\n<h3>State Model</h3>\n<ul>\n<li>Controlled state: measure, gutter, intrinsic.</li>\n<li>Uncontrolled/default state: readable measure and page gutter tokens.</li>\n<li>Parent-owned state: available width and surrounding layout.</li>\n<li>Child-owned state: document semantics and focus.</li>\n<li>Programmatic update behavior: CSS updates only.</li>\n</ul>\n<h3>Focus Model</h3>\n<p>Center is not focusable. Children keep native tab order.</p>\n<h3>Keyboard Contract</h3>\n<p>No keyboard behavior.</p>\n<h2>Layout Contract</h2>\n<ul>\n<li>Display: block by default.</li>\n<li>Intrinsic size: constrained by max inline size and gutter.</li>\n<li>Shrink policy: content may shrink to available width.</li>\n<li>Wrap policy: text wraps naturally.</li>\n<li>Flexible slots: default content.</li>\n<li>Fixed slots: none.</li>\n<li>Parent owns: vertical placement and page region.</li>\n<li>Component owns: horizontal centering, readable measure, inline gutter.</li>\n<li>Container-query thresholds: none.</li>\n<li>Container behavior: must not set <code>container-type</code>; consumers may add containment outside the primitive when needed.</li>\n<li>Scroll / overflow policy: no internal scroll.</li>\n</ul>\n<h2>Styling Contract</h2>\n<h3>Public Tokens</h3>\n<p>Use <code>--ty-center-*</code>, <code>--ty-layout-content-measure</code>, and <code>--ty-page-gutter</code>.</p>\n<h3>Private Implementation Variables</h3>\n<p>Private variables use <code>--_ty-*</code>.</p>\n<h3>Styling State Surface</h3>\n<p>Attributes and tokens only.</p>\n<ul>\n<li>Forced-colors behavior: none beyond children.</li>\n<li>Reduced-motion behavior: no motion.</li>\n<li>App-variant hooks: host attributes, utility class, public tokens.</li>\n</ul>\n<h2>Accessibility</h2>\n<ul>\n<li>Role: none by default.</li>\n<li>Accessible name: none.</li>\n<li>ARIA attributes: only add landmark or region semantics when content needs them.</li>\n<li>Reading order: unchanged.</li>\n</ul>\n<h2>Implementation Requirements</h2>\n<ul>\n<li>Implement as a native custom element with no shadow DOM.</li>\n<li>Follow <code>spec/behavior.md</code> by preserving native child semantics, focus order, and event propagation; Center adds no interaction.</li>\n<li>Define idempotently through <code>defineTyuiCenter</code>.</li>\n<li>Export <code>@toyu-ui/elements/center</code> and <code>@toyu-ui/define/center</code>.</li>\n<li>Provide <code>.ty-center</code> utility CSS.</li>\n<li>Do not use JavaScript measurement.</li>\n</ul>\n<h2>Tests</h2>\n<table><thead><tr><th>Requirement</th><th>Setup</th><th>Action</th><th>Expected Result</th></tr></thead><tbody><tr><td>Measure maps</td><td>Render with <code>measure=&quot;40rem&quot;</code></td><td>Read computed style</td><td>Max inline size uses 40rem.</td></tr><tr><td>Gutters apply</td><td>Render in narrow container</td><td>Measure padding</td><td>Inline padding follows gutter token.</td></tr><tr><td>No focus stop</td><td>Render input inside Center</td><td>Press Tab</td><td>Focus enters input.</td></tr><tr><td>No shadow DOM</td><td>Render Center</td><td>Inspect host</td><td>Children remain light DOM.</td></tr><tr><td>Element/utility parity</td><td>Compare <code>.ty-center</code> with matching CSS variables and <code>tyui-center</code> with attributes</td><td>Read core styles</td><td>Core centering rules match.</td></tr></tbody></table>\n<h2>Agent Guidance</h2>\n<ul>\n<li>Use Center for one readable column.</li>\n<li>Use Container for broader page regions.</li>\n<li>Pair Center with Flex for vertical spacing rather than inventing local margins.</li>\n<li>Do not use Center to align individual controls inside a toolbar.</li>\n</ul>"),
};
