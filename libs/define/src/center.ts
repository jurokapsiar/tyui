import { TyuiCenterElement } from '@tyui/elements/center';

export const tyuiCenterTagName = 'tyui-center';

export function defineTyuiCenter(): void {
  if (!customElements.get(tyuiCenterTagName)) {
    customElements.define(tyuiCenterTagName, TyuiCenterElement);
  }
}
