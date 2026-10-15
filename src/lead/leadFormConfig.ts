import type { FieldConfig } from '../form/types';

export const leadFormConfig: FieldConfig[] = [
  {
    name: 'fullName',
    label: 'Full name',
    type: 'text',
    required: true,
    span: 'half',
  },
  {
    name: 'email',
    label: 'Email',
    type: 'email',
    required: true,
    span: 'half',
  },
  {
    name: 'leadType',
    label: 'Lead type',
    type: 'select',
    required: true,
    span: 'half',
    options: [
      { value: 'individual', label: 'Individual' },
      { value: 'company', label: 'Company' },
    ],
  },
  {
    name: 'companyName',
    label: 'Company name',
    type: 'text',
    required: true,
    span: 'half',
    visibleWhen: { field: 'leadType', equals: 'company' },
  },
  {
    name: 'phone',
    label: 'Phone',
    type: 'text',
    required: true,
    span: 'half',
    hint: '10 digits, no spaces or dashes',
    pattern: { regex: '^\\d{10}$', message: 'Phone number must be exactly 10 digits' },
  },
  {
    name: 'notes',
    label: 'Notes',
    type: 'textarea',
    span: 'full',
    hint: 'Optional, up to 200 characters',
    maxLength: 200,
  },
  {
    name: 'consent',
    label: 'I agree to be contacted about this enquiry',
    type: 'checkbox',
    required: true,
    span: 'full',
  },
];
