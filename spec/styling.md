# Styling Architecture

FAST's Adaptive UI model demonstrated that components driven by design tokens and "recipes" could yield substantially different visual languages by modifying a relatively small set of values—density, corner radius, typography, neutral/accent palettes, stroke widths, control heights. The modern approach preserves this intent while leaning heavily on native browser capabilities.

The recommended pipeline is:

```
Headless behavior
      ↓
Stable component DOM structure
      ↓
Semantic CSS contract
      ↓
Product design-token theme
      ↓
Optional component-level overrides
```

## Product `DESIGN.md` vs Component Styling Contract

A product `DESIGN.md` explains the visual identity: product character, palette rationale, typography voice, shape language, elevation/depth model, motion feeling, density posture, and the intentional do's and don'ts that prevent generic output. Its YAML front matter or linked `tokens.json` supplies exact values. Its prose explains why those values exist and when to use them.

The component library owns the stable styling API that lets products express that identity without rewriting internals: token names, fallback behavior, CSS parts, cascade layer boundaries, state selectors, and forced-colors/reduced-motion behavior.

| Concern                                            | Product `DESIGN.md`                    | Component Styling Spec             |
| -------------------------------------------------- | -------------------------------------- | ---------------------------------- |
| Brand and product visual identity                  | Owns                                   | Does not own                       |
| Color, type, shape, motion, elevation rationale    | Owns                                   | Defines supported token categories |
| Exact product values                               | Owns directly or through `tokens.json` | Publishes schema/defaults          |
| Component visual variants preferred by the product | May prefer or restrict                 | Defines available variants         |
| Token names and inheritance behavior               | References                             | Owns                               |
| Shadow parts and component tokens                  | Does not invent                        | Owns as public API                 |
| Dark mode, forced colors, reduced motion policy    | Owns product policy                    | Implements safe defaults and hooks |

This keeps `DESIGN.md` from becoming a parallel styling API. Products describe intent and choose tokens; components expose the stable levers.

`design-app.md` is the generated bridge between those two layers. It may translate product intent into app-specific component token assignments and variant guidance, then point to generated CSS such as `theme.css` and `component-variants.css`.

Example:

```css
[data-design-system='atmospheric'] {
  --ty-color-surface: rgb(255 255 255 / 0.1);
  --ty-color-text: #ffffff;
  --ty-control-radius: 1.5rem;
  --ty-overlay-elevation: 0 8px 32px rgb(0 0 0 / 0.1);
}

[data-design-system='atmospheric'] tyui-button[appearance='primary'] {
  --ty-button-background: #ffffff;
  --ty-button-foreground: #2f3131;
  --ty-button-radius: var(--ty-control-radius);
}
```

Generated app styling must use documented semantic tokens, component tokens, and public parts. It must not reach into private shadow DOM. When the desired style needs a missing lever, the generator records a component-library gap in `design-app.md`.

## Consumer Override Model

Apps and generated design bundles customize components in this order:

1. Component attributes and properties such as `appearance`, `size`, `shape`, `disabled`, `checked`, `invalid`, or `open`.
2. Host classes or app-local CSS for layout, containment, width, margin, and narrowly scoped token overrides.
3. Public CSS custom properties documented by the component.
4. Documented `::part()` selectors for exposed internal elements.
5. Inline `style` values only for truly dynamic per-instance values such as measured size, computed position, or runtime token values.

This order is normative for app authors, generated `design-app.md` guidance, and review tooling. Static visual choices belong in generated CSS or app-local CSS, not inline styles. Broad global token overrides are discouraged unless they are intentional product theme values defined in `theme.css`.

CSS classes on a TYUI custom element style the host element:

```tsx
<tyui-button class={styles.sendButton} appearance="primary">
  Send
</tyui-button>
```

```css
.sendButton {
  inline-size: 100%;
  margin-inline-start: auto;
  --ty-button-padding-inline: 1rem;
}
```

This is appropriate for host-level layout concerns and scoped custom-property values. It must not be treated as permission to select private shadow DOM structure.

Inline styles follow the same boundary. They may set host layout properties or public custom properties when the value is computed at runtime:

```tsx
<tyui-popover style={{ '--ty-popover-anchor-inline-size': `${anchorWidth}px` }}>...</tyui-popover>
```

They must not be used for stable theme styling, and they cannot directly style private shadow DOM elements.

## Public vs Private Styling Surface

Public styling surface:

- Documented attributes and properties reflected to the host.
- Semantic and component CSS custom properties using the `--ty-*` prefix.
- Documented slots.
- Documented CSS shadow parts.
- Documented forwarded parts through `exportparts`.

Private implementation details:

- Shadow DOM internal class names.
- Shadow DOM element structure not exposed through parts.
- Internal helper custom properties using the `--_ty-*` prefix.
- `data-*` attributes documented as internal or derived implementation state.

Component styles may use private helper variables such as `--_ty-button-icon-size` to avoid duplicating calculations inside a shadow root. These variables are not a consumer contract and may change in any release unless explicitly promoted to a public `--ty-*` token.

## 1. Framework-Neutral Headless Behavior

Interaction logic, accessibility, keyboard navigation, selection logic, and state transitions live in plain TypeScript with no styling and no framework dependency.

```ts
export interface PressableControllerOptions {
  disabled?: () => boolean;
  onPress?: () => void;
}

export function createPressableController(options: PressableControllerOptions) {
  function handleClick(event: MouseEvent): void {
    if (options.disabled?.()) {
      event.preventDefault();
      return;
    }
    options.onPress?.();
  }

  function handleKeyDown(event: KeyboardEvent): void {
    if (event.key !== 'Enter' && event.key !== ' ') return;
    if (event.key === ' ') event.preventDefault();
  }

  return { handleClick, handleKeyDown };
}
```

## 2. Native Custom Elements With Stable Internal DOM

Each component creates its DOM once and updates only affected nodes or attributes. `part` names form a deliberate public styling API, not an accidental exposure of internal DOM.

```ts
export class TyuiButton extends HTMLElement {
  static observedAttributes = ['disabled', 'appearance', 'size'];

  readonly #button: HTMLButtonElement;

  constructor() {
    super();

    const root = this.attachShadow({ mode: 'open' });

    this.#button = document.createElement('button');
    this.#button.type = 'button';
    this.#button.part.add('control');

    const content = document.createElement('span');
    content.part.add('content');
    content.append(document.createElement('slot'));

    this.#button.append(content);
    root.append(this.#button);
    root.adoptedStyleSheets = [buttonSheet];
  }

  attributeChangedCallback(): void {
    this.#button.disabled = this.hasAttribute('disabled');
  }
}
```

## 3. Three Token Levels

Components must not consume raw values directly. Three layers separate concerns:

### Naming Governance

- CSS custom properties exported by the library use the `--ty-` prefix.
- Primitive tokens use category names: `--ty-space-*`, `--ty-radius-*`, `--ty-color-*`, `--ty-font-*`, `--ty-duration-*`, `--ty-easing-*`, `--ty-elevation-*`, `--ty-stroke-*`.
- Semantic tokens describe intent: `--ty-color-surface`, `--ty-color-text`, `--ty-control-radius`, `--ty-focus-width`, `--ty-motion-feedback`.
- Component tokens follow `--ty-{component}-{property}`: `--ty-button-background`, `--ty-button-padding-inline`, `--ty-dialog-elevation`.
- Private helper variables inside component styles use the `--_ty-` prefix and must not be documented as consumer customization hooks.
- Product-specific private tokens may use a product prefix, but component styles must consume only the public `--ty-*` semantic and component tokens.
- Add a new component token when a common product customization should remain stable across releases. Use `::part()` only when structural styling is intentionally advanced and harder to abstract as a token.

### Primitive Tokens

Available choices, not semantic decisions:

```css
@layer ty.primitives {
  :root {
    --ty-space-0: 0;
    --ty-space-1: 0.25rem;
    --ty-space-2: 0.5rem;
    --ty-space-3: 0.75rem;
    --ty-space-4: 1rem;

    --ty-radius-0: 0;
    --ty-radius-1: 0.125rem;
    --ty-radius-2: 0.25rem;
    --ty-radius-3: 0.5rem;
    --ty-radius-pill: 999px;

    --ty-font-size-100: 0.75rem;
    --ty-font-size-200: 0.875rem;
    --ty-font-size-300: 1rem;

    --ty-stroke-thin: 1px;
    --ty-stroke-thick: 2px;

    --ty-duration-fast: 120ms;
    --ty-duration-normal: 200ms;
    --ty-duration-slow: 320ms;
    --ty-easing-standard: cubic-bezier(0.2, 0, 0, 1);

    --ty-elevation-1: 0 1px 2px rgb(0 0 0 / 0.14);
    --ty-elevation-2: 0 4px 12px rgb(0 0 0 / 0.16);
    --ty-elevation-3: 0 12px 32px rgb(0 0 0 / 0.18);
  }
}
```

### Semantic Tokens

Describe product intent:

```css
@layer ty.semantic {
  :root {
    --ty-color-surface: light-dark(#ffffff, #1c1c1e);
    --ty-color-surface-hover: light-dark(#f3f3f3, #2c2c2e);
    --ty-color-text: light-dark(#191919, #f5f5f7);
    --ty-color-border: light-dark(#c7c7c7, #555558);
    --ty-color-accent: #0067c0;
    --ty-color-on-accent: white;

    --ty-control-radius: var(--ty-radius-2);
    --ty-control-border-width: var(--ty-stroke-thin);
    --ty-control-font-size: var(--ty-font-size-200);

    --ty-control-padding-inline: var(--ty-space-3);
    --ty-control-padding-block: var(--ty-space-2);
    --ty-control-gap: var(--ty-space-2);

    --ty-focus-width: 2px;
    --ty-focus-offset: 2px;

    --ty-motion-feedback-duration: var(--ty-duration-fast);
    --ty-motion-content-duration: var(--ty-duration-normal);
    --ty-motion-easing: var(--ty-easing-standard);

    --ty-overlay-elevation: var(--ty-elevation-2);
  }
}
```

### Component Tokens

Connect semantic intent to a specific component:

```css
@layer ty.components {
  tyui-button {
    --ty-button-background: var(--ty-color-surface);
    --ty-button-background-hover: var(--ty-color-surface-hover);
    --ty-button-foreground: var(--ty-color-text);
    --ty-button-border-color: var(--ty-color-border);

    --ty-button-radius: var(--ty-control-radius);
    --ty-button-padding-inline: var(--ty-control-padding-inline);
    --ty-button-padding-block: var(--ty-control-padding-block);
    --ty-button-gap: var(--ty-control-gap);
  }
}
```

This layered token model is the modern equivalent of FAST's configurable design language.

## 4. Component CSS

Components reference only semantic or component tokens. Because custom properties inherit through shadow boundaries, a product can define tokens on `:root`, a theme container, or an individual component.

```css
@layer ty.component-base {
  :host {
    display: inline-block;
    font: inherit;
    color: inherit;
  }

  [part='control'] {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: var(--ty-button-gap, 0.5rem);

    min-block-size: var(--ty-button-min-block-size, 2rem);
    padding: var(--ty-button-padding-block, 0.5rem) var(--ty-button-padding-inline, 0.75rem);

    border: var(--ty-button-border-width, 1px) solid var(--ty-button-border-color, currentColor);

    border-radius: var(--ty-button-radius, 0.25rem);

    background: var(--ty-button-background, Canvas);
    color: var(--ty-button-foreground, CanvasText);

    font: inherit;
    cursor: pointer;
  }

  [part='control']:hover:not(:disabled) {
    background: var(--ty-button-background-hover, var(--ty-button-background));
  }

  [part='control']:focus-visible {
    outline: var(--ty-focus-width, 2px) solid var(--ty-focus-color, Highlight);
    outline-offset: var(--ty-focus-offset, 2px);
  }
}
```

## 5. Product Themes as Small CSS Packages

A theme is a set of inherited CSS custom property values. Switching themes requires no component re-render; the browser recalculates CSS against an unchanged DOM tree.

```css
/* Windows-like theme */
@layer product.theme {
  [data-design-system='windows'] {
    color-scheme: light dark;
    --ty-font-family: 'Segoe UI Variable', 'Segoe UI', system-ui, sans-serif;
    --ty-control-radius: 4px;
    --ty-control-border-width: 1px;
    --ty-control-padding-inline: 12px;
    --ty-control-padding-block: 6px;
    --ty-focus-offset: 1px;
    --ty-color-accent: #0067c0;
  }
}

/* macOS-like theme */
@layer product.theme {
  [data-design-system='macos'] {
    color-scheme: light dark;
    --ty-font-family: -apple-system, BlinkMacSystemFont, 'SF Pro Text', sans-serif;
    --ty-control-radius: 7px;
    --ty-control-border-width: 0.5px;
    --ty-control-padding-inline: 14px;
    --ty-control-padding-block: 5px;
    --ty-focus-offset: 3px;
    --ty-color-accent: #007aff;
  }
}

/* Dense enterprise theme */
@layer product.theme {
  [data-design-system='dense'] {
    --ty-control-radius: 2px;
    --ty-control-padding-inline: 8px;
    --ty-control-padding-block: 3px;
    --ty-control-gap: 4px;
    --ty-control-font-size: 0.8125rem;
  }
}
```

## 6. Recipes

FAST's distinctive contribution was deriving values algorithmically, especially for adaptive colors and states.

### CSS-Native Recipes

Use CSS when the relationship can be expressed directly. The browser maintains the dependency graph:

```css
[data-design-system] {
  --ty-color-accent-hover: color-mix(in oklab, var(--ty-color-accent), black 12%);

  --ty-color-accent-pressed: color-mix(in oklab, var(--ty-color-accent), black 20%);

  --ty-color-disabled: color-mix(in oklab, var(--ty-color-text), transparent 55%);
}
```

### Build-Time Recipes

For complex relationships—contrast enforcement, palette generation, elevation scales—compile a product token file into static CSS. This keeps design computation out of application startup:

```ts
export default defineDesignSystem({
  name: 'my-product',
  color: { accent: '#5b4bdb', neutralHue: 250, contrastTarget: 4.5 },
  shape: { baseRadius: 6, controlRadiusScale: 1 },
  density: { unit: 4, controlInline: 3, controlBlock: 1.5, controlGap: 2 },
  typography: { family: 'Inter, system-ui, sans-serif', baseSize: 14, ratio: 1.2 },
});
```

## 7. Density as Relational Spacing

Avoid individually defining every component's exact height. Use padding-based relationships that adapt better to variable content:

```css
[data-design-system] {
  --ty-unit: 4px;
  --ty-density-inline: 0;
  --ty-density-block: 0;

  --ty-control-padding-inline: calc(var(--ty-unit) * (3 + var(--ty-density-inline)));

  --ty-control-padding-block: calc(var(--ty-unit) * (1.5 + var(--ty-density-block)));
}

[data-density='compact'] {
  --ty-density-inline: -0.5;
  --ty-density-block: -0.5;
}

[data-density='comfortable'] {
  --ty-density-inline: 0.5;
  --ty-density-block: 0.5;
}
```

## 8. Style Sharing and Performance

Define one constructed stylesheet per component module and reuse the same object across shadow roots. Do not dynamically regenerate component stylesheets when theme tokens change—keep component rules static and change custom-property values on an ancestor:

```ts
export const buttonSheet = new CSSStyleSheet();

buttonSheet.replaceSync(`
  @layer ty.component-base {
    :host { display: inline-block; }

    [part="control"] {
      padding:
        var(--ty-button-padding-block)
        var(--ty-button-padding-inline);
      border-radius: var(--ty-button-radius);
    }
  }
`);
```

Recommended sheet composition per component:

```
resetSheet
accessibilitySheet
controlFoundationSheet
componentSheet
```

## 9. CSS Cascade Layers

Declare a predictable public cascade order in the product document:

```css
@layer reset,
  tokens,
  product-theme,
  components,
  product-components,
  utilities,
  overrides;
```

Rules for crossing boundaries:

- Use layers to manage order **inside** a component stylesheet.
- Use custom properties to **cross the shadow boundary**.
- Use `::part()` for intentionally exposed structural styling.
- Do not expect a document-level `@layer` to reorder rules inside a shadow root.

The document-level layer names (`reset`, `tokens`, `product-theme`, `components`, `product-components`, `utilities`, `overrides`) govern light-DOM CSS. The `ty.*` layer names used inside component stylesheets govern only that shadow root. A product override from outside a shadow root must use inherited custom properties or documented `::part()` selectors; it cannot rely on layer order to pierce encapsulation.

## 10. Preference and System-Color Modes

Product design bundles own light and dark values. Apps activate the design and color scheme on the same root:

```html
<body data-design-system="product" data-color-scheme="system"></body>
```

Use `data-color-scheme="light"`, `"dark"`, or `"system"`. Generated CSS may use `light-dark()` where appropriate, but explicit `[data-color-scheme]` selectors are allowed for products needing full control. Components do not contain product-specific dark-mode rules; they consume semantic tokens and system-color fallbacks.

```css
[data-design-system='product'] {
  color-scheme: light dark;
  --ty-color-surface: light-dark(#ffffff, #1c1c1e);
  --ty-color-text: light-dark(#191919, #f5f5f7);
}
```

Components must keep system-color fallbacks (`Canvas`, `CanvasText`, `Highlight`, `ButtonText`) so they remain usable if product tokens fail or forced-colors mode is active.

```css
@media (forced-colors: active) {
  [part='control'] {
    border-color: ButtonBorder;
    background: ButtonFace;
    color: ButtonText;
  }

  [part='control']:focus-visible {
    outline-color: Highlight;
  }
}
```

Motion tokens must collapse under reduced motion:

```css
@media (prefers-reduced-motion: reduce) {
  :host {
    --ty-motion-feedback-duration: 0ms;
    --ty-motion-content-duration: 0ms;
  }
}
```

Support `prefers-contrast` where practical by increasing border and focus contrast through semantic tokens. V1 does not require a complete alternate contrast token set.

## 11. Public Styling Contract

Three levels of customization, from coarse to fine:

**Level 1 — Semantic tokens** (for most products):

```css
.my-product {
  --ty-control-radius: 8px;
  --ty-color-accent: rebeccapurple;
}
```

**Level 2 — Component tokens** (for component-specific design):

```css
.my-product {
  --ty-button-radius: 999px;
  --ty-button-padding-inline: 1.25rem;
}
```

**Level 3 — Parts** (for advanced structural tweaks):

```css
tyui-button::part(control) {
  text-transform: uppercase;
  letter-spacing: 0.04em;
}
```

Treat every token and part as a versioned public API. Avoid exposing arbitrary internal selectors.

Default to semantic and component tokens. Use `::part()` only for advanced structural styling that cannot be represented as a stable token. `design-app.md` must list every `::part()` override with rationale. If the same part override appears across multiple app variants or products, promote it to a new component token. Private shadow-DOM selectors are never allowed.

### Slots, Parts, and Exported Parts

Use slots for semantic placement of consumer-owned content. Slotted nodes remain in light DOM, so app CSS may style those nodes directly:

```tsx
<tyui-button appearance="subtle">
  <tyui-icon slot="start" class={styles.searchIcon} name="search" />
  Search
</tyui-button>
```

Use `::slotted(...)` only for immediate slotted children and only for component-owned minimum guarantees such as icon sizing, shrink behavior, or alignment. Use a part when consumers need to style an internal wrapper around slotted content.

Use `part` when an internal element is intentionally part of the public structural styling contract:

```css
tyui-field::part(control) {
  border-block-end-color: var(--ty-color-accent);
}
```

Nested components must forward public styling hooks with `exportparts` when the parent component exposes the nested element as part of its own styling contract. For example, a picker that renders selected values as internal tags may expose the chip host as `part="chip"` and forward nested tag parts such as `label` and `dismiss`.

Every slot, part, and forwarded part must be listed in the Custom Elements Manifest and the component contract document. Generated app CSS may target only documented parts and forwarded parts.

## 12. Variant and State Architecture

Component variants should remap tokens rather than repeating style blocks:

```css
:host([appearance='primary']) {
  --ty-button-background: var(--ty-color-accent);
  --ty-button-background-hover: var(--ty-color-accent-hover);
  --ty-button-foreground: var(--ty-color-on-accent);
  --ty-button-border-color: transparent;
}

:host([appearance='subtle']) {
  --ty-button-background: transparent;
  --ty-button-background-hover: var(--ty-color-surface-hover);
  --ty-button-border-color: transparent;
}

:host([shape='circular']) {
  --ty-button-radius: 50%;
  --ty-button-padding-inline: var(--ty-button-padding-block);
}
```

Use native state selectors where possible; use host attributes for component state that CSS cannot infer. Do not store purely visual states such as hover or focus in JavaScript signals.

### State-Driven Styling Surface

Each visual state must have one intentional styling surface:

- Reflect public API state to host attributes when consumers may need to style it, such as `disabled`, `checked`, `indeterminate`, `invalid`, `readonly`, `required`, `open`, `selected`, `pressed`, `appearance`, and `size`.
- Use native pseudo-classes for native interaction state, including `:hover`, `:active`, `:focus-visible`, `:focus-within`, `:disabled`, and `:required`.
- Use ARIA attributes for semantic widget state, including `aria-selected`, `aria-checked`, `aria-expanded`, `aria-disabled`, `aria-invalid`, and `aria-current`.
- Use `data-*` attributes only for internal or derived state that helps implementation or visual styling but is not a public API.

Selection must expose both semantic state and a styling hook. A checkbox can reflect `checked` on the host and forward the state to its native input. A listbox option can expose `aria-selected="true"` and, when needed, a documented `selected` attribute or part-based styling hook. A picker that represents selected values as chips should expose those chips through documented parts rather than requiring consumers to infer internal DOM.

Visual state changes should be expressed declaratively through CSS selectors and custom-property remapping. JavaScript may update attributes, ARIA, or `data-*` state; it must not imperatively write style properties for ordinary hover, selected, checked, invalid, or focused visuals.

## 13. Package Structure

```
libs/
├─ core/
│  ├─ pressable/
│  ├─ selection/
│  ├─ focus/
│  └─ keyboard-navigation/
│
├─ elements/
│  ├─ button/
│  ├─ checkbox/
│  ├─ listbox/
│  └─ dialog/
│
├─ styles/
│  ├─ reset.ts
│  ├─ accessibility.ts
│  └─ control-foundation.ts
│
├─ tokens/
│  ├─ schema.ts
│  ├─ defaults.css
│  └─ generator.ts
│
├─ themes/
│  ├─ windows.css
│  ├─ macos.css
│  └─ product-example.css
│
└─ solid/
   ├─ jsx.d.ts
   └─ optional-wrappers/
```

## 14. Headless vs. Styleable Boundaries

The **shared component layer** owns:

- Semantics and ARIA
- Keyboard behavior
- Focus management
- Form participation
- Popup positioning contracts
- Selection and state machines
- DOM structure necessary for accessibility

The **product design layer** owns:

- Colors
- Typography
- Radius
- Spacing and density
- Borders
- Elevation
- Motion durations and easing
- Icon style
- Component visual variants

Tokens should transform the visual language. They should not pretend every platform interaction model is equivalent—some platform differences are structural, not merely visual (e.g., segmented controls vs. dropdowns, platform-specific date pickers, toolbar layout conventions).

## 15. Component Author Checklist

When adding or changing a component:

- Keep default visuals inside the component stylesheet and share one constructed stylesheet per component module.
- Consume public `--ty-*` semantic and component tokens with resilient fallbacks.
- Use `--_ty-*` only for private component-internal helper variables.
- Reflect public visual or semantic state to host attributes.
- Use pseudo-classes for hover, active, focus, focus-within, disabled, and required behavior.
- Use ARIA attributes when the state is semantic.
- Use `data-*` only for internal or derived state.
- Expose parts only when consumers have a real structural styling need.
- Forward nested public parts with `exportparts` when composing components.
- Document every public token, slot, part, forwarded part, reflected state, and app-variant hook in the component contract.
- Preserve forced-colors and reduced-motion behavior when changing colors, borders, focus rings, motion, selected states, or checked states.

## Summary

The recommended system uses:

- Plain TypeScript headless controllers
- Native custom elements with stable shadow DOM
- Shared constructed stylesheets
- CSS custom properties as the principal styling API
- Primitive → semantic → component token layers
- CSS-native recipes with `calc()`, `color-mix()`, and `light-dark()`
- Build-time generation for contrast, palettes, and complex recipes
- `::part()` only for advanced overrides
- Solid JSX typings and optional thin wrappers
