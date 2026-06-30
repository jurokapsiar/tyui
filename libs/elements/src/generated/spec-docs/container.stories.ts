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
    "code": "<tyui-container size=\"wide\">\n  <tyui-flex direction=\"column\" gap=\"4\">\n    <h2>Settings</h2>\n    <tyui-grid min-item-size=\"18rem\">\n      <section style=\"padding:16px;border:1px solid CanvasText;\">Account</section>\n      <section style=\"padding:16px;border:1px solid CanvasText;\">Security</section>\n      <section style=\"padding:16px;border:1px solid CanvasText;\">Billing</section>\n    </tyui-grid>\n  </tyui-flex>\n</tyui-container>",
    "title": "Page Section"
  },
  {
    "code": "<tyui-container bleed gutter=\"4\" style=\"background:CanvasText;color:Canvas;padding-block:24px;\">\n  <h2>Full-width announcement</h2>\n</tyui-container>",
    "title": "Full Bleed Region"
  }
];
const designs: Array<{ title: string; code: string }> = [];

const meta: Meta = {
  title: 'Components/Container',
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
    <h1>Container Examples</h1>
    ${examples.length > 0
      ? examples.map(renderExample)
      : html`<p>No Storybook examples are marked in the component spec yet.</p>`}
  </article>`;
}

function designsPage() {
  return html`<article class="ty-spec-doc">
    ${styles}
    <h1>Container Designs</h1>
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
  render: () => markdownPage("<h1>Container</h1>\n<h2>Identity</h2>\n<ul>\n<li>Tag: <code>tyui-container</code></li>\n<li>Define: <code>@toyu-ui/define/container</code></li>\n<li>Status: implemented</li>\n<li>Native substrate: native custom element extending <code>HTMLElement</code>.</li>\n<li>Shadow DOM: none.</li>\n<li>Utility class: <code>.ty-container</code></li>\n<li>Category: layout primitive</li>\n<li>Component family: intrinsic layout</li>\n<li>Pattern type: page or region width constraint</li>\n</ul>\n<h2>Intent</h2>\n<p>Use Container to set page or region width, inline gutters, and horizontal centering. It gives application screens a stable content rail without turning individual components into page-layout owners.</p>\n<p>Do not use Container for readable prose measure, one-axis alignment, or card grids. Prefer <code>tyui-center</code>, <code>tyui-flex</code>, or <code>tyui-grid</code> for those jobs.</p>\n<h2>Selection Guidance</h2>\n<ul>\n<li>Use when: a page, section, or major region needs max width and gutters.</li>\n<li>Do not use when: one component needs internal padding or an action row needs wrapping.</li>\n<li>Prefer instead: <code>tyui-center</code> for a narrow readable column, <code>tyui-grid</code> for repeated panels, plain block flow inside an already constrained region.</li>\n<li>Product-level variant preferences: generated design layers may map container size names to product breakpoints or content rails.</li>\n<li>Agent rule: choose Container when the layout question is &quot;what horizontal rail does this section live on?&quot;</li>\n</ul>"),
};

export const API: Story = {
  render: () => markdownPage("<h1>Container API</h1>\n<h2>API</h2>\n<h3>Attributes</h3>\n<table><thead><tr><th>Name</th><th>Type</th><th>Reflects</th><th>Default</th><th>Notes</th></tr></thead><tbody><tr><td><code>size</code></td><td><code>narrow | medium | wide | full</code></td><td>yes</td><td><code>wide</code></td><td>Maps to max inline size tokens.</td></tr><tr><td><code>gutter</code></td><td><code>0 | 1 | 2 | 3 | 4 | page</code></td><td>yes</td><td><code>page</code></td><td>Inline padding token.</td></tr><tr><td><code>bleed</code></td><td><code>boolean</code></td><td>yes</td><td><code>false</code></td><td>Edge-to-edge mode: removes max width and gutters.</td></tr></tbody></table>\n<h3>Properties</h3>\n<p>Mirror attributes with typed properties.</p>\n<h3>Events</h3>\n<p>None.</p>\n<h3>Event Semantics</h3>\n<p>Child events pass through light DOM.</p>\n<h3>Slots</h3>\n<table><thead><tr><th>Name</th><th>Description</th><th>Fallback</th><th>Slotted Styling Rules</th></tr></thead><tbody><tr><td>default</td><td>constrained region content</td><td>none</td><td>children keep their own layout</td></tr></tbody></table>\n<h3>CSS Parts</h3>\n<p>None.</p>\n<h3>CSS Custom Properties</h3>\n<p><code>--ty-container-max-inline-size</code>, <code>--ty-container-gutter</code>, <code>--ty-container-narrow</code>, <code>--ty-container-medium</code>, <code>--ty-container-wide</code>, <code>--ty-page-gutter</code>.</p>\n<p>Default rail token fallbacks: <code>--ty-container-narrow</code> -&gt; <code>42rem</code>, <code>--ty-container-medium</code> -&gt; <code>60rem</code>, <code>--ty-container-wide</code> -&gt; <code>72rem</code>.</p>\n<h3>Attribute To CSS Mapping</h3>\n<p>The element maps attributes to the public CSS variables consumed by both <code>tyui-container</code> and <code>.ty-container</code>:</p>\n<table><thead><tr><th>Attribute</th><th>CSS Variable</th><th>Mapping</th></tr></thead><tbody><tr><td><code>size</code></td><td><code>--ty-container-max-inline-size</code></td><td><code>narrow/medium/wide</code> -&gt; named rail token with fallback; <code>full</code> -&gt; <code>none</code></td></tr><tr><td><code>gutter</code></td><td><code>--ty-container-gutter</code></td><td><code>page</code> -&gt; <code>var(--ty-page-gutter, 1rem)</code>; <code>0..4</code> -&gt; <code>var(--ty-space-*, fallback)</code></td></tr><tr><td><code>bleed</code></td><td><code>--ty-container-gutter</code></td><td>present -&gt; <code>0</code>; <code>size=&quot;full&quot;</code> still keeps gutters unless <code>bleed</code> is present</td></tr></tbody></table>\n<h2>Slots</h2>\n<table><thead><tr><th>Name</th><th>Description</th><th>Fallback</th><th>Slotted Styling Rules</th></tr></thead><tbody><tr><td>default</td><td>constrained region content</td><td>none</td><td>children keep their own layout</td></tr></tbody></table>\n<h2>CSS Parts</h2>\n<p>None.</p>\n<h2>Events</h2>\n<p>None.</p>\n<h2>Event Semantics</h2>\n<p>Child events pass through light DOM.</p>"),
};

export const Examples: Story = {
  tags: ['visual'],
  render: () => examplesPage(),
};


export const ImplementationSpec: Story = {
  name: 'Implementation Spec',
  render: () => markdownPage("<h1>Container Implementation Spec</h1>\n<h2>Composition Contract</h2>\n<ul>\n<li>Allowed children: sections, headings, layouts, forms, grids, and component groups.</li>\n<li>Required parent: none.</li>\n<li>Required child components: none.</li>\n<li>Optional child components: all layout primitives.</li>\n<li>Disallowed nested interactive content: none beyond child rules.</li>\n<li>Composition anti-patterns: using Container inside every card, using Container to set a button width, nesting containers without a named rail change.</li>\n</ul>\n<h2>Behavior</h2>\n<h3>State Model</h3>\n<ul>\n<li>Controlled state: size, gutter, bleed.</li>\n<li>Uncontrolled/default state: wide content rail with page gutter.</li>\n<li>Parent-owned state: vertical placement and app shell.</li>\n<li>Child-owned state: semantics, spacing inside region.</li>\n<li>Programmatic update behavior: CSS updates only.</li>\n</ul>\n<h3>Focus Model</h3>\n<p>Container is not focusable. Children keep native focus order.</p>\n<h3>Keyboard Contract</h3>\n<p>No keyboard behavior.</p>\n<h2>Layout Contract</h2>\n<ul>\n<li>Display: block.</li>\n<li>Intrinsic size: inline size is <code>100%</code> constrained by <code>max-inline-size</code>; <code>size=&quot;full&quot;</code> removes max width but keeps gutters, while <code>bleed</code> removes max width and gutters.</li>\n<li>Shrink policy: shrinks to viewport/container with gutters.</li>\n<li>Wrap policy: natural child wrapping.</li>\n<li>Flexible slots: default content.</li>\n<li>Fixed slots: none.</li>\n<li>Parent owns: page shell and vertical rhythm around Container.</li>\n<li>Component owns: max width, inline gutters, horizontal centering.</li>\n<li>Container-query thresholds: none.</li>\n<li>Container behavior: must not set <code>container-type</code>; consumers may add containment outside the primitive when needed.</li>\n<li>Scroll / overflow policy: no internal scroll.</li>\n</ul>\n<h2>Styling Contract</h2>\n<h3>Public Tokens</h3>\n<p>Use <code>--ty-container-*</code> tokens and <code>--ty-page-gutter</code>. Design layers may set container rails from <code>DESIGN.md</code>.</p>\n<h3>Private Implementation Variables</h3>\n<p>Private variables use <code>--_ty-*</code>.</p>\n<h3>Styling State Surface</h3>\n<p>Attributes and tokens only.</p>\n<ul>\n<li>Forced-colors behavior: none beyond children.</li>\n<li>Reduced-motion behavior: no motion.</li>\n<li>App-variant hooks: host attributes, utility class, public tokens.</li>\n</ul>\n<h2>Accessibility</h2>\n<ul>\n<li>Role: none by default.</li>\n<li>Accessible name: none.</li>\n<li>ARIA attributes: consumers may add landmark roles to sections when appropriate.</li>\n<li>Reading order: unchanged.</li>\n</ul>\n<h2>Implementation Requirements</h2>\n<ul>\n<li>Implement as a native custom element with no shadow DOM.</li>\n<li>Follow <code>spec/behavior.md</code> by preserving native child semantics, focus order, and event propagation; Container adds no interaction.</li>\n<li>Define idempotently through <code>defineTyuiContainer</code>.</li>\n<li>Export <code>@toyu-ui/elements/container</code> and <code>@toyu-ui/define/container</code>.</li>\n<li>Provide <code>.ty-container</code> utility CSS.</li>\n<li>Do not use viewport-specific JavaScript.</li>\n</ul>\n<h2>Tests</h2>\n<table><thead><tr><th>Requirement</th><th>Setup</th><th>Action</th><th>Expected Result</th></tr></thead><tbody><tr><td>Size maps</td><td>Render <code>size=&quot;medium&quot;</code></td><td>Read computed max inline size</td><td>Uses medium token.</td></tr><tr><td>Full keeps gutters</td><td>Render <code>size=&quot;full&quot;</code></td><td>Read CSS variables</td><td>Max inline size is none and gutter remains page gutter.</td></tr><tr><td>Bleed removes gutters</td><td>Render with <code>bleed</code></td><td>Read CSS variables</td><td>Max inline size is none and gutter is <code>0</code>.</td></tr><tr><td>Gutters apply</td><td>Render in narrow viewport</td><td>Measure padding</td><td>Inline gutter remains.</td></tr><tr><td>No focus stop</td><td>Render focusable child</td><td>Press Tab</td><td>Focus enters child.</td></tr><tr><td>Element/utility parity</td><td>Compare <code>.ty-container</code> with matching CSS variables and element attributes</td><td>Read core styles</td><td>Core rules match.</td></tr></tbody></table>\n<h2>Agent Guidance</h2>\n<ul>\n<li>Use Container for page and section rails.</li>\n<li>Use Center for readable measure inside a Container.</li>\n<li>Do not solve component spacing by adding Container around controls.</li>\n<li>Put app shell decisions in <code>DESIGN.md</code> / <code>design-app.md</code>, then map them to Container tokens.</li>\n</ul>"),
};
