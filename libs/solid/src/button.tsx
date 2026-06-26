import type { JSX } from 'solid-js';
import { defineTyuiButton } from '@tyui/define/button';
import './jsx';
import type { TyuiButtonActivateEvent } from '@tyui/elements/button';

defineTyuiButton();

export type ButtonProps = {
  disabled?: boolean | undefined;
  pressed?: boolean | undefined;
  onActivate?: ((event: TyuiButtonActivateEvent) => void) | undefined;
  children?: JSX.Element | undefined;
};

export function Button(props: ButtonProps): JSX.Element {
  return (
    <tyui-button disabled={props.disabled} pressed={props.pressed} on:activate={props.onActivate}>
      {props.children}
    </tyui-button>
  );
}
