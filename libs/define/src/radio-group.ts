import { TyuiRadioGroupElement } from '@toyu-ui/elements/radio-group';

export const tyuiRadioGroupTagName = 'tyui-radio-group';

export function defineTyuiRadioGroup(): void {
  if (!customElements.get(tyuiRadioGroupTagName)) {
    customElements.define(tyuiRadioGroupTagName, TyuiRadioGroupElement);
  }
}
