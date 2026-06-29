---
name: component-spec-implementation
description: Transform a TYUI draft component spec into an implemented component spec. Use after a component is coded or while finishing implementation to sync ai/components docs, examples, Storybook spec pages, CEM, skills, tests, and package exports.
---

# Component Spec Implementation

Use this skill when a TYUI component moves from draft/planned to implemented. The goal is one source of truth: `ai/components/<component>.md` describes the implemented behavior, Storybook renders that spec, and tests prove the claims.

## Required Inputs

- Draft spec in `ai/components/<component>.md`.
- Element implementation in `libs/elements/src/<component>/`.
- Define entry in `libs/define/src/<component>.ts`.
- Spec examples that demonstrate implemented variants.
- Tests that prove behavior, accessibility, form, focus, and styling contracts.

## Workflow

1. Reconcile the spec with code:
   - Update status, source file, package entry point, tag name, attributes, properties, events, slots, CSS parts, tokens, and current behavior.
   - Remove requirements that the implementation does not satisfy, or keep them as explicit gaps with follow-up labels.
   - Keep design-system-only styling in `design/alternatives/*/DESIGN.md` and generated CSS, not in the base component spec.

2. Move durable examples into the spec:
   - Put examples under `## Examples`.
   - Cover the implemented public variants from the spec: size, shape, appearance, icon, state, layout, form, and design examples when applicable.
   - Treat missing implemented variants as a spec bug.
   - Mark live Storybook examples with fenced blocks like:

````
```html story title="Default"
<tyui-button>Save</tyui-button>
```
````

- Leave invalid examples as plain `html` fences without the `story` marker.
- Keep example markup runnable with implemented components only.
- Move design-system examples such as Fluent Web and Atmospheric Glass into `## Examples` as `html design title="..."` fences.
- Do not keep design-system demos outside the markdown spec once the component is implemented.

3. Generate Storybook spec docs:
   - Run `nx run elements:storybook-docs`.
   - Confirm generated files appear in `libs/elements/src/generated/spec-docs`.
   - Confirm Storybook groups pages directly under `Components/<Component>` as About, API, Examples, Examples/Designs, and Implementation Spec.
   - Confirm the Examples page includes the implemented public variants documented by the spec.
   - Confirm unimplemented component specs render as `Unimplemented components/<Component>/Spec` and carry the `Show unimplemented components` sidebar-filter tag.

4. Update implementation-facing artifacts:
   - Ensure `libs/elements/custom-elements.json` includes the component.
   - Add or update `libs/elements/skills/<component>/SKILL.md` when the component ships.
   - Run `nx run elements:ai-context` so `dist/ai` and `llms.txt` match the spec.
   - Check package subpath exports in `libs/elements/package.json` and `libs/define/package.json`.

5. Verify behavior with deterministic tests:
   - Unit and contract tests cover attributes, properties, slots, events, and lifecycle.
   - Direct Playwright e2e covers Tab, Shift+Tab, arrows, Space, Enter, pointer input, form behavior, and `shadowRoot.activeElement` when focus delegates through shadow DOM.
   - Storybook is documentation and visual proof, not the primary behavior test surface.

6. Close the spec:
   - The markdown spec must match implemented behavior.
   - Storybook generated docs must build.
   - CEM, skills, AI context, package exports, and tests must agree.
   - Leave open gaps as explicit follow-up requirements rather than silent mismatches.

## Validation Commands

Use the local Yarn entrypoint:

```sh
node .yarn/releases/yarn-4.5.0.cjs nx run elements:storybook-docs
node .yarn/releases/yarn-4.5.0.cjs nx run elements:cem
node .yarn/releases/yarn-4.5.0.cjs nx run elements:ai-context
node .yarn/releases/yarn-4.5.0.cjs nx run elements:test
node .yarn/releases/yarn-4.5.0.cjs nx run elements:storybook --mode=build
```
