# Agentic UI Design

A component library designed for AI-assisted development requires a distinct layer of machine-readable documentation alongside the human-readable one. This spec defines the artifact contract that enables coding agents to generate consistent, correct, and accessible UI.

## Artifact Overview

Use a small set of complementary artifacts, each optimized for a different type of information:

| Artifact               | Purpose                                       |
| ---------------------- | --------------------------------------------- |
| `DESIGN.md`            | Human and AI-readable product design intent   |
| `design-app.md`        | Generated app-to-component design application |
| `tokens.json`          | Exact design-token values and aliases         |
| `custom-elements.json` | Exact component API metadata                  |
| `components/*.md`      | Behavior, intent, layout, and usage guidance  |
| `skills/**/SKILL.md`   | Versioned Intent-compatible agent guidance    |
| `examples/`            | Executable canonical examples                 |
| `llms.txt`             | Index telling agents where to find everything |

## 1. `DESIGN.md`: Product Design Intent

The consuming product owns this file. It answers:

- What kind of product is this?
- What visual character should it have?
- Which design-system package and theme does it use?
- What density, typography, shape, and color policies apply?
- Which layout principles should generated UI follow?
- Which components should be preferred for recurring patterns?
- What must an agent never invent or override?
- What accessibility requirements apply?

This file describes **intent and policy**, not an exhaustive dump of APIs.

### Format Baseline

Adopt the upstream `design.md` shape for product files:

- YAML front matter at the top of the file stores machine-readable design tokens.
- Markdown body sections store human-readable design rationale and guardrails.
- Token values are normative exact values.
- Prose is normative design intent: it explains why values exist and how agents should apply them.
- Unknown token groups and unknown sections are allowed and must be preserved so products can document motion, iconography, elevation, domain-specific surfaces, or other concerns.
- Duplicate canonical sections are invalid.

Recommended section order:

1. Overview, also accepted as Brand & Style
2. Colors
3. Typography
4. Layout, also accepted as Layout & Spacing
5. Elevation & Depth, also accepted as Elevation
6. Shapes
7. Components
8. Do's and Don'ts

Use `DESIGN.md` as the product's design constitution. Do not use it as a component API database. Component APIs, slots, events, CSS parts, and per-component layout contracts remain in library-owned artifacts.

TYUI itself does not maintain a root product-style `DESIGN.md`. The library owns templates, examples, schemas, validators, and generation tools. Consuming applications own their `DESIGN.md` files and may keep generated design bundles in the application repository or import them from a separate design repository.

### Derived App Design Layer

It is valid and expected for an LLM or build tool to read `DESIGN.md`, `tokens.json`, `custom-elements.json`, and component guidance, then generate an app-specific companion document named `design-app.md`.

`design-app.md` is not the source of visual identity. It is the application of that identity to the component system. It answers:

- Which library component should be preferred for each intent?
- Which existing component variants should be used by default?
- Which new app-level variants should be introduced through component tokens?
- Which page and composition patterns should be preferred?
- Which component combinations are valid for this product?
- Which product-specific exceptions are allowed?
- Which generated theme CSS files implement the decisions?

The generated file may add app-level variants such as `button-primary-glass`, `card-atmospheric`, or `toolbar-muted` when those variants are implemented through public component tokens and documented parts. It must not invent unsupported attributes, slots, events, CSS parts, state hooks, or component behavior. When a desired style cannot be expressed through existing tokens or parts, `design-app.md` must record a component-library gap rather than silently relying on private selectors.

Generated app styling follows the same override order as hand-written app styling:

1. Component attributes and properties.
2. Host classes or app-local CSS for layout and scoped variables.
3. Public CSS custom properties.
4. Documented `::part()` and forwarded-part selectors.
5. Inline styles only for dynamic per-instance values supplied by runtime code.

The generator must never target private shadow DOM selectors, `--_ty-*` helper variables, undocumented `data-*` attributes, or undocumented parts. If the product design requires one of those hooks, the generated `design-app.md` must list it as a library gap.

Expected generated outputs:

```text
dist/design/<design-name>/
├─ theme.css
├─ component-variants.css
├─ design-app.md
├─ patterns.md
├─ tokens.resolved.json
└─ context.json
```

The generated bundle is portable. An app may consume a bundle produced in its own repo or a bundle published by another repo:

```ts
import '@product/design/theme.css';
import '@product/design/component-variants.css';
```

```html
<body data-design-system="product-name" data-color-scheme="system"></body>
```

`design-app.md` may be regenerated as the product design evolves. Human review is still required before committing changes that affect broad component styling. TYUI should provide one `design.md`-style example inspired by the upstream Google repo as the first example; a Fluent-design-system example and a dedicated generation skill are follow-up deliverables.

### App-Level vs Component-Level Concerns

| Concern                                                       | Product `DESIGN.md`             | Component Library                              |
| ------------------------------------------------------------- | ------------------------------- | ---------------------------------------------- |
| Product character, audience, emotional tone                   | Owns                            | May provide examples only                      |
| Visual references and negative constraints                    | Owns                            | Does not own                                   |
| Exact product token values                                    | Owns or points to `tokens.json` | Publishes token schema and defaults            |
| Theme, density, color-scheme, and accessibility policy        | Owns policy                     | Implements resilient hooks and defaults        |
| App shell, page composition, safe areas, and product patterns | Owns                            | Provides primitives and reusable patterns      |
| Component APIs, slots, attributes, events, parts              | References                      | Owns through `custom-elements.json`            |
| Component behavior and accessibility invariants               | References                      | Owns implementation contract                   |
| Component layout contracts                                    | References                      | Owns per component                             |
| Preferred component selection                                 | May add product preferences     | Owns baseline guidance and misuse alternatives |
| Derived app variants and component preferences                | Generated into `design-app.md`  | Validates against public APIs                  |

### Example

````markdown
# Product Design System

## Product Character

This is a desktop productivity application.

The interface should feel:

- compact but not cramped
- information-dense
- calm and neutral
- optimized for keyboard and pointer use
- structurally similar to native desktop software

Do not use:

- oversized marketing typography
- floating glass cards
- excessive rounding
- gradients for decoration
- fixed control heights that prevent text growth

## Component System

Use components from `@acme/elements`. Import from explicit entry points:

```ts
import '@acme/elements/button/define';
```

Do not recreate functionality already provided by the component library.

Component metadata:

- `node_modules/@acme/elements/custom-elements.json`
- `node_modules/@acme/elements/ai/components/`

## Theme

Apply the product theme at the application root:

```ts
import '@product/design-system/theme.css';
```

```html
<body data-design-system="product"></body>
```

## Shape

- Controls use `--product-control-radius`
- Panels use `--product-panel-radius`
- Pills are reserved for tags, filters, and status
- Do not apply pill shapes to ordinary buttons

## Density

The default density is compact. Controls must:

- size intrinsically from content
- use minimum block size rather than fixed height
- allow labels to grow under zoom or translation
- preserve at least the configured interaction target

## Layout

Prefer intrinsic sizing, flex wrapping, grid auto-fit, container queries, and logical properties. The parent owns distribution and stretching. Components own their internal layout. Do not assign `flex: 1` to individual controls unless the surrounding pattern explicitly requires equal distribution.

## Accessibility

- All functionality must be keyboard accessible
- Preserve visible focus indicators
- Use library components instead of recreating ARIA widgets
- Do not use color as the only indication of state
- Support 400% zoom and text enlargement
- Respect reduced motion and forced colors
````

## 2. `tokens.json`: Exact Visual Values

Use the Design Tokens Community Group (DTCG) format. Agents should use semantic token names rather than copying resolved values.

```json
{
  "product": {
    "density": {
      "control-padding-inline": {
        "$type": "dimension",
        "$value": "0.75rem",
        "$description": "Default horizontal padding for controls"
      },
      "control-padding-block": {
        "$type": "dimension",
        "$value": "0.375rem"
      }
    },
    "shape": {
      "control-radius": {
        "$type": "dimension",
        "$value": "0.375rem"
      }
    },
    "layout": {
      "content-measure": {
        "$type": "dimension",
        "$value": "68rem"
      }
    }
  }
}
```

Generated CSS:

```css
[data-design-system='product'] {
  --ty-control-padding-inline: 0.75rem;
  --ty-control-padding-block: 0.375rem;
  --ty-control-radius: 0.375rem;
  --ty-content-measure: 68rem;
}
```

## 3. `custom-elements.json`: Exact Component API

The component library publishes a Custom Elements Manifest at its package root. Generate this from source declarations and documentation comments rather than maintaining it manually.

TYUI exposes CEM generation through:

```sh
nx run elements:cem
```

This writes `libs/elements/custom-elements.json`, which is exported as `@toyu-ui/elements/custom-elements.json` and included in the package files. The manifest is the machine-readable facts layer. It is generated output and must not be hand-edited.

A future implementation may delegate baseline extraction to `@custom-elements-manifest/analyzer`; the architectural requirement is the package-level manifest plus TYUI's `x-design-system` enrichment and validation.

The manifest describes:

- Tag names
- Attributes
- JavaScript properties
- Methods
- Events
- Slots
- CSS custom properties
- CSS shadow parts
- Module exports and inheritance
- Reflected state attributes
- Forwarded parts exposed through `exportparts`

That makes it the correct machine-readable source for component syntax and public surface area.

### Example Entry

```json
{
  "name": "TyuiButton",
  "tagName": "tyui-button",
  "description": "Triggers an immediate action.",
  "attributes": [
    {
      "name": "appearance",
      "type": { "text": "\"primary\" | \"secondary\" | \"subtle\"" },
      "default": "\"secondary\""
    },
    { "name": "disabled", "type": { "text": "boolean" } }
  ],
  "events": [{ "name": "tyui-activate", "type": { "text": "CustomEvent<ActivateDetail>" } }],
  "slots": [
    { "name": "", "description": "Button label or inline content." },
    { "name": "start", "description": "Leading icon." },
    { "name": "end", "description": "Trailing icon." }
  ],
  "cssParts": [
    { "name": "control", "description": "The native interactive control." },
    { "name": "label", "description": "The label container." }
  ],
  "cssProperties": [
    {
      "name": "--ty-button-padding-inline",
      "description": "Inline padding of the control.",
      "default": "var(--ty-control-padding-inline)"
    }
  ]
}
```

### Semantic Metadata Extensions

Extend the manifest with namespaced `x-design-system` properties for intent and alternatives that the base CEM spec cannot capture:

```json
{
  "tagName": "tyui-button",
  "x-design-system": {
    "intent": "action",
    "roles": ["primary-action", "secondary-action", "toolbar-action"],
    "alternatives": {
      "navigation": "tyui-link",
      "binary-state": "tyui-toggle-button",
      "menu-opening": "tyui-menu-button"
    },
    "layout": {
      "intrinsic": true,
      "defaultDisplay": "inline-block",
      "parentOwnsStretching": true
    },
    "accessibility": {
      "requiresAccessibleName": true,
      "allowsInteractiveChildren": false
    }
  }
}
```

Author this metadata in co-located component files such as:

```text
libs/elements/src/button/tyui-button.design.json
```

The enrichment step merges design-system metadata into `custom-elements.json` and fails if metadata references nonexistent attributes, properties, events, slots, CSS parts, CSS custom properties, alternatives, or layout hooks.

## 4. Component Contract Documents

A manifest describes what exists, not enough about when and why to use something. Each substantial component has one combined contract document at `ai/components/<component>.md`. This document is the single component-level source of truth for human guidance, agent guidance, layout/styling contracts, examples, anti-examples, and test expectations.

### Document Format

````markdown
---
component: tyui-button
status: stable
manifest: ../../custom-elements.json
source: ../../src/button/tyui-button.ts
---

# Button

## Intent

Use a button to trigger an immediate action.
Use a link when activation navigates to another resource.

## Selection Guidance

- `primary` — the main action in a bounded task
- `secondary` — ordinary actions
- `subtle` — low-emphasis toolbar actions
- `danger` — destructive actions only

A region should normally contain no more than one primary action.

## API Summary

- `appearance`: primary | secondary | subtle | danger
- `disabled`: boolean
- `pending`: boolean
- event: `tyui-activate`

The manifest is authoritative for exact types.

## Internal Layout

The control uses intrinsic `inline-flex` sizing:

```text
[start] gap [label] gap [end]
icons do not shrink
the label may shrink or wrap
padding comes from component tokens
block size is a minimum, never fixed
the parent controls stretching and distribution
```

## Styling Contract

Preferred customization order:

1. Attributes and properties
2. Host classes or app-local CSS
3. Semantic and component tokens
4. Public CSS parts
5. Inline style only for dynamic values

Supported component tokens: `--ty-button-padding-inline`, `--ty-button-padding-block`, `--ty-button-radius`, `--ty-button-background`, `--ty-button-foreground`

Public parts: `control`, `label`

Private implementation variables: none documented; do not depend on `--_ty-*` variables.

State styling: `disabled` and `pending` reflect to host attributes. Hover and focus use native pseudo-classes. ARIA state remains on the internal native button.

## Behavior

- Enter activates the button
- Space activates the button
- Disabled buttons do not emit `tyui-activate`
- Pending buttons remain labelled but reject repeated activation
- Focus is retained after ordinary activation

## Accessibility

Prefer visible text labels. An icon-only button requires an accessible name. Do not place interactive elements inside the default slot.

## Valid Example

```tsx
<tyui-button appearance="primary" disabled={saving()} on:tyui-activate={save}>
  <tyui-icon slot="start" name="save" />
  {saving() ? 'Saving…' : 'Save'}
</tyui-button>
```

## Invalid Examples

Do not use a button for navigation:

```tsx
// ✗ Use tyui-link instead
<tyui-button on:tyui-activate={() => navigate('/settings')}>Settings</tyui-button>
```
````

Strict CI validation keeps the component contract synchronized with source:

- Frontmatter `component` must match a manifest tag.
- Documented attributes, properties, events, slots, parts, and tokens must exist in the manifest.
- Documented forwarded parts must correspond to real `exportparts` usage.
- Public state selectors must be backed by reflected host attributes, native pseudo-classes, or semantic ARIA attributes.
- Generated app CSS must not target private shadow DOM selectors, private `--_ty-*` variables, or undocumented `data-*` state.
- Examples and anti-examples must parse and validate against the manifest.
- `.design.json` metadata must reference only valid component APIs.
- Status, deprecation, and experimental flags must agree across source, manifest, docs, and AI context.

## 5. Layout Contracts

For every component, publish a layout model as YAML front matter or an adjacent file:

```yaml
layout:
  display: inline-flex
  intrinsic-size: content
  shrink-policy: allowed
  wrap-policy: label-may-wrap
  min-block-size-token: --ty-control-min-block-size

  children:
    start:
      flex: none
    label:
      flex: 0 1 auto
      min-inline-size: 0
    end:
      flex: none

  parent-owns:
    - stretching
    - distribution
    - ordering
    - outer margin

  component-owns:
    - internal padding
    - internal gap
    - minimum target size
    - internal alignment
```

This gives agents explicit answers to questions such as: Can this component shrink? Which content wraps? Is it valid to make it full width? Does the parent or child own spacing?

## 6. Canonical Examples as Data

Agents learn especially well from small, validated examples. Store each example in structured form and run them in tests so AI documentation cannot silently drift from the implementation.

### Valid Example

```yaml
id: button-primary-submit
component: tyui-button
purpose: Submit the current form
valid: true
context:
  inside: form-actions
code: |
  <tyui-button appearance="primary" type="submit">
    Save changes
  </tyui-button>
```

### Anti-Example

```yaml
id: button-navigation
component: tyui-button
valid: false
reason: Navigation should use tyui-link.
code: |
  <tyui-button>Open documentation</tyui-button>
```

## 7. Intent Skills as the Versioned Guidance Layer

The Custom Elements Manifest and token files describe facts. They do not explain
which component to choose, which anti-patterns to avoid, or how framework setup
should work. TYUI ships that intent as Intent-compatible `SKILL.md` files:

```text
libs/elements/
├─ custom-elements.json
└─ skills/
   ├─ button/SKILL.md
   ├─ input/SKILL.md
   ├─ checkbox/SKILL.md
   ├─ radio/SKILL.md
   └─ radio-group/SKILL.md

libs/solid/
└─ skills/
   └─ setup/SKILL.md
```

Skill files are the agent-readable intent layer:

- intent and selection guidance;
- anti-patterns;
- layout ownership;
- accessibility constraints;
- design-system variant guidance;
- framework setup guidance.

They must not duplicate full API type definitions. Skills reference
`custom-elements.json` as the authoritative API source. This prevents drift and
keeps each file short enough for agent loading.

Skill-bearing packages must:

- include the `tanstack-intent` package keyword;
- include `skills/` in package files;
- exclude `skills/_artifacts` from package files;
- validate skills through `skills:validate`;
- use `metadata.type: library` for component packages;
- use `metadata.type: framework` plus `requires` for framework setup skills.

Maintainer commands:

```sh
yarn skills:validate
nx run elements:skills:validate
nx run solid:skills:validate
```

Consumer commands:

```sh
yarn dlx @tanstack/intent@latest install
yarn dlx @tanstack/intent@latest load @toyu-ui/elements#button
yarn dlx @tanstack/intent@latest load @toyu-ui/solid#setup
```

The local `skills:validate` target intentionally provides a no-network CI gate.
Projects may additionally run `yarn dlx @tanstack/intent@latest validate --check`
when they want upstream Intent validation.

## 8. `llms.txt` as the Discovery Layer

Provide an `llms.txt` index at the documentation site or package root:

```
# Acme Design System

> Framework-neutral custom elements with Solid JSX integration.

## Start Here

- [Product integration](https://docs.example.com/ai/integration.md)
- Component selection guide: `dist/ai/selection.md`, generated from shipped Intent-compatible `SKILL.md` files.
- [Layout principles](https://docs.example.com/ai/layout.md)
- [Accessibility rules](https://docs.example.com/ai/accessibility.md)

## Machine-Readable Sources

- [Custom Elements Manifest](https://docs.example.com/custom-elements.json)
- [Design tokens](https://docs.example.com/tokens.json)

## Components

- [Button](https://docs.example.com/ai/components/button.md)
- [Dialog](https://docs.example.com/ai/components/dialog.md)
- [Listbox](https://docs.example.com/ai/components/listbox.md)

## Patterns

- [Form actions](https://docs.example.com/ai/patterns/form-actions.md)
- [Toolbars](https://docs.example.com/ai/patterns/toolbars.md)
- [Responsive page layouts](https://docs.example.com/ai/patterns/layouts.md)
```

For repository-based agents, include a local `AGENTS.md` that instructs them to read `DESIGN.md` and the relevant component metadata before generating UI.

## 9. Responsibility Split

| Responsibility             | Component Library                             | Consuming Product                            |
| -------------------------- | --------------------------------------------- | -------------------------------------------- |
| Component capabilities     | `custom-elements.json`                        |                                              |
| Token schema               | `tokens.schema.json`, `defaults.tokens.json`  |                                              |
| AI overview and selection  | `ai/overview.md`, `ai/component-selection.md` |                                              |
| Component and pattern docs | `ai/components/`, `ai/patterns/`              |                                              |
| Versioned skill guidance   | `skills/**/SKILL.md`                          | May install or allowlist via Intent          |
| Solid JSX types            | `solid/jsx.d.ts`                              |                                              |
| Validated examples         | `examples/`                                   |                                              |
| Design intent and policy   |                                               | `DESIGN.md`                                  |
| Applied component guidance |                                               | `design-app.md`                              |
| Resolved token values      |                                               | `tokens.json`, `theme.css`                   |
| Agent instructions         |                                               | `AGENTS.md`                                  |
| Product-specific patterns  |                                               | `design/patterns.md`, `design/exceptions.md` |

The library knows what a component **can** do. `DESIGN.md` knows how the product should feel. `design-app.md` maps that product intent onto the actual component system.

## 10. `design-app.md`: Generated Component Application

`design-app.md` is generated from:

- Product `DESIGN.md`
- Product token files
- Library `custom-elements.json`
- Library component guidance
- Library pattern guidance
- Existing app screenshots or source, when available

The file should be structured for review and regeneration:

```markdown
# Product Component Application

## Source Inputs

- DESIGN.md
- tokens.json
- node_modules/@acme/elements/custom-elements.json
- node_modules/@acme/elements/ai/components/

## Intent To Component Map

| Intent              | Preferred Component | Variant | Notes                     |
| ------------------- | ------------------- | ------- | ------------------------- |
| primary action      | tyui-button         | primary | One per bounded task      |
| low-emphasis action | tyui-button         | subtle  | Toolbar and inline use    |
| navigation          | tyui-link           | default | Do not use buttons        |
| binary state        | tyui-toggle-button  | default | Do not use pressed button |

## App Variants

### tyui-button[appearance="primary"]

Use for the single strongest action in a task.

Implemented by:

- `--ty-button-background`
- `--ty-button-foreground`
- `--ty-button-radius`
- `--ty-button-padding-inline`

Uses no parts and no private selectors.

### tyui-card[data-app-variant="glass"]

Use for dashboard metric groups.

Implemented by:

- `--ty-card-background`
- `--ty-card-border-color`
- `--ty-card-elevation`

Requires a documented `surface` part only if the backdrop treatment cannot be expressed as a component token.

## Composition Patterns

### Form Actions

Use `tyui-cluster` with content distribution by default.
Use equal-width buttons only in narrow stacked layouts.

## New Library Gaps

- Need `tyui-card` to expose `--ty-card-backdrop-filter` before true glass surfaces can be implemented without private selectors.
```

### Generation Rules

- Prefer existing library variants before creating app variants.
- Create app variants through semantic tokens, component tokens, and documented `::part()` selectors only.
- Do not generate selectors against undocumented shadow DOM.
- Do not invent attributes, slots, events, or properties that are absent from `custom-elements.json`.
- Do not redefine behavior, keyboard interaction, ARIA semantics, or slot ownership.
- Record unavailable styling needs as library gaps.
- Include source references so reviewers can trace each decision back to product intent or component capability.
- Prefer tokens over `::part()`. Any `::part()` usage must be listed with a rationale. If the same part override appears across multiple variants or products, promote it to a new public component token.

### Example Transformation

If `DESIGN.md` says the product should feel "atmospheric, layered, and glass-like", the generator may produce:

- `theme.css` values for translucent surfaces, bright text, soft elevation, and larger radii.
- `component-variants.css` entries for card, button, input, and list-item component tokens.
- `design-app.md` guidance that maps "metric group" to a card variant, "primary action" to a high-contrast button variant, and "secondary navigation" to low-emphasis links.

It may not decide that a button has a new `glass` attribute unless that attribute exists in the manifest. If the desired variant is product-specific, prefer a product data attribute or class outside the shadow root that remaps documented component tokens.

## 11. AI Context Bundle

Add a build command to combine and validate all sources:

```
yarn design-system:context
```

This runs `nx run elements:ai-context`, which depends on `elements:cem` and
`elements:skills:validate`.

Output at `dist/ai/`:

```
dist/ai/
├─ index.md
├─ components.md
├─ llms.txt
├─ tokens.resolved.json
├─ custom-elements.compact.json
└─ context.json
```

`patterns.md` and `design-app.md` are included when a generated product bundle
provides them. The root `llms.txt` points agents to the generated context bundle.

The compact context document:

```json
{
  "designSystem": "product",
  "framework": "solid",
  "components": {
    "action": {
      "default": "tyui-button",
      "navigation": "tyui-link",
      "toggle": "tyui-toggle-button"
    }
  },
  "rules": [
    "Use library components before native reimplementations.",
    "Use no more than one primary action per bounded task.",
    "Parent layouts own stretching.",
    "Use semantic tokens rather than literal values.",
    "Use design-app.md for app-specific variants and composition preferences."
  ],
  "sources": {
    "manifest": "../custom-elements.json",
    "tokens": "../tokens.json",
    "appliedDesign": "../design-app.md"
  }
}
```

## 12. Validation Loop

The same metadata drives automated checks. Without validation, even excellent context will eventually be ignored or misinterpreted:

```
design intent
   ↓
AI generates interface
   ↓
schema and lint validation
   ↓
browser and accessibility tests
   ↓
visual comparison
```

Checks to enforce:

- Validate every element used in generated TSX against `custom-elements.json`
- Validate attributes and event names
- Flag undocumented CSS parts or custom properties
- Reject literal colors, radii, and spacing where semantic tokens exist
- Detect invalid nesting
- Validate `design-app.md` selectors against documented component tokens and parts
- Validate app variant names against the generated CSS that implements them
- Test canonical examples
- Run accessibility checks
- Ensure every documented slot, token, and event still exists
- Diff manifest changes and classify them as patch, minor, or major.
- Propagate deprecated and experimental status into `custom-elements.json`, component docs, `design-app.md`, and the AI context bundle.

Validation is strict by default in CI. Products may use configurable validation presets, but every escape hatch must be an explicit allowlist entry with rationale.

## Summary

Use `DESIGN.md` as the design constitution, not the database:

| Artifact               | Role                                                     |
| ---------------------- | -------------------------------------------------------- |
| `DESIGN.md`            | Product identity, principles, constraints, and decisions |
| `tokens.json`          | Exact visual values                                      |
| `custom-elements.json` | Exact programmable component interface                   |
| Component Markdown     | Intent, behavior, composition, and accessibility         |
| Examples               | Canonical implementation patterns                        |
| `design-app.md`        | Generated app-level component application                |
| `llms.txt`             | Discovery and context routing                            |
| Lint/tests             | Enforcement                                              |

This gives humans readable documentation, IDEs structured metadata, AI agents semantic guidance, and build tools authoritative schemas—without forcing all four audiences into one oversized Markdown file.
