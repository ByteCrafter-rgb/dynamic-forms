import { forwardRef, type FormEvent } from 'react';
import { Button } from '../design-system/atoms/Button';
import { Field } from '../design-system/molecules/Field';
import { getRegistryEntry } from './fieldRegistry';
import type { FieldConfig, FieldValue, FormErrors, FormValues } from './types';
import styles from './DynamicForm.module.css';

export type DynamicFormProps = {
  /** Fields to render, in order. The caller decides which ones are visible. */
  fields: FieldConfig[];
  values: FormValues;
  errors: FormErrors;
  onChange: (name: string, value: FieldValue) => void;
  onBlur: (name: string) => void;
  onSubmit: () => void;
  submitLabel?: string;
};

export const DynamicForm = forwardRef<HTMLFormElement, DynamicFormProps>(function DynamicForm(
  { fields, values, errors, onChange, onBlur, onSubmit, submitLabel = 'Submit' },
  ref,
) {
  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    onSubmit();
  };

  return (
    <form ref={ref} className={styles.form} onSubmit={handleSubmit} noValidate>
      {fields.map((field) => {
        const entry = getRegistryEntry(field);
        const spanClass = field.span === 'half' ? styles.half : styles.full;

        return (
          <Field
            key={field.name}
            className={spanClass}
            label={field.label}
            hint={field.hint}
            error={errors[field.name]}
            required={field.required}
            controlHasLabel={entry.controlHasLabel}
          >
            {(control) =>
              entry.render({
                field,
                value: values[field.name],
                onChange: (value) => onChange(field.name, value),
                onBlur: () => onBlur(field.name),
                control,
              })
            }
          </Field>
        );
      })}

      <div className={styles.actions}>
        <Button type="submit" className={styles.submit}>
          {submitLabel}
        </Button>
      </div>
    </form>
  );
});
