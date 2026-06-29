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
    code: '<tyui-sidebar side-size="16rem" content-min="55%" gap="4">\n  <aside>\n    <h3>Filters</h3>\n    <tyui-flex direction="column" gap="2">\n      <tyui-checkbox checked>Available</tyui-checkbox>\n      <tyui-checkbox>Has owner</tyui-checkbox>\n    </tyui-flex>\n  </aside>\n  <main>\n    <tyui-grid min-item-size="12rem">\n      <section style="padding:16px;border:1px solid CanvasText;">Result A</section>\n      <section style="padding:16px;border:1px solid CanvasText;">Result B</section>\n    </tyui-grid>\n  </main>\n</tyui-sidebar>',
    title: 'Filters And Results',
  },
  {
    code: '<tyui-sidebar side-size="12rem" content-min="60%" gap="3">\n  <tyui-frame ratio="1/1">\n    <div style="display:grid;place-items:center;background:CanvasText;color:Canvas;">Image</div>\n  </tyui-frame>\n  <tyui-flex direction="column" gap="2">\n    <h3>Component preview</h3>\n    <p>The body region takes remaining space and wraps below the media when narrow.</p>\n    <tyui-cluster>\n      <tyui-button appearance="primary">Open</tyui-button>\n      <tyui-button>Dismiss</tyui-button>\n    </tyui-cluster>\n  </tyui-flex>\n</tyui-sidebar>',
    title: 'Media And Body',
  },
];
const designs: Array<{ title: string; code: string }> = [];

const meta: Meta = {
  title: 'Components/Sidebar',
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
    <h1>Sidebar Examples</h1>
    ${examples.length > 0
      ? examples.map(renderExample)
      : html`<p>No Storybook examples are marked in the component spec yet.</p>`}
  </article>`;
}

function designsPage() {
  return html`<article class="ty-spec-doc">
    ${styles}
    <h1>Sidebar Designs</h1>
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
      '<h1>Sidebar</h1>\n<h2>Identity</h2>\n<ul>\n<li>Tag: <code>tyui-sidebar</code></li>\n<li>Define: <code>@tyui/define/sidebar</code></li>\n<li>Status: implemented</li>\n<li>Native substrate: native custom element extending <code>HTMLElement</code>.</li>\n<li>Shadow DOM: none.</li>\n<li>Utility class: <code>.ty-sidebar</code></li>\n<li>Category: layout primitive</li>\n<li>Component family: intrinsic layout</li>\n<li>Pattern type: fixed-plus-fluid two-region layout</li>\n</ul>\n<h2>Intent</h2>\n<p>Use Sidebar for a two-region layout where one child has a preferred fixed size and the other child takes the remaining space. It collapses through intrinsic flex wrapping instead of viewport breakpoints.</p>\n<p>Use it for navigation plus content, filter panel plus results, metadata plus detail, or media plus body. Do not use it for app-wide drawer behavior, overlay side panels, or arbitrary three-column shells.</p>\n<h2>Selection Guidance</h2>\n<ul>\n<li>Use when: exactly two primary regions exist and one region has a preferred size.</li>\n<li>Do not use when: the side region opens as an overlay, more than two columns are needed, or both regions should be equal cards.</li>\n<li>Prefer instead: <code>tyui-grid</code> for peer columns, <code>tyui-container</code> for page rails, dialog/drawer components for overlay side panels.</li>\n<li>Product-level variant preferences: generated design layers may set side width, gap, and collapse threshold through tokens.</li>\n<li>Agent rule: choose Sidebar when the layout sentence reads &quot;filters beside results&quot; or &quot;nav beside content&quot;.</li>\n</ul>',
    ),
};

export const API: Story = {
  render: () =>
    markdownPage(
      '<h1>Sidebar API</h1>\n<h2>API</h2>\n<h3>Attributes</h3>\n<table><thead><tr><th>Name</th><th>Type</th><th>Reflects</th><th>Default</th><th>Notes</th></tr></thead><tbody><tr><td><code>side</code></td><td><code>start | end</code></td><td>yes</td><td><code>start</code></td><td><code>end</code> maps to <code>flex-direction: row-reverse</code>; DOM order remains the reading order.</td></tr><tr><td><code>side-size</code></td><td>CSS length token or length string</td><td>yes</td><td><code>18rem</code></td><td>Preferred side region size.</td></tr><tr><td><code>content-min</code></td><td>CSS length token or length string</td><td>yes</td><td><code>50%</code></td><td>Minimum content size before wrap/collapse.</td></tr><tr><td><code>gap</code></td><td><code>0 | 1 | 2 | 3 | 4</code></td><td>yes</td><td><code>3</code></td><td>Gap between regions.</td></tr><tr><td><code>no-stretch</code></td><td><code>boolean</code></td><td>yes</td><td><code>false</code></td><td>Prevents default cross-axis stretch.</td></tr></tbody></table>\n<h3>Properties</h3>\n<p>Mirror attributes with typed properties.</p>\n<h3>Events</h3>\n<p>None. Sidebar is layout only.</p>\n<h3>Event Semantics</h3>\n<p>Child events pass through light DOM.</p>\n<h3>Slots</h3>\n<table><thead><tr><th>Name</th><th>Description</th><th>Fallback</th><th>Slotted Styling Rules</th></tr></thead><tbody><tr><td>default</td><td>exactly two regions</td><td>none</td><td>first child receives side policy; second child receives fluid policy</td></tr></tbody></table>\n<h3>CSS Parts</h3>\n<p>None.</p>\n<h3>CSS Custom Properties</h3>\n<p><code>--ty-sidebar-size</code>, <code>--ty-sidebar-content-min-inline-size</code>, <code>--ty-sidebar-gap</code>, <code>--ty-layout-gap</code>.</p>\n<h3>Attribute To CSS Mapping</h3>\n<p>The element maps attributes to the public CSS variables consumed by both <code>tyui-sidebar</code> and <code>.ty-sidebar</code>:</p>\n<table><thead><tr><th>Attribute</th><th>CSS Variable</th><th>Mapping</th></tr></thead><tbody><tr><td><code>side</code></td><td><code>--ty-sidebar-direction</code></td><td><code>start</code> -&gt; <code>row</code>; <code>end</code> -&gt; <code>row-reverse</code></td></tr><tr><td><code>side-size</code></td><td><code>--ty-sidebar-size</code></td><td>valid CSS length string; absent uses <code>18rem</code></td></tr><tr><td><code>content-min</code></td><td><code>--ty-sidebar-content-min-inline-size</code></td><td>valid CSS length string; absent uses <code>50%</code></td></tr><tr><td><code>gap</code></td><td><code>--ty-sidebar-gap</code></td><td><code>0..4</code> -&gt; <code>var(--ty-space-*, fallback)</code>; invalid values fall back to <code>3</code></td></tr><tr><td><code>no-stretch</code></td><td><code>--ty-sidebar-align</code></td><td>absent -&gt; <code>stretch</code>; present -&gt; <code>flex-start</code></td></tr></tbody></table>\n<h2>Slots</h2>\n<table><thead><tr><th>Name</th><th>Description</th><th>Fallback</th><th>Slotted Styling Rules</th></tr></thead><tbody><tr><td>default</td><td>exactly two regions</td><td>none</td><td>first child receives side policy; second child receives fluid policy</td></tr></tbody></table>\n<h2>CSS Parts</h2>\n<p>None.</p>\n<h2>Events</h2>\n<p>None. Sidebar is layout only.</p>\n<h2>Event Semantics</h2>\n<p>Child events pass through light DOM.</p>',
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
      '<h1>Sidebar Implementation Spec</h1>\n<h2>Composition Contract</h2>\n<ul>\n<li>Allowed children: exactly two direct children.</li>\n<li>Required parent: none.</li>\n<li>Required child components: none.</li>\n<li>Optional child components: nav, form filters, details, grids, cards.</li>\n<li>Disallowed nested interactive content: none beyond child rules.</li>\n<li>Composition anti-patterns: adding three or more direct children, using CSS order to move navigation after content while DOM says otherwise, using Sidebar for an overlay drawer.</li>\n<li>Child order: first child is the side region; second child is the main/content region.</li>\n</ul>\n<h2>Behavior</h2>\n<h3>State Model</h3>\n<ul>\n<li>Controlled state: side, side-size, content-min, gap, no-stretch.</li>\n<li>Uncontrolled/default state: start side, 18rem side size, 50 percent content minimum, gap token 3.</li>\n<li>Parent-owned state: page region and available width.</li>\n<li>Child-owned state: semantics, focus, scroll.</li>\n<li>Programmatic update behavior: CSS updates only.</li>\n</ul>\n<h3>Focus Model</h3>\n<p>Sidebar is not focusable. Focus order follows DOM order. Visual <code>side=&quot;end&quot;</code> must not create a misleading reading order.</p>\n<h3>Keyboard Contract</h3>\n<p>No keyboard behavior. Navigation, filters, and content controls own their own keyboard contracts.</p>\n<h2>Layout Contract</h2>\n<ul>\n<li>Display: flex.</li>\n<li>Intrinsic size: side child uses preferred flex basis; content child consumes remaining space.</li>\n<li>Shrink policy: content child has <code>min-inline-size: min(100%, content-min)</code>; side child can wrap above content when space runs out.</li>\n<li>Wrap policy: wraps to one column when the content minimum cannot fit.</li>\n<li>Flexible slots: second child is fluid.</li>\n<li>Fixed slots: first child has preferred side size.</li>\n<li>Parent owns: page placement and vertical rhythm.</li>\n<li>Component owns: side/content flex relationship and gap.</li>\n<li>Container-query thresholds: no explicit breakpoint; flex wrapping handles collapse.</li>\n<li>Container behavior: must not set <code>container-type</code>; consumers may add containment outside the primitive when needed.</li>\n<li>Scroll / overflow policy: children own internal scroll.</li>\n</ul>\n<h3>Direct Child Contract</h3>\n<table><thead><tr><th>Child</th><th>Role</th><th>Flex Policy</th><th>Notes</th></tr></thead><tbody><tr><td>first</td><td>side region</td><td><code>flex-basis: side-size; flex-grow: 1</code></td><td>Navigation, filters, media, metadata.</td></tr><tr><td>second</td><td>content region</td><td><code>flex-basis: 0; flex-grow: 999</code></td><td>Main content; must support <code>min-inline-size:0</code> where needed.</td></tr></tbody></table>\n<h2>Styling Contract</h2>\n<h3>Public Tokens</h3>\n<p>Use <code>--ty-sidebar-*</code> tokens. Design layers may set side size and gap from product layout principles.</p>\n<h3>Private Implementation Variables</h3>\n<p>Private variables use <code>--_ty-*</code>.</p>\n<h3>Styling State Surface</h3>\n<p>Attributes and tokens only.</p>\n<ul>\n<li>Forced-colors behavior: none beyond children.</li>\n<li>Reduced-motion behavior: no motion.</li>\n<li>App-variant hooks: host attributes, utility class, public tokens.</li>\n</ul>\n<h2>Accessibility</h2>\n<ul>\n<li>Role: none by default.</li>\n<li>Accessible name: none.</li>\n<li>ARIA attributes: consumers should use native landmarks inside children when the regions need names.</li>\n<li>Reading order: DOM order must match reading order. Do not use <code>side=&quot;end&quot;</code> to hide an order problem.</li>\n</ul>\n<h2>Implementation Requirements</h2>\n<ul>\n<li>Implement as a native custom element with no shadow DOM.</li>\n<li>Follow <code>spec/behavior.md</code> by preserving native child semantics, focus order, and event propagation; Sidebar adds no interaction.</li>\n<li>Define idempotently through <code>defineTyuiSidebar</code>.</li>\n<li>Export <code>@tyui/elements/sidebar</code> and <code>@tyui/define/sidebar</code>.</li>\n<li>Provide <code>.ty-sidebar</code> utility CSS.</li>\n<li>Warn in development when direct child count is not two.</li>\n<li>Do not calculate collapse with JavaScript.</li>\n</ul>\n<h2>Tests</h2>\n<table><thead><tr><th>Requirement</th><th>Setup</th><th>Action</th><th>Expected Result</th></tr></thead><tbody><tr><td>Two-region flex works</td><td>Render two children</td><td>Measure widths</td><td>First child uses side size; second fills remaining space.</td></tr><tr><td>Wrap collapse works</td><td>Constrain container</td><td>Measure rows</td><td>Content wraps below side region without JS.</td></tr><tr><td>Child count warning</td><td>Render three direct children in dev</td><td>Observe console</td><td>Development warning is emitted.</td></tr><tr><td>No focus stop</td><td>Render focusable children</td><td>Press Tab</td><td>Focus enters first focusable child in DOM order.</td></tr><tr><td><code>side=end</code> mapping</td><td>Render <code>side=&quot;end&quot;</code></td><td>Read CSS variables</td><td><code>--ty-sidebar-direction</code> is <code>row-reverse</code>; DOM order is unchanged.</td></tr><tr><td>Element/utility parity</td><td>Compare <code>.ty-sidebar</code> with matching CSS variables and element attributes</td><td>Read core styles</td><td>Core rules match.</td></tr></tbody></table>\n<h2>Agent Guidance</h2>\n<ul>\n<li>Use Sidebar for two-region fixed-plus-fluid layouts.</li>\n<li>Keep app drawer and overlay behavior out of Sidebar.</li>\n<li>Put landmarks inside children when regions need names.</li>\n<li>Use Grid for more than two peer columns.</li>\n</ul>',
    ),
};
