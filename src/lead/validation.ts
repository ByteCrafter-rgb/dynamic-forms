import type { FieldConfig, FieldValue, FormErrors, FormValues } from '../form/types';

// Deliberately loose: something@something.tld. Real verification happens by
// actually emailing the person, not with a regex.
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/**
 * Whether a field should be shown for the current values. The renderer and
 * the validator both call this, so "required only when visible" is decided
 * in exactly one place.
 */
export function isVisible(field: FieldConfig, values: FormValues): boolean {
  if (!field.visibleWhen) return true;
  return values[field.visibleWhen.field] === field.visibleWhen.equals;
}

function isEmpty(field: FieldConfig, value: FieldValue | undefined): boolean {
  if (field.type === 'checkbox') return value !== true;
  return typeof value !== 'string' || value.trim() === '';
}

function requiredMessage(field: FieldConfig): string {
  return field.type === 'checkbox' ? 'Please tick this box to continue' : `${field.label} is required`;
}

/**
 * Validate a single field. Returns the first failing rule's message, or
 * undefined if the field is fine. Order: required -> email -> pattern -> maxLength.
 */
export function validateField(field: FieldConfig, values: FormValues): string | undefined {
  if (!isVisible(field, values)) return undefined;

  const value = values[field.name];

  if (isEmpty(field, value)) {
    return field.required ? requiredMessage(field) : undefined;
  }

  // Past this point the value is non-empty. Only checkbox values are booleans.
  if (typeof value !== 'string') return undefined;
  const text = value.trim();

  switch (field.type) {
    case 'email':
      if (!EMAIL_RE.test(text)) return 'Enter a valid email address';
      break;
    case 'text':
      if (field.pattern && !new RegExp(field.pattern.regex).test(text)) {
        return field.pattern.message;
      }
      break;
    case 'textarea':
      if (field.maxLength !== undefined && value.length > field.maxLength) {
        return `${field.label} must be ${field.maxLength} characters or fewer`;
      }
      break;
  }

  return undefined;
}

/** Validate every visible field. Pure: same config + values, same result. */
export function validate(config: FieldConfig[], values: FormValues): FormErrors {
  const errors: FormErrors = {};
  for (const field of config) {
    const message = validateField(field, values);
    if (message) errors[field.name] = message;
  }
  return errors;
}
