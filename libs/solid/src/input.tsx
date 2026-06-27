import type { JSX } from 'solid-js';
import { defineTyuiInput } from '@tyui/define/input';
import './jsx';
import type {
  TyuiInputAppearance,
  TyuiInputEvent,
  TyuiInputSize,
  TyuiInputType,
} from '@tyui/elements/input';

defineTyuiInput();

export type InputProps = {
  appearance?: TyuiInputAppearance | undefined;
  defaultValue?: string | undefined;
  disabled?: boolean | undefined;
  invalid?: boolean | undefined;
  name?: string | undefined;
  onChange?: ((event: Event) => void) | undefined;
  onInput?: ((event: TyuiInputEvent) => void) | undefined;
  placeholder?: string | undefined;
  readonly?: boolean | undefined;
  required?: boolean | undefined;
  size?: TyuiInputSize | undefined;
  type?: TyuiInputType | undefined;
  value?: string | undefined;
  children?: JSX.Element | undefined;
};

export function Input(props: InputProps): JSX.Element {
  return (
    <tyui-input
      appearance={props.appearance}
      defaultValue={props.defaultValue}
      disabled={props.disabled}
      invalid={props.invalid}
      name={props.name}
      on:change={props.onChange}
      on:input={props.onInput}
      placeholder={props.placeholder}
      readonly={props.readonly}
      required={props.required}
      size={props.size}
      type={props.type}
      value={props.value}
    >
      {props.children}
    </tyui-input>
  );
}
