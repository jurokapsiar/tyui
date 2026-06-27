import type { JSX } from 'solid-js';
import { defineTyuiButton } from '@tyui/define/button';
import './jsx';
import type {
  TyuiButtonAppearance,
  TyuiButtonIconPosition,
  TyuiButtonShape,
  TyuiButtonSize,
  TyuiButtonType,
} from '@tyui/elements/button';

defineTyuiButton();

export type ButtonProps = {
  appearance?: TyuiButtonAppearance | undefined;
  disabled?: boolean | undefined;
  disabledFocusable?: boolean | undefined;
  iconPosition?: TyuiButtonIconPosition | undefined;
  shape?: TyuiButtonShape | undefined;
  size?: TyuiButtonSize | undefined;
  type?: TyuiButtonType | undefined;
  children?: JSX.Element | undefined;
};

export function Button(props: ButtonProps): JSX.Element {
  return (
    <tyui-button
      appearance={props.appearance}
      disabled={props.disabled}
      disabledFocusable={props.disabledFocusable}
      iconPosition={props.iconPosition}
      shape={props.shape}
      size={props.size}
      type={props.type}
    >
      {props.children}
    </tyui-button>
  );
}
