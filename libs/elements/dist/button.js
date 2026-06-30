const i = new CSSStyleSheet();
i.replaceSync(`
  @layer ty.component-base {
    :host {
      display: inline-block;
      color: inherit;
      font: inherit;
    }

    [part='control'] {
      appearance: none;
      box-sizing: border-box;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      gap: var(--ty-button-gap, var(--ty-control-gap, 0.5rem));
      min-block-size: var(--ty-button-min-block-size, var(--ty-control-min-block-size, 2rem));
      min-inline-size: var(--ty-button-min-inline-size, 6rem);
      padding:
        var(--ty-button-padding-block, var(--ty-control-padding-block, 0.375rem))
        var(--ty-button-padding-inline, var(--ty-control-padding-inline, 0.75rem));
      border:
        var(--ty-button-border-width, var(--ty-control-border-width, 1px))
        solid
        var(--ty-button-border-color, var(--ty-color-border, ButtonBorder));
      border-radius: var(--ty-button-radius, var(--ty-control-radius, 0.375rem));
      background: var(--ty-button-background, var(--ty-color-surface, ButtonFace));
      color: var(--ty-button-foreground, var(--ty-color-text, ButtonText));
      font-family: var(--ty-font-family, inherit);
      font-size: var(--ty-button-font-size, var(--ty-control-font-size, 0.875rem));
      font-weight: var(--ty-button-font-weight, var(--ty-font-weight-semibold, 600));
      line-height: var(--ty-button-line-height, 1.25rem);
      cursor: pointer;
      text-align: center;
      transition:
        background-color var(--ty-motion-feedback-duration, 120ms) var(--ty-motion-easing, ease),
        border-color var(--ty-motion-feedback-duration, 120ms) var(--ty-motion-easing, ease),
        color var(--ty-motion-feedback-duration, 120ms) var(--ty-motion-easing, ease),
        box-shadow var(--ty-motion-feedback-duration, 120ms) var(--ty-motion-easing, ease);
    }

    :host([size='small']) [part='control'] {
      --ty-button-min-block-size: 1.5rem;
      --ty-button-min-inline-size: 4rem;
      --ty-button-padding-block: 0.1875rem;
      --ty-button-padding-inline: var(--ty-space-2, 0.5rem);
      --ty-button-font-size: var(--ty-font-size-100, 0.75rem);
      --ty-button-font-weight: var(--ty-font-weight-regular, 400);
      --ty-button-line-height: 1rem;
      --_ty-button-icon-size: 1.25rem;
      --_ty-button-icon-gap: var(--ty-space-1, 0.25rem);
    }

    :host(:not([size='small']):not([size='large'])),
    :host([size='medium']) {
      --ty-button-min-block-size: 2rem;
      --ty-button-min-inline-size: 6rem;
      --ty-button-padding-block: 0.3125rem;
      --ty-button-padding-inline: var(--ty-space-3, 0.75rem);
      --ty-button-font-size: var(--ty-font-size-200, 0.875rem);
      --ty-button-font-weight: var(--ty-font-weight-semibold, 600);
      --ty-button-line-height: 1.25rem;
      --_ty-button-icon-size: 1.25rem;
      --_ty-button-icon-gap: var(--ty-space-2, 0.5rem);
    }

    :host([size='large']) [part='control'] {
      --ty-button-min-block-size: 2.5rem;
      --ty-button-min-inline-size: 6rem;
      --ty-button-padding-block: 0.5rem;
      --ty-button-padding-inline: var(--ty-space-4, 1rem);
      --ty-button-font-size: var(--ty-font-size-300, 1rem);
      --ty-button-font-weight: var(--ty-font-weight-semibold, 600);
      --ty-button-line-height: 1.375rem;
      --_ty-button-icon-size: 1.5rem;
      --_ty-button-icon-gap: var(--ty-space-2, 0.5rem);
    }

    :host([shape='rounded']) [part='control'] {
      --ty-button-radius: var(--ty-control-radius, var(--ty-radius-2, 0.5rem));
    }

    :host([shape='circular']) [part='control'] {
      --ty-button-radius: var(--ty-radius-pill, 9999px);
    }

    :host([shape='square']) [part='control'] {
      --ty-button-radius: var(--ty-radius-0, 0);
    }

    :host([appearance='default']) [part='control'],
    :host([appearance='secondary']) [part='control'],
    :host(:not([appearance])) [part='control'] {
      --ty-button-background: var(--ty-color-surface, ButtonFace);
      --ty-button-background-hover: var(--ty-color-surface-hover, ButtonFace);
      --ty-button-background-active: var(--ty-color-surface-pressed, ButtonFace);
      --ty-button-foreground: var(--ty-color-text, ButtonText);
      --ty-button-border-color: var(--ty-color-border, ButtonBorder);
      --ty-button-border-color-hover: var(--ty-color-border-strong, ButtonText);
    }

    :host([appearance='primary']) [part='control'] {
      --ty-button-background: var(--ty-color-accent, Highlight);
      --ty-button-background-hover: var(--ty-color-accent-hover, Highlight);
      --ty-button-background-active: var(--ty-color-accent-pressed, Highlight);
      --ty-button-foreground: var(--ty-color-on-accent, HighlightText);
      --ty-button-border-color: transparent;
      --ty-button-border-color-hover: transparent;
    }

    :host([appearance='outline']) [part='control'] {
      --ty-button-background: transparent;
      --ty-button-background-hover: var(--ty-color-surface-hover, ButtonFace);
      --ty-button-background-active: var(--ty-color-surface-pressed, ButtonFace);
      --ty-button-foreground: var(--ty-color-text, ButtonText);
      --ty-button-border-color: var(--ty-color-border-strong, ButtonText);
      --ty-button-border-color-hover: var(--ty-color-border-strong, ButtonText);
    }

    :host([appearance='subtle']) [part='control'] {
      --ty-button-background: transparent;
      --ty-button-background-hover: var(--ty-color-surface-hover, ButtonFace);
      --ty-button-background-active: var(--ty-color-surface-pressed, ButtonFace);
      --ty-button-foreground: var(--ty-color-text, ButtonText);
      --ty-button-border-color: transparent;
      --ty-button-border-color-hover: transparent;
    }

    :host([appearance='transparent']) [part='control'] {
      --ty-button-background: transparent;
      --ty-button-background-hover: transparent;
      --ty-button-background-active: transparent;
      --ty-button-foreground: var(--ty-color-text, ButtonText);
      --ty-button-foreground-hover: var(--ty-color-text-muted, ButtonText);
      --ty-button-border-color: transparent;
      --ty-button-border-color-hover: transparent;
    }

    [part='control']:hover:not(:disabled):not([aria-disabled='true']) {
      background: var(--ty-button-background-hover, var(--ty-button-background));
      border-color: var(--ty-button-border-color-hover, var(--ty-button-border-color));
      color: var(--ty-button-foreground-hover, var(--ty-button-foreground));
    }

    [part='control']:active:not(:disabled):not([aria-disabled='true']) {
      background: var(--ty-button-background-active, var(--ty-button-background-hover));
    }

    [part='control']:disabled,
    [part='control'][aria-disabled='true'] {
      background: var(--ty-button-disabled-background, var(--ty-color-disabled-surface, ButtonFace));
      border-color: var(--ty-button-disabled-border-color, var(--ty-color-disabled-border, GrayText));
      color: var(--ty-button-disabled-foreground, var(--ty-color-disabled-text, GrayText));
      cursor: not-allowed;
    }

    [part='control']:focus-visible {
      outline: var(--ty-focus-width, 2px) solid var(--ty-focus-color, Highlight);
      outline-offset: var(--ty-focus-offset, 2px);
      box-shadow: inset 0 0 0 2px var(--ty-focus-inner-color, Canvas);
    }

    [part='control'][data-icon-only] {
      min-inline-size: unset;
      aspect-ratio: 1;
      padding-inline: var(--ty-button-padding-block);
    }

    [part='label'] {
      min-inline-size: 0;
    }

    ::slotted([slot='icon']) {
      flex: none;
      inline-size: var(--_ty-button-icon-size, 1.25rem);
      block-size: var(--_ty-button-icon-size, 1.25rem);
    }

    [part='control'][data-icon-position='before']:not([data-icon-only]) ::slotted([slot='icon']) {
      margin-inline-end: var(--_ty-button-icon-gap, 0.5rem);
    }

    [part='control'][data-icon-position='after']:not([data-icon-only]) ::slotted([slot='icon']) {
      margin-inline-start: var(--_ty-button-icon-gap, 0.5rem);
    }

    @media (forced-colors: active) {
      [part='control'] {
        forced-color-adjust: none;
        background: ButtonFace;
        border-color: ButtonText;
        color: ButtonText;
      }

      [part='control']:disabled,
      [part='control'][aria-disabled='true'] {
        border-color: GrayText;
        color: GrayText;
      }

      [part='control']:focus-visible {
        outline-color: Highlight;
        box-shadow: none;
      }
    }

    @media (prefers-reduced-motion: reduce) {
      [part='control'] {
        transition-duration: 0ms;
      }
    }
  }
`);
const s = document.createElement("template");
s.innerHTML = `
  <button part="control" type="button">
    <slot name="icon"></slot>
    <span part="label"><slot></slot></span>
  </button>
`;
function n(a, t, e) {
  return t.includes(a) ? a : e;
}
class c extends HTMLElement {
  static observedAttributes = [
    "appearance",
    "disabled",
    "disabled-focusable",
    "icon-position",
    "shape",
    "size",
    "type"
  ];
  #t;
  #e;
  #r;
  constructor() {
    super();
    const t = this.attachShadow({ mode: "open", delegatesFocus: !0 });
    t.adoptedStyleSheets = [i], t.append(s.content.cloneNode(!0));
    const e = t.querySelector("button"), o = t.querySelector('slot[name="icon"]'), r = t.querySelector("slot:not([name])");
    if (!(e instanceof HTMLButtonElement))
      throw new Error("TyuiButtonElement template is missing its button.");
    if (!(o instanceof HTMLSlotElement) || !(r instanceof HTMLSlotElement))
      throw new Error("TyuiButtonElement template is missing expected slots.");
    this.#t = e, this.#e = o, this.#r = r, this.#t.addEventListener("click", this.#n, {
      capture: !0
    }), this.#t.addEventListener("keydown", this.#n, {
      capture: !0
    }), this.#e.addEventListener("slotchange", this.#o), this.#r.addEventListener("slotchange", this.#o);
  }
  get appearance() {
    return n(
      this.getAttribute("appearance"),
      ["default", "secondary", "primary", "outline", "subtle", "transparent"],
      "default"
    );
  }
  set appearance(t) {
    this.setAttribute("appearance", t);
  }
  get disabled() {
    return this.hasAttribute("disabled");
  }
  set disabled(t) {
    this.toggleAttribute("disabled", t);
  }
  get disabledFocusable() {
    return this.hasAttribute("disabled-focusable");
  }
  set disabledFocusable(t) {
    this.toggleAttribute("disabled-focusable", t);
  }
  get iconPosition() {
    return n(this.getAttribute("icon-position"), ["before", "after"], "before");
  }
  set iconPosition(t) {
    this.setAttribute("icon-position", t);
  }
  get shape() {
    return n(
      this.getAttribute("shape"),
      ["rounded", "circular", "square"],
      "rounded"
    );
  }
  set shape(t) {
    this.setAttribute("shape", t);
  }
  get size() {
    return n(this.getAttribute("size"), ["small", "medium", "large"], "medium");
  }
  set size(t) {
    this.setAttribute("size", t);
  }
  get type() {
    return n(this.getAttribute("type"), ["button", "submit", "reset"], "button");
  }
  set type(t) {
    this.setAttribute("type", t);
  }
  connectedCallback() {
    this.#a(), this.#o();
  }
  attributeChangedCallback() {
    this.#o();
  }
  focus(t) {
    this.#t.focus(t);
  }
  #a() {
    this.hasAttribute("appearance") || this.setAttribute("appearance", "default"), this.hasAttribute("size") || this.setAttribute("size", "medium"), this.hasAttribute("shape") || this.setAttribute("shape", "rounded"), this.hasAttribute("icon-position") || this.setAttribute("icon-position", "before"), this.hasAttribute("type") || this.setAttribute("type", "button");
  }
  #n = (t) => {
    if (!(!this.disabledFocusable || this.disabled)) {
      if (t.type === "keydown") {
        const e = t.key;
        if (e !== "Enter" && e !== " ") return;
      }
      t.preventDefault(), t.stopImmediatePropagation();
    }
  };
  #o = () => {
    const t = this.iconPosition, e = this.#i();
    this.#t.type = this.type, this.#t.disabled = this.disabled, this.#t.toggleAttribute("data-icon-only", e), this.#t.dataset.appearance = this.appearance === "default" ? "secondary" : this.appearance, this.#t.dataset.size = this.size, this.#t.dataset.shape = this.shape, this.#t.dataset.iconPosition = t, this.disabledFocusable && !this.disabled ? this.#t.setAttribute("aria-disabled", "true") : this.#t.removeAttribute("aria-disabled");
    const o = this.#e, r = this.#t.querySelector('[part="label"]');
    r && t === "after" && o.nextElementSibling !== null ? this.#t.append(o) : r && t === "before" && o.nextElementSibling !== r && this.#t.insertBefore(o, r);
  };
  #i() {
    if (!(this.#e.assignedElements({ flatten: !0 }).length > 0)) return !1;
    for (const e of this.childNodes)
      if (e.nodeType === Node.TEXT_NODE && (e.textContent ?? "").trim().length > 0 || e.nodeType === Node.ELEMENT_NODE && e.slot !== "icon")
        return !1;
    return !0;
  }
}
export {
  c as TyuiButtonElement
};
