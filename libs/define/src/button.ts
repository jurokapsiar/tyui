import { TyuiButtonElement } from '@tyui/elements/button';

export const tyuiButtonTagName = 'tyui-button';

export function defineTyuiButton(): void {
  if (!customElements.get(tyuiButtonTagName)) {
    customElements.define(tyuiButtonTagName, TyuiButtonElement);
  }
}
