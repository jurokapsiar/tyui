import type { JSX } from 'solid-js';
import './jsx';
import type { TyuiRadioGroupEvent, TyuiRadioGroupLayout } from '@toyu-ui/elements/radio-group';

export type RadioGroupProps = {
  disabled?: boolean | undefined;
  label?: string | undefined;
  layout?: TyuiRadioGroupLayout | undefined;
  name?: string | undefined;
  onChange?: ((event: TyuiRadioGroupEvent) => void) | undefined;
  required?: boolean | undefined;
  value?: string | undefined;
  children?: JSX.Element | undefined;
};

export function RadioGroup(props: RadioGroupProps): JSX.Element {
  return (
    <tyui-radio-group
      disabled={props.disabled}
      label={props.label}
      layout={props.layout}
      name={props.name}
      on:change={props.onChange}
      required={props.required}
      value={props.value}
    >
      {props.children}
    </tyui-radio-group>
  );
}
