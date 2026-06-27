---
name: component-spec-creator
description: Create or enrich TYUI component specifications before implementation. Use when designing a new component, revising ai/components/<component>.md, converting reviews into component requirements, or preparing robust component implementation plans for TYUI custom elements, Solid typings, accessibility, styling, behavior, and tests.
---

# Component Spec Creator

Use this skill to create implementation-ready component specs for TYUI.

The output should normally be an `ai/components/<component>.md` component contract, plus any necessary updates to `.design.json`, canonical examples, or tests. Do not start component implementation until the spec answers behavior, accessibility, styling, layout, and testing questions clearly enough for another engineer or agent to implement.

## Required Inputs

Gather or infer:

- Component name, tag name, package entry point, and intended status.
- User-facing intent and misuse cases.
- Closest native element, ARIA pattern, or Fluent analogue.
- Parent/child composition rules.
- Required styling hooks and generated-design needs.
- Form, popup, focus, keyboard, and motion requirements if relevant.

If a choice affects accessibility or behavior and cannot be inferred, ask before writing final spec text.

## Source Documents

Always read these repo files before creating or changing a component spec:

- `spec/component-contract-template.md`
- `spec/requirements.md`
- `spec/behavior.md`
- `spec/styling.md`
- `spec/layout.md`
- `spec/testing.md`
- `spec/agentic-ui-design.md`

Read `references/component-spec-rules.md` when you need the distilled lessons from reviews.

For component-family details, search the review docs:

- `reviews/design-system-component-patterns.md`
- `reviews/ds-behaviors.md`
- `reviews/ds-ttests.md`
- `reviews/fluent-acc.md`
- `reviews/fluent-behaviors.md`
- `reviews/mcp-styling.md`

Use `rg` to load only the relevant component family and cross-cutting sections.

## Workflow

1. Classify the component:
   - Native-like control, display component, form field, composite widget, popup/overlay, status/loading component, layout primitive, or composition surface.
   - Identify the closest native element or ARIA pattern.
   - Identify the Fluent analogue when one exists.

2. Fill the template:
   - Start from `spec/component-contract-template.md`.
   - Preserve every section unless it is truly not applicable.
   - Use `N/A - rationale` instead of leaving important sections blank.

3. Make behavior explicit:
   - Prefer native semantics and native controls.
   - Document focus owner, keyboard model, pointer model, and one-target/one-action boundaries.
   - For composites, put coordinated selection/open/focus state at the parent.
   - For popups, document open/close triggers, focus while open, next Tab behavior, Escape, outside click, and focus restoration.
   - For motion, document behavior during delayed mount/unmount and reduced motion.

4. Make accessibility explicit:
   - List roles, names, ARIA attributes, ARIA relationships, and author responsibilities.
   - Preserve consumer ARIA unless the component has a documented reason to own it.
   - Mirror ARIA across shadow boundaries when ID references would not resolve.
   - Hide decorative icons, images, and visual-only affordances.

5. Make styling explicit:
   - Use `--ty-*` public tokens and `--_ty-*` private helper variables.
   - Document host attributes, slots, parts, forwarded parts, and public state selectors.
   - Follow the override order: attributes/properties, host classes/local CSS, public tokens, documented parts, inline styles only for dynamic values.
   - Generated app CSS must never target private shadow DOM, private variables, undocumented `data-*`, or undocumented parts.

6. Make tests executable:
   - Write requirement rows as setup / action / validation.
   - Include unit, browser E2E, accessibility, visual/contrast, styling-contract, Solid typing, example smoke, manifest/doc sync, and design metadata sync coverage as applicable.
   - For any focus, keyboard, pointer, popup, or form behavior, add browser E2E rows that run against direct Vite fixtures, not Storybook.
   - Browser E2E rows must use trusted Playwright input and assert the real focus target, including `shadowRoot.activeElement` when a custom element delegates focus to a native shadow control.
   - Prefer deterministic assertions.

7. Close with implementation readiness:
   - Identify unresolved decisions and library gaps.
   - If a requirement needs a new token, part, event, or primitive, call it out explicitly.
   - Ensure the spec can drive implementation without relying on private review context.

## Quality Bar

A robust TYUI component spec:

- Chooses the right widget pattern instead of forcing one component to imitate several unrelated widgets.
- Defines composition, parent/child rules, and anti-patterns.
- Separates public API state from internal derived state.
- Has no overloaded hit targets.
- Keeps focus predictable and visible.
- Preserves native semantics where possible.
- Requires browser-level proof for `Tab`, `Shift+Tab`, arrows, Space, Enter, focus delegation, focus restoration, native keyboard defaults, and browser form behavior.
- Documents shadow-boundary accessibility behavior.
- Provides a public styling surface sufficient for generated `design-app.md` bundles.
- Includes reduced-motion, forced-colors, contrast, cleanup, and lifecycle expectations.
- Contains test rows that can be implemented directly.
