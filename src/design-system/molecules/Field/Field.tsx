import { useId, type ReactNode } from 'react';
import styles from './Field.module.css';

/** Props the Field hands to whatever control sits in its slot. */
export type ControlProps = {
  id: string;
  required?: boolean;
  'aria-invalid'?: true;
  'aria-describedby'?: string;
};

export type FieldProps = {
  label: string;
  hint?: string;
  error?: string;
  required?: boolean;
  /**
   * Set when the control renders its own label (e.g. a checkbox, where the
   * label sits beside the box). The Field then skips its own <label>.
   */
  controlHasLabel?: boolean;
  className?: string;
  children: (control: ControlProps) => ReactNode;
};

export function Field({
  label,
  hint,
  error,
  required,
  controlHasLabel = false,
  className,
  children,
}: FieldProps) {
  const id = useId();
  const hintId = `${id}-hint`;
  const errorId = `${id}-error`;

  const describedBy = [hint && hintId, error && errorId].filter(Boolean).join(' ');

  const control: ControlProps = {
    id,
    required,
    'aria-invalid': error ? true : undefined,
    'aria-describedby': describedBy || undefined,
  };

  return (
    <div className={[styles.field, className].filter(Boolean).join(' ')}>
      {!controlHasLabel && (
        <label htmlFor={id} className={styles.label}>
          {label}
          {required && (
            <span className={styles.required} aria-hidden="true">
              {' '}*
            </span>
          )}
        </label>
      )}

      {children(control)}

      {hint && (
        <p id={hintId} className={styles.hint}>
          {hint}
        </p>
      )}

      {/* Always rendered so screen readers pick up the message when it appears. */}
      <p id={errorId} className={styles.error} aria-live="polite">
        {error}
      </p>
    </div>
  );
}
