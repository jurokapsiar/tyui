# Contributing

## Add A Component

1. Create a contract from `spec/component-contract-template.md`.
2. Put reusable behavior in `libs/core`.
3. Put the Custom Element in `libs/elements`.
4. Add a registration function in `libs/define`.
5. Add Solid JSX typing and an optional wrapper in `libs/solid`.
6. Add deterministic tests across core, DOM behavior, accessibility, and Solid typing.
7. Document attributes, properties, events, slots, parts, and theming hooks.

## Build And Test

Use Nx from the repository root:

```sh
yarn build
yarn test
yarn typecheck
```

Run examples with:

```sh
yarn dev:solid
yarn dev:vanilla
```
