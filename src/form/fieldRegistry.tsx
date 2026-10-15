import type { ReactNode } from 'react';
import { Checkbox } from '../design-system/atoms/Checkbox';
import { Select } from '../design-system/atoms/Select';
import { TextInput } from '../design-system/atoms/TextInput';
import { Textarea } from '../design-system/atoms/Textarea';
import type { ControlProps } from '../design-system/molecules/Field';
import type { FieldConfig, FieldType, FieldValue } from './types';

export type RenderArgs<F extends FieldConfig = FieldConfig> = {
  field: F;
  value: FieldValue | undefined;
  onChange: (value: FieldValue) => void;
  onBlur: () => void;
  /** id + aria props from the surrounding Field. */
  control: ControlProps;
};

type RegistryEntry<F extends FieldConfig> = {
  render: (args: RenderArgs<F>) => ReactNode;
  /** True when the atom draws its own label (checkbox). */
  controlHasLabel?: boolean;
};

type FieldRegistry = {
  [K in FieldType]: RegistryEntry<Extract<FieldConfig, { type: K }>>;
};

const asString = (value: FieldValue | undefined) => (typeof value === 'string' ? value : '');

/**
 * One entry per config `type`. Supporting a new control type means adding an
 * atom and a line here; TypeScript complains if a type is missing.
 */
export const fieldRegistry: FieldRegistry = {
  text: {
    render: ({ field, value, onChange, onBlur, control }) => (
      <TextInput {...control} name={field.name} value={asString(value)} onChange={onChange} onBlur={onBlur} />
    ),
  },
  email: {
    render: ({ field, value, onChange, onBlur, control }) => (
      <TextInput
        {...control}
        type="email"
        name={field.name}
        autoComplete="email"
        value={asString(value)}
        onChange={onChange}
        onBlur={onBlur}
      />
    ),
  },
  select: {
    render: ({ field, value, onChange, onBlur, control }) => (
      <Select
        {...control}
        name={field.name}
        options={field.options}
        value={asString(value)}
        onChange={onChange}
        onBlur={onBlur}
      />
    ),
  },
  textarea: {
    render: ({ field, value, onChange, onBlur, control }) => (
      <Textarea {...control} name={field.name} value={asString(value)} onChange={onChange} onBlur={onBlur} />
    ),
  },
  checkbox: {
    controlHasLabel: true,
    render: ({ field, value, onChange, onBlur, control }) => (
      <Checkbox
        {...control}
        name={field.name}
        label={field.label}
        checked={value === true}
        onChange={onChange}
        onBlur={onBlur}
      />
    ),
  },
};

export function getRegistryEntry(field: FieldConfig): RegistryEntry<FieldConfig> {
  // TS can't follow the link between field.type and the entry's field type,
  // so we widen here once instead of casting at every call site.
  return fieldRegistry[field.type] as RegistryEntry<FieldConfig>;
}
