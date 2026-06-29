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
    code: '<tyui-cluster gap="2">\n  <tyui-button appearance="primary">Save</tyui-button>\n  <tyui-button>Cancel</tyui-button>\n  <tyui-button appearance="subtle">Reset</tyui-button>\n</tyui-cluster>',
    title: 'Action Row',
  },
  {
    code: '<tyui-cluster gap="1" aria-label="Selected filters">\n  <tyui-button size="small" shape="rounded">Design</tyui-button>\n  <tyui-button size="small" shape="rounded">Accessibility</tyui-button>\n  <tyui-button size="small" shape="rounded">Testing</tyui-button>\n  <tyui-button size="small" shape="rounded">Tokens</tyui-button>\n</tyui-cluster>',
    title: 'Wrapping Tags',
  },
  {
    code: '<tyui-cluster gap="2" align="center">\n  <tyui-input label="Search" style="flex:1 1 14rem;min-inline-size:0;"></tyui-input>\n  <tyui-button appearance="primary">Search</tyui-button>\n</tyui-cluster>',
    title: 'Flexible Search Row',
  },
];
const designs: Array<{ title: string; code: string }> = [];

const meta: Meta = {
  title: 'Components/Cluster',
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
    <h1>Cluster Examples</h1>
    ${examples.length > 0
      ? examples.map(renderExample)
      : html`<p>No Storybook examples are marked in the component spec yet.</p>`}
  </article>`;
}

function designsPage() {
  return html`<article class="ty-spec-doc">
    ${styles}
    <h1>Cluster Designs</h1>
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
      '<h1>Cluster</h1>\n<h2>Identity</h2>\n<ul>\n<li>Tag: <code>tyui-cluster</code></li>\n<li>Define: <code>@tyui/define/cluster</code></li>\n<li>Status: implemented</li>\n<li>Native substrate: native custom element extending <code>HTMLElement</code>.</li>\n<li>Shadow DOM: none.</li>\n<li>Utility class: <code>.ty-cluster</code></li>\n<li>Alias concept: Wrap. The public element remains <code>tyui-cluster</code>; docs may describe the pattern as wrap layout.</li>\n<li>Category: layout primitive</li>\n<li>Component family: intrinsic layout</li>\n<li>Pattern type: wrapping row composition</li>\n</ul>\n<h2>Intent</h2>\n<p>Use Cluster for compact groups of peer items that should stay content-sized and wrap to additional lines when space runs out: action rows, toolbar groups, tag lists, checkbox rows, radio rows, and small metadata chips.</p>\n<p>Do not use Cluster for equal-width card grids, vertical forms, page gutters, or layouts where visual order differs from DOM order.</p>\n<h2>Selection Guidance</h2>\n<ul>\n<li>Use when: items form a row, wrapping is acceptable, and each child keeps its intrinsic size.</li>\n<li>Do not use when: children need equal columns, a single vertical stack, or fixed sidebar behavior.</li>\n<li>Prefer instead: <code>tyui-flex wrap=&quot;wrap&quot;</code> when you need custom one-axis distribution, <code>tyui-grid</code> for tracks, <code>tyui-container</code> for page bounds.</li>\n<li>Product-level variant preferences: generated design layers may set dense or spacious gaps.</li>\n<li>Agent rule: choose Cluster when the sentence contains &quot;row of actions&quot;, &quot;tags&quot;, &quot;chips&quot;, &quot;wrap when narrow&quot;, or &quot;toolbar-like group&quot;.</li>\n</ul>',
    ),
};

export const API: Story = {
  render: () =>
    markdownPage(
      '<h1>Cluster API</h1>\n<h2>API</h2>\n<h3>Attributes</h3>\n<table><thead><tr><th>Name</th><th>Type</th><th>Reflects</th><th>Default</th><th>Notes</th></tr></thead><tbody><tr><td><code>align</code></td><td><code>start | center | end | baseline | stretch</code></td><td>yes</td><td><code>center</code></td><td>Cross-axis alignment.</td></tr><tr><td><code>justify</code></td><td><code>start | center | end | between</code></td><td>yes</td><td><code>start</code></td><td>Main-axis distribution.</td></tr><tr><td><code>gap</code></td><td><code>0 | 1 | 2 | 3 | 4</code></td><td>yes</td><td><code>2</code></td><td>Row and column gap token.</td></tr><tr><td><code>row-gap</code></td><td><code>0 | 1 | 2 | 3 | 4</code></td><td>yes</td><td><code>gap</code></td><td>Optional line gap override.</td></tr></tbody></table>\n<h3>Properties</h3>\n<p>Mirror attributes with typed properties.</p>\n<h3>Events</h3>\n<p>None. Cluster is layout only.</p>\n<h3>Event Semantics</h3>\n<p>Child events pass through light DOM. Cluster must not intercept activation, focus, or form events.</p>\n<h3>Slots</h3>\n<table><thead><tr><th>Name</th><th>Description</th><th>Fallback</th><th>Slotted Styling Rules</th></tr></thead><tbody><tr><td>default</td><td>wrapping peer items</td><td>none</td><td>each child keeps intrinsic size unless app applies an explicit item policy</td></tr></tbody></table>\n<h3>CSS Parts</h3>\n<p>None.</p>\n<h3>CSS Custom Properties</h3>\n<p><code>--ty-cluster-gap</code>, <code>--ty-cluster-row-gap</code>, <code>--ty-cluster-align</code>, <code>--ty-cluster-justify</code>, <code>--ty-layout-gap</code>.</p>\n<h3>Attribute To CSS Mapping</h3>\n<p>The element maps attributes to the public CSS variables consumed by both <code>tyui-cluster</code> and <code>.ty-cluster</code>:</p>\n<table><thead><tr><th>Attribute</th><th>CSS Variable</th><th>Mapping</th></tr></thead><tbody><tr><td><code>align</code></td><td><code>--ty-cluster-align</code></td><td><code>start</code> -&gt; <code>flex-start</code>, <code>end</code> -&gt; <code>flex-end</code>, other values pass through</td></tr><tr><td><code>justify</code></td><td><code>--ty-cluster-justify</code></td><td><code>start</code> -&gt; <code>flex-start</code>, <code>end</code> -&gt; <code>flex-end</code>, <code>between</code> -&gt; <code>space-between</code></td></tr><tr><td><code>gap</code></td><td><code>--ty-cluster-gap</code></td><td><code>0..4</code> -&gt; <code>var(--ty-space-*, fallback)</code>; invalid values fall back to <code>2</code></td></tr><tr><td><code>row-gap</code></td><td><code>--ty-cluster-row-gap</code></td><td><code>0..4</code> -&gt; <code>var(--ty-space-*, fallback)</code>; absent uses <code>gap</code></td></tr></tbody></table>\n<h2>Slots</h2>\n<table><thead><tr><th>Name</th><th>Description</th><th>Fallback</th><th>Slotted Styling Rules</th></tr></thead><tbody><tr><td>default</td><td>wrapping peer items</td><td>none</td><td>each child keeps intrinsic size unless app applies an explicit item policy</td></tr></tbody></table>\n<h2>CSS Parts</h2>\n<p>None.</p>\n<h2>Events</h2>\n<p>None. Cluster is layout only.</p>\n<h2>Event Semantics</h2>\n<p>Child events pass through light DOM. Cluster must not intercept activation, focus, or form events.</p>',
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
      '<h1>Cluster Implementation Spec</h1>\n<h2>Composition Contract</h2>\n<ul>\n<li>Allowed children: controls, tags, links, badges, inline media, and short text groups.</li>\n<li>Required parent: none.</li>\n<li>Required child components: none.</li>\n<li>Optional child components: <code>tyui-button</code>, <code>tyui-checkbox</code>, <code>tyui-radio</code>, <code>tyui-badge</code>, <code>tyui-link</code>.</li>\n<li>Disallowed nested interactive content: none beyond children.</li>\n<li>Composition anti-patterns: using Cluster for table rows or navigation lists where list semantics are required.</li>\n<li>List semantics: when items form a semantic list, use <code>&lt;ul class=&quot;ty-cluster&quot;&gt;</code> or allow a future list-compatible primitive rather than removing list semantics.</li>\n</ul>\n<h2>Behavior</h2>\n<h3>State Model</h3>\n<ul>\n<li>Controlled state: align, justify, gap, row-gap.</li>\n<li>Uncontrolled/default state: center aligned, start justified, gap token 2.</li>\n<li>Parent-owned state: width and placement.</li>\n<li>Child-owned state: intrinsic size, semantics, focus, events.</li>\n<li>Programmatic update behavior: CSS updates only.</li>\n</ul>\n<h3>Focus Model</h3>\n<p>Cluster is not focusable. Children keep DOM-order tabbing. Wrapping must not create a roving tabindex pattern.</p>\n<h3>Keyboard Contract</h3>\n<p>Cluster adds no keyboard behavior. Toolbars or composite widgets must implement their own keyboard contracts and may use Cluster only as an internal layout technique.</p>\n<h2>Layout Contract</h2>\n<ul>\n<li>Display: flex.</li>\n<li>Intrinsic size: content-driven.</li>\n<li>Shrink policy: children keep intrinsic width by default; long-text children need <code>min-inline-size: 0</code> if they should shrink.</li>\n<li>Wrap policy: always wraps.</li>\n<li>Flexible slots: default children only by explicit app policy.</li>\n<li>Fixed slots: none.</li>\n<li>Parent owns: available width and vertical placement.</li>\n<li>Component owns: wrapping, gap, alignment.</li>\n<li>Container-query thresholds: none.</li>\n<li>Container behavior: must not set <code>container-type</code>; consumers may add containment outside the primitive when needed.</li>\n<li>Scroll / overflow policy: no internal scroll.</li>\n</ul>\n<h3>Item Guidance</h3>\n<table><thead><tr><th>Child Intent</th><th>Recommended Policy</th><th>Notes</th></tr></thead><tbody><tr><td>action button</td><td>content-sized</td><td>Common action-row pattern.</td></tr><tr><td>tag/chip/badge</td><td>content-sized</td><td>Wraps naturally.</td></tr><tr><td>search input</td><td><code>min-inline-size</code> plus <code>flex:1 1 12rem</code></td><td>Use only when the row needs a flexible input.</td></tr><tr><td>icon-only tool</td><td>content-sized</td><td>Keep target-size token intact.</td></tr></tbody></table>\n<h2>Styling Contract</h2>\n<h3>Public Tokens</h3>\n<p>Use <code>--ty-cluster-*</code> tokens. Design layers may map those to product spacing tokens.</p>\n<h3>Private Implementation Variables</h3>\n<p>Private variables use <code>--_ty-*</code>.</p>\n<h3>Styling State Surface</h3>\n<p>Attributes and public tokens only.</p>\n<ul>\n<li>Forced-colors behavior: none beyond children.</li>\n<li>Reduced-motion behavior: no motion.</li>\n<li>App-variant hooks: host attributes, utility class, public tokens.</li>\n</ul>\n<h2>Accessibility</h2>\n<ul>\n<li>Role: none by default.</li>\n<li>Accessible name: none.</li>\n<li>ARIA attributes: do not add ARIA for layout.</li>\n<li>Semantic groups: if items need a group name, consumers may add <code>role=&quot;group&quot;</code> plus <code>aria-label</code> or wrap the Cluster in a named region.</li>\n<li>List semantics: preserve native list markup when order/count matters.</li>\n</ul>\n<h2>Implementation Requirements</h2>\n<ul>\n<li>Implement as a native custom element with no shadow DOM.</li>\n<li>Follow <code>spec/behavior.md</code> by preserving native child semantics, focus order, and event propagation; Cluster adds no interaction.</li>\n<li>Define idempotently through <code>defineTyuiCluster</code>.</li>\n<li>Export <code>@tyui/elements/cluster</code> and <code>@tyui/define/cluster</code>.</li>\n<li>Provide <code>.ty-cluster</code> utility CSS.</li>\n<li>Map alignment aliases to valid CSS values.</li>\n<li>Keep child DOM stable.</li>\n</ul>\n<h2>Tests</h2>\n<table><thead><tr><th>Requirement</th><th>Setup</th><th>Action</th><th>Expected Result</th></tr></thead><tbody><tr><td>Wraps by default</td><td>Render several buttons in narrow container</td><td>Measure rows</td><td>Items wrap without horizontal overflow.</td></tr><tr><td>Alignment maps</td><td>Set <code>align=&quot;end&quot;</code></td><td>Read computed style</td><td><code>align-items</code> is <code>flex-end</code>.</td></tr><tr><td>No focus stop</td><td>Render focusable children</td><td>Press Tab</td><td>Focus moves to first child.</td></tr><tr><td>Child events pass through</td><td>Listen on Cluster</td><td>Click child</td><td>Event bubbles.</td></tr><tr><td>Element/utility parity</td><td>Render <code>.ty-cluster</code> with matching CSS variables and <code>tyui-cluster</code> with attributes</td><td>Compare core styles</td><td>Display, wrap, and gap match.</td></tr></tbody></table>\n<h2>Agent Guidance</h2>\n<ul>\n<li>Use Cluster for action rows and wrapping inline groups.</li>\n<li>Use Flex when the axis can be row or column and wrapping is optional.</li>\n<li>Use Grid when the design calls for repeated columns.</li>\n<li>Do not make Cluster responsible for toolbar keyboard behavior.</li>\n</ul>',
    ),
};
