import { TyuiButtonElement } from '@toyu-ui/elements/button';

export const tyuiButtonTagName = 'tyui-button';

export function defineTyuiButton(): void {
  if (!customElements.get(tyuiButtonTagName)) {
    customElements.define(tyuiButtonTagName, TyuiButtonElement);
  }
}
