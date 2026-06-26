FAST’s Adaptive UI model: components were driven by design tokens and “recipes,” so changing a relatively small set of values—density, corner radius, typography, neutral/accent palettes, stroke widths, control heights—could substantially change the visual language. FAST explicitly positioned this as a way to create a different design system largely by modifying tokens rather than rewriting components.

A modern version should keep the same idea but lean much more heavily on the browser:

Headless behavior
      ↓
Stable component DOM structure
      ↓
Semantic CSS co  ntract
      ↓
Product design-token theme
      ↓
Optional component-level overrides
Recommended architecture
1. Framework-neutral headless behavior

Put interaction, accessibility, keyboard navigation, selection logic and state transitions in plain TypeScript.

export interface PressableControllerOptions {
  disabled?: () => boolean;
  onPress?: () => void;
}

export function createPressableController(
  options: PressableControllerOptions,
) {
  function handleClick(event: MouseEvent): void {
    if (options.disabled?.()) {
      event.preventDefault();
      return;
    }

    options.onPress?.();
  }

  function handleKeyDown(event: KeyboardEvent): void {
    if (event.key !== 'Enter' && event.key !== ' ') return;

    if (event.key === ' ') {
      event.preventDefault();
    }
  }

  return {
    handleClick,
    handleKeyDown,
  };
}

This layer has no styling and no Solid dependency.

2. Native custom elements with stable internal DOM

Each component creates its DOM once and updates only affected nodes or attributes.

export class DsButton extends HTMLElement {
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

Use part names as a deliberate public styling API, not as an accidental exposure of your entire internal DOM.

3. Three token levels

Do not let components consume raw values directly. Use three layers.

Primitive tokens

These are available choices, not semantic decisions:

@layer ds.primitives {
  :root {
    --ds-space-0: 0;
    --ds-space-1: 0.25rem;
    --ds-space-2: 0.5rem;
    --ds-space-3: 0.75rem;
    --ds-space-4: 1rem;

    --ds-radius-0: 0;
    --ds-radius-1: 0.125rem;
    --ds-radius-2: 0.25rem;
    --ds-radius-3: 0.5rem;
    --ds-radius-pill: 999px;

    --ds-font-size-100: 0.75rem;
    --ds-font-size-200: 0.875rem;
    --ds-font-size-300: 1rem;

    --ds-stroke-thin: 1px;
    --ds-stroke-thick: 2px;
  }
}
Semantic tokens

These describe product intent:

@layer ds.semantic {
  :root {
    --ds-color-surface: light-dark(#ffffff, #1c1c1e);
    --ds-color-surface-hover: light-dark(#f3f3f3, #2c2c2e);
    --ds-color-text: light-dark(#191919, #f5f5f7);
    --ds-color-border: light-dark(#c7c7c7, #555558);
    --ds-color-accent: #0067c0;
    --ds-color-on-accent: white;

    --ds-control-radius: var(--ds-radius-2);
    --ds-control-border-width: var(--ds-stroke-thin);
    --ds-control-font-size: var(--ds-font-size-200);

    --ds-control-padding-inline: var(--ds-space-3);
    --ds-control-padding-block: var(--ds-space-2);
    --ds-control-gap: var(--ds-space-2);

    --ds-focus-width: 2px;
    --ds-focus-offset: 2px;
  }
}
Component tokens

These connect semantic intent to a specific component:

@layer ds.components {
  ds-button {
    --ds-button-background: var(--ds-color-surface);
    --ds-button-background-hover: var(--ds-color-surface-hover);
    --ds-button-foreground: var(--ds-color-text);
    --ds-button-border-color: var(--ds-color-border);

    --ds-button-radius: var(--ds-control-radius);
    --ds-button-padding-inline: var(--ds-control-padding-inline);
    --ds-button-padding-block: var(--ds-control-padding-block);
    --ds-button-gap: var(--ds-control-gap);
  }
}

This layered token model is the modern equivalent of FAST’s configurable design language. FAST used extensive tokenization and adaptive recipes; modern token architectures similarly distinguish raw options, semantic decisions and component-specific tokens.

Component CSS

The component should reference only semantic or component tokens:

@layer ds.component-base {
  :host {
    display: inline-block;
    font: inherit;
    color: inherit;
  }

  [part='control'] {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: var(--ds-button-gap, 0.5rem);

    min-block-size: var(--ds-button-min-block-size, 2rem);
    padding:
      var(--ds-button-padding-block, 0.5rem)
      var(--ds-button-padding-inline, 0.75rem);

    border:
      var(--ds-button-border-width, 1px)
      solid
      var(--ds-button-border-color, currentColor);

    border-radius: var(--ds-button-radius, 0.25rem);

    background: var(--ds-button-background, Canvas);
    color: var(--ds-button-foreground, CanvasText);

    font: inherit;
    cursor: pointer;
  }

  [part='control']:hover:not(:disabled) {
    background: var(
      --ds-button-background-hover,
      var(--ds-button-background)
    );
  }

  [part='control']:focus-visible {
    outline:
      var(--ds-focus-width, 2px)
      solid
      var(--ds-focus-color, Highlight);

    outline-offset: var(--ds-focus-offset, 2px);
  }
}

Because custom properties inherit through shadow boundaries, a product can define tokens on :root, a theme container, or an individual component. This is the main theming mechanism recommended for encapsulated custom elements.

Product themes become small CSS packages
Windows-like theme
@layer product.theme {
  [data-design-system='windows'] {
    color-scheme: light dark;

    --ds-font-family:
      "Segoe UI Variable",
      "Segoe UI",
      system-ui,
      sans-serif;

    --ds-control-radius: 4px;
    --ds-control-border-width: 1px;
    --ds-control-padding-inline: 12px;
    --ds-control-padding-block: 6px;
    --ds-focus-offset: 1px;

    --ds-color-accent: #0067c0;
  }
}
macOS-like theme
@layer product.theme {
  [data-design-system='macos'] {
    color-scheme: light dark;

    --ds-font-family:
      -apple-system,
      BlinkMacSystemFont,
      "SF Pro Text",
      sans-serif;

    --ds-control-radius: 7px;
    --ds-control-border-width: 0.5px;
    --ds-control-padding-inline: 14px;
    --ds-control-padding-block: 5px;
    --ds-focus-offset: 3px;

    --ds-color-accent: #007aff;
  }
}
Dense enterprise theme
@layer product.theme {
  [data-design-system='dense'] {
    --ds-control-radius: 2px;
    --ds-control-padding-inline: 8px;
    --ds-control-padding-block: 3px;
    --ds-control-gap: 4px;
    --ds-control-font-size: 0.8125rem;
  }
}

Usage:

export function App() {
  return (
    <main data-design-system="macos">
      <ds-button appearance="primary">
        Save
      </ds-button>
    </main>
  );
}

No component rerender is required when the theme changes. The browser recalculates CSS.

Use recipes, but mostly at build time

FAST’s more distinctive idea was not only tokens but recipes: values could be derived algorithmically from other values, especially for adaptive colors and states.

You can reproduce this with two kinds of recipes.

CSS-native recipes

Use CSS when the relationship can be expressed directly:

[data-design-system] {
  --ds-color-accent-hover:
    color-mix(
      in oklab,
      var(--ds-color-accent),
      black 12%
    );

  --ds-color-accent-pressed:
    color-mix(
      in oklab,
      var(--ds-color-accent),
      black 20%
    );

  --ds-color-disabled:
    color-mix(
      in oklab,
      var(--ds-color-text),
      transparent 55%
    );
}

This is ideal because the browser maintains the dependency graph.

Build-time recipes

For more complex relationships—contrast enforcement, palette generation, elevation scales, typographic scales—compile a product token file into static CSS.

Input:

export default defineDesignSystem({
  name: 'my-product',

  color: {
    accent: '#5b4bdb',
    neutralHue: 250,
    contrastTarget: 4.5,
  },

  shape: {
    baseRadius: 6,
    controlRadiusScale: 1,
  },

  density: {
    unit: 4,
    controlInline: 3,
    controlBlock: 1.5,
    controlGap: 2,
  },

  typography: {
    family: 'Inter, system-ui, sans-serif',
    baseSize: 14,
    ratio: 1.2,
  },
});

Generated CSS:

[data-design-system='my-product'] {
  --ds-color-accent: #5b4bdb;
  --ds-color-on-accent: #ffffff;
  --ds-control-radius: 6px;
  --ds-control-padding-inline: 12px;
  --ds-control-padding-block: 6px;
  --ds-control-gap: 8px;
}

This keeps design computation out of application startup.

Density should be relational

Avoid individually defining every component’s exact height. FAST’s later density work moved toward padding-based relationships because padding adapts better to variable content than fixed heights.

A good model is:

[data-design-system] {
  --ds-unit: 4px;

  --ds-density-inline: 0;
  --ds-density-block: 0;

  --ds-control-padding-inline:
    calc(
      var(--ds-unit) *
      (3 + var(--ds-density-inline))
    );

  --ds-control-padding-block:
    calc(
      var(--ds-unit) *
      (1.5 + var(--ds-density-block))
    );
}

Compact mode:

[data-density='compact'] {
  --ds-density-inline: -0.5;
  --ds-density-block: -0.5;
}

Comfortable mode:

[data-density='comfortable'] {
  --ds-density-inline: 0.5;
  --ds-density-block: 0.5;
}

This lets all components respond consistently without each product maintaining hundreds of values.

Style sharing and performance

For shadow-DOM components, define one constructed stylesheet per component module:

export const buttonSheet = new CSSStyleSheet();

buttonSheet.replaceSync(`
  @layer ds.component-base {
    :host {
      display: inline-block;
    }

    [part="control"] {
      padding:
        var(--ds-button-padding-block)
        var(--ds-button-padding-inline);

      border-radius: var(--ds-button-radius);
    }
  }
`);

Then reuse the same stylesheet object:

root.adoptedStyleSheets = [
  resetSheet,
  accessibilitySheet,
  buttonSheet,
];

Constructed stylesheets can be shared across multiple shadow roots, and updating one shared stylesheet affects all adopters. Browser support is broadly available, and reuse avoids creating and parsing a <style> element for every component instance.

Recommended sheet composition
resetSheet
accessibilitySheet
controlFoundationSheet
buttonSheet

Each component adopts only what it needs.

Do not dynamically regenerate the component stylesheet whenever theme tokens change. Keep component rules static and change custom-property values on an ancestor.

CSS cascade layers

Declare a predictable public cascade order in the product document:

@layer
  reset,
  tokens,
  product-theme,
  components,
  product-components,
  utilities,
  overrides;

Then package CSS accordingly:

@layer tokens {
  /* defaults */
}

@layer product-theme {
  /* product design system */
}

@layer product-components {
  /* product-wide component adjustments */
}

@layer overrides {
  /* targeted exceptions */
}

Cascade layers let you control style precedence without specificity escalation. Inside shadow roots, layers work normally, though each shadow root has its own isolated layer order rather than sharing the document’s global order.

That means:

use layers to manage order inside a component stylesheet;
use custom properties to cross the shadow boundary;
use ::part() for intentionally exposed structural styling;
do not expect a document-level @layer to reorder rules inside a shadow root.
Public styling contract

Provide three levels of customization.

Level 1: semantic tokens

For most products:

.my-product {
  --ds-control-radius: 8px;
  --ds-color-accent: rebeccapurple;
}
Level 2: component tokens

For component-specific design:

.my-product {
  --ds-button-radius: 999px;
  --ds-button-padding-inline: 1.25rem;
}
Level 3: parts

For advanced structural tweaks:

ds-button::part(control) {
  text-transform: uppercase;
  letter-spacing: 0.04em;
}

Avoid exposing arbitrary internal selectors. Treat each token and part as a versioned public API.

Component variants should remap tokens

Avoid repeating complete style blocks for every variant.

:host([appearance='primary']) {
  --ds-button-background: var(--ds-color-accent);
  --ds-button-background-hover: var(--ds-color-accent-hover);
  --ds-button-foreground: var(--ds-color-on-accent);
  --ds-button-border-color: transparent;
}

:host([appearance='subtle']) {
  --ds-button-background: transparent;
  --ds-button-background-hover: var(--ds-color-surface-hover);
  --ds-button-border-color: transparent;
}

:host([shape='circular']) {
  --ds-button-radius: 50%;
  --ds-button-padding-inline: var(--ds-button-padding-block);
}

The base button rules remain identical.

State architecture

Use native state selectors where possible:

[part='control']:hover {}
[part='control']:active {}
[part='control']:focus-visible {}
[part='control']:disabled {}

Use host attributes for component state that CSS cannot infer:

<ds-combobox expanded invalid></ds-combobox>
:host([expanded]) [part='popup'] {
  display: block;
}

:host([invalid]) {
  --ds-control-border-color: var(--ds-color-danger);
}

Do not store purely visual states such as hover or focus in JavaScript signals.

Package structure
packages/
├─ behavior/
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

The application imports:

import '@acme/elements/button/define';
import '@acme/elements/checkbox/define';
import '@my-product/design-system/theme.css';

Then consumes components through Solid JSX:

<ds-button appearance="primary">
  Continue
</ds-button>
What should remain headless versus styleable

The shared component layer should own:

semantics and ARIA;
keyboard behavior;
focus management;
form participation;
popup positioning contracts;
selection and state machines;
DOM structure necessary for accessibility.

The product design layer should own:

colors;
typography;
radius;
spacing and density;
borders;
elevation;
motion durations and easing;
icon style;
component visual variants.

Be careful with “any UI purely through values.” Some platform styles differ structurally, not merely visually. For example:

segmented controls versus dropdowns;
toolbar layout conventions;
title-bar placement;
menu interaction expectations;
mobile versus desktop navigation;
platform-specific date or color pickers.

Tokens should transform the visual language. They should not pretend that every platform interaction model is equivalent.

My proposed modern FAST-like system

Use:

Plain TypeScript headless controllers
Native custom elements
Stable shadow DOM
Shared constructed stylesheets
CSS custom properties as the principal styling API
Primitive → semantic → component token layers
CSS-native recipes with calc(), color-mix() and light-dark()
Build-time generation for contrast, palettes and complex recipes
::part() only for advanced overrides
Solid JSX typings and optional thin wrappers

The key performance characteristic is that a theme is mostly a set of inherited CSS values. Changing from a Windows-like to macOS-like design does not recreate components, rerun Solid component functions or load another rendering runtime. The browser performs style recalculation against an unchanged DOM tree.

