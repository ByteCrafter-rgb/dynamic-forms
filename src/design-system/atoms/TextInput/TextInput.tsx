import type { InputHTMLAttributes } from 'react';
import styles from './TextInput.module.css';

type NativeProps = Omit<InputHTMLAttributes<HTMLInputElement>, 'value' | 'onChange' | 'type'>;

export type TextInputProps = NativeProps & {
  value: string;
  onChange: (value: string) => void;
  type?: 'text' | 'email';
};

export function TextInput({ value, onChange, type = 'text', className, ...rest }: TextInputProps) {
  return (
    <input
      {...rest}
      type={type}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className={[styles.input, className].filter(Boolean).join(' ')}
    />
  );
}
