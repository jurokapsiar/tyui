import type { JSX } from 'solid-js';
import { defineTyuiCheckbox } from '@tyui/define/checkbox';
import './jsx';

defineTyuiCheckbox();

export type CheckboxProps = {
  checked?: boolean | undefined;
  disabled?: boolean | undefined;
  indeterminate?: boolean | undefined;
  name?: string | undefined;
  onChange?: ((event: Event) => void) | undefined;
  required?: boolean | undefined;
  value?: string | undefined;
  children?: JSX.Element | undefined;
};

export function Checkbox(props: CheckboxProps): JSX.Element {
  return (
    <tyui-checkbox
      checked={props.checked}
      disabled={props.disabled}
      indeterminate={props.indeterminate}
      name={props.name}
      on:change={props.onChange}
      required={props.required}
      value={props.value}
    >
      {props.children}
    </tyui-checkbox>
  );
}
