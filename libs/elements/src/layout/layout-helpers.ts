export type TyuiSpace = '0' | '1' | '2' | '3' | '4';

const layoutSheet = new CSSStyleSheet();

export const tyuiLayoutStylesText = `
  @layer reset, tokens, product-theme, components, product-components, utilities, overrides;

  @layer utilities {
    .ty-flex,
    tyui-flex {
      box-sizing: border-box;
      display: var(--ty-flex-display, flex);
      flex-direction: var(--ty-flex-direction, row);
      flex-wrap: var(--ty-flex-wrap, nowrap);
      align-items: var(--ty-flex-align, stretch);
      justify-content: var(--ty-flex-justify, flex-start);
      gap: var(--ty-flex-gap, var(--ty-layout-gap, var(--ty-space-3, 0.75rem)));
    }

    .ty-cluster,
    tyui-cluster {
      box-sizing: border-box;
      display: flex;
      flex-wrap: wrap;
      align-items: var(--ty-cluster-align, center);
      justify-content: var(--ty-cluster-justify, flex-start);
      gap:
        var(--ty-cluster-row-gap, var(--ty-cluster-gap, var(--ty-space-2, 0.5rem)))
        var(--ty-cluster-gap, var(--ty-space-2, 0.5rem));
    }

    .ty-grid,
    tyui-grid {
      box-sizing: border-box;
      display: grid;
      grid-template-columns: repeat(
        auto-fit,
        minmax(min(100%, var(--ty-grid-min-item-size, 16rem)), 1fr)
      );
      align-items: var(--ty-grid-align, stretch);
      justify-items: var(--ty-grid-justify, stretch);
      grid-auto-flow: var(--ty-grid-auto-flow, row);
      gap:
        var(--ty-grid-row-gap, var(--ty-grid-gap, var(--ty-space-4, 1rem)))
        var(--ty-grid-gap, var(--ty-space-4, 1rem));
    }

    .ty-center,
    tyui-center {
      box-sizing: content-box;
      display: var(--ty-center-display, block);
      margin-inline: auto;
      max-inline-size: var(--ty-center-measure, var(--ty-layout-content-measure, 65ch));
      padding-inline: var(--ty-center-gutter, var(--ty-page-gutter, 1rem));
    }

    tyui-center[intrinsic],
    .ty-center[data-intrinsic='true'] {
      --ty-center-display: flex;
      flex-direction: column;
      align-items: center;
    }

    .ty-container,
    tyui-container {
      box-sizing: border-box;
      display: block;
      inline-size: 100%;
      max-inline-size: var(--ty-container-max-inline-size, var(--ty-container-wide, 72rem));
      margin-inline: auto;
      padding-inline: var(--ty-container-gutter, var(--ty-page-gutter, 1rem));
    }

    tyui-container[bleed],
    .ty-container[data-bleed='true'] {
      max-inline-size: none;
      padding-inline: 0;
    }

    .ty-frame,
    tyui-frame {
      box-sizing: border-box;
      aspect-ratio: var(--ty-frame-ratio, 16 / 9);
      display: block;
      overflow: hidden;
    }

    .ty-frame > *,
    tyui-frame > * {
      box-sizing: border-box;
      block-size: 100%;
      inline-size: 100%;
    }

    .ty-frame > img,
    .ty-frame > video,
    .ty-frame > iframe,
    .ty-frame > canvas,
    tyui-frame > img,
    tyui-frame > video,
    tyui-frame > iframe,
    tyui-frame > canvas {
      object-fit: var(--ty-frame-fit, cover);
      object-position: var(--ty-frame-position, center);
    }

    .ty-sidebar,
    tyui-sidebar {
      box-sizing: border-box;
      display: flex;
      flex-direction: var(--ty-sidebar-direction, row);
      flex-wrap: wrap;
      align-items: var(--ty-sidebar-align, stretch);
      gap: var(--ty-sidebar-gap, var(--ty-layout-gap, var(--ty-space-3, 0.75rem)));
    }

    .ty-sidebar > :first-child,
    tyui-sidebar > :first-child {
      flex-basis: var(--ty-sidebar-size, 18rem);
      flex-grow: 1;
    }

    .ty-sidebar > :last-child,
    tyui-sidebar > :last-child {
      flex-basis: 0;
      flex-grow: 999;
      min-inline-size: min(100%, var(--ty-sidebar-content-min-inline-size, 50%));
    }
  }
`;

layoutSheet.replaceSync(tyuiLayoutStylesText);

let layoutStylesInstalled = false;

export function installTyuiLayoutStyles(): void {
  if (layoutStylesInstalled || typeof document === 'undefined') return;
  document.adoptedStyleSheets = [...document.adoptedStyleSheets, layoutSheet];
  layoutStylesInstalled = true;
}

export function normalizeAttribute<T extends string>(
  value: string | null,
  allowed: readonly T[],
  fallback: T,
): T {
  return allowed.includes(value as T) ? (value as T) : fallback;
}

export function setReflectedAttribute(
  element: HTMLElement,
  name: string,
  value: string | boolean,
): void {
  if (typeof value === 'boolean') {
    element.toggleAttribute(name, value);
    return;
  }

  element.setAttribute(name, value);
}

export function spaceValue(value: string | null, fallback: TyuiSpace): string {
  const normalized = normalizeAttribute(value, ['0', '1', '2', '3', '4'] as const, fallback);
  const fallbacks: Record<TyuiSpace, string> = {
    '0': '0',
    '1': '0.25rem',
    '2': '0.5rem',
    '3': '0.75rem',
    '4': '1rem',
  };

  return `var(--ty-space-${normalized}, ${fallbacks[normalized]})`;
}

export function lengthOrFallback(value: string | null, fallback: string): string {
  const trimmed = value?.trim();
  return trimmed ? trimmed : fallback;
}

export function ratioOrFallback(value: string | null, fallback: string): string {
  const trimmed = value?.trim();
  if (!trimmed) return fallback;
  return trimmed.replace('/', ' / ');
}

export function setStyleVar(element: HTMLElement, name: string, value: string): void {
  element.style.setProperty(name, value);
}
