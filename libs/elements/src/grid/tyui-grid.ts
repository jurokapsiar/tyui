import {
  installTyuiLayoutStyles,
  lengthOrFallback,
  normalizeAttribute,
  setReflectedAttribute,
  setStyleVar,
  spaceValue,
} from '../layout/layout-helpers';

export type TyuiGridAlign = 'stretch' | 'start' | 'center' | 'end';
export type TyuiGridJustify = 'stretch' | 'start' | 'center' | 'end';

const placements = ['stretch', 'start', 'center', 'end'] as const;

const placementValues: Record<TyuiGridAlign, string> = {
  center: 'center',
  end: 'end',
  start: 'start',
  stretch: 'stretch',
};

export class TyuiGridElement extends HTMLElement {
  static observedAttributes = ['align', 'dense', 'gap', 'justify', 'min-item-size', 'row-gap'];

  connectedCallback(): void {
    installTyuiLayoutStyles();
    this.#syncStyles();
  }

  attributeChangedCallback(): void {
    this.#syncStyles();
  }

  get minItemSize(): string {
    return this.getAttribute('min-item-size') ?? '16rem';
  }

  set minItemSize(value: string) {
    setReflectedAttribute(this, 'min-item-size', value);
  }

  get align(): TyuiGridAlign {
    return normalizeAttribute(this.getAttribute('align'), placements, 'stretch');
  }

  set align(value: TyuiGridAlign) {
    setReflectedAttribute(this, 'align', value);
  }

  get justify(): TyuiGridJustify {
    return normalizeAttribute(this.getAttribute('justify'), placements, 'stretch');
  }

  set justify(value: TyuiGridJustify) {
    setReflectedAttribute(this, 'justify', value);
  }

  get gap(): string {
    return this.getAttribute('gap') ?? '4';
  }

  set gap(value: string) {
    setReflectedAttribute(this, 'gap', value);
  }

  get rowGap(): string | null {
    return this.getAttribute('row-gap');
  }

  set rowGap(value: string | null) {
    if (value === null) this.removeAttribute('row-gap');
    else setReflectedAttribute(this, 'row-gap', value);
  }

  get dense(): boolean {
    return this.hasAttribute('dense');
  }

  set dense(value: boolean) {
    setReflectedAttribute(this, 'dense', value);
  }

  #syncStyles(): void {
    const gap = spaceValue(this.getAttribute('gap'), '4');
    setStyleVar(this, '--ty-grid-min-item-size', lengthOrFallback(this.minItemSize, '16rem'));
    setStyleVar(this, '--ty-grid-align', placementValues[this.align]);
    setStyleVar(this, '--ty-grid-justify', placementValues[this.justify]);
    setStyleVar(this, '--ty-grid-gap', gap);
    setStyleVar(this, '--ty-grid-row-gap', this.rowGap ? spaceValue(this.rowGap, '4') : gap);
    setStyleVar(this, '--ty-grid-auto-flow', this.dense ? 'row dense' : 'row');
  }
}
