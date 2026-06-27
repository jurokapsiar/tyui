# Component Library Requirements

## Goal

Build a reusable component library whose implementation is framework-agnostic while still feeling natural to consume from a Solid application.

## Core Requirements

- Component implementations must not use JSX.
- The component library must not be tied to Solid, React, Lit, or another framework runtime.
- The consuming application should use Solid JSX/TSX.
- Components should feel natural to consume from Solid, ideally with React-like JSX ergonomics.
- Minimize bundle size and runtime footprint.
- Avoid a virtual DOM where possible.
- Prefer fine-grained DOM updates over rebuilding component DOM.
- Avoid creating a custom JSX compiler unless it becomes genuinely necessary.

## Performance Priorities

- Fast initial loading.
- Efficient updates and reactivity.
- Minimal rerender work.

## Web Component Interoperability

The library should support standard Web Component interoperability through:

- Properties.
- Attributes.
- Slots.
- Custom events.

## TypeScript And Solid Integration

- Provide strong TypeScript typing for Solid JSX, including custom-element properties and events.
- Optional Solid wrappers are acceptable when they are thin, tree-shakable, and do not move the actual component implementation into Solid.

## Internal Architecture Expectations

The internal component logic should ideally be plain TypeScript and native DOM APIs, separated into:

- Framework-neutral behavior and state.
- Native Custom Element implementations.
- Solid-specific typings or ergonomic adapters.

## Testing

Each component should have requirements that can be transformed into deterministic and AI-assisted tests for:

- API.
- Behavior.
- Semantics.
- States and transitions.
- Visuals.

Accessibility testing should happen in layers:

- DOM or accessibility tree checks.
- Screen reader checks.

## Styling

> See [`spec/styling.md`](./styling.md) for the full specification.

- Product visual identity belongs in product `DESIGN.md`; the component library owns the stable styling API that implements that identity through tokens, parts, and CSS states.
- Public CSS custom properties exported by the library must use the `--ty-` prefix and follow the documented primitive, semantic, and component token naming patterns.
- Private component-internal CSS helper variables must use the `--_ty-` prefix and must not be documented or validated as consumer customization hooks.
- Use a three-tier CSS custom property hierarchy: primitive tokens → semantic tokens → component tokens.
- Components must reference only semantic or component tokens, never raw primitive values.
- Motion and elevation must be tokenized (`--ty-duration-*`, `--ty-easing-*`, `--ty-elevation-*`) and must respect `prefers-reduced-motion`.
- Product themes are pure CSS packages applied via a `[data-design-system]` attribute; no component re-render is required when a theme changes.
- Components must remain usable in `forced-colors: active` through system-color fallbacks and explicit focus styling.
- Each component module must define exactly one constructed stylesheet (`CSSStyleSheet`) and share it across all shadow roots; do not create per-instance `<style>` elements.
- Density is controlled by relational padding calculations (`calc()` against a unit variable and an offset); never use a fixed control height token.
- Declare a public cascade layer order at the document level (`reset`, `tokens`, `product-theme`, `components`, `product-components`, `utilities`, `overrides`).
- The public styling contract has three levels: semantic tokens (for most products), component tokens (for component-specific design), and `::part()` (for advanced structural overrides only).
- Apps and generated design bundles must follow this override order: component attributes/properties, host classes or app-local CSS, public CSS custom properties, documented `::part()` selectors, then inline styles only for dynamic per-instance values.
- Host classes and app-local CSS may style custom-element hosts for layout, containment, width, margin, and scoped token overrides; they must not depend on private shadow DOM selectors.
- Inline `style` may set host layout values or public custom properties only when the value is computed at runtime; stable theme or variant styling belongs in generated CSS or app-local CSS.
- Component variants remap token values; they must not repeat complete style rule blocks.
- Visual states such as hover and focus must use native CSS pseudo-classes; do not store them in JavaScript signals.
- Public API state that consumers may need to style must be reflected to host attributes, for example `disabled`, `checked`, `indeterminate`, `invalid`, `readonly`, `required`, `open`, `selected`, `pressed`, `appearance`, and `size`.
- Semantic widget state must use ARIA attributes where appropriate, for example `aria-selected`, `aria-checked`, `aria-expanded`, `aria-disabled`, `aria-invalid`, and `aria-current`.
- Internal or derived visual state may use `data-*` attributes, but those attributes remain private unless explicitly documented.
- `::part()` selectors are a versioned public API; do not expose undocumented internal shadow-DOM selectors.
- Nested components must forward documented public parts with `exportparts` when the parent exposes nested internals as part of its styling contract.
- Component contracts and the Custom Elements Manifest must document all public tokens, slots, CSS parts, forwarded parts, reflected state attributes, and app-variant hooks.

## Layout

> See [`spec/layout.md`](./layout.md) for the full specification.

- Product `DESIGN.md` owns page rhythm, safe areas, app shell composition, and product spatial character; component contracts own internal sizing, slot shrink behavior, and reusable primitive behavior.
- A generated `design-app.md` may map app layout intent to preferred layout primitives and composition patterns, but it must validate those choices against component layout contracts.
- Tokens define constraints and relationships (padding, minimum block size, gap), never fixed pixel geometry such as a control width or height.
- Components must use `min-block-size`, not `block-size`, so they can grow with content under zoom, translation, or large icons.
- Every flex child that must be allowed to shrink must carry `min-inline-size: 0`.
- The component library must include v1 layout primitives: `Flex`, `Grid`, `Center`, `Container`, `Frame` / `AspectRatio`, `Cluster` / `Wrap`, and `Sidebar`. `Switcher` is optional follow-up.
- Use container queries for structural mode changes; do not use viewport media queries inside component stylesheets.
- A component owns its internal padding, icon-label gap, minimum interaction target, and internal alignment. The parent layout owns stretching, distribution, ordering, and available width.
- Components must not carry `flex: 1` by default; distribution is the responsibility of parent layout components such as `tyui-button-group`.
- All spacing and sizing tokens must use CSS logical properties (`padding-inline`, `min-block-size`, `margin-inline-start`) to support multiple writing directions.
- Slotted icons must carry `flex: none`; slotted or default text content must carry `min-inline-size: 0` so it can shrink or wrap.
- Intrinsic size variants must express layout intent through attributes (`fit="content"`, `fit="container"`, `nowrap`), not through pixel dimensions.
- `clamp()` with viewport- or container-relative preferred values should be used for page gutter, section gap, and heading size to provide fluid but bounded adaptation.

## Agentic UI Design

> See [`spec/agentic-ui-design.md`](./agentic-ui-design.md) for the full specification.

- Product `DESIGN.md` must follow the upstream `design.md` shape: YAML token front matter plus Markdown rationale sections. Tokens provide exact values; prose provides design intent and negative constraints.
- TYUI itself must not maintain a root product-style `DESIGN.md`; it provides schemas, validators, examples, and generators for consuming apps.
- `DESIGN.md` must not duplicate component APIs. Component syntax, slots, events, CSS parts, and component layout contracts remain in library-owned artifacts.
- The product may generate a `design-app.md` companion from `DESIGN.md` plus library metadata. This file records preferred components per intent, preferred variants, app-specific variants, composition patterns, generated CSS outputs, and library gaps.
- Generated design bundles must be portable and contain `theme.css`, `component-variants.css`, `design-app.md`, `tokens.resolved.json`, and `context.json`; they may live in the app repo or be imported from another design repo.
- Generated app variants must use documented semantic tokens, component tokens, public `::part()` selectors, and manifest-defined attributes only.
- Generated app CSS must not target private shadow DOM selectors, `--_ty-*` variables, undocumented `data-*` attributes, or undocumented parts.
- The component library must publish a package-root `custom-elements.json` Custom Elements Manifest generated by `nx run elements:cem`; do not hand-edit generated output.
- The manifest must be extended with namespaced `x-design-system` metadata capturing component intent, valid roles or patterns, alternatives for misuse scenarios, layout ownership, and accessibility constraints.
- `@tyui/elements` must export `custom-elements.json` and include it in package files.
- Skill-bearing packages must include Intent-compatible `skills/**/SKILL.md` files, use the `tanstack-intent` keyword, and include `skills/` in package files.
- Skill files must keep intent, selection guidance, layout ownership, anti-patterns, and framework setup guidance. They must reference `custom-elements.json` for API facts instead of duplicating full types.
- `skills:validate` must run in CI or the build graph and enforce required `SKILL.md` frontmatter, name/directory consistency, allowed frontmatter keys, line-count limits, and framework-skill `requires`.
- Consumers should be able to install or load skills with `yarn dlx @tanstack/intent@latest install` and `@tanstack/intent load <package>#<skill>` for the installed package version.
- Each substantial component must have a corresponding `ai/components/<component>.md` document covering: intent, selection guidance, API summary, internal layout contract, styling contract, behavior, accessibility, a valid usage example, and at least one invalid anti-example.
- Every component must publish a structured layout contract (YAML front matter or adjacent file) that explicitly states which child owns stretching, which slots are flexible, and which tokens govern sizing.
- Canonical usage examples must be stored as structured data (YAML or JSON) and executed in the test suite so they cannot silently diverge from the implementation.
- The library must generate an `llms.txt` index at the repo/package root and in the AI context bundle pointing to the manifest, token files, component docs, skills, pattern docs, and product `DESIGN.md` when present.
- A `design-system:context` build command must produce a compact `dist/ai/` bundle (`index.md`, `components.md`, `llms.txt`, `tokens.resolved.json`, `custom-elements.compact.json`, `context.json`; plus `patterns.md` or `design-app.md` when present).
- The context bundle must include `design-app.md` when present or generated.
- `elements:build` must depend on CEM generation, skill validation, and AI context generation so published artifacts do not drift from source.
- The consuming product must maintain a `DESIGN.md` file that captures product character, theme configuration, density policy, layout principles, preferred components, and accessibility requirements.
- Automated validation must check all generated TSX against `custom-elements.json`, reject literal color/radius/spacing values where semantic tokens exist, detect invalid nesting, and verify every documented slot, token, and event still exists in source.
- Validation must be strict by default with configurable product overrides; escape hatches require allowlist entries with rationale.
- Manifest changes must be diffed and classified as patch, minor, or major. Deprecated and experimental status must propagate through the manifest, component docs, `design-app.md`, and AI context.
- Agent instructions (`AGENTS.md`) must direct coding agents to read `DESIGN.md` and relevant component metadata before generating any UI.
