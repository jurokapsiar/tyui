import {
  installTyuiLayoutStyles,
  lengthOrFallback,
  normalizeAttribute,
  setReflectedAttribute,
  setStyleVar,
  spaceValue,
} from '../layout/layout-helpers';

export type TyuiSidebarSide = 'start' | 'end';

const sides = ['start', 'end'] as const;

export class TyuiSidebarElement extends HTMLElement {
  static observedAttributes = ['content-min', 'gap', 'no-stretch', 'side', 'side-size'];

  connectedCallback(): void {
    installTyuiLayoutStyles();
    this.#syncStyles();
    this.#validateChildren();
  }

  attributeChangedCallback(): void {
    this.#syncStyles();
  }

  get side(): TyuiSidebarSide {
    return normalizeAttribute(this.getAttribute('side'), sides, 'start');
  }

  set side(value: TyuiSidebarSide) {
    setReflectedAttribute(this, 'side', value);
  }

  get sideSize(): string {
    return this.getAttribute('side-size') ?? '18rem';
  }

  set sideSize(value: string) {
    setReflectedAttribute(this, 'side-size', value);
  }

  get contentMin(): string {
    return this.getAttribute('content-min') ?? '50%';
  }

  set contentMin(value: string) {
    setReflectedAttribute(this, 'content-min', value);
  }

  get gap(): string {
    return this.getAttribute('gap') ?? '3';
  }

  set gap(value: string) {
    setReflectedAttribute(this, 'gap', value);
  }

  get noStretch(): boolean {
    return this.hasAttribute('no-stretch');
  }

  set noStretch(value: boolean) {
    setReflectedAttribute(this, 'no-stretch', value);
  }

  #syncStyles(): void {
    setStyleVar(this, '--ty-sidebar-direction', this.side === 'end' ? 'row-reverse' : 'row');
    setStyleVar(this, '--ty-sidebar-size', lengthOrFallback(this.sideSize, '18rem'));
    setStyleVar(
      this,
      '--ty-sidebar-content-min-inline-size',
      lengthOrFallback(this.contentMin, '50%'),
    );
    setStyleVar(this, '--ty-sidebar-gap', spaceValue(this.getAttribute('gap'), '3'));
    setStyleVar(this, '--ty-sidebar-align', this.noStretch ? 'flex-start' : 'stretch');
  }

  #validateChildren(): void {
    if (this.children.length !== 2) {
      console.warn('tyui-sidebar expects exactly two direct children.');
    }
  }
}
