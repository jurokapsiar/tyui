import {
  installTyuiLayoutStyles,
  normalizeAttribute,
  setReflectedAttribute,
  setStyleVar,
  spaceValue,
} from '../layout/layout-helpers';

export type TyuiClusterAlign = 'start' | 'center' | 'end' | 'baseline' | 'stretch';
export type TyuiClusterJustify = 'start' | 'center' | 'end' | 'between';

const aligns = ['start', 'center', 'end', 'baseline', 'stretch'] as const;
const justifies = ['start', 'center', 'end', 'between'] as const;

const alignmentValues: Record<TyuiClusterAlign, string> = {
  baseline: 'baseline',
  center: 'center',
  end: 'flex-end',
  start: 'flex-start',
  stretch: 'stretch',
};

const justifyValues: Record<TyuiClusterJustify, string> = {
  between: 'space-between',
  center: 'center',
  end: 'flex-end',
  start: 'flex-start',
};

export class TyuiClusterElement extends HTMLElement {
  static observedAttributes = ['align', 'gap', 'justify', 'row-gap'];

  connectedCallback(): void {
    installTyuiLayoutStyles();
    this.#syncStyles();
  }

  attributeChangedCallback(): void {
    this.#syncStyles();
  }

  get align(): TyuiClusterAlign {
    return normalizeAttribute(this.getAttribute('align'), aligns, 'center');
  }

  set align(value: TyuiClusterAlign) {
    setReflectedAttribute(this, 'align', value);
  }

  get justify(): TyuiClusterJustify {
    return normalizeAttribute(this.getAttribute('justify'), justifies, 'start');
  }

  set justify(value: TyuiClusterJustify) {
    setReflectedAttribute(this, 'justify', value);
  }

  get gap(): string {
    return this.getAttribute('gap') ?? '2';
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

  #syncStyles(): void {
    const gap = spaceValue(this.getAttribute('gap'), '2');
    setStyleVar(this, '--ty-cluster-align', alignmentValues[this.align]);
    setStyleVar(this, '--ty-cluster-justify', justifyValues[this.justify]);
    setStyleVar(this, '--ty-cluster-gap', gap);
    setStyleVar(this, '--ty-cluster-row-gap', this.rowGap ? spaceValue(this.rowGap, '2') : gap);
  }
}
