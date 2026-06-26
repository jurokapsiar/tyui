The design system supplies constraints and relationships; content and available space determine the final layout.

So instead of a product theme defining fixed button heights, toolbar widths, or breakpoint-specific layouts, it defines things like spacing, minimum target size, preferred proportions, and wrapping thresholds. The browser then resolves the actual size.

Flexbox is especially suitable because its sizing algorithm starts from the items’ intrinsic sizes and then distributes available space.

1. Tokens should define constraints, not fixed geometry

Avoid this:

--ds-button-width: 120px;
--ds-button-height: 32px;

Prefer:

--ds-control-min-block-size: 2rem;
--ds-control-padding-inline: 0.75rem;
--ds-control-padding-block: 0.375rem;
--ds-control-max-inline-size: 100%;

Then the component adapts to:

translated text;
larger fonts;
user zoom;
different icons;
product density;
available container width.
[part='control'] {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: var(--ds-control-gap);

  min-block-size: var(--ds-control-min-block-size);
  max-inline-size: 100%;
  padding:
    var(--ds-control-padding-block)
    var(--ds-control-padding-inline);
}

The token system sets the visual character, but content remains authoritative.

2. Component internals should be intrinsically sized

A button should normally size itself from its icon, label, gap, border, and padding:

[part='control'] {
  display: inline-flex;
  inline-size: fit-content;
  min-inline-size: min-content;
  max-inline-size: 100%;
}

Usually you do not even need to set inline-size; an inline-flex control naturally follows its content.

For the label:

[part='label'] {
  min-inline-size: 0;
  overflow-wrap: anywhere;
}

min-inline-size: 0 is important when a flex child must be allowed to shrink. Otherwise, its automatic minimum size can prevent the component from fitting inside a narrow container.

3. Expose flex behaviour as semantic layout tokens

The product theme can define how controls behave in composition:

:root {
  --ds-control-grow: 0;
  --ds-control-shrink: 1;
  --ds-control-basis: auto;
}
:host {
  flex:
    var(--ds-control-grow)
    var(--ds-control-shrink)
    var(--ds-control-basis);
}

A mobile-oriented product could change this:

[data-design-system='mobile'] {
  --ds-control-grow: 1;
  --ds-control-basis: 100%;
}

But use this sparingly. In most cases, the parent layout—not the child component—should decide whether the component grows.

A better division is:

ds-button {
  /* Own intrinsic appearance */
}

ds-toolbar {
  /* Own arrangement of buttons */
}
4. Build headless layout primitives alongside headless controls

The component library should include a small number of layout components or CSS primitives:

Stack
Cluster
Sidebar
Grid
Switcher
Center
Frame

This is the model popularized by intrinsic-layout approaches such as Every Layout: use browser algorithms and composable constraints instead of application-specific breakpoints and magic numbers.

Cluster

For toolbars, action groups, tags, and button rows:

.ds-cluster {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: var(--ds-cluster-gap, var(--ds-space-2));
}
<div class="ds-cluster">
  <ds-button>Save</ds-button>
  <ds-button>Cancel</ds-button>
  <ds-button>More options</ds-button>
</div>

The items wrap when they no longer fit. No viewport breakpoint is needed. Flex wrapping naturally uses the items’ intrinsic sizes.

Stack
.ds-stack {
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  gap: var(--ds-stack-gap, var(--ds-space-3));
}
Intrinsic grid
.ds-grid {
  display: grid;
  grid-template-columns:
    repeat(
      auto-fit,
      minmax(
        min(100%, var(--ds-grid-min-item-size, 16rem)),
        1fr
      )
    );
  gap: var(--ds-grid-gap, var(--ds-space-4));
}

This responds to the container, content, and configured minimum card size rather than a hardcoded screen width.

5. Use container queries for true component responsiveness

Intrinsic sizing should handle most cases. Container queries are useful when a component genuinely needs a structural mode change.

ds-toolbar {
  container-type: inline-size;
}
@container (inline-size < 28rem) {
  [part='actions'] {
    flex-direction: column;
    align-items: stretch;
  }

  [part='actions'] > ds-button {
    inline-size: 100%;
  }
}

This is superior to a viewport media query because the same toolbar can behave correctly in:

a full page;
a sidebar;
a dialog;
a dashboard tile.

The threshold can itself be a product token conceptually, although custom properties cannot currently be used directly in container-query conditions. Your build-time theme generator can emit the relevant query value.

6. Density should modify spacing, not override intrinsic sizing

A theme can make controls feel like Windows, macOS, touch UI, or a dense enterprise system by adjusting padding, gaps, radius, typography, and minimum target size.

[data-density='compact'] {
  --ds-control-padding-inline: 0.5rem;
  --ds-control-padding-block: 0.25rem;
  --ds-control-gap: 0.25rem;
  --ds-control-min-block-size: 1.75rem;
}

[data-density='touch'] {
  --ds-control-padding-inline: 1rem;
  --ds-control-padding-block: 0.625rem;
  --ds-control-gap: 0.5rem;
  --ds-control-min-block-size: 2.75rem;
}

The actual height can still grow if:

text wraps;
the user increases font size;
an icon is larger;
the label occupies two lines.

Avoid:

block-size: var(--ds-control-height);

Prefer:

min-block-size: var(--ds-control-min-block-size);
7. Use clamp() for fluid but bounded values

Some design-system values can adapt continuously:

:root {
  --ds-page-gutter:
    clamp(1rem, 0.5rem + 2vi, 3rem);

  --ds-section-gap:
    clamp(1.5rem, 1rem + 2vi, 4rem);

  --ds-heading-size:
    clamp(1.5rem, 1.2rem + 1.2vi, 2.5rem);
}

This gives the browser a minimum, preferred relationship, and maximum instead of a sequence of breakpoint overrides. clamp() is a common tool for intrinsic and contextual spacing.

For reusable embedded components, prefer container-relative units such as cqi over viewport units where supported:

--ds-card-padding: clamp(0.75rem, 4cqi, 1.5rem);
8. Separate component sizing from composition sizing

This distinction is critical.

Component owns
internal padding;
icon-label gap;
minimum interaction target;
label wrapping;
intrinsic minimum and preferred size;
internal alignment.
Parent layout owns
whether the component stretches;
how siblings divide space;
wrapping;
ordering;
available width;
horizontal versus vertical composition.

For example, the button should not globally contain:

:host {
  flex: 1;
}

Instead, a button group decides:

ds-button-group[distribution='equal'] > ds-button {
  flex: 1 1 0;
}
ds-button-group[distribution='content'] > ds-button {
  flex: 0 1 auto;
}

This keeps the component reusable in unrelated contexts.

9. Use logical dimensions everywhere

To keep the design system adaptable across writing directions:

padding-inline: var(--ds-control-padding-inline);
padding-block: var(--ds-control-padding-block);

margin-inline-start: var(--ds-space-2);

min-inline-size: 0;
max-inline-size: 100%;

Avoid baking left, right, width, and height into low-level design tokens unless the concept is genuinely physical.

This also makes platform themes less brittle.

10. Let slotted content participate naturally

A custom element should not assume that its label is a fixed string.

<ds-button>
  <ds-icon slot="start"></ds-icon>
  A very long translated action label
</ds-button>

Internal layout:

[part='control'] {
  display: inline-flex;
  align-items: center;
  gap: var(--ds-button-gap);
}

[part='content'] {
  min-inline-size: 0;
}

::slotted([slot='start']),
::slotted([slot='end']) {
  flex: none;
}

::slotted(:not([slot])) {
  min-inline-size: 0;
}

Icons remain stable; text is allowed to shrink or wrap.

11. Intrinsic variants should express policy

Rather than components exposing pixel sizes:

<ds-button width="140" height="32">

Expose layout intent:

<ds-button fit="content">
<ds-button fit="container">
<ds-button nowrap>

Corresponding CSS:

:host([fit='content']) {
  inline-size: fit-content;
}

:host([fit='container']) {
  display: block;
  inline-size: 100%;
}

:host([fit='container']) [part='control'] {
  inline-size: 100%;
}

:host([nowrap]) [part='label'] {
  white-space: nowrap;
}

The product design system can set defaults, but application composition can select the policy.

12. A practical FAST-like intrinsic token model

I would divide the token API like this:

:root {
  /* Visual tokens */
  --ds-control-radius: 0.375rem;
  --ds-control-border-width: 1px;

  /* Intrinsic internal sizing */
  --ds-control-padding-inline: 0.75rem;
  --ds-control-padding-block: 0.375rem;
  --ds-control-gap: 0.5rem;
  --ds-control-min-block-size: 2rem;

  /* Content constraints */
  --ds-control-min-inline-size: min-content;
  --ds-control-max-inline-size: 100%;

  /* Composition */
  --ds-layout-gap: 1rem;
  --ds-layout-min-column-size: 16rem;
  --ds-layout-sidebar-size: 18rem;
  --ds-layout-content-measure: 65ch;
}

Then a product theme changes the parameters:

[data-design-system='macos'] {
  --ds-control-radius: 0.5rem;
  --ds-control-padding-inline: 0.875rem;
  --ds-control-padding-block: 0.3125rem;
  --ds-control-min-block-size: 2rem;
}

[data-design-system='windows'] {
  --ds-control-radius: 0.25rem;
  --ds-control-padding-inline: 0.75rem;
  --ds-control-padding-block: 0.375rem;
  --ds-control-min-block-size: 2rem;
}

[data-design-system='touch'] {
  --ds-control-radius: 0.75rem;
  --ds-control-padding-inline: 1rem;
  --ds-control-padding-block: 0.625rem;
  --ds-control-min-block-size: 2.75rem;
}

The theme changes the design language, while intrinsic layout keeps it resilient.

The governing rule

Treat every component and layout as a negotiation among:

content’s intrinsic size
+ design-system constraints
+ available container space
+ user preferences
= final used size

The product should define the bounds and relationships, not the final pixels.

That gives you a FAST-like adaptive visual system without turning the design tokens into a rigid geometry table—and it keeps layout changes almost entirely inside CSS, with no Solid rerenders or JavaScript measurement loops.