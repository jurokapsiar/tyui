# TYUI

TYUI is a framework-neutral component library scaffolded as an Nx monorepo with Vite-powered package builds and examples.

## Architecture

- `libs/core`: plain TypeScript behavior, state machines, and accessibility logic.
- `libs/elements`: native Custom Element implementations.
- `libs/define`: opt-in custom-element registration functions.
- `libs/solid`: Solid JSX typing and optional thin wrappers.
- `libs/testing`: shared testing helpers.
- `apps/solid-example`: Solid + Vite consumer example.
- `apps/vanilla-example`: vanilla + Vite consumer example.

The component implementation should remain in `core` and `elements`. Framework packages should only improve typing and ergonomics.

## Commands

```sh
yarn install
yarn build
yarn test
yarn typecheck
yarn playwright:image
yarn dev:solid
yarn dev:vanilla
```

## Specs And Decisions

- `spec/requirements.md`
- `spec/architecture.md`
- `spec/testing.md`
- `spec/component-contract-template.md`
- `adr/0001-native-custom-elements.md`
- `adr/0002-solid-integration-surface.md`
