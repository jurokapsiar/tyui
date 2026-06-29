import {
  installTyuiLayoutStyles,
  normalizeAttribute,
  setReflectedAttribute,
  setStyleVar,
  spaceValue,
} from '../layout/layout-helpers';

export type TyuiFlexDirection = 'row' | 'row-reverse' | 'column' | 'column-reverse';
export type TyuiFlexWrap = 'nowrap' | 'wrap' | 'wrap-reverse';
export type TyuiFlexAlign = 'stretch' | 'start' | 'center' | 'end' | 'baseline';
export type TyuiFlexJustify = 'start' | 'center' | 'end' | 'between' | 'around' | 'evenly';

const directions = ['row', 'row-reverse', 'column', 'column-reverse'] as const;
const wraps = ['nowrap', 'wrap', 'wrap-reverse'] as const;
const aligns = ['stretch', 'start', 'center', 'end', 'baseline'] as const;
const justifies = ['start', 'center', 'end', 'between', 'around', 'evenly'] as const;

const alignmentValues: Record<TyuiFlexAlign, string> = {
  baseline: 'baseline',
  center: 'center',
  end: 'flex-end',
  start: 'flex-start',
  stretch: 'stretch',
};

const justifyValues: Record<TyuiFlexJustify, string> = {
  around: 'space-around',
  between: 'space-between',
  center: 'center',
  end: 'flex-end',
  evenly: 'space-evenly',
  start: 'flex-start',
};

export class TyuiFlexElement extends HTMLElement {
  static observedAttributes = ['align', 'direction', 'gap', 'inline', 'justify', 'wrap'];

  connectedCallback(): void {
    installTyuiLayoutStyles();
    this.#syncStyles();
  }

  attributeChangedCallback(): void {
    this.#syncStyles();
  }

  get direction(): TyuiFlexDirection {
    return normalizeAttribute(this.getAttribute('direction'), directions, 'row');
  }

  set direction(value: TyuiFlexDirection) {
    setReflectedAttribute(this, 'direction', value);
  }

  get wrap(): TyuiFlexWrap {
    return normalizeAttribute(this.getAttribute('wrap'), wraps, 'nowrap');
  }

  set wrap(value: TyuiFlexWrap) {
    setReflectedAttribute(this, 'wrap', value);
  }

  get align(): TyuiFlexAlign {
    return normalizeAttribute(this.getAttribute('align'), aligns, 'stretch');
  }

  set align(value: TyuiFlexAlign) {
    setReflectedAttribute(this, 'align', value);
  }

  get justify(): TyuiFlexJustify {
    return normalizeAttribute(this.getAttribute('justify'), justifies, 'start');
  }

  set justify(value: TyuiFlexJustify) {
    setReflectedAttribute(this, 'justify', value);
  }

  get gap(): string {
    return this.getAttribute('gap') ?? '3';
  }

  set gap(value: string) {
    setReflectedAttribute(this, 'gap', value);
  }

  get inline(): boolean {
    return this.hasAttribute('inline');
  }

  set inline(value: boolean) {
    setReflectedAttribute(this, 'inline', value);
  }

  #syncStyles(): void {
    setStyleVar(this, '--ty-flex-display', this.inline ? 'inline-flex' : 'flex');
    setStyleVar(this, '--ty-flex-direction', this.direction);
    setStyleVar(this, '--ty-flex-wrap', this.wrap);
    setStyleVar(this, '--ty-flex-align', alignmentValues[this.align]);
    setStyleVar(this, '--ty-flex-justify', justifyValues[this.justify]);
    setStyleVar(this, '--ty-flex-gap', spaceValue(this.getAttribute('gap'), '3'));
  }
}
