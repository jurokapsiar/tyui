import { TyuiFlexElement } from '@toyu-ui/elements/flex';

export const tyuiFlexTagName = 'tyui-flex';

export function defineTyuiFlex(): void {
  if (!customElements.get(tyuiFlexTagName)) {
    customElements.define(tyuiFlexTagName, TyuiFlexElement);
  }
}
