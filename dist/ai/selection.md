# TYUI Component Selection Guide

This file is generated from shipped TanStack Intent-compatible `SKILL.md` files. Do not hand-edit component recommendations here; update the relevant skill and rerun `nx run elements:ai-context`.

Use this guide to discover candidate skills, then load the aggregate component skill for the installed package version:

```sh
yarn dlx @tanstack/intent@latest load @toyu-ui/elements#components
```

You can still load an individual component skill when a task only touches one component.

## Skill Index

| Intent Skill | Use When | Avoid |
| ------------ | -------- | ----- |
| `@toyu-ui/elements#button` | Use `tyui-button` to trigger an immediate in-page action. Use a link for navigation. | Do not use button activation for navigation. |
| `@toyu-ui/elements#center` | Use `tyui-center` to constrain readable content to a maximum inline measure and center it inside the available space. | Do not wrap every individual control in Center. |
| `@toyu-ui/elements#checkbox` | Use `tyui-checkbox` for an independent yes/no or on/off choice. | Do not use checkbox as a command button. |
| `@toyu-ui/elements#cluster` | Use `tyui-cluster` for compact groups of peer items that keep their intrinsic size and wrap to new lines when space runs out. | Do not use Cluster for table rows or data grids. |
| `@toyu-ui/elements#components` | Use `@toyu-ui/elements#components` when an agent or developer needs the complete shipped TYUI component guidance set before choosing controls or layout primitives. | Do not duplicate component selection rules in app docs when this aggregate skill can load the versioned component guidance. |
| `@toyu-ui/elements#container` | Use `tyui-container` to create a page or section rail that controls maximum inline size and horizontal gutter. | Do not use Container to set a button or input width. |
| `@toyu-ui/elements#flex` | Use `tyui-flex` when sibling content follows one axis and the parent owns direction, wrapping, alignment, justification, and gap. | Do not use Flex to create data tables or two-dimensional card grids. |
| `@toyu-ui/elements#frame` | Use `tyui-frame` to reserve a stable aspect ratio for one primary child while the parent owns width. | Do not place full forms or complex scrollable interactive regions inside Frame. |
| `@toyu-ui/elements#grid` | Use `tyui-grid` for repeated peer items that should form responsive columns from the container width and a minimum item size. | Do not use Grid for data tables or keyboard-navigable ARIA grids. |
| `@toyu-ui/elements#input` | Use `tyui-input` for short single-line text entry such as names, email addresses, search terms, telephone numbers, URLs, passwords, and numeric text. | Do not rely on placeholder as the only label. |
| `@toyu-ui/elements#radio` | Use `tyui-radio` to represent one option inside `tyui-radio-group`. | Do not use standalone radio buttons for unrelated boolean choices. |
| `@toyu-ui/elements#radio-group` | Use `tyui-radio-group` when the user must choose exactly one option from a small set. | Do not place non-radio interactive elements in the default slot. |
| `@toyu-ui/elements#sidebar` | Use `tyui-sidebar` for a two-region layout where one child has a preferred fixed size and the other child takes remaining space. | Do not add more than two direct children. |
| `@toyu-ui/solid#button` | Use `@toyu-ui/solid#button` to load Solid setup plus the authoritative `@toyu-ui/elements#button` guidance. | Do not duplicate button behavior in a Solid wrapper. |
| `@toyu-ui/solid#center` | Use `@toyu-ui/solid#center` to load Solid setup plus the authoritative `@toyu-ui/elements#center` guidance. | Do not use Center as a card or surface. |
| `@toyu-ui/solid#checkbox` | Use `@toyu-ui/solid#checkbox` to load Solid setup plus the authoritative `@toyu-ui/elements#checkbox` guidance. | Do not use Checkbox as a command button. |
| `@toyu-ui/solid#cluster` | Use `@toyu-ui/solid#cluster` to load Solid setup plus the authoritative `@toyu-ui/elements#cluster` guidance. | Do not use Cluster for table or data-grid semantics. |
| `@toyu-ui/solid#components` | Use `@toyu-ui/solid#components` when a Solid app needs the full TYUI component selection and usage guidance. | Do not ask Solid apps to install `@toyu-ui/define` or `@toyu-ui/elements` directly for normal use. |
| `@toyu-ui/solid#container` | Use `@toyu-ui/solid#container` to load Solid setup plus the authoritative `@toyu-ui/elements#container` guidance. | Do not use Container to set individual control widths. |
| `@toyu-ui/solid#flex` | Use `@toyu-ui/solid#flex` to load Solid setup plus the authoritative `@toyu-ui/elements#flex` guidance. | Do not import registration helpers from `@toyu-ui/define` in normal Solid app code. |
| `@toyu-ui/solid#frame` | Use `@toyu-ui/solid#frame` to load Solid setup plus the authoritative `@toyu-ui/elements#frame` guidance. | Do not put complex forms inside Frame. |
| `@toyu-ui/solid#grid` | Use `@toyu-ui/solid#grid` to load Solid setup plus the authoritative `@toyu-ui/elements#grid` guidance. | Do not use Grid for tabular data. |
| `@toyu-ui/solid#input` | Use `@toyu-ui/solid#input` to load Solid setup plus the authoritative `@toyu-ui/elements#input` guidance. | Do not rely on placeholder text as the only label. |
| `@toyu-ui/solid#radio` | Use `@toyu-ui/solid#radio` to load Solid setup plus the authoritative `@toyu-ui/elements#radio` guidance. | Do not manage Radio checked state outside the group. |
| `@toyu-ui/solid#radio-group` | Use `@toyu-ui/solid#radio-group` to load Solid setup plus the authoritative `@toyu-ui/elements#radio-group` guidance. | Do not put non-radio controls in the default slot. |
| `@toyu-ui/solid#setup` | Use `@toyu-ui/solid` when a Solid app wants typed JSX ergonomics for TYUI custom elements. The implementation remains in `@toyu-ui/elements`. | Do not reimplement TYUI behavior in Solid wrappers. |
| `@toyu-ui/solid#sidebar` | Use `@toyu-ui/solid#sidebar` to load Solid setup plus the authoritative `@toyu-ui/elements#sidebar` guidance. | Do not use Sidebar for overlay drawer behavior. |

## tyui-button

- Skill: `@toyu-ui/elements#button`
- Source: `libs/elements/skills/button/SKILL.md`
- Description: Use and integrate the tyui-button custom element correctly, including registration, intent, states, events, and anti-patterns.

### Intent

Use `tyui-button` to trigger an immediate in-page action. Use a link for navigation.

### Selection Guidance

- Use one primary button for the dominant local action.
- Use default or secondary styling for ordinary commands.
- Use subtle or transparent styling for dense toolbars and repeated row actions.
- Icon-only buttons must have an accessible name.

### Anti-Patterns

- Do not use button activation for navigation.
- Do not place focusable controls inside the button label.
- Do not restyle private shadow DOM; use public tokens, attributes, and parts.

### Correct Usage

```html
<tyui-button appearance="primary">Save</tyui-button>
```

## tyui-center

- Skill: `@toyu-ui/elements#center`
- Source: `libs/elements/skills/center/SKILL.md`
- Description: Use tyui-center to constrain readable content to a centered measure with tokenized gutters.

### Intent

Use `tyui-center` to constrain readable content to a maximum inline measure and center it inside the available space.

### Selection Guidance

- Use Center for prose, forms, narrow settings pages, and focused empty states.
- Use Container for page or section rails.
- Use Grid or Sidebar when the content has multiple peer regions.
- Use the `intrinsic` attribute when children should also center as a column.

### Anti-Patterns

- Do not wrap every individual control in Center.
- Do not use Center as a card or surface.
- Do not nest Center repeatedly without a specific measure change.

### Correct Usage

```html
<tyui-center measure="60ch" gutter="page">
  <tyui-flex direction="column" gap="3">
    <h1>Profile</h1>
    <tyui-input label="Display name"></tyui-input>
  </tyui-flex>
</tyui-center>
```

## tyui-checkbox

- Skill: `@toyu-ui/elements#checkbox`
- Source: `libs/elements/skills/checkbox/SKILL.md`
- Description: Use and integrate the tyui-checkbox custom element for independent boolean choices and avoid radio or command-button misuse.

### Intent

Use `tyui-checkbox` for an independent yes/no or on/off choice.

### Selection Guidance

- Use checkbox for independent choices.
- Use radio group when exactly one option must be chosen from a set.
- Use a switch component, when available, for immediate setting toggles.

### Anti-Patterns

- Do not use checkbox as a command button.
- Do not use checkbox for mutually exclusive options.
- Do not hide the label without providing an accessible name.

### Correct Usage

```html
<tyui-checkbox name="notifications" value="enabled">Email notifications</tyui-checkbox>
```

## tyui-cluster

- Skill: `@toyu-ui/elements#cluster`
- Source: `libs/elements/skills/cluster/SKILL.md`
- Description: Use tyui-cluster for compact wrapping rows of intrinsic items such as actions, tags, chips, and toolbar-like groups.

### Intent

Use `tyui-cluster` for compact groups of peer items that keep their intrinsic size and wrap to new lines when space runs out.

### Selection Guidance

- Use Cluster for action rows, tags, chips, checkbox rows, radio rows, and short metadata groups.
- Use Flex when one-axis distribution, direction, or optional wrapping matters more than wrap-first behavior.
- Use Grid when children should form equal responsive tracks.
- Preserve list markup when the items are a semantic list.

### Anti-Patterns

- Do not use Cluster for table rows or data grids.
- Do not remove list semantics just to get a wrapping row.
- Do not make Cluster responsible for toolbar keyboard behavior.

### Correct Usage

```html
<tyui-cluster gap="2">
  <tyui-button appearance="primary">Save</tyui-button>
  <tyui-button>Cancel</tyui-button>
  <tyui-button appearance="subtle">Reset</tyui-button>
</tyui-cluster>
```

## TYUI components

- Skill: `@toyu-ui/elements#components`
- Source: `libs/elements/skills/components/SKILL.md`
- Description: Load the TYUI component guidance set for choosing and using shipped custom elements and layout primitives.

### Intent

Use `@toyu-ui/elements#components` when an agent or developer needs the complete shipped TYUI component guidance set before choosing controls or layout primitives.

### Selection Guidance

- Load this skill at the start of a TYUI UI task when the component choice is not known yet.
- Use the required component skills for exact intent, selection guidance, anti-patterns, and usage examples.
- Use `@toyu-ui/solid#setup` as the companion setup skill for Solid apps.
- Use `custom-elements.json` for exact attributes, events, slots, CSS parts, and CSS custom properties.

### Anti-Patterns

- Do not duplicate component selection rules in app docs when this aggregate skill can load the versioned component guidance.
- Do not treat this skill as an API reference; use the manifest for exact API facts.
- Do not load every component at runtime just because every component skill was loaded for agent guidance.

### Correct Usage

```sh
yarn dlx @tanstack/intent@latest load @toyu-ui/elements#components
```

## tyui-container

- Skill: `@toyu-ui/elements#container`
- Source: `libs/elements/skills/container/SKILL.md`
- Description: Use tyui-container to constrain page or section width with named rails and tokenized gutters.

### Intent

Use `tyui-container` to create a page or section rail that controls maximum inline size and horizontal gutter.

### Selection Guidance

- Use Container for page shells, section rails, dashboard content bounds, and full-width page regions.
- Use Center for readable single-column content.
- Use Frame for aspect-ratio media.
- Use `bleed` only when content intentionally reaches the container edge.

### Anti-Patterns

- Do not use Container to set a button or input width.
- Do not use card padding as page gutters.
- Do not nest containers without a named rail change.

### Correct Usage

```html
<tyui-container size="wide" gutter="page">
  <tyui-grid min-item-size="18rem" gap="4"></tyui-grid>
</tyui-container>
```

## tyui-flex

- Skill: `@toyu-ui/elements#flex`
- Source: `libs/elements/skills/flex/SKILL.md`
- Description: Use tyui-flex for one-axis sibling composition with tokenized direction, alignment, wrapping, and gap.

### Intent

Use `tyui-flex` when sibling content follows one axis and the parent owns direction, wrapping, alignment, justification, and gap.

### Selection Guidance

- Use Flex for row or column composition of siblings.
- Use Flex when the design may switch direction or wrapping through attributes.
- Use Cluster for wrap-first action rows, chips, and tags.
- Use Grid for repeated peer cards or panels.
- Use native block flow for simple prose.

### Anti-Patterns

- Do not use Flex to create data tables or two-dimensional card grids.
- Do not force every child to `flex: 1` unless equal distribution is the container intent.
- Do not use visual reverse direction to fix incorrect DOM reading order.

### Correct Usage

```html
<tyui-flex direction="column" gap="3">
  <h2>Settings</h2>
  <tyui-input label="Name"></tyui-input>
  <tyui-button appearance="primary">Save</tyui-button>
</tyui-flex>
```

## tyui-frame

- Skill: `@toyu-ui/elements#frame`
- Source: `libs/elements/skills/frame/SKILL.md`
- Description: Use tyui-frame to reserve aspect ratio for media, previews, charts, thumbnails, and embeds.

### Intent

Use `tyui-frame` to reserve a stable aspect ratio for one primary child while the parent owns width.

### Selection Guidance

- Use Frame for images, video, canvas, iframe embeds, charts, thumbnails, and preview surfaces.
- Use natural block flow for text-heavy cards.
- Use Grid for collections of framed peers.
- Apply `fit` and `position` only when the direct child is replaced media.

### Anti-Patterns

- Do not place full forms or complex scrollable interactive regions inside Frame.
- Do not use Frame to crop text cards.
- Do not expect `object-fit` to affect non-replaced elements.

### Correct Usage

```html
<tyui-frame ratio="16/9" fit="cover">
  <img src="/preview.jpg" alt="Project preview" />
</tyui-frame>
```

## tyui-grid

- Skill: `@toyu-ui/elements#grid`
- Source: `libs/elements/skills/grid/SKILL.md`
- Description: Use tyui-grid for responsive peer-card and panel collections that auto-fit columns from container width.

### Intent

Use `tyui-grid` for repeated peer items that should form responsive columns from the container width and a minimum item size.

### Selection Guidance

- Use Grid for cards, tiles, metric panels, image groups, and settings panels.
- Use Cluster for compact wrapping action rows and tags.
- Use Flex for one-axis composition.
- Use table or data-grid components for tabular data with row and column relationships.

### Anti-Patterns

- Do not use Grid for data tables or keyboard-navigable ARIA grids.
- Do not use dense visual reordering when DOM order must match reading order.
- Do not calculate columns in JavaScript.

### Correct Usage

```html
<tyui-grid min-item-size="14rem" gap="4">
  <section>Alpha</section>
  <section>Beta</section>
  <section>Gamma</section>
</tyui-grid>
```

## tyui-input

- Skill: `@toyu-ui/elements#input`
- Source: `libs/elements/skills/input/SKILL.md`
- Description: Use and integrate the tyui-input custom element for accessible single-line text entry without confusing base component features with design-system variants.

### Intent

Use `tyui-input` for short single-line text entry such as names, email addresses,
search terms, telephone numbers, URLs, passwords, and numeric text.

### Selection Guidance

- Use Input for short single-line text entry.
- Use a textarea component, when available, for multiline text.
- Use Select, Combobox, RadioGroup, or Checkbox when the user chooses from known options.
- Use Field or a visible native label to provide the accessible label.
- Keep design-system-specific visuals in the design layer rather than adding base appearances.

### Anti-Patterns

- Do not rely on placeholder as the only label.
- Do not put buttons, links, or other focusable controls in content slots.
- Do not invent unsupported input appearances; use design-layer classes for

### Correct Usage

```html
<label for="email">Email</label>
<tyui-input id="email" name="email" type="email" required></tyui-input>
```

## tyui-radio

- Skill: `@toyu-ui/elements#radio`
- Source: `libs/elements/skills/radio/SKILL.md`
- Description: Use tyui-radio only as a radio option coordinated by tyui-radio-group, with native input focus and group-owned selection.

### Intent

Use `tyui-radio` to represent one option inside `tyui-radio-group`.

### Selection Guidance

- Use Radio only as an option inside RadioGroup.
- Use RadioGroup for the field label, name, value ownership, and keyboard coordination.
- Use Checkbox for unrelated independent boolean choices.
- Use Select or Combobox for larger option sets.

### Anti-Patterns

- Do not use standalone radio buttons for unrelated boolean choices.
- Do not manage checked state independently when inside a group.
- Do not replace native radio keyboard behavior with app-level key handlers.

### Correct Usage

```html
<tyui-radio-group label="Plan" name="plan" value="team">
  <tyui-radio value="personal">Personal</tyui-radio>
  <tyui-radio value="team">Team</tyui-radio>
</tyui-radio-group>
```

## tyui-radio-group

- Skill: `@toyu-ui/elements#radio-group`
- Source: `libs/elements/skills/radio-group/SKILL.md`
- Description: Use and integrate tyui-radio-group for mutually exclusive choices, including value ownership, keyboard behavior, and form participation.

### Intent

Use `tyui-radio-group` when the user must choose exactly one option from a small
set.

### Selection Guidance

- Use RadioGroup when the user chooses exactly one option from a small set.
- Use Checkbox for independent boolean choices or multi-select checklists.
- Use Select or Combobox for long option lists, async options, or compact forms.
- Keep only `tyui-radio` choices in the default slot.

### Anti-Patterns

- Do not place non-radio interactive elements in the default slot.
- Do not use radio group for multi-select choices.
- Do not create custom roving tabindex outside the group.

### Correct Usage

```html
<tyui-radio-group label="Notification frequency" name="frequency" required>
  <tyui-radio value="daily">Daily</tyui-radio>
  <tyui-radio value="weekly">Weekly</tyui-radio>
  <tyui-radio value="never">Never</tyui-radio>
</tyui-radio-group>
```

## tyui-sidebar

- Skill: `@toyu-ui/elements#sidebar`
- Source: `libs/elements/skills/sidebar/SKILL.md`
- Description: Use tyui-sidebar for two-region fixed-plus-fluid layouts such as filters beside results or navigation beside content.

### Intent

Use `tyui-sidebar` for a two-region layout where one child has a preferred fixed size and the other child takes remaining space.

### Selection Guidance

- Use Sidebar for filters beside results, navigation beside content, metadata beside detail, or media beside body.
- Use Grid when regions are peer cards or equal columns.
- Use Container for page rails.
- Use dialog or drawer components for overlay side panels.

### Anti-Patterns

- Do not add more than two direct children.
- Do not use Sidebar for overlay drawer behavior.
- Do not use `side="end"` to fix an incorrect DOM reading order.

### Correct Usage

```html
<tyui-sidebar side-size="16rem" content-min="55%" gap="4">
  <aside>Filters</aside>
  <main>Results</main>
</tyui-sidebar>
```

## TYUI Solid button

- Skill: `@toyu-ui/solid#button`
- Source: `libs/solid/skills/button/SKILL.md`
- Description: Solid-facing alias for tyui-button guidance.

### Intent

Use `@toyu-ui/solid#button` to load Solid setup plus the authoritative `@toyu-ui/elements#button` guidance.

### Selection Guidance

- Use the `Button` wrapper for ordinary Solid app code.
- Use raw `tyui-button` only when direct custom-element access is needed.

### Anti-Patterns

- Do not duplicate button behavior in a Solid wrapper.

### Correct Usage

```tsx
import { Button } from '@toyu-ui/solid';

<Button appearance="primary">Save</Button>;
```

## TYUI Solid center

- Skill: `@toyu-ui/solid#center`
- Source: `libs/solid/skills/center/SKILL.md`
- Description: Solid-facing alias for tyui-center guidance.

### Intent

Use `@toyu-ui/solid#center` to load Solid setup plus the authoritative `@toyu-ui/elements#center` guidance.

### Selection Guidance

- Use raw `tyui-center` in TSX for readable centered regions.
- Register it through `@toyu-ui/solid/define/center`.

### Anti-Patterns

- Do not use Center as a card or surface.

### Correct Usage

```tsx
import '@toyu-ui/solid/jsx';
import { defineTyuiCenter } from '@toyu-ui/solid/define/center';

defineTyuiCenter();

<tyui-center measure="60ch" gutter="page" />;
```

## TYUI Solid checkbox

- Skill: `@toyu-ui/solid#checkbox`
- Source: `libs/solid/skills/checkbox/SKILL.md`
- Description: Solid-facing alias for tyui-checkbox guidance.

### Intent

Use `@toyu-ui/solid#checkbox` to load Solid setup plus the authoritative `@toyu-ui/elements#checkbox` guidance.

### Selection Guidance

- Use Checkbox for independent boolean choices in Solid.
- Use RadioGroup and Radio for mutually exclusive choices.

### Anti-Patterns

- Do not use Checkbox as a command button.

### Correct Usage

```tsx
import { Checkbox } from '@toyu-ui/solid';

<Checkbox name="updates" value="yes">
  Send updates
</Checkbox>;
```

## TYUI Solid cluster

- Skill: `@toyu-ui/solid#cluster`
- Source: `libs/solid/skills/cluster/SKILL.md`
- Description: Solid-facing alias for tyui-cluster guidance.

### Intent

Use `@toyu-ui/solid#cluster` to load Solid setup plus the authoritative `@toyu-ui/elements#cluster` guidance.

### Selection Guidance

- Use raw `tyui-cluster` in TSX for wrapping action rows and tags.
- Register it through `@toyu-ui/solid/define/cluster`.

### Anti-Patterns

- Do not use Cluster for table or data-grid semantics.

### Correct Usage

```tsx
import '@toyu-ui/solid/jsx';
import { defineTyuiCluster } from '@toyu-ui/solid/define/cluster';

defineTyuiCluster();

<tyui-cluster gap="2" />;
```

## TYUI Solid components

- Skill: `@toyu-ui/solid#components`
- Source: `libs/solid/skills/components/SKILL.md`
- Description: Load the Solid setup guidance and the complete TYUI component guidance set for Solid apps.

### Intent

Use `@toyu-ui/solid#components` when a Solid app needs the full TYUI component selection and usage guidance.

### Selection Guidance

- Start Solid app guidance from this skill when component choice is not known.
- Use `@toyu-ui/solid#setup` for Solid registration and JSX rules.
- Use required `@toyu-ui/elements#*` skills for component-specific intent and anti-patterns.
- Use `@toyu-ui/solid` exports and `@toyu-ui/solid/define/*` paths in app code.

### Anti-Patterns

- Do not ask Solid apps to install `@toyu-ui/define` or `@toyu-ui/elements` directly for normal use.
- Do not duplicate component guidance in Solid skills.

### Correct Usage

```sh
yarn dlx @tanstack/intent@latest load @toyu-ui/solid#components
```

## TYUI Solid container

- Skill: `@toyu-ui/solid#container`
- Source: `libs/solid/skills/container/SKILL.md`
- Description: Solid-facing alias for tyui-container guidance.

### Intent

Use `@toyu-ui/solid#container` to load Solid setup plus the authoritative `@toyu-ui/elements#container` guidance.

### Selection Guidance

- Use raw `tyui-container` in TSX for page or section rails.
- Register it through `@toyu-ui/solid/define/container`.

### Anti-Patterns

- Do not use Container to set individual control widths.

### Correct Usage

```tsx
import '@toyu-ui/solid/jsx';
import { defineTyuiContainer } from '@toyu-ui/solid/define/container';

defineTyuiContainer();

<tyui-container size="wide" gutter="page" />;
```

## TYUI Solid flex

- Skill: `@toyu-ui/solid#flex`
- Source: `libs/solid/skills/flex/SKILL.md`
- Description: Solid-facing alias for tyui-flex guidance.

### Intent

Use `@toyu-ui/solid#flex` to load Solid setup plus the authoritative `@toyu-ui/elements#flex` guidance.

### Selection Guidance

- Use raw `tyui-flex` in TSX for one-axis composition.
- Register it through `@toyu-ui/solid/define/flex`.

### Anti-Patterns

- Do not import registration helpers from `@toyu-ui/define` in normal Solid app code.

### Correct Usage

```tsx
import '@toyu-ui/solid/jsx';
import { defineTyuiFlex } from '@toyu-ui/solid/define/flex';

defineTyuiFlex();

<tyui-flex direction="column" gap="3" />;
```

## TYUI Solid frame

- Skill: `@toyu-ui/solid#frame`
- Source: `libs/solid/skills/frame/SKILL.md`
- Description: Solid-facing alias for tyui-frame guidance.

### Intent

Use `@toyu-ui/solid#frame` to load Solid setup plus the authoritative `@toyu-ui/elements#frame` guidance.

### Selection Guidance

- Use raw `tyui-frame` in TSX for aspect-ratio media and previews.
- Register it through `@toyu-ui/solid/define/frame`.

### Anti-Patterns

- Do not put complex forms inside Frame.

### Correct Usage

```tsx
import '@toyu-ui/solid/jsx';
import { defineTyuiFrame } from '@toyu-ui/solid/define/frame';

defineTyuiFrame();

<tyui-frame ratio="16/9" fit="cover" />;
```

## TYUI Solid grid

- Skill: `@toyu-ui/solid#grid`
- Source: `libs/solid/skills/grid/SKILL.md`
- Description: Solid-facing alias for tyui-grid guidance.

### Intent

Use `@toyu-ui/solid#grid` to load Solid setup plus the authoritative `@toyu-ui/elements#grid` guidance.

### Selection Guidance

- Use raw `tyui-grid` in TSX for responsive peer cards and panels.
- Register it through `@toyu-ui/solid/define/grid`.

### Anti-Patterns

- Do not use Grid for tabular data.

### Correct Usage

```tsx
import '@toyu-ui/solid/jsx';
import { defineTyuiGrid } from '@toyu-ui/solid/define/grid';

defineTyuiGrid();

<tyui-grid min-item-size="16rem" gap="4" />;
```

## TYUI Solid input

- Skill: `@toyu-ui/solid#input`
- Source: `libs/solid/skills/input/SKILL.md`
- Description: Solid-facing alias for tyui-input guidance.

### Intent

Use `@toyu-ui/solid#input` to load Solid setup plus the authoritative `@toyu-ui/elements#input` guidance.

### Selection Guidance

- Use the `Input` wrapper for single-line text entry in Solid.
- Use `event.detail.value` from typed `onInput` handlers.

### Anti-Patterns

- Do not rely on placeholder text as the only label.

### Correct Usage

```tsx
import { Input } from '@toyu-ui/solid';

<Input name="email" type="email" required>
  Email
</Input>;
```

## TYUI Solid radio

- Skill: `@toyu-ui/solid#radio`
- Source: `libs/solid/skills/radio/SKILL.md`
- Description: Solid-facing alias for tyui-radio guidance.

### Intent

Use `@toyu-ui/solid#radio` to load Solid setup plus the authoritative `@toyu-ui/elements#radio` guidance.

### Selection Guidance

- Use Radio only inside RadioGroup.
- Use Checkbox for independent boolean choices.

### Anti-Patterns

- Do not manage Radio checked state outside the group.

### Correct Usage

```tsx
import { Radio, RadioGroup } from '@toyu-ui/solid';

<RadioGroup label="Plan" name="plan">
  <Radio value="team">Team</Radio>
</RadioGroup>;
```

## TYUI Solid radio group

- Skill: `@toyu-ui/solid#radio-group`
- Source: `libs/solid/skills/radio-group/SKILL.md`
- Description: Solid-facing alias for tyui-radio-group guidance.

### Intent

Use `@toyu-ui/solid#radio-group` to load Solid setup plus the authoritative `@toyu-ui/elements#radio-group` guidance.

### Selection Guidance

- Use RadioGroup when the user chooses one option from a small set.
- Use `event.detail.value` from typed change handlers.

### Anti-Patterns

- Do not put non-radio controls in the default slot.

### Correct Usage

```tsx
import { Radio, RadioGroup } from '@toyu-ui/solid';

<RadioGroup label="Frequency" name="frequency">
  <Radio value="daily">Daily</Radio>
  <Radio value="weekly">Weekly</Radio>
</RadioGroup>;
```

## TYUI Solid setup

- Skill: `@toyu-ui/solid#setup`
- Source: `libs/solid/skills/setup/SKILL.md`
- Description: Set up TYUI custom elements for Solid, including registration, JSX typing, wrappers, and typed custom events.

### Intent

Use `@toyu-ui/solid` when a Solid app wants typed JSX ergonomics for TYUI custom
elements. The implementation remains in `@toyu-ui/elements`.

### Anti-Patterns

- Do not reimplement TYUI behavior in Solid wrappers.
- Do not use Solid signals inside `@toyu-ui/elements`.
- Do not register all elements in a library module that should tree-shake.

## TYUI Solid sidebar

- Skill: `@toyu-ui/solid#sidebar`
- Source: `libs/solid/skills/sidebar/SKILL.md`
- Description: Solid-facing alias for tyui-sidebar guidance.

### Intent

Use `@toyu-ui/solid#sidebar` to load Solid setup plus the authoritative `@toyu-ui/elements#sidebar` guidance.

### Selection Guidance

- Use raw `tyui-sidebar` in TSX for two-region fixed-plus-fluid layout.
- Register it through `@toyu-ui/solid/define/sidebar`.

### Anti-Patterns

- Do not use Sidebar for overlay drawer behavior.

### Correct Usage

```tsx
import '@toyu-ui/solid/jsx';
import { defineTyuiSidebar } from '@toyu-ui/solid/define/sidebar';

defineTyuiSidebar();

<tyui-sidebar side-size="16rem" content-min="55%" />;
```
