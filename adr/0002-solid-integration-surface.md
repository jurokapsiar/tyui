# ADR 0002: Thin Solid Integration Surface

## Status

Accepted.

## Context

The consuming application should use Solid JSX/TSX, but component implementations should remain framework-neutral.

## Decision

Publish a `@toyu-ui/solid` package that provides:

- `JSX.IntrinsicElements` declarations for TYUI custom elements.
- Typed custom-event helpers.
- Optional thin wrappers for ergonomic Solid usage.

The Solid package must not contain component state machines, accessibility behavior, rendering logic, or DOM ownership.

## Consequences

- Solid consumers get typed JSX and conventional wrapper props.
- The implementation remains in `@toyu-ui/core`, `@toyu-ui/elements`, and `@toyu-ui/define`.
- Wrapper tests should verify type safety and event wiring, not duplicate Custom Element behavior tests.
