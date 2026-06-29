import { TyuiFrameElement } from '@tyui/elements/frame';

export const tyuiFrameTagName = 'tyui-frame';

export function defineTyuiFrame(): void {
  if (!customElements.get(tyuiFrameTagName)) {
    customElements.define(tyuiFrameTagName, TyuiFrameElement);
  }
}
