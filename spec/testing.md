# Testing Strategy

## Goals

Tests should prove that each component satisfies its public contract across API, behavior, semantics, states, visuals, and framework integration.

## Layers

- Core unit tests for framework-neutral state machines and behavior helpers.
- Custom Element contract tests for attributes, properties, slots, events, lifecycle, and focus behavior.
- Accessibility tests for roles, labels, ARIA states, keyboard behavior, and accessibility-tree expectations.
- Browser E2E tests for trusted focus, keyboard, pointer, and form behavior that unit DOM environments cannot prove.
- Styling contract tests for public tokens, parts, forwarded parts, reflected state attributes, and private-surface violations.
- Solid type tests that compile JSX usage against the published declarations.
- Example app smoke tests for vanilla and Solid consumers.
- Visual regression tests for states, themes, density, directionality, and forced-colors mode.

## Deterministic First

AI-assisted tests can generate scenarios from a component contract, but the final assertions should be deterministic whenever possible.

Good AI-assisted uses:

- Propose missing state transitions from a contract.
- Generate keyboard interaction scenarios.
- Draft visual state matrices.
- Compare accessibility expectations against implementation notes.

Deterministic checks should remain the source of truth for pass/fail behavior.

## Browser E2E Acceptance

Components with focus, keyboard, pointer, popup, or form behavior must have browser E2E coverage that runs against direct Vite fixtures under the project `e2e/` folder. Storybook stories may demonstrate the same behavior, but they are not the acceptance harness for component correctness.

Browser E2E tests must:

- Start from a realistic document state, such as focus on `body` before first `Tab`.
- Use trusted browser input through Playwright keyboard, mouse, or locator actions.
- Assert observable focus targets, including `shadowRoot.activeElement` for custom elements with shadow DOM.
- Assert public state and events after interaction, such as checked/value/expanded/pressed state and composed change events.
- Cover the first interaction after mount for focusable components, because that is where roving tabindex and focus delegation bugs often appear.
- Reproduce reported accessibility bugs before the implementation is considered fixed.

Unit tests may verify deterministic DOM contracts such as host attributes, internal input attributes, state sync, and event payloads. They do not replace browser E2E tests for `Tab`, `Shift+Tab`, arrow keys, Space, Enter, native keyboard defaults, focus delegation, focus restoration, or browser form submission.

## Component Test Matrix

Every component should define tests for:

- Default rendering.
- Attribute and property updates.
- Event dispatch, bubbling, composition, and detail payloads.
- Slot behavior.
- Public styling hooks: documented `--ty-*` tokens, slots, parts, forwarded parts, and reflected state selectors.
- Private styling boundaries: generated app CSS must not target shadow DOM internals, `--_ty-*` variables, undocumented `data-*` attributes, or undocumented parts.
- Keyboard interactions.
- Focus entry, movement, trapping, and restoration where relevant.
- Disabled, readonly, selected, expanded, checked, pressed, invalid, and loading states where relevant.
- Cleanup on disconnect.
- Solid JSX typing and wrapper behavior when a wrapper exists.

## Styling Contract Validation

Each substantial component must have deterministic checks that compare source, `custom-elements.json`, `.design.json`, and `ai/components/<component>.md`:

- Every documented public CSS custom property exists in the manifest and uses the `--ty-*` prefix.
- Every documented private helper variable uses `--_ty-*` and is not listed as a consumer hook.
- Every documented slot, part, and forwarded part exists in source and in the manifest.
- Every public state selector is backed by a reflected host attribute, native pseudo-class, or semantic ARIA attribute.
- Generated `theme.css`, `component-variants.css`, and `design-app.md` reference only public tokens, documented host attributes, documented parts, and documented forwarded parts.
- Generated app CSS uses inline style guidance only as prose or runtime API guidance; static generated CSS must not rely on inline-style-only values.
