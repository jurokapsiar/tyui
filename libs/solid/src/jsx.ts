import type { JSX } from 'solid-js';
import type {
  TyuiButtonAppearance,
  TyuiButtonElement,
  TyuiButtonIconPosition,
  TyuiButtonShape,
  TyuiButtonSize,
  TyuiButtonType,
} from '@tyui/elements/button';
import type { TyuiCheckboxElement } from '@tyui/elements/checkbox';
import type {
  TyuiInputAppearance,
  TyuiInputElement,
  TyuiInputEvent,
  TyuiInputSize,
  TyuiInputType,
} from '@tyui/elements/input';
import type { TyuiRadioElement, TyuiRadioLabelPosition } from '@tyui/elements/radio';
import type {
  TyuiRadioGroupElement,
  TyuiRadioGroupEvent,
  TyuiRadioGroupLayout,
} from '@tyui/elements/radio-group';

export type TyuiButtonSolidAttributes = JSX.HTMLAttributes<TyuiButtonElement> & {
  appearance?: TyuiButtonAppearance | undefined;
  disabled?: boolean | undefined;
  disabledFocusable?: boolean | undefined;
  'disabled-focusable'?: boolean | undefined;
  iconPosition?: TyuiButtonIconPosition | undefined;
  'icon-position'?: TyuiButtonIconPosition | undefined;
  shape?: TyuiButtonShape | undefined;
  size?: TyuiButtonSize | undefined;
  type?: TyuiButtonType | undefined;
  children?: JSX.Element | undefined;
};

type TyuiInputBaseAttributes = Omit<
  JSX.HTMLAttributes<TyuiInputElement>,
  'onInput' | 'on:input' | 'onChange' | 'on:change'
>;

export type TyuiInputSolidAttributes = TyuiInputBaseAttributes & {
  appearance?: TyuiInputAppearance | undefined;
  defaultValue?: string | undefined;
  'default-value'?: string | undefined;
  disabled?: boolean | undefined;
  invalid?: boolean | undefined;
  name?: string | undefined;
  placeholder?: string | undefined;
  readonly?: boolean | undefined;
  required?: boolean | undefined;
  size?: TyuiInputSize | undefined;
  type?: TyuiInputType | undefined;
  value?: string | undefined;
  children?: JSX.Element | undefined;
  'on:input'?: ((event: TyuiInputEvent) => void) | undefined;
  'on:change'?: ((event: Event) => void) | undefined;
};

type TyuiCheckboxBaseAttributes = Omit<
  JSX.HTMLAttributes<TyuiCheckboxElement>,
  'onChange' | 'on:change'
>;

export type TyuiCheckboxSolidAttributes = TyuiCheckboxBaseAttributes & {
  checked?: boolean | undefined;
  disabled?: boolean | undefined;
  indeterminate?: boolean | undefined;
  name?: string | undefined;
  required?: boolean | undefined;
  value?: string | undefined;
  children?: JSX.Element | undefined;
  'on:change'?: ((event: Event) => void) | undefined;
};

export type TyuiRadioSolidAttributes = JSX.HTMLAttributes<TyuiRadioElement> & {
  checked?: boolean | undefined;
  disabled?: boolean | undefined;
  labelPosition?: TyuiRadioLabelPosition | undefined;
  'label-position'?: TyuiRadioLabelPosition | undefined;
  name?: string | undefined;
  required?: boolean | undefined;
  value?: string | undefined;
  children?: JSX.Element | undefined;
};

type TyuiRadioGroupBaseAttributes = Omit<
  JSX.HTMLAttributes<TyuiRadioGroupElement>,
  'onChange' | 'on:change'
>;

export type TyuiRadioGroupSolidAttributes = TyuiRadioGroupBaseAttributes & {
  disabled?: boolean | undefined;
  label?: string | undefined;
  layout?: TyuiRadioGroupLayout | undefined;
  name?: string | undefined;
  required?: boolean | undefined;
  value?: string | undefined;
  children?: JSX.Element | undefined;
  'on:change'?: ((event: TyuiRadioGroupEvent) => void) | undefined;
};

declare module 'solid-js' {
  namespace JSX {
    interface IntrinsicElements {
      'tyui-button': TyuiButtonSolidAttributes;
      'tyui-checkbox': TyuiCheckboxSolidAttributes;
      'tyui-input': TyuiInputSolidAttributes;
      'tyui-radio': TyuiRadioSolidAttributes;
      'tyui-radio-group': TyuiRadioGroupSolidAttributes;
    }
  }
}
