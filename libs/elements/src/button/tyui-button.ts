export type TyuiButtonAppearance =
  | 'default'
  | 'secondary'
  | 'primary'
  | 'outline'
  | 'subtle'
  | 'transparent';

export type TyuiButtonSize = 'small' | 'medium' | 'large';
export type TyuiButtonShape = 'rounded' | 'circular' | 'square';
export type TyuiButtonIconPosition = 'before' | 'after';
export type TyuiButtonType = 'button' | 'submit' | 'reset';

const buttonSheet = new CSSStyleSheet();

buttonSheet.replaceSync(`
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

const template = document.createElement('template');

template.innerHTML = `
  <button part="control" type="button">
    <slot name="icon"></slot>
    <span part="label"><slot></slot></span>
  </button>
`;

function normalizeAttribute<T extends string>(
  value: string | null,
  allowed: readonly T[],
  fallback: T,
): T {
  return allowed.includes(value as T) ? (value as T) : fallback;
}

export class TyuiButtonElement extends HTMLElement {
  static observedAttributes = [
    'appearance',
    'disabled',
    'disabled-focusable',
    'icon-position',
    'shape',
    'size',
    'type',
  ];

  readonly #button: HTMLButtonElement;
  readonly #iconSlot: HTMLSlotElement;
  readonly #defaultSlot: HTMLSlotElement;

  constructor() {
    super();

    const root = this.attachShadow({ mode: 'open', delegatesFocus: true });
    root.adoptedStyleSheets = [buttonSheet];
    root.append(template.content.cloneNode(true));

    const button = root.querySelector('button');
    const iconSlot = root.querySelector('slot[name="icon"]');
    const defaultSlot = root.querySelector('slot:not([name])');

    if (!(button instanceof HTMLButtonElement)) {
      throw new Error('TyuiButtonElement template is missing its button.');
    }
    if (!(iconSlot instanceof HTMLSlotElement) || !(defaultSlot instanceof HTMLSlotElement)) {
      throw new Error('TyuiButtonElement template is missing expected slots.');
    }

    this.#button = button;
    this.#iconSlot = iconSlot;
    this.#defaultSlot = defaultSlot;

    this.#button.addEventListener('click', this.#suppressIfFocusableDisabled, {
      capture: true,
    });
    this.#button.addEventListener('keydown', this.#suppressIfFocusableDisabled, {
      capture: true,
    });
    this.#iconSlot.addEventListener('slotchange', this.#render);
    this.#defaultSlot.addEventListener('slotchange', this.#render);
  }

  get appearance(): TyuiButtonAppearance {
    return normalizeAttribute(
      this.getAttribute('appearance'),
      ['default', 'secondary', 'primary', 'outline', 'subtle', 'transparent'],
      'default',
    );
  }

  set appearance(value: TyuiButtonAppearance) {
    this.setAttribute('appearance', value);
  }

  get disabled(): boolean {
    return this.hasAttribute('disabled');
  }

  set disabled(value: boolean) {
    this.toggleAttribute('disabled', value);
  }

  get disabledFocusable(): boolean {
    return this.hasAttribute('disabled-focusable');
  }

  set disabledFocusable(value: boolean) {
    this.toggleAttribute('disabled-focusable', value);
  }

  get iconPosition(): TyuiButtonIconPosition {
    return normalizeAttribute(this.getAttribute('icon-position'), ['before', 'after'], 'before');
  }

  set iconPosition(value: TyuiButtonIconPosition) {
    this.setAttribute('icon-position', value);
  }

  get shape(): TyuiButtonShape {
    return normalizeAttribute(
      this.getAttribute('shape'),
      ['rounded', 'circular', 'square'],
      'rounded',
    );
  }

  set shape(value: TyuiButtonShape) {
    this.setAttribute('shape', value);
  }

  get size(): TyuiButtonSize {
    return normalizeAttribute(this.getAttribute('size'), ['small', 'medium', 'large'], 'medium');
  }

  set size(value: TyuiButtonSize) {
    this.setAttribute('size', value);
  }

  get type(): TyuiButtonType {
    return normalizeAttribute(this.getAttribute('type'), ['button', 'submit', 'reset'], 'button');
  }

  set type(value: TyuiButtonType) {
    this.setAttribute('type', value);
  }

  connectedCallback(): void {
    this.#ensureDefaultAttributes();
    this.#render();
  }

  attributeChangedCallback(): void {
    this.#render();
  }

  override focus(options?: FocusOptions): void {
    this.#button.focus(options);
  }

  #ensureDefaultAttributes(): void {
    if (!this.hasAttribute('appearance')) this.setAttribute('appearance', 'default');
    if (!this.hasAttribute('size')) this.setAttribute('size', 'medium');
    if (!this.hasAttribute('shape')) this.setAttribute('shape', 'rounded');
    if (!this.hasAttribute('icon-position')) this.setAttribute('icon-position', 'before');
    if (!this.hasAttribute('type')) this.setAttribute('type', 'button');
  }

  #suppressIfFocusableDisabled = (event: Event): void => {
    if (!this.disabledFocusable || this.disabled) return;

    if (event.type === 'keydown') {
      const key = (event as KeyboardEvent).key;
      if (key !== 'Enter' && key !== ' ') return;
    }

    event.preventDefault();
    event.stopImmediatePropagation();
  };

  #render = (): void => {
    const iconPosition = this.iconPosition;
    const iconOnly = this.#isIconOnly();

    this.#button.type = this.type;
    this.#button.disabled = this.disabled;
    this.#button.toggleAttribute('data-icon-only', iconOnly);
    this.#button.dataset.appearance = this.appearance === 'default' ? 'secondary' : this.appearance;
    this.#button.dataset.size = this.size;
    this.#button.dataset.shape = this.shape;
    this.#button.dataset.iconPosition = iconPosition;

    if (this.disabledFocusable && !this.disabled) {
      this.#button.setAttribute('aria-disabled', 'true');
    } else {
      this.#button.removeAttribute('aria-disabled');
    }

    const iconSlot = this.#iconSlot;
    const label = this.#button.querySelector('[part="label"]');

    if (label && iconPosition === 'after' && iconSlot.nextElementSibling !== null) {
      this.#button.append(iconSlot);
    } else if (label && iconPosition === 'before' && iconSlot.nextElementSibling !== label) {
      this.#button.insertBefore(iconSlot, label);
    }
  };

  #isIconOnly(): boolean {
    const hasIcon = this.#iconSlot.assignedElements({ flatten: true }).length > 0;
    if (!hasIcon) return false;

    for (const node of this.childNodes) {
      if (node.nodeType === Node.TEXT_NODE && (node.textContent ?? '').trim().length > 0) {
        return false;
      }
      if (node.nodeType === Node.ELEMENT_NODE) {
        const element = node as Element;
        if (element.slot !== 'icon') return false;
      }
    }

    return true;
  }
}
