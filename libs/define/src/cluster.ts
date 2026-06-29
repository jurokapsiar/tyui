import { TyuiClusterElement } from '@tyui/elements/cluster';

export const tyuiClusterTagName = 'tyui-cluster';

export function defineTyuiCluster(): void {
  if (!customElements.get(tyuiClusterTagName)) {
    customElements.define(tyuiClusterTagName, TyuiClusterElement);
  }
}
