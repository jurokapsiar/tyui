---
name: Fluent Web
source:
  storybook: https://storybooks.fluentui.dev/react/
  inspectedStories:
    - components-button-button--appearance
    - components-button-button--shape
    - components-button-button--size
    - components-button-button--disabled
    - components-input--appearance
    - components-input--content-before-after
    - components-input--size
    - components-input--type
    - concepts-developer-accessibility-components-button--docs
    - concepts-developer-accessibility-components-input--docs
  packageSignals:
    - '@fluentui/tokens exports webLightTheme, webDarkTheme, teamsLightTheme, and tokens'
colors:
  neutral-background-1: '#ffffff'
  neutral-background-2: '#fafafa'
  neutral-background-3: '#f5f5f5'
  neutral-background-4: '#f0f0f0'
  neutral-background-disabled: '#f0f0f0'
  neutral-foreground-1: '#242424'
  neutral-foreground-2: '#424242'
  neutral-foreground-3: '#616161'
  neutral-foreground-disabled: '#bdbdbd'
  neutral-stroke-1: '#d1d1d1'
  neutral-stroke-1-hover: '#c7c7c7'
  neutral-stroke-1-pressed: '#b3b3b3'
  neutral-stroke-disabled: '#e0e0e0'
  neutral-fill-stealth: transparent
  neutral-fill-stealth-hover: '#f5f5f5'
  neutral-fill-stealth-pressed: '#e0e0e0'
  brand-background: '#0f6cbd'
  brand-background-hover: '#115ea3'
  brand-background-pressed: '#0f548c'
  brand-foreground: '#0f6cbd'
  brand-foreground-hover: '#115ea3'
  brand-foreground-on-brand: '#ffffff'
  danger-foreground: '#c50f1f'
  danger-background: '#fdf3f4'
typography:
  caption:
    fontFamily: Segoe UI
    fontSize: 12px
    fontWeight: '400'
    lineHeight: 16px
  body:
    fontFamily: Segoe UI
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 20px
  body-strong:
    fontFamily: Segoe UI
    fontSize: 14px
    fontWeight: '600'
    lineHeight: 20px
  subtitle:
    fontFamily: Segoe UI
    fontSize: 20px
    fontWeight: '600'
    lineHeight: 28px
  title:
    fontFamily: Segoe UI
    fontSize: 28px
    fontWeight: '600'
    lineHeight: 36px
rounded:
  none: 0
  small: 2px
  medium: 4px
  large: 6px
  xlarge: 8px
  circular: 9999px
spacing:
  unit: 4px
  xxs: 2px
  xs: 4px
  s: 8px
  m: 12px
  l: 16px
  xl: 20px
  xxl: 24px
components:
  button-secondary:
    backgroundColor: '{colors.neutral-background-1}'
    textColor: '{colors.neutral-foreground-1}'
    borderColor: '{colors.neutral-stroke-1}'
    rounded: '{rounded.medium}'
    height: 32px
    padding: 0 12px
    typography: '{typography.body-strong}'
  button-primary:
    backgroundColor: '{colors.brand-background}'
    textColor: '{colors.brand-foreground-on-brand}'
    borderColor: transparent
    rounded: '{rounded.medium}'
    height: 32px
    padding: 0 12px
    typography: '{typography.body-strong}'
  button-subtle:
    backgroundColor: transparent
    textColor: '{colors.neutral-foreground-2}'
    borderColor: transparent
    rounded: '{rounded.medium}'
  input-outline:
    backgroundColor: '{colors.neutral-background-1}'
    textColor: '{colors.neutral-foreground-1}'
    borderColor: '{colors.neutral-stroke-1}'
    focusBorderColor: '{colors.brand-background}'
    focusMotion: underline expands from center over 120ms
    rounded: '{rounded.medium}'
    height: 32px
    padding: 0 12px
    typography: '{typography.body}'
  input-underline:
    backgroundColor: transparent
    textColor: '{colors.neutral-foreground-1}'
    borderColor: '{colors.neutral-stroke-1}'
    focusBorderColor: '{colors.brand-background}'
    focusMotion: underline expands from center over 120ms
    rounded: '{rounded.none}'
    height: 32px
    padding: 0 12px
    typography: '{typography.body}'
  app-card:
    backgroundColor: '{colors.neutral-background-1}'
    borderColor: '{colors.neutral-stroke-1}'
    rounded: '{rounded.large}'
    padding: 16px
---

# Fluent Web

## Design Intent

Fluent Web is a practical application interface style based on the Fluent UI React v9 component surface. It is quiet, dense, and task-oriented: controls should feel native to business apps, documentation tools, settings panels, and collaboration workflows.

The design prioritizes clarity over decoration. Most surfaces are white or near-white, borders are subtle, and motion is limited to short state feedback. The strongest visual signal is the brand-blue primary action; everything else uses neutral foreground, neutral stroke, and restrained background changes.

## Source Observations

The Fluent React Storybook exposes Button stories for appearance, shape, icon, size, disabled, loading, and long text. It exposes Input stories for appearance, content before/after, disabled, inline, placeholder, size, type, uncontrolled, and controlled usage. Accessibility docs exist for both Button and Input.

This design alternative maps those public concepts onto TYUI's existing Button and Input specs:

- Button appearances map to `default`, `primary`, `outline`, `subtle`, and `transparent`.
- Button shapes map to `rounded`, `circular`, and `square`.
- Button sizes map to `small`, `medium`, and `large`.
- Input appearances map to TYUI's base `outline`, `filled-darker`, and `filled-lighter` appearances.
- Every Fluent input appearance shows a brand underline on focus. The underline expands from the center over the feedback duration and is implemented by the generated layer through the documented `control` part.
- Fluent's always-underline resting input is a design-system variant, not a base component feature. Apply it with the Fluent-owned `.ty-fluent-input-underline` class on `tyui-input`; the generated layer styles the documented `control` part.
- Input slots map to `contentBefore` and `contentAfter`.

## Color

Use a light-first neutral palette. `neutral-background-1` is the main page and panel surface. `neutral-background-2` and `neutral-background-3` create quiet distinction between app chrome, cards, and rows. Brand blue is reserved for primary actions and selected/emphasized states.

Avoid large saturated surfaces. Brand color should usually appear as a primary button, focus indicator, link, selected rail, or compact status mark.

## Typography

Use `Segoe UI` first, followed by platform UI fonts. The default control text is 14px with a 20px line height. Button labels use the same size with semibold weight. Headings are useful but should stay proportionate to app chrome; do not create oversized marketing-style typography.

## Layout

The preferred app layout is compact and scannable:

- Use flex for toolbars, command rows, form rows, and inline groups.
- Use grid for dashboards, setting groups, and repeated cards.
- Keep cards shallow, with 6px radius and 16px padding.
- Use 4px as the base spacing unit, with common gaps at 8px, 12px, and 16px.

## Shape & Elevation

Controls use a 4px default radius. Cards use 6px. Circular buttons are reserved for icon-only commands or compact toolbar actions. Avoid heavy shadows; Fluent Web primarily separates layers with borders and background contrast. Use a small shadow only for elevated flyouts or app-owned preview panels.

## Component Guidance

### Button

Use `appearance="primary"` for one dominant action per local task. Use default/secondary buttons for ordinary commands. Use `outline` when the button must sit on a colored or tinted surface. Use `subtle` or `transparent` in toolbars and repeated row actions.

Long labels should remain readable without truncation by default. Icon-only buttons require accessible names.

### Input

Use `appearance="outline"` for standard form fields. Use `.ty-fluent-input-underline` for dense settings panels or table-like editing. Use `filled-lighter` for search fields in app chrome and `filled-darker` for fields on tinted panels. All variants use the same focused underline motion.

Inputs need visible labels or an accessible name. Placeholders are examples, not labels.

## Accessibility

Retain strong focus indicators with a brand-blue underline for Fluent inputs and an inner contrast ring or outline where needed. Disabled controls must not rely on opacity alone. Error/invalid states use red border or underline plus text guidance at the app level. Forced-colors mode must fall back to system colors.
