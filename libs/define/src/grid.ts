import { TyuiGridElement } from '@tyui/elements/grid';

export const tyuiGridTagName = 'tyui-grid';

export function defineTyuiGrid(): void {
  if (!customElements.get(tyuiGridTagName)) {
    customElements.define(tyuiGridTagName, TyuiGridElement);
  }
}
