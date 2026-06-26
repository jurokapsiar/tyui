import type { JSX } from 'solid-js';
import type { TyuiButtonActivateEvent, TyuiButtonElement } from '@tyui/elements/button';

export type TyuiButtonSolidAttributes = JSX.HTMLAttributes<TyuiButtonElement> & {
  disabled?: boolean | undefined;
  pressed?: boolean | undefined;
  children?: JSX.Element | undefined;
  'on:activate'?: ((event: TyuiButtonActivateEvent) => void) | undefined;
};

declare module 'solid-js' {
  namespace JSX {
    interface IntrinsicElements {
      'tyui-button': TyuiButtonSolidAttributes;
    }
  }
}
