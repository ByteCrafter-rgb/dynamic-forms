import { useEffect, useMemo, useRef, useState } from 'react';
import { DynamicForm } from '../form/DynamicForm';
import type { FieldConfig, FieldValue, FormErrors, FormValues } from '../form/types';
import { leadFormConfig } from './leadFormConfig';
import { isVisible, validate, validateField } from './validation';
import styles from './LeadPage.module.css';

function emptyValues(config: FieldConfig[]): FormValues {
  return Object.fromEntries(config.map((f) => [f.name, f.type === 'checkbox' ? false : '']));
}

function setError(errors: FormErrors, name: string, message: string | undefined): FormErrors {
  const next = { ...errors };
  if (message) next[name] = message;
  else delete next[name];
  return next;
}

export function LeadPage() {
  const [values, setValues] = useState<FormValues>(() => emptyValues(leadFormConfig));
  const [errors, setErrors] = useState<FormErrors>({});
  const [submitted, setSubmitted] = useState<FormValues | null>(null);

  const formRef = useRef<HTMLFormElement>(null);
  const resultRef = useRef<HTMLHeadingElement>(null);

  const visibleFields = useMemo(
    () => leadFormConfig.filter((field) => isVisible(field, values)),
    [values],
  );

  useEffect(() => {
    if (submitted) resultRef.current?.focus();
  }, [submitted]);

  const handleChange = (name: string, value: FieldValue) => {
    const next = { ...values, [name]: value };
    setValues(next);

    setErrors((prev) => {
      let updated = prev;
      for (const field of leadFormConfig) {
        if (!(field.name in updated)) continue;

        if (!isVisible(field, next)) {
          // field just got hidden (e.g. company name) - its error goes with it
          updated = setError(updated, field.name, undefined);
        } else if (field.name === name) {
          // already showing an error: re-check so it clears as soon as it's fixed
          updated = setError(updated, name, validateField(field, next));
        }
      }
      return updated;
    });
  };

  const handleBlur = (name: string) => {
    const field = leadFormConfig.find((f) => f.name === name);
    if (!field) return;
    setErrors((prev) => setError(prev, name, validateField(field, values)));
  };

  const handleSubmit = () => {
    const nextErrors = validate(leadFormConfig, values);
    setErrors(nextErrors);

    const firstInvalid = visibleFields.find((field) => nextErrors[field.name]);
    if (firstInvalid) {
      setSubmitted(null);
      const el = formRef.current?.elements.namedItem(firstInvalid.name);
      if (el instanceof HTMLElement) el.focus();
      return;
    }

    // hidden fields are left out of what we "send"
    const payload: FormValues = {};
    for (const field of visibleFields) {
      const value = values[field.name];
      payload[field.name] = typeof value === 'string' ? value.trim() : value;
    }
    console.log('Lead submitted', payload);
    setSubmitted(payload);
  };

  return (
    <main className={styles.page}>
      <header className={styles.header}>
        <h1 className={styles.title}>New lead</h1>
        <p className={styles.intro}>
          Tell us a bit about yourself and we'll get back to you. Fields marked * are required.
        </p>
      </header>

      <section className={styles.card} aria-label="Lead details">
        <DynamicForm
          ref={formRef}
          fields={visibleFields}
          values={values}
          errors={errors}
          onChange={handleChange}
          onBlur={handleBlur}
          onSubmit={handleSubmit}
          submitLabel="Submit lead"
        />
      </section>

      {submitted && (
        <section className={styles.result} aria-labelledby="result-heading">
          <h2 id="result-heading" ref={resultRef} tabIndex={-1} className={styles.resultTitle}>
            Submitted values
          </h2>
          <pre className={styles.pre}>{JSON.stringify(submitted, null, 2)}</pre>
        </section>
      )}
    </main>
  );
}
