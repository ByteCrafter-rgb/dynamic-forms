import { describe, expect, it } from 'vitest';
import type { FormValues } from '../form/types';
import { leadFormConfig } from './leadFormConfig';
import { isVisible, validate } from './validation';

const validIndividual: FormValues = {
  fullName: 'Asha Rao',
  email: 'asha@example.com',
  leadType: 'individual',
  companyName: '',
  phone: '9876543210',
  notes: '',
  consent: true,
};

const withValues = (overrides: FormValues): FormValues => ({ ...validIndividual, ...overrides });

const companyField = leadFormConfig.find((f) => f.name === 'companyName')!;

describe('validate', () => {
  it('passes a fully valid individual lead', () => {
    expect(validate(leadFormConfig, validIndividual)).toEqual({});
  });

  describe('required', () => {
    it('flags every empty required field', () => {
      const errors = validate(leadFormConfig, {
        fullName: '',
        email: '',
        leadType: '',
        phone: '',
        notes: '',
        consent: false,
      });
      expect(Object.keys(errors).sort()).toEqual(
        ['consent', 'email', 'fullName', 'leadType', 'phone'].sort(),
      );
    });

    it('treats whitespace-only text as empty', () => {
      expect(validate(leadFormConfig, withValues({ fullName: '   ' }))).toEqual({
        fullName: 'Full name is required',
      });
    });

    it('requires the consent box to be ticked', () => {
      expect(validate(leadFormConfig, withValues({ consent: false }))).toHaveProperty('consent');
    });

    it('does not require optional fields', () => {
      expect(validate(leadFormConfig, withValues({ notes: '' }))).not.toHaveProperty('notes');
    });
  });

  describe('email', () => {
    it.each(['asha', 'asha@', 'asha@example', '@example.com', 'asha @example.com'])(
      'rejects "%s"',
      (email) => {
        expect(validate(leadFormConfig, withValues({ email }))).toEqual({
          email: 'Enter a valid email address',
        });
      },
    );

    it('accepts a normal address', () => {
      expect(validate(leadFormConfig, withValues({ email: 'a.b+tag@mail.co.in' }))).toEqual({});
    });

    it('reports required before format', () => {
      expect(validate(leadFormConfig, withValues({ email: '' }))).toEqual({
        email: 'Email is required',
      });
    });
  });

  describe('phone', () => {
    it.each(['12345', '12345678901', '98765-43210', 'abcdefghij', '98765 4321'])(
      'rejects "%s"',
      (phone) => {
        expect(validate(leadFormConfig, withValues({ phone }))).toEqual({
          phone: 'Phone number must be exactly 10 digits',
        });
      },
    );

    it('accepts exactly 10 digits', () => {
      expect(validate(leadFormConfig, withValues({ phone: '0123456789' }))).toEqual({});
    });
  });

  describe('notes', () => {
    it('allows exactly 200 characters', () => {
      expect(validate(leadFormConfig, withValues({ notes: 'a'.repeat(200) }))).toEqual({});
    });

    it('rejects 201 characters', () => {
      expect(validate(leadFormConfig, withValues({ notes: 'a'.repeat(201) }))).toEqual({
        notes: 'Notes must be 200 characters or fewer',
      });
    });
  });

  describe('company name', () => {
    it('is required when lead type is company', () => {
      expect(validate(leadFormConfig, withValues({ leadType: 'company', companyName: '' }))).toEqual({
        companyName: 'Company name is required',
      });
    });

    it('passes when lead type is company and a name is given', () => {
      expect(
        validate(leadFormConfig, withValues({ leadType: 'company', companyName: 'Acme Ltd' })),
      ).toEqual({});
    });

    it('is not required for individuals', () => {
      expect(validate(leadFormConfig, withValues({ leadType: 'individual', companyName: '' }))).toEqual(
        {},
      );
    });
  });

  describe('hidden fields', () => {
    it('skips hidden fields entirely, even if their stale value is bad', () => {
      // e.g. user typed a company name, then switched back to Individual
      const errors = validate(leadFormConfig, withValues({ leadType: 'individual', companyName: '   ' }));
      expect(errors).not.toHaveProperty('companyName');
    });

    it('skips hidden fields when lead type has not been chosen yet', () => {
      expect(validate(leadFormConfig, withValues({ leadType: '' }))).toEqual({
        leadType: 'Lead type is required',
      });
    });
  });

  it('does not mutate the values it is given', () => {
    const values = withValues({ email: 'bad' });
    const snapshot = { ...values };
    validate(leadFormConfig, values);
    expect(values).toEqual(snapshot);
  });
});

describe('isVisible', () => {
  it('shows fields without a visibleWhen rule', () => {
    expect(isVisible(leadFormConfig[0], {})).toBe(true);
  });

  it('shows company name only for company leads', () => {
    expect(isVisible(companyField, { leadType: 'company' })).toBe(true);
    expect(isVisible(companyField, { leadType: 'individual' })).toBe(false);
    expect(isVisible(companyField, {})).toBe(false);
  });
});
