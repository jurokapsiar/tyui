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
