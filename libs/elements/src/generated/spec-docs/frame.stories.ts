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
    "code": "<tyui-frame ratio=\"16/9\" fit=\"cover\" style=\"max-inline-size:420px;\">\n  <img\n    src='data:image/svg+xml;utf8,<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 640 360\"><rect width=\"640\" height=\"360\" fill=\"%23d7e8ff\"/><circle cx=\"460\" cy=\"120\" r=\"76\" fill=\"%2379a7ff\"/><rect x=\"72\" y=\"196\" width=\"496\" height=\"80\" rx=\"22\" fill=\"%23233548\"/></svg>'\n    alt=\"Abstract workspace preview\"\n  />\n</tyui-frame>",
    "title": "Image Frame"
  },
  {
    "code": "<tyui-frame ratio=\"1/1\" style=\"max-inline-size:240px;background:CanvasText;\">\n  <div style=\"display:grid;place-items:center;color:Canvas;\">Preview</div>\n</tyui-frame>",
    "title": "Square Preview"
  }
];
const designs: Array<{ title: string; code: string }> = [];

const meta: Meta = {
  title: 'Components/Frame',
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
    <h1>Frame Examples</h1>
    ${examples.length > 0
      ? examples.map(renderExample)
      : html`<p>No Storybook examples are marked in the component spec yet.</p>`}
  </article>`;
}

function designsPage() {
  return html`<article class="ty-spec-doc">
    ${styles}
    <h1>Frame Designs</h1>
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
  render: () => markdownPage("<h1>Frame</h1>\n<h2>Identity</h2>\n<ul>\n<li>Tag: <code>tyui-frame</code></li>\n<li>Define: <code>@toyu-ui/define/frame</code></li>\n<li>Status: implemented</li>\n<li>Native substrate: native custom element extending <code>HTMLElement</code>.</li>\n<li>Shadow DOM: none.</li>\n<li>Utility class: <code>.ty-frame</code></li>\n<li>Alias concept: AspectRatio. The public element remains <code>tyui-frame</code>; docs may describe the pattern as aspect-ratio framing.</li>\n<li>Category: layout primitive</li>\n<li>Component family: intrinsic layout</li>\n<li>Pattern type: aspect-ratio media/content frame</li>\n</ul>\n<h2>Intent</h2>\n<p>Use Frame to reserve a stable aspect ratio for media, previews, charts, thumbnails, and embedded content. It prevents layout shift while letting the parent own width.</p>\n<p>Do not use Frame to crop text-heavy cards, create arbitrary fixed heights, or hide overflowing interactive content.</p>\n<h2>Selection Guidance</h2>\n<ul>\n<li>Use when: one child needs a stable aspect ratio.</li>\n<li>Do not use when: content height should follow text, the child is an unconstrained form, or scrollable overflow is required.</li>\n<li>Prefer instead: natural block flow for text, <code>tyui-grid</code> for collections, future media-specific components for image semantics.</li>\n<li>Product-level variant preferences: generated design layers may choose common ratios for cards, avatars, and media previews.</li>\n<li>Agent rule: choose Frame when the layout question is &quot;what ratio should this visual region hold?&quot;</li>\n</ul>"),
};

export const API: Story = {
  render: () => markdownPage("<h1>Frame API</h1>\n<h2>API</h2>\n<h3>Attributes</h3>\n<table><thead><tr><th>Name</th><th>Type</th><th>Reflects</th><th>Default</th><th>Notes</th></tr></thead><tbody><tr><td><code>ratio</code></td><td>ratio string such as <code>16/9</code>, <code>4/3</code>, <code>1/1</code></td><td>yes</td><td><code>16/9</code></td><td>Maps to CSS <code>aspect-ratio</code>.</td></tr><tr><td><code>fit</code></td><td><code>cover | contain | fill | scale-down | none</code></td><td>yes</td><td><code>cover</code></td><td>Applies only to direct replaced media children such as <code>img</code>, <code>video</code>, <code>iframe</code>, or <code>canvas</code>.</td></tr><tr><td><code>position</code></td><td>CSS object-position keyword string</td><td>yes</td><td><code>center</code></td><td>Applies only to direct replaced media children.</td></tr></tbody></table>\n<h3>Properties</h3>\n<p>Mirror attributes with typed properties.</p>\n<h3>Events</h3>\n<p>None.</p>\n<h3>Event Semantics</h3>\n<p>Child media events pass through light DOM.</p>\n<h3>Slots</h3>\n<table><thead><tr><th>Name</th><th>Description</th><th>Fallback</th><th>Slotted Styling Rules</th></tr></thead><tbody><tr><td>default</td><td>framed child</td><td>none</td><td>direct child fills the frame</td></tr></tbody></table>\n<h3>CSS Parts</h3>\n<p>None.</p>\n<h3>CSS Custom Properties</h3>\n<p><code>--ty-frame-ratio</code>, <code>--ty-frame-fit</code>, <code>--ty-frame-position</code>.</p>\n<h3>Attribute To CSS Mapping</h3>\n<p>The element maps attributes to the public CSS variables consumed by both <code>tyui-frame</code> and <code>.ty-frame</code>:</p>\n<table><thead><tr><th>Attribute</th><th>CSS Variable</th><th>Mapping</th></tr></thead><tbody><tr><td><code>ratio</code></td><td><code>--ty-frame-ratio</code></td><td>ratio string; <code>16/9</code> normalizes to <code>16 / 9</code>; absent uses <code>16 / 9</code></td></tr><tr><td><code>fit</code></td><td><code>--ty-frame-fit</code></td><td>valid enum value; invalid values fall back to <code>cover</code></td></tr><tr><td><code>position</code></td><td><code>--ty-frame-position</code></td><td>raw CSS object-position value; absent uses <code>center</code></td></tr></tbody></table>\n<h2>Slots</h2>\n<table><thead><tr><th>Name</th><th>Description</th><th>Fallback</th><th>Slotted Styling Rules</th></tr></thead><tbody><tr><td>default</td><td>framed child</td><td>none</td><td>direct child fills the frame</td></tr></tbody></table>\n<h2>CSS Parts</h2>\n<p>None.</p>\n<h2>Events</h2>\n<p>None.</p>\n<h2>Event Semantics</h2>\n<p>Child media events pass through light DOM.</p>"),
};

export const Examples: Story = {
  tags: ['visual'],
  render: () => examplesPage(),
};


export const ImplementationSpec: Story = {
  name: 'Implementation Spec',
  render: () => markdownPage("<h1>Frame Implementation Spec</h1>\n<h2>Composition Contract</h2>\n<ul>\n<li>Allowed children: one primary child such as image, video, canvas, iframe, chart, or preview surface.</li>\n<li>Required parent: none.</li>\n<li>Required child components: none.</li>\n<li>Optional child components: <code>tyui-image</code>.</li>\n<li>Disallowed nested interactive content: avoid complex focusable content unless it fits and remains usable.</li>\n<li>Composition anti-patterns: placing a full form in Frame, using overflow hidden to mask broken layout, using Frame for text card height equalization.</li>\n</ul>\n<h2>Behavior</h2>\n<h3>State Model</h3>\n<ul>\n<li>Controlled state: ratio, fit, position.</li>\n<li>Uncontrolled/default state: 16:9 cover center.</li>\n<li>Parent-owned state: inline size and placement.</li>\n<li>Child-owned state: media semantics, loading behavior, alt text.</li>\n<li>Programmatic update behavior: CSS updates only.</li>\n</ul>\n<h3>Focus Model</h3>\n<p>Frame is not focusable. Focusable child content keeps its own focus behavior.</p>\n<h3>Keyboard Contract</h3>\n<p>No keyboard behavior.</p>\n<h2>Layout Contract</h2>\n<ul>\n<li>Display: block.</li>\n<li>Intrinsic size: block size derives from inline size and aspect ratio.</li>\n<li>Shrink policy: shrinks with parent inline size.</li>\n<li>Wrap policy: N/A.</li>\n<li>Flexible slots: one default child.</li>\n<li>Fixed slots: none.</li>\n<li>Parent owns: width and placement.</li>\n<li>Component owns: aspect ratio, overflow clipping, child fill behavior.</li>\n<li>Container-query thresholds: none.</li>\n<li>Container behavior: must not set <code>container-type</code>; consumers may add containment outside the primitive when needed.</li>\n<li>Scroll / overflow policy: hidden by default; do not place scrollable content inside Frame.</li>\n</ul>\n<h2>Styling Contract</h2>\n<h3>Public Tokens</h3>\n<p>Use <code>--ty-frame-*</code> tokens for ratio, fit, and position. Product design layers may set media ratios by component composition.</p>\n<h3>Private Implementation Variables</h3>\n<p>Private variables use <code>--_ty-*</code>.</p>\n<h3>Styling State Surface</h3>\n<p>Attributes and tokens only.</p>\n<ul>\n<li>Forced-colors behavior: none beyond child.</li>\n<li>Reduced-motion behavior: no motion added.</li>\n<li>App-variant hooks: host attributes, utility class, public tokens.</li>\n</ul>\n<h2>Accessibility</h2>\n<ul>\n<li>Role: none by default.</li>\n<li>Accessible name: none.</li>\n<li>ARIA attributes: do not add media semantics. The child image/video/iframe owns accessible name and role.</li>\n<li>Reading order: unchanged.</li>\n</ul>\n<h2>Implementation Requirements</h2>\n<ul>\n<li>Implement as a native custom element with no shadow DOM.</li>\n<li>Follow <code>spec/behavior.md</code> by preserving native child semantics, focus order, and event propagation; Frame adds no interaction.</li>\n<li>Define idempotently through <code>defineTyuiFrame</code>.</li>\n<li>Export <code>@toyu-ui/elements/frame</code> and <code>@toyu-ui/define/frame</code>.</li>\n<li>Provide <code>.ty-frame</code> utility CSS.</li>\n<li>Use CSS <code>aspect-ratio</code>; do not calculate height in JavaScript.</li>\n<li>Apply child fill rules only to direct children.</li>\n</ul>\n<h2>Tests</h2>\n<table><thead><tr><th>Requirement</th><th>Setup</th><th>Action</th><th>Expected Result</th></tr></thead><tbody><tr><td>Ratio maps</td><td>Render <code>ratio=&quot;1/1&quot;</code></td><td>Measure box</td><td>Width and height match.</td></tr><tr><td>Child fills</td><td>Render image child</td><td>Read computed style</td><td>Direct child fills inline and block size.</td></tr><tr><td>No focus stop</td><td>Render focusable child</td><td>Press Tab</td><td>Focus enters child, not Frame.</td></tr><tr><td>Overflow policy</td><td>Render oversized media</td><td>Inspect layout</td><td>Media clips without layout shift.</td></tr><tr><td>Element/utility parity</td><td>Compare <code>.ty-frame</code> with matching CSS variables and element attributes</td><td>Read core styles</td><td>Core frame rules match.</td></tr></tbody></table>\n<h2>Agent Guidance</h2>\n<ul>\n<li>Use Frame for visual media ratios.</li>\n<li>Use Grid to arrange many Frames.</li>\n<li>Keep alt text and media semantics on the child element.</li>\n<li>Do not put forms or dense interactive surfaces in Frame.</li>\n</ul>"),
};
