import type { TextareaHTMLAttributes } from 'react';
import styles from './Textarea.module.css';

type NativeProps = Omit<TextareaHTMLAttributes<HTMLTextAreaElement>, 'value' | 'onChange'>;

export type TextareaProps = NativeProps & {
  value: string;
  onChange: (value: string) => void;
};

export function Textarea({ value, onChange, rows = 4, className, ...rest }: TextareaProps) {
  return (
    <textarea
      {...rest}
      rows={rows}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className={[styles.textarea, className].filter(Boolean).join(' ')}
    />
  );
}
