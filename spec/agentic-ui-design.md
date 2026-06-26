Use a small set of complementary artifacts, each optimized for a different type of information:

DESIGN.md                 Human and AI-readable product design intent
tokens.json               Exact design-token values and aliases
custom-elements.json      Exact component API metadata
components/*.md           Behavior, intent, layout and usage guidance
examples/                 Executable canonical examples
llms.txt                  Index telling agents where to find everything

DESIGN.md is now an open draft format from Google Labs intended to give coding agents a persistent description of a product’s visual identity. It is useful for product-wide visual intent, but it should not become the sole authoritative description of every component API.

The proposed contract
1. DESIGN.md: product design intent

The consuming product owns this file.

It should answer:

What kind of product is this?
What visual character should it have?
Which design-system package and theme does it use?
What density, typography, shape and color policies apply?
Which layout principles should generated UI follow?
Which components should be preferred for recurring patterns?
What must an agent never invent or override?
What accessibility requirements apply?

Example:

# Product design system

## Product character

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

## Component system

Use components from `@acme/elements`.

Import component registration from explicit entry points:

```ts
import "@acme/elements/button/define";

Do not recreate functionality already provided by the component library.

Component metadata:

node_modules/@acme/elements/custom-elements.json
node_modules/@acme/elements/ai/components/
Theme

Use the product theme:

import "@product/design-system/theme.css";

Apply it at the application root:

<body data-design-system="product">
Shape
controls use --product-control-radius
panels use --product-panel-radius
pills are reserved for tags, filters and status
do not apply pill shapes to ordinary buttons
Density

The default density is compact.

Controls must:

size intrinsically from content
use minimum block size rather than fixed height
allow labels to grow under zoom or translation
preserve at least the configured interaction target
Layout

Prefer:

intrinsic sizing
flex wrapping
grid auto-fit
container queries
logical properties

The parent owns distribution and stretching.
Components own their internal layout.

Do not assign flex: 1 to individual controls unless the surrounding
pattern explicitly requires equal distribution.

Accessibility
all functionality must be keyboard accessible
preserve visible focus indicators
use library components instead of recreating ARIA widgets
do not use color as the only indication of state
support 400% zoom and text enlargement
respect reduced motion and forced colors

This file describes **intent and policy**, not an exhaustive JSON-like dump of APIs.

## 2. `tokens.json`: exact visual values

Use the Design Tokens Community Group format for values such as color, spacing, radius, typography and motion. The DTCG published its first stable format version in October 2025, specifically to exchange design tokens across tools and platforms. :contentReference[oaicite:1]{index=1}

Example:

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

Generate CSS from this:

[data-design-system="product"] {
  --ds-control-padding-inline: 0.75rem;
  --ds-control-padding-block: 0.375rem;
  --ds-control-radius: 0.375rem;
  --ds-content-measure: 68rem;
}

The agent should normally use the semantic token name rather than copying the resolved value.

3. custom-elements.json: exact component API

The component library should publish a Custom Elements Manifest at its package root.

The manifest format can describe:

tag names
attributes
JavaScript properties
methods
events
slots
CSS custom properties
CSS shadow parts
module exports and inheritance

That makes it the correct machine-readable source for component syntax and public surface area.

For example, the metadata for a button should encode information equivalent to:

{
  "name": "DsButton",
  "tagName": "ds-button",
  "description": "Triggers an immediate action.",
  "attributes": [
    {
      "name": "appearance",
      "type": {
        "text": "\"primary\" | \"secondary\" | \"subtle\""
      },
      "default": "\"secondary\""
    },
    {
      "name": "disabled",
      "type": {
        "text": "boolean"
      }
    }
  ],
  "events": [
    {
      "name": "ds-activate",
      "type": {
        "text": "CustomEvent<ActivateDetail>"
      }
    }
  ],
  "slots": [
    {
      "name": "",
      "description": "Button label or inline content."
    },
    {
      "name": "start",
      "description": "Leading icon."
    },
    {
      "name": "end",
      "description": "Trailing icon."
    }
  ],
  "cssParts": [
    {
      "name": "control",
      "description": "The native interactive control."
    },
    {
      "name": "label",
      "description": "The label container."
    }
  ],
  "cssProperties": [
    {
      "name": "--ds-button-padding-inline",
      "description": "Inline padding of the control.",
      "default": "var(--ds-control-padding-inline)"
    }
  ]
}

Generate this from source declarations and documentation comments rather than maintaining it manually.

4. Component guidance documents

A manifest describes what exists, but not enough about when and why to use it.

Each substantial component should therefore have a concise semantic document:

ai/components/button.md
ai/components/dialog.md
ai/components/listbox.md
ai/patterns/forms.md
ai/patterns/toolbars.md

A good component document should follow a predictable schema.

Suggested component document format
---
component: ds-button
status: stable
manifest: ../../custom-elements.json
source: ../../src/button/ds-button.ts
---

# Button

## Intent

Use a button to trigger an immediate action.

Use a link when activation navigates to another resource.

## Selection guidance

Use:
- `primary` for the main action in a bounded task
- `secondary` for ordinary actions
- `subtle` for low-emphasis toolbar actions
- `danger` only for destructive actions

A region should normally contain no more than one primary action.

## API summary

- `appearance`: primary | secondary | subtle | danger
- `disabled`: boolean
- `pending`: boolean
- event: `ds-activate`

The manifest is authoritative for exact types.

## Slots

### Default slot

Contains the visible label.

The label should normally be concise text. It may wrap when space is
constrained or text is enlarged.

### `start`

Contains a leading decorative or meaningful icon.

When the icon conveys unique meaning, provide an accessible name.

### `end`

Reserved for content such as a disclosure indicator.

Do not place an arbitrary badge here.

## Internal layout

The control uses intrinsic `inline-flex` sizing:

```text
[start] gap [label] gap [end]
icons do not shrink
the label may shrink or wrap
padding comes from component tokens
block size is a minimum, never fixed
the parent controls stretching and distribution
Styling contract

Preferred customization order:

semantic product tokens
button component tokens
public CSS parts

Do not target undocumented shadow-DOM selectors.

Supported component tokens:

--ds-button-padding-inline
--ds-button-padding-block
--ds-button-radius
--ds-button-background
--ds-button-foreground

Public parts:

control
label
Behavior
Enter activates the button
Space activates the button
disabled buttons do not emit ds-activate
pending buttons remain labelled but reject repeated activation
focus is retained after ordinary activation
Accessibility

Prefer visible text labels.

An icon-only button requires an accessible name.

Do not place interactive elements inside the default slot.

Solid example
<ds-button
  appearance="primary"
  disabled={saving()}
  on:ds-activate={save}
>
  <ds-icon slot="start" name="save" />
  {saving() ? "Saving…" : "Save"}
</ds-button>
Invalid examples

Do not use a button for navigation:

<ds-button on:ds-activate={() => navigate("/settings")}>
  Settings
</ds-button>

Use the design-system link component instead.


The sections on **intent**, **selection guidance**, **invalid examples** and **layout ownership** are particularly valuable to an AI agent. Type declarations alone cannot communicate them.

## Describe layout as contracts, not hidden CSS

For every component, publish a small layout model:

```yaml
layout:
  display: inline-flex
  intrinsic-size: content
  shrink-policy: allowed
  wrap-policy: label-may-wrap
  min-block-size-token: --ds-control-min-block-size

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

This could be embedded in Markdown front matter or stored in an adjacent JSON file.

It gives agents an explicit answer to questions such as:

Can this component shrink?
Which content wraps?
Is it valid to make it full width?
Does the parent or child own spacing?
Which values are tokens?
Which slots are inflexible?
Add semantic metadata beyond the current manifest

The Custom Elements Manifest should remain the interoperable base, but your library can add namespaced extensions:

{
  "tagName": "ds-button",

  "x-design-system": {
    "intent": "action",
    "roles": ["primary-action", "secondary-action", "toolbar-action"],

    "alternatives": {
      "navigation": "ds-link",
      "binary-state": "ds-toggle-button",
      "menu-opening": "ds-menu-button"
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

Use an x- namespace because this is your extension rather than part of the base CEM specification.

Publish canonical examples as data

Agents learn especially well from small, validated examples.

For each example, store:

id: button-primary-submit
component: ds-button
purpose: Submit the current form
valid: true
context:
  inside: form-actions
code: |
  <ds-button appearance="primary" type="submit">
    Save changes
  </ds-button>

Also include anti-examples:

id: button-navigation
component: ds-button
valid: false
reason: Navigation should use ds-link.
code: |
  <ds-button>Open documentation</ds-button>

Run examples in tests so the AI documentation cannot silently drift from the implementation.

llms.txt as the discovery layer

At the documentation site or package root, provide an llms.txt index. llms.txt is currently a proposal rather than a formal web standard, but it is designed to help language models locate the most useful documentation without ingesting an entire site blindly.

Example:

# Acme Design System

> Framework-neutral custom elements with Solid JSX integration.

## Start here

- [Product integration](https://docs.example.com/ai/integration.md)
- [Component selection guide](https://docs.example.com/ai/selection.md)
- [Layout principles](https://docs.example.com/ai/layout.md)
- [Accessibility rules](https://docs.example.com/ai/accessibility.md)

## Machine-readable sources

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

For repository-based agents, you can also include a local AGENTS.md that instructs them to read DESIGN.md and the relevant component metadata before generating UI.

Product-level and library-level responsibilities
The component library publishes
custom-elements.json
tokens.schema.json
defaults.tokens.json
ai/
  overview.md
  component-selection.md
  layout-principles.md
  components/
  patterns/
solid/
  jsx.d.ts
examples/
The consuming product publishes
DESIGN.md
tokens.json
theme.css
AGENTS.md
design/
  patterns.md
  exceptions.md

This distinction matters:

The library knows what a component can do.
The product knows how that component should look and when it should be chosen in that particular application.
Generate an AI bundle at build time

I would add a build command such as:

npm run design-system:context

It would combine and validate:

DESIGN.md
+ resolved DTCG tokens
+ custom-elements.json
+ relevant component guidance
+ framework-specific examples

The output could be:

dist/ai/
├─ index.md
├─ components.md
├─ patterns.md
├─ tokens.resolved.json
├─ custom-elements.compact.json
└─ context.json

The compact machine document might look like:

{
  "designSystem": "product",
  "framework": "solid",
  "components": {
    "action": {
      "default": "ds-button",
      "navigation": "ds-link",
      "toggle": "ds-toggle-button"
    }
  },
  "rules": [
    "Use library components before native reimplementations.",
    "Use no more than one primary action per bounded task.",
    "Parent layouts own stretching.",
    "Use semantic tokens rather than literal values."
  ],
  "sources": {
    "manifest": "../custom-elements.json",
    "tokens": "../tokens.json"
  }
}

This is much more efficient than making an agent repeatedly search hundreds of long documentation pages.

Validation is as important as documentation

The same metadata should drive automated checks:

validate every element used in generated TSX against custom-elements.json;
validate attributes and event names;
flag undocumented CSS parts or custom properties;
reject literal colors, radii and spacing where semantic tokens exist;
detect invalid nesting;
test canonical examples;
run accessibility checks;
ensure every documented slot, token and event still exists.

This creates a closed loop:

design intent
   ↓
AI generates interface
   ↓
schema and lint validation
   ↓
browser and accessibility tests
   ↓
visual comparison

Without validation, even excellent context will eventually be ignored or misinterpreted.

Recommended overall format

Use DESIGN.md as the design constitution, not the database:

DESIGN.md
  product identity, principles, constraints and decisions

tokens.json
  exact visual values

custom-elements.json
  exact programmable component interface

component Markdown
  intent, behavior, composition and accessibility

examples
  canonical implementation patterns

llms.txt
  discovery and context routing

lint/tests
  enforcement

That gives humans readable documentation, IDEs structured metadata, AI agents semantic guidance, and build tools authoritative schemas—without trying to force all four audiences into one oversized Markdown file.