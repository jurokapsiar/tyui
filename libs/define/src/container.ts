import { TyuiContainerElement } from '@tyui/elements/container';

export const tyuiContainerTagName = 'tyui-container';

export function defineTyuiContainer(): void {
  if (!customElements.get(tyuiContainerTagName)) {
    customElements.define(tyuiContainerTagName, TyuiContainerElement);
  }
}
