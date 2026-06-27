import type { JSX } from 'solid-js';
import { defineTyuiRadio } from '@tyui/define/radio';
import './jsx';
import type { TyuiRadioLabelPosition } from '@tyui/elements/radio';

defineTyuiRadio();

export type RadioProps = {
  checked?: boolean | undefined;
  disabled?: boolean | undefined;
  labelPosition?: TyuiRadioLabelPosition | undefined;
  name?: string | undefined;
  required?: boolean | undefined;
  value?: string | undefined;
  children?: JSX.Element | undefined;
};

export function Radio(props: RadioProps): JSX.Element {
  return (
    <tyui-radio
      checked={props.checked}
      disabled={props.disabled}
      labelPosition={props.labelPosition}
      name={props.name}
      required={props.required}
      value={props.value}
    >
      {props.children}
    </tyui-radio>
  );
}
