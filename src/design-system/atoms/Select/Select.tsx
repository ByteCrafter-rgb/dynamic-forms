import type { SelectHTMLAttributes } from 'react';
import styles from './Select.module.css';

type NativeProps = Omit<SelectHTMLAttributes<HTMLSelectElement>, 'value' | 'onChange'>;

export type SelectProps = NativeProps & {
  value: string;
  onChange: (value: string) => void;
  options: { value: string; label: string }[];
  placeholder?: string;
};

export function Select({
  value,
  onChange,
  options,
  placeholder = 'Select…',
  className,
  ...rest
}: SelectProps) {
  return (
    <div className={styles.wrapper}>
      <select
        {...rest}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={[styles.select, className].filter(Boolean).join(' ')}
      >
        <option value="" disabled>
          {placeholder}
        </option>
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
      <span className={styles.chevron} aria-hidden="true" />
    </div>
  );
}
