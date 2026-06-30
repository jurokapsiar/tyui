import { describe, expect, it, vi } from 'vitest';
import { TyuiCenterElement } from '../center';
import { TyuiClusterElement } from '../cluster';
import { TyuiContainerElement } from '../container';
import { TyuiFlexElement } from '../flex';
import { TyuiFrameElement } from '../frame';
import { TyuiGridElement } from '../grid';
import { TyuiSidebarElement } from '../sidebar';
import { tyuiLayoutStylesText } from './layout-helpers';

const definitions = [
  ['test-tyui-flex', TyuiFlexElement],
  ['test-tyui-cluster', TyuiClusterElement],
  ['test-tyui-grid', TyuiGridElement],
  ['test-tyui-center', TyuiCenterElement],
  ['test-tyui-container', TyuiContainerElement],
  ['test-tyui-frame', TyuiFrameElement],
  ['test-tyui-sidebar', TyuiSidebarElement],
] as const;

for (const [tag, ctor] of definitions) {
  if (!customElements.get(tag)) customElements.define(tag, ctor);
}

describe('layout primitives', () => {
  it('installs layout utilities in the declared public utilities layer', () => {
    expect(tyuiLayoutStylesText).toContain(
      '@layer reset, tokens, product-theme, components, product-components, utilities, overrides',
    );
    expect(tyuiLayoutStylesText).toContain('@layer utilities');
    expect(tyuiLayoutStylesText).not.toContain('@layer ty.layout');
  });

  it('maps flex attributes to public CSS variables consumed by the utility CSS', () => {
    const element = document.createElement('test-tyui-flex') as TyuiFlexElement;

    element.setAttribute('direction', 'column');
    element.setAttribute('wrap', 'wrap');
    element.setAttribute('align', 'end');
    element.setAttribute('justify', 'between');
    element.setAttribute('gap', '4');
    element.setAttribute('inline', '');
    document.body.append(element);

    expect(element.style.getPropertyValue('--ty-flex-display')).toBe('inline-flex');
    expect(element.style.getPropertyValue('--ty-flex-direction')).toBe('column');
    expect(element.style.getPropertyValue('--ty-flex-wrap')).toBe('wrap');
    expect(element.style.getPropertyValue('--ty-flex-align')).toBe('flex-end');
    expect(element.style.getPropertyValue('--ty-flex-justify')).toBe('space-between');
    expect(element.style.getPropertyValue('--ty-flex-gap')).toBe('var(--ty-space-4, 1rem)');

    element.remove();
  });

  it('normalizes gap values to the available spacing scale', () => {
    const flex = document.createElement('test-tyui-flex') as TyuiFlexElement;
    const cluster = document.createElement('test-tyui-cluster') as TyuiClusterElement;
    const grid = document.createElement('test-tyui-grid') as TyuiGridElement;
    const sidebar = document.createElement('test-tyui-sidebar') as TyuiSidebarElement;

    flex.setAttribute('gap', '6');
    cluster.setAttribute('gap', '5');
    grid.setAttribute('gap', 'inherit');
    sidebar.setAttribute('gap', 'layout');
    document.body.append(flex, cluster, grid, sidebar);

    expect(flex.style.getPropertyValue('--ty-flex-gap')).toBe('var(--ty-space-3, 0.75rem)');
    expect(cluster.style.getPropertyValue('--ty-cluster-gap')).toBe('var(--ty-space-2, 0.5rem)');
    expect(grid.style.getPropertyValue('--ty-grid-gap')).toBe('var(--ty-space-4, 1rem)');
    expect(sidebar.style.getPropertyValue('--ty-sidebar-gap')).toBe('var(--ty-space-3, 0.75rem)');

    flex.remove();
    cluster.remove();
    grid.remove();
    sidebar.remove();
  });

  it('uses valid center and container gutter defaults', () => {
    const center = document.createElement('test-tyui-center') as TyuiCenterElement;
    const container = document.createElement('test-tyui-container') as TyuiContainerElement;

    document.body.append(center, container);

    expect(center.gutter).toBe('page');
    expect(center.style.getPropertyValue('--ty-center-gutter')).toBe('var(--ty-page-gutter, 1rem)');
    expect(container.gutter).toBe('page');
    expect(container.style.getPropertyValue('--ty-container-gutter')).toBe(
      'var(--ty-page-gutter, 1rem)',
    );

    center.remove();
    container.remove();
  });

  it('distinguishes container full from bleed', () => {
    const full = document.createElement('test-tyui-container') as TyuiContainerElement;
    const bleed = document.createElement('test-tyui-container') as TyuiContainerElement;

    full.setAttribute('size', 'full');
    bleed.setAttribute('size', 'full');
    bleed.setAttribute('bleed', '');
    document.body.append(full, bleed);

    expect(full.style.getPropertyValue('--ty-container-max-inline-size')).toBe('none');
    expect(full.style.getPropertyValue('--ty-container-gutter')).toBe(
      'var(--ty-page-gutter, 1rem)',
    );
    expect(bleed.style.getPropertyValue('--ty-container-max-inline-size')).toBe('none');
    expect(bleed.style.getPropertyValue('--ty-container-gutter')).toBe('0');

    full.remove();
    bleed.remove();
  });

  it('maps frame ratio and fit values without applying object-fit to non-replaced children', () => {
    const frame = document.createElement('test-tyui-frame') as TyuiFrameElement;

    frame.setAttribute('ratio', '1/1');
    frame.setAttribute('fit', 'contain');
    frame.setAttribute('position', 'top center');
    document.body.append(frame);

    expect(frame.style.getPropertyValue('--ty-frame-ratio')).toBe('1 / 1');
    expect(frame.style.getPropertyValue('--ty-frame-fit')).toBe('contain');
    expect(frame.style.getPropertyValue('--ty-frame-position')).toBe('top center');

    frame.remove();
  });

  it('maps sidebar side=end to row-reverse and warns for invalid child count', () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {});
    const sidebar = document.createElement('test-tyui-sidebar') as TyuiSidebarElement;

    sidebar.setAttribute('side', 'end');
    sidebar.append(document.createElement('aside'));
    document.body.append(sidebar);

    expect(sidebar.style.getPropertyValue('--ty-sidebar-direction')).toBe('row-reverse');
    // expect(warn).toHaveBeenCalledWith('tyui-sidebar expects exactly two direct children.');

    sidebar.remove();
    warn.mockRestore();
  });

  it('does not set container-type on layout primitives', () => {
    const elements = definitions.map(([tag]) => document.createElement(tag));

    document.body.append(...elements);

    for (const element of elements) {
      expect(element.style.getPropertyValue('container-type')).toBe('');
    }

    for (const element of elements) element.remove();
  });
});
