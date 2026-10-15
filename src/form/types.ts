export type Visibility = { field: string; equals: string };

export type SelectOption = { value: string; label: string };

type BaseField = {
  name: string;
  label: string;
  required?: boolean;
  hint?: string;
  /** Desktop layout hint. Everything is full width on mobile. */
  span?: 'half' | 'full';
  visibleWhen?: Visibility;
};

export type TextFieldConfig = BaseField & {
  type: 'text';
  pattern?: { regex: string; message: string };
};
export type EmailFieldConfig = BaseField & { type: 'email' };
export type SelectFieldConfig = BaseField & { type: 'select'; options: SelectOption[] };
export type TextareaFieldConfig = BaseField & { type: 'textarea'; maxLength?: number };
export type CheckboxFieldConfig = BaseField & { type: 'checkbox' };

export type FieldConfig =
  | TextFieldConfig
  | EmailFieldConfig
  | SelectFieldConfig
  | TextareaFieldConfig
  | CheckboxFieldConfig;

export type FieldType = FieldConfig['type'];

/** Checkboxes hold a boolean, every other control holds a string. */
export type FieldValue = string | boolean;

export type FormValues = Record<string, FieldValue>;

/** Field name -> error message. A missing key means the field is valid. */
export type FormErrors = Record<string, string>;
