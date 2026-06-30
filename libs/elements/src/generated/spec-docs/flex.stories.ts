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
    "code": "<tyui-flex gap=\"3\" align=\"center\">\n  <tyui-button appearance=\"primary\">Save</tyui-button>\n  <tyui-button>Cancel</tyui-button>\n</tyui-flex>",
    "title": "Row"
  },
  {
    "code": "<tyui-flex direction=\"column\" gap=\"2\" style=\"max-inline-size: 320px;\">\n  <tyui-input label=\"Name\" value=\"Ada Lovelace\"></tyui-input>\n  <tyui-input label=\"Email\" value=\"ada@example.com\"></tyui-input>\n</tyui-flex>",
    "title": "Column"
  },
  {
    "code": "<tyui-flex gap=\"2\" style=\"--demo-action-flex:1 1 0;\">\n  <tyui-button style=\"flex:var(--demo-action-flex);\">Back</tyui-button>\n  <tyui-button appearance=\"primary\" style=\"flex:var(--demo-action-flex);\">Continue</tyui-button>\n</tyui-flex>",
    "title": "Equal Distribution"
  }
];
const designs: Array<{ title: string; code: string }> = [];

const meta: Meta = {
  title: 'Components/Flex',
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
    <h1>Flex Examples</h1>
    ${examples.length > 0
      ? examples.map(renderExample)
      : html`<p>No Storybook examples are marked in the component spec yet.</p>`}
  </article>`;
}

function designsPage() {
  return html`<article class="ty-spec-doc">
    ${styles}
    <h1>Flex Designs</h1>
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
  render: () => markdownPage("<h1>Flex</h1>\n<h2>Identity</h2>\n<ul>\n<li>Tag: <code>tyui-flex</code></li>\n<li>Define: <code>@toyu-ui/define/flex</code></li>\n<li>Status: implemented</li>\n<li>Native substrate: native custom element extending <code>HTMLElement</code>.</li>\n<li>Shadow DOM: none. Children must stay in light DOM so layout applies directly to slotted content.</li>\n<li>Utility class: <code>.ty-flex</code></li>\n<li>Category: layout primitive</li>\n<li>Component family: intrinsic layout</li>\n<li>Pattern type: one-axis composition</li>\n</ul>\n<h2>Intent</h2>\n<p>Use Flex for one-dimensional layout when children should arrange in a row or column and the parent owns direction, alignment, gap, wrapping, and distribution.</p>\n<p>Do not use Flex as a replacement for component internals, data grids, page-width constraints, or two-dimensional card layouts. Prefer <code>tyui-grid</code> for responsive card grids, <code>tyui-cluster</code> for wrapping action/tag rows, <code>tyui-container</code> for page gutters, and <code>tyui-sidebar</code> for fixed-plus-fluid regions.</p>\n<h2>Selection Guidance</h2>\n<ul>\n<li>Use when: content follows one axis, direction may change by design layer, or a parent must align mixed children.</li>\n<li>Do not use when: each item needs responsive column tracks, intrinsic wrapping action-row behavior, or page-level max width.</li>\n<li>Prefer instead: <code>tyui-cluster</code> for wrap-first rows, <code>tyui-grid</code> for card collections, <code>tyui-center</code> for readable single-column content, native block flow for simple vertical document content.</li>\n<li>Product-level variant preferences: generated design layers may set default gap and alignment tokens, but must not force child components to grow unless the container intent requires equal distribution.</li>\n<li>Agent rule: choose Flex only when the layout question is &quot;how do these siblings share one axis?&quot;</li>\n</ul>"),
};

export const API: Story = {
  render: () => markdownPage("<h1>Flex API</h1>\n<h2>API</h2>\n<h3>Attributes</h3>\n<table><thead><tr><th>Name</th><th>Type</th><th>Reflects</th><th>Default</th><th>Notes</th></tr></thead><tbody><tr><td><code>direction</code></td><td><code>row | row-reverse | column | column-reverse</code></td><td>yes</td><td><code>row</code></td><td>Maps to <code>flex-direction</code>.</td></tr><tr><td><code>wrap</code></td><td><code>nowrap | wrap | wrap-reverse</code></td><td>yes</td><td><code>nowrap</code></td><td>Maps to <code>flex-wrap</code>.</td></tr><tr><td><code>align</code></td><td><code>stretch | start | center | end | baseline</code></td><td>yes</td><td><code>stretch</code></td><td>Maps to <code>align-items</code>; logical aliases compile to CSS values.</td></tr><tr><td><code>justify</code></td><td><code>start | center | end | between | around | evenly</code></td><td>yes</td><td><code>start</code></td><td>Maps to <code>justify-content</code>; aliases compile to CSS values.</td></tr><tr><td><code>gap</code></td><td><code>0 | 1 | 2 | 3 | 4</code></td><td>yes</td><td><code>3</code></td><td>Maps to spacing tokens.</td></tr><tr><td><code>inline</code></td><td><code>boolean</code></td><td>yes</td><td><code>false</code></td><td>Uses <code>inline-flex</code> instead of <code>flex</code>.</td></tr></tbody></table>\n<h3>Properties</h3>\n<p>Mirror attributes with typed properties. Boolean <code>inline</code> reflects to the host.</p>\n<h3>Events</h3>\n<p>None. Flex is layout only and must not emit user events.</p>\n<h3>Event Semantics</h3>\n<ul>\n<li>User-initiated events: none.</li>\n<li>Programmatic state changes: changing attributes updates layout only.</li>\n<li>Native events: child events pass through light DOM without interception.</li>\n<li>Cancellation behavior: N/A.</li>\n</ul>\n<h3>Slots</h3>\n<table><thead><tr><th>Name</th><th>Description</th><th>Fallback</th><th>Slotted Styling Rules</th></tr></thead><tbody><tr><td>default</td><td>laid-out children</td><td>none</td><td>children keep their own semantics; parent may assign flex item policy through public CSS variables or utility classes</td></tr></tbody></table>\n<h3>CSS Parts</h3>\n<p>None. Flex has no shadow DOM.</p>\n<h3>CSS Custom Properties</h3>\n<p><code>--ty-flex-direction</code>, <code>--ty-flex-wrap</code>, <code>--ty-flex-align</code>, <code>--ty-flex-justify</code>, <code>--ty-flex-gap</code>, <code>--ty-layout-gap</code>.</p>\n<h3>Attribute To CSS Mapping</h3>\n<p>The element maps attributes to the public CSS variables consumed by both <code>tyui-flex</code> and <code>.ty-flex</code>:</p>\n<table><thead><tr><th>Attribute</th><th>CSS Variable</th><th>Mapping</th></tr></thead><tbody><tr><td><code>direction</code></td><td><code>--ty-flex-direction</code></td><td>raw valid enum value</td></tr><tr><td><code>wrap</code></td><td><code>--ty-flex-wrap</code></td><td>raw valid enum value</td></tr><tr><td><code>align</code></td><td><code>--ty-flex-align</code></td><td><code>start</code> -&gt; <code>flex-start</code>, <code>end</code> -&gt; <code>flex-end</code>, other values pass through</td></tr><tr><td><code>justify</code></td><td><code>--ty-flex-justify</code></td><td><code>start</code> -&gt; <code>flex-start</code>, <code>end</code> -&gt; <code>flex-end</code>, <code>between/around/evenly</code> -&gt; <code>space-*</code></td></tr><tr><td><code>gap</code></td><td><code>--ty-flex-gap</code></td><td><code>0..4</code> -&gt; <code>var(--ty-space-*, fallback)</code>; invalid values fall back to <code>3</code></td></tr><tr><td><code>inline</code></td><td><code>--ty-flex-display</code></td><td>absent -&gt; <code>flex</code>; present -&gt; <code>inline-flex</code></td></tr></tbody></table>\n<h2>Slots</h2>\n<table><thead><tr><th>Name</th><th>Description</th><th>Fallback</th><th>Slotted Styling Rules</th></tr></thead><tbody><tr><td>default</td><td>laid-out children</td><td>none</td><td>children keep their own semantics; parent may assign flex item policy through public CSS variables or utility classes</td></tr></tbody></table>\n<h2>CSS Parts</h2>\n<p>None. Flex has no shadow DOM.</p>\n<h2>Events</h2>\n<p>None. Flex is layout only and must not emit user events.</p>\n<h2>Event Semantics</h2>\n<ul>\n<li>User-initiated events: none.</li>\n<li>Programmatic state changes: changing attributes updates layout only.</li>\n<li>Native events: child events pass through light DOM without interception.</li>\n<li>Cancellation behavior: N/A.</li>\n</ul>"),
};

export const Examples: Story = {
  tags: ['visual'],
  render: () => examplesPage(),
};


export const ImplementationSpec: Story = {
  name: 'Implementation Spec',
  render: () => markdownPage("<h1>Flex Implementation Spec</h1>\n<h2>Composition Contract</h2>\n<ul>\n<li>Allowed children: any flow content, including TYUI controls, text, cards, and layout primitives.</li>\n<li>Required parent: none.</li>\n<li>Required child components: none.</li>\n<li>Optional child components: any component whose parent may own placement.</li>\n<li>Disallowed nested interactive content: none beyond each child component's own rules.</li>\n<li>Composition anti-patterns: using Flex to create a table, using child inline styles for gaps that the parent should own, setting <code>flex: 1</code> on every child by default.</li>\n<li>Nesting: allowed, but nested Flex containers must keep their own layout tokens scoped.</li>\n</ul>\n<h2>Behavior</h2>\n<h3>State Model</h3>\n<ul>\n<li>Controlled state: direction, wrap, align, justify, gap, inline.</li>\n<li>Uncontrolled/default state: row, nowrap, stretch, start, spacing token 3.</li>\n<li>Parent-owned state: placement and available size.</li>\n<li>Child-owned state: intrinsic size, semantics, focus, and events.</li>\n<li>Programmatic update behavior: update CSS values without moving focus or recreating children.</li>\n</ul>\n<h3>Native Behavior First</h3>\n<ul>\n<li>Native element used: custom element with light DOM children.</li>\n<li>Native behavior preserved: document flow, focus order, event propagation, accessible semantics of children.</li>\n<li>Custom behavior added: attribute-to-CSS mapping and tokenized defaults.</li>\n</ul>\n<h3>Focus Model</h3>\n<ul>\n<li>Focus owner: children only.</li>\n<li>Tabbable elements: Flex itself is not focusable.</li>\n<li>Roving tabindex: N/A.</li>\n<li>Focus-visible treatment: owned by children.</li>\n</ul>\n<h3>Keyboard Contract</h3>\n<p>Flex adds no keyboard behavior. Tab order follows DOM order, including when <code>direction=&quot;row-reverse&quot;</code> or <code>direction=&quot;column-reverse&quot;</code>. Do not reorder DOM to create visual order.</p>\n<h2>Layout Contract</h2>\n<ul>\n<li>Display: <code>flex</code> or <code>inline-flex</code>.</li>\n<li>Intrinsic size: content-driven.</li>\n<li>Shrink policy: parent does not force children to shrink; flexible children that need shrink must use <code>min-inline-size: 0</code>.</li>\n<li>Wrap policy: controlled by <code>wrap</code>.</li>\n<li>Flexible slots: default children, if the application assigns flex policy.</li>\n<li>Fixed slots: none.</li>\n<li>Parent owns: external placement, available width, and item distribution.</li>\n<li>Component owns: one-axis arrangement, gap, alignment, and wrapping.</li>\n<li>Container-query thresholds: none in base primitive.</li>\n<li>Container behavior: must not set <code>container-type</code>; consumers may add containment outside the primitive when needed.</li>\n<li>Scroll / overflow policy: no internal scroll; parent or child owns overflow.</li>\n<li>Top-layer / popover policy: N/A.</li>\n</ul>\n<h3>Item Guidance</h3>\n<table><thead><tr><th>Child Intent</th><th>Recommended Policy</th><th>Notes</th></tr></thead><tbody><tr><td>content-sized control</td><td><code>flex: 0 1 auto</code></td><td>Default for buttons and inputs.</td></tr><tr><td>equal-width actions</td><td>parent class or token sets <code>flex: 1 1 0</code></td><td>Use only for explicit equal distribution.</td></tr><tr><td>shrinking text region</td><td><code>min-inline-size: 0</code></td><td>Required to prevent overflow in flex layouts.</td></tr><tr><td>icon or media</td><td><code>flex: none</code></td><td>Prevents distortion.</td></tr></tbody></table>\n<h2>Styling Contract</h2>\n<h3>Public Tokens</h3>\n<p>Use <code>--ty-flex-*</code> tokens for primitive defaults and <code>--ty-layout-gap</code> as the shared fallback. Design layers may remap tokens; they should not hardcode child selectors.</p>\n<h3>Private Implementation Variables</h3>\n<p>Private variables use <code>--_ty-*</code> and are not consumer API.</p>\n<h3>Styling State Surface</h3>\n<p>Attributes are public styling surface. There are no interactive states.</p>\n<ul>\n<li>Forced-colors behavior: no special handling beyond child components.</li>\n<li>Reduced-motion behavior: no motion.</li>\n<li>App-variant hooks: host attributes, utility class, and public tokens.</li>\n</ul>\n<h2>Accessibility</h2>\n<ul>\n<li>Role: none by default.</li>\n<li>Accessible name: none.</li>\n<li>ARIA attributes: do not add layout roles. Consumers may add landmark or grouping roles only when the content semantics require it.</li>\n<li>Reading order: DOM order remains the accessible order. Visual reverse directions must be used with care.</li>\n</ul>\n<h2>Implementation Requirements</h2>\n<ul>\n<li>Implement as a native custom element with no framework runtime.</li>\n<li>Do not attach shadow DOM.</li>\n<li>Follow <code>spec/behavior.md</code> by preserving native child semantics, focus order, and event propagation; Flex adds no interaction.</li>\n<li>Define idempotently through <code>defineTyuiFlex</code>.</li>\n<li>Export <code>@toyu-ui/elements/flex</code> and <code>@toyu-ui/define/flex</code>.</li>\n<li>Provide <code>.ty-flex</code> utility CSS with the same behavior as the element.</li>\n<li>Attribute changes must mutate host style or reflected attributes without rebuilding children.</li>\n<li>Use logical alignment aliases: <code>start</code> -&gt; <code>flex-start</code>, <code>end</code> -&gt; <code>flex-end</code>, <code>between</code> -&gt; <code>space-between</code>.</li>\n</ul>\n<h2>Tests</h2>\n<table><thead><tr><th>Requirement</th><th>Setup</th><th>Action</th><th>Expected Result</th></tr></thead><tbody><tr><td>Attribute mapping works</td><td>Render default Flex</td><td>Set <code>direction=&quot;column&quot;</code></td><td>Computed <code>flex-direction</code> is <code>column</code>.</td></tr><tr><td>Children remain light DOM</td><td>Render buttons inside Flex</td><td>Query children</td><td>Buttons are direct light DOM descendants.</td></tr><tr><td>No focus stop</td><td>Render focusable children</td><td>Press Tab</td><td>Focus enters first child, not Flex.</td></tr><tr><td>Child events pass through</td><td>Listen on Flex</td><td>Click child button</td><td>Native event bubbles through Flex.</td></tr><tr><td>Shrink guidance works</td><td>Put long text child with <code>min-inline-size:0</code></td><td>Constrain width</td><td>Child shrinks without forcing overflow.</td></tr><tr><td>Element/utility parity</td><td>Render <code>.ty-flex</code> with matching CSS variables and <code>tyui-flex</code> with attributes</td><td>Compare core styles</td><td>Display, direction, wrap, alignment, and gap match.</td></tr></tbody></table>\n<h2>Agent Guidance</h2>\n<ul>\n<li>Use <code>tyui-flex</code> for simple one-axis arrangement.</li>\n<li>Use <code>tyui-cluster</code> when wrapping is the point of the layout.</li>\n<li>Use <code>tyui-grid</code> when items form responsive tracks.</li>\n<li>Do not put component-specific styling in Flex. The primitive arranges children; components own their internals.</li>\n</ul>"),
};
