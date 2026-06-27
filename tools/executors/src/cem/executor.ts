import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import type { ExecutorContext } from '@nx/devkit';
import { resolveProjectPaths } from '../shared/workspace-paths';

type ComponentManifest = {
  tagName: string;
  className: string;
  modulePath: string;
  summary: string;
  attributes: Array<{ name: string; type: string; default?: string; description: string }>;
  properties: Array<{ name: string; type: string; attribute?: string; description: string }>;
  events: Array<{ name: string; type: string; description: string }>;
  slots: Array<{ name: string; description: string }>;
  cssParts: Array<{ name: string; description: string }>;
  cssProperties: Array<{ name: string; default?: string; description: string }>;
  design: {
    intent: string;
    pattern: string;
    layoutOwnership: string;
    accessibility: string[];
    misuse: string[];
  };
};

const components: ComponentManifest[] = [
  {
    tagName: 'tyui-button',
    className: 'TyuiButtonElement',
    modulePath: './src/button/tyui-button.ts',
    summary: 'Native custom element button for immediate actions.',
    attributes: [
      {
        name: 'appearance',
        type: 'default | secondary | primary | outline | subtle | transparent',
        default: 'default',
        description: 'Visual emphasis.',
      },
      {
        name: 'disabled',
        type: 'boolean',
        default: 'false',
        description: 'Disables the native button.',
      },
      {
        name: 'disabled-focusable',
        type: 'boolean',
        default: 'false',
        description: 'Keeps the button focusable while suppressing activation.',
      },
      {
        name: 'icon-position',
        type: 'before | after',
        default: 'before',
        description: 'Places slotted icon before or after text.',
      },
      {
        name: 'shape',
        type: 'rounded | circular | square',
        default: 'rounded',
        description: 'Control corner treatment.',
      },
      {
        name: 'size',
        type: 'small | medium | large',
        default: 'medium',
        description: 'Control density.',
      },
      {
        name: 'type',
        type: 'button | submit | reset',
        default: 'button',
        description: 'Native button type.',
      },
    ],
    properties: [
      {
        name: 'appearance',
        type: 'TyuiButtonAppearance',
        attribute: 'appearance',
        description: 'Reflected visual emphasis.',
      },
      {
        name: 'disabled',
        type: 'boolean',
        attribute: 'disabled',
        description: 'Reflected disabled state.',
      },
      {
        name: 'disabledFocusable',
        type: 'boolean',
        attribute: 'disabled-focusable',
        description: 'Focusable disabled state.',
      },
      {
        name: 'type',
        type: 'TyuiButtonType',
        attribute: 'type',
        description: 'Native button type.',
      },
    ],
    events: [
      {
        name: 'click',
        type: 'MouseEvent',
        description: 'Native composed click from the internal button.',
      },
    ],
    slots: [
      { name: 'default', description: 'Button label.' },
      { name: 'icon', description: 'Decorative or named icon.' },
    ],
    cssParts: [
      { name: 'control', description: 'Internal native button.' },
      { name: 'label', description: 'Label wrapper.' },
    ],
    cssProperties: [
      { name: '--ty-button-background', description: 'Resting background.' },
      { name: '--ty-button-foreground', description: 'Text color.' },
      { name: '--ty-button-border-color', description: 'Border color.' },
      { name: '--ty-button-radius', description: 'Corner radius.' },
    ],
    design: {
      intent: 'Trigger an immediate in-page action.',
      pattern: 'Native button',
      layoutOwnership:
        'Component owns internal padding and icon-label gap; parent owns width and placement.',
      accessibility: [
        'Use a button for actions, not navigation.',
        'Icon-only buttons require an accessible name.',
      ],
      misuse: [
        'Do not use for navigation.',
        'Do not place interactive controls inside the label slot.',
      ],
    },
  },
  {
    tagName: 'tyui-input',
    className: 'TyuiInputElement',
    modulePath: './src/input/tyui-input.ts',
    summary: 'Form-associated single-line text input.',
    attributes: [
      {
        name: 'appearance',
        type: 'outline | filled-darker | filled-lighter',
        default: 'outline',
        description: 'Base field style.',
      },
      {
        name: 'default-value',
        type: 'string',
        default: '',
        description: 'Initial uncontrolled value.',
      },
      {
        name: 'disabled',
        type: 'boolean',
        default: 'false',
        description: 'Disables the native input.',
      },
      {
        name: 'invalid',
        type: 'boolean',
        default: 'false',
        description: 'Reflects invalid visual/ARIA state.',
      },
      { name: 'name', type: 'string', default: '', description: 'Form field name.' },
      {
        name: 'placeholder',
        type: 'string',
        default: '',
        description: 'Native placeholder, not a label.',
      },
      {
        name: 'readonly',
        type: 'boolean',
        default: 'false',
        description: 'Forwards native readOnly.',
      },
      {
        name: 'required',
        type: 'boolean',
        default: 'false',
        description: 'Participates in validity.',
      },
      {
        name: 'size',
        type: 'small | medium | large',
        default: 'medium',
        description: 'Control density.',
      },
      {
        name: 'type',
        type: 'text | email | password | search | tel | url | number',
        default: 'text',
        description: 'Supported native input type.',
      },
      { name: 'value', type: 'string', default: '', description: 'Current value.' },
    ],
    properties: [
      {
        name: 'value',
        type: 'string',
        attribute: 'value',
        description: 'Updates internal input and form value.',
      },
      {
        name: 'defaultValue',
        type: 'string',
        attribute: 'default-value',
        description: 'Seeds initial value once.',
      },
      {
        name: 'invalid',
        type: 'boolean',
        attribute: 'invalid',
        description: 'Reflected invalid state.',
      },
    ],
    events: [
      {
        name: 'input',
        type: 'CustomEvent<{ value: string }>',
        description: 'User text input after host value updates.',
      },
      { name: 'change', type: 'Event', description: 'Native change re-dispatched from host.' },
    ],
    slots: [
      { name: 'contentBefore', description: 'Decorative content before text.' },
      { name: 'contentAfter', description: 'Decorative content after text.' },
    ],
    cssParts: [
      { name: 'control', description: 'Input surface wrapper.' },
      { name: 'input', description: 'Internal native input.' },
      { name: 'content-before', description: 'Before slot wrapper.' },
      { name: 'content-after', description: 'After slot wrapper.' },
    ],
    cssProperties: [
      { name: '--ty-input-background', description: 'Resting field background.' },
      { name: '--ty-input-border-color', description: 'Resting border.' },
      { name: '--ty-input-focus-indicator-color', description: 'Focus indicator color.' },
    ],
    design: {
      intent: 'Capture short single-line text.',
      pattern: 'Native input',
      layoutOwnership:
        'Component owns internal padding, gap, and native input; field wrapper owns label and messages.',
      accessibility: [
        'Requires a visible label or accessible name.',
        'Placeholder is not a label.',
      ],
      misuse: [
        'Do not put focusable controls in content slots.',
        'Use combobox/search components for popups or clear buttons.',
      ],
    },
  },
  {
    tagName: 'tyui-checkbox',
    className: 'TyuiCheckboxElement',
    modulePath: './src/checkbox/tyui-checkbox.ts',
    summary: 'Native checkbox custom element.',
    attributes: [
      { name: 'checked', type: 'boolean', default: 'false', description: 'Checked state.' },
      { name: 'disabled', type: 'boolean', default: 'false', description: 'Disabled state.' },
      {
        name: 'indeterminate',
        type: 'boolean',
        default: 'false',
        description: 'Mixed visual state.',
      },
      { name: 'value', type: 'string', default: 'on', description: 'Submitted value.' },
    ],
    properties: [
      {
        name: 'checked',
        type: 'boolean',
        attribute: 'checked',
        description: 'Reflected checked state.',
      },
      {
        name: 'indeterminate',
        type: 'boolean',
        attribute: 'indeterminate',
        description: 'Reflected mixed state.',
      },
    ],
    events: [
      {
        name: 'change',
        type: 'CustomEvent<{ checked: boolean }>',
        description: 'User change event.',
      },
    ],
    slots: [{ name: 'default', description: 'Checkbox label.' }],
    cssParts: [
      { name: 'control', description: 'Native input.' },
      { name: 'box', description: 'Visual box.' },
      { name: 'label', description: 'Label wrapper.' },
    ],
    cssProperties: [{ name: '--ty-checkbox-size', description: 'Checkbox visual size.' }],
    design: {
      intent: 'Toggle an independent boolean choice.',
      pattern: 'Native checkbox',
      layoutOwnership: 'Component owns indicator/label gap; parent owns grouping.',
      accessibility: ['Use for independent choices.', 'Use radio for mutually exclusive choices.'],
      misuse: ['Do not use checkbox as a command button.'],
    },
  },
  {
    tagName: 'tyui-radio',
    className: 'TyuiRadioElement',
    modulePath: './src/radio/tyui-radio.ts',
    summary: 'Radio option used inside tyui-radio-group.',
    attributes: [
      {
        name: 'checked',
        type: 'boolean',
        default: 'false',
        description: 'Checked state controlled by group.',
      },
      { name: 'disabled', type: 'boolean', default: 'false', description: 'Disabled state.' },
      { name: 'value', type: 'string', default: '', description: 'Option value.' },
    ],
    properties: [
      { name: 'value', type: 'string', attribute: 'value', description: 'Option value.' },
    ],
    events: [
      { name: 'change', type: 'Event', description: 'Native input change reflected to host.' },
    ],
    slots: [{ name: 'default', description: 'Radio label.' }],
    cssParts: [
      { name: 'root', description: 'Label root.' },
      { name: 'input', description: 'Native radio input.' },
      { name: 'circle', description: 'Visual circle.' },
      { name: 'dot', description: 'Selected dot.' },
      { name: 'label', description: 'Label wrapper.' },
    ],
    cssProperties: [{ name: '--ty-radio-checked-color', description: 'Selected fill and border.' }],
    design: {
      intent: 'Represent one option in a mutually exclusive set.',
      pattern: 'Native radio',
      layoutOwnership:
        'Radio owns native input and indicator; radio group owns value and roving tabindex.',
      accessibility: ['Use inside tyui-radio-group for coordinated keyboard behavior.'],
      misuse: ['Do not use standalone radios for unrelated boolean choices.'],
    },
  },
  {
    tagName: 'tyui-radio-group',
    className: 'TyuiRadioGroupElement',
    modulePath: './src/radio-group/tyui-radio-group.ts',
    summary: 'Form-associated radio group coordinating tyui-radio children.',
    attributes: [
      { name: 'disabled', type: 'boolean', default: 'false', description: 'Disables the group.' },
      { name: 'label', type: 'string', default: '', description: 'Group label text.' },
      {
        name: 'layout',
        type: 'vertical | horizontal | horizontal-stacked',
        default: 'vertical',
        description: 'Child layout.',
      },
      { name: 'name', type: 'string', default: '', description: 'Form field name.' },
      { name: 'required', type: 'boolean', default: 'false', description: 'Requires selection.' },
      { name: 'value', type: 'string', default: '', description: 'Selected radio value.' },
    ],
    properties: [
      { name: 'value', type: 'string', attribute: 'value', description: 'Selected value.' },
    ],
    events: [
      {
        name: 'change',
        type: 'CustomEvent<{ value: string }>',
        description: 'User selection change.',
      },
    ],
    slots: [{ name: 'default', description: 'tyui-radio children.' }],
    cssParts: [
      { name: 'label', description: 'Group label.' },
      { name: 'items', description: 'Radio item container.' },
    ],
    cssProperties: [{ name: '--ty-radio-group-gap', description: 'Gap between radio items.' }],
    design: {
      intent: 'Select one option from a small set.',
      pattern: 'ARIA radiogroup with native radio children',
      layoutOwnership: 'Group owns child layout, value, roving tabindex, and form state.',
      accessibility: ['Tab enters one active radio.', 'Arrow keys move focus and selection.'],
      misuse: ['Do not put non-radio interactive controls in the default slot.'],
    },
  },
];

export default async function cem(
  _options: Record<string, never>,
  context: ExecutorContext,
): Promise<{ success: boolean }> {
  const paths = resolveProjectPaths(context);
  const packageJsonPath = join(paths.projectAbsRoot, 'package.json');
  const packageJson = JSON.parse(await readFile(packageJsonPath, 'utf8')) as {
    name: string;
    version: string;
  };

  const manifest = {
    schemaVersion: '1.0.0',
    readme: '',
    package: packageJson.name,
    version: packageJson.version,
    modules: components.map((component) => ({
      kind: 'javascript-module',
      path: component.modulePath,
      declarations: [
        {
          kind: 'class',
          declaration: {
            name: component.className,
            module: component.modulePath,
          },
          name: component.className,
          tagName: component.tagName,
          customElement: true,
          summary: component.summary,
          attributes: component.attributes,
          members: component.properties.map((property) => ({
            kind: 'field',
            name: property.name,
            type: { text: property.type },
            attribute: property.attribute,
            description: property.description,
          })),
          events: component.events.map((event) => ({
            name: event.name,
            type: { text: event.type },
            description: event.description,
          })),
          slots: component.slots,
          cssParts: component.cssParts,
          cssProperties: component.cssProperties,
          'x-design-system': component.design,
        },
      ],
      exports: [
        {
          kind: 'custom-element-definition',
          name: component.tagName,
          declaration: {
            name: component.className,
            module: component.modulePath,
          },
        },
      ],
    })),
  };

  await mkdir(paths.projectAbsRoot, { recursive: true });
  await writeFile(
    join(paths.projectAbsRoot, 'custom-elements.json'),
    `${JSON.stringify(manifest, null, 2)}\n`,
  );

  return { success: true };
}
