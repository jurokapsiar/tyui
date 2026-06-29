# Storybook Spec Documentation

The specs in `ai/components/*.md` are the source for Storybook documentation for human and agent developers. Storybook must not grow a parallel handwritten docs layer for component contracts.

## Source Model

Each implemented component keeps its durable contract in `ai/components/<component>.md`.

The spec owns:

- Identity, intent, and selection guidance.
- API, slots, CSS parts, events, and event semantics.
- Runnable examples.
- Behavior, layout, styling, accessibility, tests, and agent guidance.

Durable examples live in `## Examples` in the markdown spec before the component is considered implemented.

## Example Blocks

Storybook renders only fenced code blocks marked with `story`.

````md
```html story title="Default"
<tyui-button>Save</tyui-button>
```
````

Rules:

- Use `html` fences for web-component examples.
- Add `story title="Readable title"` to each live example.
- Keep examples runnable with implemented TYUI elements only.
- Leave invalid examples as plain `html` fences without `story`.
- Mark design-system-specific examples with `design title="Readable title"`. Storybook renders these on the nested `Examples/Designs` page.

````md
```html design title="Fluent Web"
<div data-design-system="fluent-web">
  <tyui-button appearance="primary">Save</tyui-button>
</div>
```
````

## Generated Pages

`nx run elements:storybook-docs` reads implemented component specs and writes generated stories to `libs/elements/src/generated/spec-docs`.

Unimplemented specs appear under the parallel `Unimplemented components/<Component>` root, next to `Components`. Storybook renders only the spec for them. They must not register custom elements, render live examples, or import design CSS.

Unimplemented component spec pages carry the `Show unimplemented components` tag for sidebar filtering, but their primary navigation location is the `Unimplemented components` root.

Sidebar root order is explicit: `Components` first, `Unimplemented components` second.

For each implemented component, Storybook shows:

- `Components/<Component>/About`.
- `Components/<Component>/API`.
- `Components/<Component>/Examples`.
- `Components/<Component>/Examples/Designs`.
- `Components/<Component>/Implementation Spec`.

For each unimplemented component, Storybook shows:

- `Unimplemented components/<Component>/Spec`.

The generator derives:

- Main page from `## Identity`, `## Intent`, and `## Selection Guidance`.
- API page from `## API` plus `### Slots`, `### CSS Parts`, `### Events`, and `### Event Semantics` wherever those subsections appear.
- Examples page from `story` fences under `## Examples`.
- Designs page from `design` fences under `## Examples`.
- Implementation page from the remaining second-level sections.
- Unimplemented spec page from the full component spec, split into readable HTML without executing examples.

## Build Integration

The `elements:storybook` executor runs `elements:storybook-docs` before Storybook starts in dev or build mode.

Storybook visual and Storybook e2e executors also regenerate spec docs before booting Storybook. This keeps screenshots, e2e pages, and published GitHub Pages output aligned with the markdown specs.

The Storybook config loads `libs/elements/src/generated/spec-docs/**/*.stories.ts` only.

Nx caches `storybook-docs` with inputs from:

- `ai/components/**/*`.
- `tools/executors/src/storybook-docs/**/*`.
- production inputs for the elements project.

## Validation

Run:

```sh
node .yarn/releases/yarn-4.5.0.cjs nx run elements:storybook-docs
node .yarn/releases/yarn-4.5.0.cjs nx run elements:storybook --mode=build
```

Behavioral requirements still need direct tests. Storybook documents examples and supports visual checks; direct browser e2e remains the required proof for focus, keyboard, pointer, and form behavior.
