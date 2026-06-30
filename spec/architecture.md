# TYUI Architecture Overview

TYUI is a framework-neutral component library built as an Nx + Vite monorepo. Its thesis is simple: implement UI components with plain TypeScript and native Custom Elements, then layer thin framework-specific typings and wrappers on top for ergonomic consumption. The implementation must not depend on Solid, React, Lit, JSX, or a virtual DOM.

## Design Principles

1. **No framework runtime in component implementation.** Components are native `HTMLElement` subclasses. Framework packages may improve consumer ergonomics, but they do not define component behavior.
2. **No JSX in component implementations.** JSX is allowed only in optional wrapper packages and example apps. Those wrappers compile into the consuming app, not into `@toyu-ui/elements`.
3. **No virtual DOM. Stable-node updates only.** DOM is created once, usually from a shared `<template>`, and state changes mutate affected nodes and attributes directly.
4. **Headless behavior is separated from DOM.** Reusable state machines and interaction logic live in `@toyu-ui/core` and are unit-testable without browser DOM.
5. **Standard Web Component contract.** Primitive configuration uses attributes, structured values use JavaScript properties, composition uses slots, and user output uses `CustomEvent`s with `bubbles: true` and `composed: true`.
6. **Native behavior first.** Native controls own text editing, form input, focus behavior, keyboard defaults, and accessibility semantics wherever possible. Custom behavior is added only where the native platform does not provide the required composite pattern.
7. **Ergonomics are additive, never authoritative.** `@toyu-ui/solid` provides types and thin wrappers; it must remain tree-shakable and cannot become the source of behavior.
8. **Idempotent registration.** `define*` functions guard with `customElements.get(...)` so repeated registration is safe.
9. **Public styling surface is explicit.** Generated app CSS may target only documented host attributes, slots, parts, forwarded parts, and public `--ty-*` tokens.
10. **Tooling is opinionated and locked.** Yarn 4, Nx caching, Vite, Vitest, Playwright, Dockerized browser infrastructure, custom executors, `oxlint`, `oxfmt`, and config-drift checks are part of the architecture.

## Layered Architecture

```text
┌─────────────────────────────────────────────────────────────┐
│ apps/                                                       │
│   solid-example   (Solid + Vite consumer)                  │
│   vanilla-example (plain HTML/TS consumer)                 │
└───────────────▲─────────────────────────▲──────────────────┘
                │                         │
        @toyu-ui/solid (opt-in)       @toyu-ui/define (registration)
                │                         │
┌───────────────┴──────────┐   ┌──────────┴──────────────────┐
│ libs/solid               │   │ libs/define                  │
│  - JSX intrinsic types   │   │  - defineTyuiButton()        │
│  - thin wrappers         │   │  - defineTyuiElements()      │
│  - typed custom events   │   │  - idempotent registration   │
└───────────────▲──────────┘   └──────────▲──────────────────┘
                │                         │
                └───────────┬─────────────┘
                            │
                ┌───────────┴─────────────┐
                │ libs/elements           │
                │  - native Custom        │
                │    Elements             │
                │  - shadow DOM           │
                │  - templates            │
                │  - attrs / props        │
                │  - slots / events       │
                └───────────▲─────────────┘
                            │ imports controllers
                ┌───────────┴─────────────┐
                │ libs/core               │
                │  - DOM-free behavior    │
                │  - state machines       │
                │  - transition objects   │
                └─────────────────────────┘

        libs/testing -> contract-test and a11y helpers
```

| Layer    | Package                            | Responsibility                                                                                                                           | Depends on                             |
| -------- | ---------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------- |
| Core     | `@toyu-ui/core`                    | Framework-neutral state machines, interaction logic, transition objects, pub/sub where needed. No DOM.                                   | none                                   |
| Elements | `@toyu-ui/elements`                | Native `HTMLElement` implementations: shadow DOM, templates, attributes/properties, slots, events, form participation, focus delegation. | `@toyu-ui/core`                        |
| Define   | `@toyu-ui/define`                  | Opt-in `customElements.define` entry points per component and for all components.                                                        | `@toyu-ui/elements`                    |
| Solid    | `@toyu-ui/solid`                   | Solid JSX intrinsic typings, typed event surfaces, thin ergonomic wrappers.                                                              | `@toyu-ui/define`, `@toyu-ui/elements` |
| Testing  | `@toyu-ui/testing`                 | Shared contract-test helpers and accessibility-role helpers.                                                                             | none                                   |
| Apps     | `solid-example`, `vanilla-example` | Consumer reference apps and smoke targets.                                                                                               | `@toyu-ui/solid` or `@toyu-ui/define`  |

Package conventions:

- Workspace packages use `"type": "module"` and should use `"sideEffects": false` when safe.
- In-repo TypeScript types resolve to `src/` for fast development; build output resolves from `dist/`.
- Per-component subpath exports such as `@toyu-ui/elements/button` and `@toyu-ui/define/button` support granular imports and code splitting.
- `vite.aliases.ts` maps `@toyu-ui/*` package specifiers to source files during local development so layers do not need prebuilds for HMR.
- Skill-bearing packages use the `tanstack-intent` keyword and include `skills/` in package files so agent guidance ships with the same version as the library.
- `@toyu-ui/elements` publishes `custom-elements.json` at the package root and exposes it as `@toyu-ui/elements/custom-elements.json`.

## Component Anatomy

Native components follow a stable-node pattern:

1. Define one module-level `<template>` and one module-level `CSSStyleSheet`.
2. In the constructor, attach shadow DOM, adopt the stylesheet, and clone the template.
3. Store references to stable internal nodes.
4. Register event listeners once.
5. Reflect attributes/properties into internal DOM through a narrow `#render()` or `#sync*()` method.
6. Dispatch composed custom events only for user-initiated state changes.

```ts
const template = document.createElement('template');

template.innerHTML = `
  <button part="control" type="button">
    <slot></slot>
  </button>
`;

export class TyuiExampleElement extends HTMLElement {
  static observedAttributes = ['disabled'];

  readonly #button: HTMLButtonElement;

  constructor() {
    super();

    const root = this.attachShadow({ mode: 'open', delegatesFocus: true });
    root.append(template.content.cloneNode(true));

    const button = root.querySelector('button');
    if (!(button instanceof HTMLButtonElement)) {
      throw new Error('TyuiExampleElement template is missing its button.');
    }

    this.#button = button;
    this.#button.addEventListener('click', this.#handleClick);
  }

  get disabled(): boolean {
    return this.hasAttribute('disabled');
  }

  set disabled(value: boolean) {
    this.toggleAttribute('disabled', value);
  }

  connectedCallback(): void {
    this.#render();
  }

  attributeChangedCallback(): void {
    this.#render();
  }

  #handleClick = (): void => {
    if (this.disabled) return;
    this.dispatchEvent(new CustomEvent('activate', { bubbles: true, composed: true }));
  };

  #render(): void {
    this.#button.disabled = this.disabled;
  }
}
```

Avoid `shadowRoot.innerHTML = ...` in response to state changes. Recreating DOM destroys event state, focus, text selection, validity UI, and browser-managed control state. Update the smallest affected node or attribute instead.

## Behavior And State Flow

State ownership must be explicit in every component contract:

- **Core-owned state:** reusable interaction or selection state that benefits from DOM-free tests.
- **Element-owned state:** host attributes/properties, form internals, reflected public state, and shadow DOM sync.
- **Native-control-owned state:** text editing, selection, IME, undo, browser validation, checked/value defaults, and keyboard behavior for native controls.
- **Parent-owned state:** composite coordination such as radio-group value, roving tabindex, option selection, popup open state, or listbox active item.
- **App-owned state:** controlled data passed through properties or attributes.

For composite components, the parent owns coordinated state and children expose a minimal surface. For example, `tyui-radio-group` owns value and roving tabindex; `tyui-radio` owns the native input and mirrors the active tab stop onto that input so real browser `Tab` can enter the group correctly.

Programmatic state changes must not emit user events unless the component contract explicitly says otherwise. User-initiated changes dispatch composed events with stable detail payloads.

## Solid Consumption Pattern

Solid consumers can use registered custom elements directly:

```tsx
import { defineTyuiButton } from '@toyu-ui/define/button';

defineTyuiButton();

export function SaveButton(props: { saving: boolean; save: () => void }) {
  return (
    <tyui-button disabled={props.saving} on:activate={props.save}>
      {props.saving ? 'Saving' : 'Save'}
    </tyui-button>
  );
}
```

Optional wrappers may improve naming, event typing, or property assignment:

```tsx
import type { JSX } from 'solid-js';
import { defineTyuiButton } from '@toyu-ui/define/button';

defineTyuiButton();

export function Button(props: {
  disabled?: boolean;
  onActivate?: () => void;
  children?: JSX.Element;
}) {
  return (
    <tyui-button disabled={props.disabled} on:activate={props.onActivate}>
      {props.children}
    </tyui-button>
  );
}
```

Wrappers must remain thin. They cannot fork behavior, duplicate accessibility logic, or introduce a second state model.

## Build, Test, And Dev Workflows

Nx owns workspace orchestration, dependency-aware task execution, caching, and project graph visibility. Vite owns library builds, app dev servers, and Vitest-powered tests. Custom Nx executors live under `tools/executors`.

| Workflow              | Command                                                 | Architecture expectation                                                                                                                                                       |
| --------------------- | ------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Build                 | `yarn build`                                            | Runs `nx run-many -t build`; custom build executor invokes Vite library builds, ES output, per-component entries, and `dist/{projectRoot}` output.                             |
| Unit / contract tests | `yarn test` or `nx run <project>:test`                  | Vitest checks DOM-free core behavior and custom-element DOM contracts.                                                                                                         |
| Browser E2E           | `nx run elements:e2e`                                   | Starts a direct Vite fixture server and runs Playwright against project `e2e/` fixtures. This is the correctness gate for trusted keyboard, focus, pointer, and form behavior. |
| CEM                   | `nx run elements:cem`                                   | Emits package-level `libs/elements/custom-elements.json` with component API facts and `x-design-system` metadata.                                                              |
| Skills validation     | `yarn skills:validate`                                  | Validates Intent-compatible `skills/**/SKILL.md` frontmatter and package rules without requiring a network install.                                                            |
| AI context bundle     | `yarn design-system:context`                            | Runs `elements:ai-context`, assembling `dist/ai/` with compact CEM, resolved tokens, component guidance, skills, context metadata, and `llms.txt`.                             |
| Typecheck             | `yarn typecheck` or project typecheck targets           | Runs TypeScript without emit against project references and package declarations.                                                                                              |
| Lint / format         | `yarn lint`, `yarn format`                              | Uses `oxlint` and `oxfmt`; no ESLint or Prettier.                                                                                                                              |
| Storybook             | `nx run elements:storybook`                             | Web-components Storybook for interactive development and documentation only. Storybook is not the acceptance harness for behavior correctness.                                 |
| Visual regression     | `nx run elements:visual`                                | Starts Storybook and runs Playwright snapshots across configured themes and viewports.                                                                                         |
| Example apps          | `yarn dev:solid`, `yarn dev:vanilla`                    | Vite dev servers for reference consumers.                                                                                                                                      |
| Config drift          | `yarn verify-configs`, `yarn sync-configs`              | Verifies and regenerates locked workspace config expectations.                                                                                                                 |
| Bundle sizes          | `yarn report-bundle-sizes`                              | Reports `.js` byte sizes from `dist/` as a footprint signal.                                                                                                                   |
| Playwright image      | `yarn playwright:image`, `yarn playwright:ensure-image` | Builds or ensures the pinned Docker image used for deterministic browser runs in CI.                                                                                           |

`nx.json` defines production inputs that exclude specs, stories, snapshots, and e2e fixtures from build cache invalidation. Visual and e2e targets run with `parallelism: false` because browser tests, screenshots, ports, and focus state are easier to keep deterministic when serialized.

## Testing Architecture

Testing follows the layered strategy in [`spec/testing.md`](./testing.md):

1. Core unit tests for DOM-free state machines.
2. Custom-element contract tests for attributes, properties, slots, events, lifecycle, form state, and DOM synchronization.
3. Browser E2E tests for trusted focus, keyboard, pointer, popup, and form behavior that unit DOM environments cannot prove.
4. Accessibility tests for roles, labels, ARIA states, keyboard behavior, and accessibility-tree expectations.
5. Styling-contract tests for public tokens, slots, parts, forwarded parts, reflected state selectors, and private-surface violations.
6. Solid type tests and wrapper behavior tests where wrappers exist.
7. Example app smoke tests.
8. Visual regression for states, themes, density, directionality, viewports, and forced-colors mode.

Any component with focus, keyboard, pointer, popup, or form behavior must include direct browser E2E coverage. These tests must use trusted Playwright input such as `page.keyboard.press('Tab')`, assert the observable focus target, and inspect `shadowRoot.activeElement` when focus is delegated into shadow DOM. Storybook stories may demonstrate the behavior, but they are not sufficient evidence that the behavior works.

The component spec template requires browser E2E rows for these behaviors before implementation. Reported accessibility bugs must be reproduced by a failing browser E2E test before being considered fixed.

## Styling Architecture

The styling system follows the layered token model documented in [`spec/styling.md`](./styling.md). Components expose styling through:

- reflected host attributes for public state;
- named slots for composition;
- named CSS parts and forwarded parts for targeted styling;
- public `--ty-*` custom properties;
- private `--_ty-*` helper variables for internal calculations only.

Design tokens are layered:

- primitive tokens define raw choices such as spacing, radius, type, motion, and elevation;
- semantic tokens express product intent such as surface, accent, border, focus, and text roles;
- component tokens map semantic choices onto one component.

Consumer override order is:

1. Attributes and properties.
2. Host classes or app-local CSS.
3. Public CSS custom properties.
4. Documented `::part()` selectors.
5. Inline styles only for dynamic per-instance values.

Generated app CSS must not target private shadow DOM, undocumented `data-*` attributes, undocumented parts, or private `--_ty-*` variables.

## Layout Architecture

The layout system follows [`spec/layout.md`](./layout.md). Components own their internal padding, gap, alignment, minimum target size, and intrinsic sizing. Parent layout owns stretching, sibling distribution, order, wrapping, and available width.

Components should size from content, icons, and padding. They must avoid fixed `block-size` except for truly fixed-format primitives. Density changes padding, gaps, and related sizing tokens; it does not force fixed heights. CSS logical properties are required for writing-direction compatibility.

The v1 layout primitive set is custom-elements-first and utility-CSS-second: `Flex`, `Grid`, `Center`, `Container`, `Frame` / `AspectRatio`, `Cluster` / `Wrap`, and `Sidebar`. `Switcher` is a follow-up candidate. Container queries are preferred over viewport media queries for component structural changes.

## Agentic Design Architecture

TYUI is designed to be used by AI coding agents as well as human developers, following [`spec/agentic-ui-design.md`](./agentic-ui-design.md). TYUI itself does not own one root product `DESIGN.md`; consuming products own `DESIGN.md` as the source design brief.

The design-generation pipeline transforms:

- a product or design-repo `DESIGN.md`;
- `custom-elements.json` generated by `nx run elements:cem`;
- Intent-compatible `skills/**/SKILL.md` files shipped by package version;
- TYUI component metadata;
- component contracts under `ai/components/`;
- design metadata and examples;

into a layered design bundle:

- `theme.css`;
- `component-variants.css`;
- `design-app.md`;
- `tokens.resolved.json`;
- `context.json`;
- optional `llms.txt`.

The bundle can live in the app repo or in a separate design repo. Apps layer base TYUI components with one or more generated styling bundles. `design-app.md` records preferred components and variants by intent, new app-level variants, composition guidance, and known gaps.

TYUI also publishes a repository/root `llms.txt` and generated `dist/ai/llms.txt` discovery index. The Custom Elements Manifest and resolved token JSON are the machine-readable facts. Intent-compatible `SKILL.md` files are the versioned agent-readable intent layer. The AI context bundle is the discovery and assembly layer that lets agents find both.

Consumer flow:

```sh
yarn dlx @tanstack/intent@latest install
```

Consumers may then load skills for their installed TYUI version, for example `@toyu-ui/elements#button` or `@toyu-ui/solid#setup`, while still using `custom-elements.json` for exact API facts.

## Performance Assessment

Strengths:

- Near-zero framework runtime footprint: no Solid, React, Lit, virtual DOM, or CSS-in-JS runtime ships in `@toyu-ui/elements`.
- Fast initial load: module-level templates and constructed stylesheets are created once and reused per instance.
- Efficient updates: stable nodes preserve listeners, focus, selection, and native control state.
- Strong tree-shaking: per-component subpath exports let apps pay for the components they import.
- Style isolation without runtime cost: shadow DOM plus CSS custom properties allow theme recalculation without component rerendering.
- Scalable build pipeline: Nx caching and dependency-aware targets keep incremental builds and tests bounded.

Watch-items:

- Manual DOM update paths require discipline as the component count grows.
- Behavior controllers should avoid exposing unused state-propagation models.
- Composite focus and keyboard behavior must be browser-tested, not inferred from DOM unit tests.
- External publishing should produce `.d.ts` output rather than requiring consumers to compile library source.
- SSR and Declarative Shadow DOM stance is not yet finalized.

## Rejected Or Deferred Alternatives

### Restricted JSX Source To Multiple Targets

A framework-neutral JSX dialect could compile to Custom Elements, Lit, Solid, React, Vue, or Svelte. This is similar to the Mitosis model and can be powerful when one source must generate several framework-native outputs.

TYUI does not choose this path now because it requires a constrained language, an intermediate representation, target-specific generators, normalized lifecycle semantics, and significant compiler ownership. It also conflicts with the current requirement that component implementations do not use JSX.

### Solid-Flavored JSX To Vanilla DOM

A Babel, SWC, or Vite transform could convert Solid-like components into Custom Elements plus a small neutral runtime. That can produce excellent output, but it effectively creates a new framework/compiler and requires static support for signals, effects, control flow, refs, spreads, slots, lifecycle, and cleanup.

TYUI may revisit a compiler only if native DOM authoring becomes the dominant cost. It is not part of the current architecture.

### Solid Internals Behind Standard Web Components

Wrapping Solid implementations as Custom Elements would give consumers a framework-neutral HTML contract, and tools such as `solid-element` make this possible. However, the shipped component would still include Solid runtime assumptions.

This remains a fallback architecture for product-specific components, not for TYUI base components.
