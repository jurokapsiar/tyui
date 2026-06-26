# Testing Strategy

## Goals

Tests should prove that each component satisfies its public contract across API, behavior, semantics, states, visuals, and framework integration.

## Layers

- Core unit tests for framework-neutral state machines and behavior helpers.
- Custom Element contract tests for attributes, properties, slots, events, lifecycle, and focus behavior.
- Accessibility tests for roles, labels, ARIA states, keyboard behavior, and accessibility-tree expectations.
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

## Component Test Matrix

Every component should define tests for:

- Default rendering.
- Attribute and property updates.
- Event dispatch, bubbling, composition, and detail payloads.
- Slot behavior.
- Keyboard interactions.
- Focus entry, movement, trapping, and restoration where relevant.
- Disabled, readonly, selected, expanded, checked, pressed, invalid, and loading states where relevant.
- Cleanup on disconnect.
- Solid JSX typing and wrapper behavior when a wrapper exists.
