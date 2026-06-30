import { TyuiSidebarElement } from '@toyu-ui/elements/sidebar';

export const tyuiSidebarTagName = 'tyui-sidebar';

export function defineTyuiSidebar(): void {
  if (!customElements.get(tyuiSidebarTagName)) {
    customElements.define(tyuiSidebarTagName, TyuiSidebarElement);
  }
}
