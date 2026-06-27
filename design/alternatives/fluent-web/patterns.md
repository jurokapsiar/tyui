# Fluent Web Patterns

## Layout

Use flex for app bars, toolbars, command rows, inline input/action groups, and button clusters. Use grid for settings pages, card lists, dashboard summaries, and multi-column forms.

Common gaps:

- 4px for icon/text micro-spacing.
- 8px for toolbar controls.
- 12px for compact form rows.
- 16px for cards and panel interiors.
- 24px for page-level section separation.

## Button Usage

Use one `appearance="primary"` button per bounded task. Use default buttons for normal actions, `subtle` buttons for toolbars, and `transparent` buttons for low-emphasis row actions.

Prefer `shape="rounded"` for text buttons. Use `shape="circular"` for icon-only buttons in toolbars. Use `shape="square"` only in grid/table editing surfaces where flush alignment matters.

## Input Usage

Use `appearance="outline"` by default. Use `.ty-fluent-input-underline` where density matters more than visual containment. Use `filled-lighter` for search in app chrome. Use `filled-darker` only on tinted surfaces. Every Fluent input variant shows the same brand underline that expands from center on focus.

Inputs should be wrapped by app-level field composition that provides a visible label, description, and validation message.

## Fluent App Shell Example

```html
<main data-design-system="fluent-web">
  <section class="ty-fluent-panel" data-elevation="raised">
    <div class="ty-fluent-toolbar">
      <span class="ty-fluent-title">Team settings</span>
      <tyui-button appearance="primary">Save</tyui-button>
      <tyui-button appearance="subtle">Cancel</tyui-button>
    </div>
    <div class="ty-fluent-form-grid">
      <tyui-input placeholder="Team name"></tyui-input>
      <tyui-input type="email" placeholder="Owner email"></tyui-input>
    </div>
  </section>
</main>
```
