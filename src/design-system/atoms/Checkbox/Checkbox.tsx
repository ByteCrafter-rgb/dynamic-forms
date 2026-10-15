import type { InputHTMLAttributes } from 'react';
import styles from './Checkbox.module.css';

type NativeProps = Omit<
  InputHTMLAttributes<HTMLInputElement>,
  'value' | 'checked' | 'onChange' | 'type'
>;

export type CheckboxProps = NativeProps & {
  id: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
  /** Checkboxes keep their label next to the box rather than above it. */
  label: string;
};

export function Checkbox({ id, checked, onChange, label, required, className, ...rest }: CheckboxProps) {
  return (
    <div className={[styles.row, className].filter(Boolean).join(' ')}>
      <input
        {...rest}
        id={id}
        type="checkbox"
        checked={checked}
        required={required}
        onChange={(e) => onChange(e.target.checked)}
        className={styles.box}
      />
      <label htmlFor={id} className={styles.label}>
        {label}
        {required && (
          <span className={styles.required} aria-hidden="true">
            {' '}*
          </span>
        )}
      </label>
    </div>
  );
}
