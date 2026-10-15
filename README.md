# Dynamic lead form

A small design system plus a lead capture form that renders itself from a config array. React + TypeScript + Vite, plain CSS modules, no form or component libraries.

Live demo: https://bytecrafter-rgb.github.io/dynamic-forms/

## Running it

```bash
npm install
npm run dev        # http://localhost:5173
npm test           # validation unit tests (Vitest)
npm run build      # type-check + production build
```

## Folder layout

```
src/
  design-system/        # generic UI, knows nothing about forms or leads
    tokens/tokens.css   # colours, spacing, type, radii, breakpoints (documented)
    atoms/              # TextInput, Textarea, Select, Checkbox, Button
    molecules/Field/    # label + control slot + hint + error, a11y wiring
  form/                 # generic config-driven form, knows nothing about leads
    types.ts            # FieldConfig union, FormValues, FormErrors
    fieldRegistry.tsx   # config `type` -> atom
    DynamicForm.tsx     # renders one Field per config entry it is given
    DynamicForm.module.css
  lead/                 # everything lead-specific
    leadFormConfig.ts   # the 7 fields
    validation.ts       # validate(), validateField(), isVisible()
    validation.test.ts
    LeadPage.tsx        # state, blur/submit handling, submitted output
    LeadPage.module.css
```

Dependencies only point one way: `lead/ -> form/ -> design-system/`. Nothing in `design-system/` imports from `form/` or `lead/`, and `form/` never mentions leads.

## Where things live

| What | Where |
|---|---|
| Design tokens | `src/design-system/tokens/tokens.css` |
| Atoms | `src/design-system/atoms/*` |
| Field molecule | `src/design-system/molecules/Field` |
| Form config | `src/lead/leadFormConfig.ts` |
| Validation rules | `src/lead/validation.ts` (+ `validation.test.ts`) |
| Mobile + desktop form layout | `src/form/DynamicForm.module.css` |
| Page shell (padding, card, output) | `src/lead/LeadPage.module.css` |

## How it fits together

**Config drives the UI.** `leadFormConfig` is a typed array. `FieldConfig` is a discriminated union on `type`, so a `select` must have `options`, only `text` can have a `pattern`, and so on. To add a field you add one entry to the array; nothing else changes.

**Registry maps type to atom.** `fieldRegistry` has one entry per type. It's typed as a mapped type over `FieldConfig['type']`, so if a new type is added to the union without a registry entry, the build fails.

**Validation is pure.** `validate(config, values)` returns `{ [fieldName]: message }` and touches no React or DOM, which is why it's easy to unit-test. Per field the checks run in this order: required, email format, pattern, max length. The first failure wins. `validateField` is the same thing for one field and is used on blur.

**One source of truth for visibility.** `isVisible(field, values)` lives in `validation.ts`. `LeadPage` uses it to filter the config before handing it to `DynamicForm`, and `validate` uses it to skip hidden fields. So Company name is required only when it's showing, and that rule exists in exactly one place. `DynamicForm` just renders the fields it's given, which keeps it generic.

**Hidden fields.** When Lead type switches away from Company, the Company name field disappears, its error is cleared, and it's left out of the submitted values. The typed value stays in state, so switching back doesn't lose it.

**Behaviour.** Fields validate on blur (that field only) and on submit (all visible fields). On a blocked submit every error is shown and focus moves to the first invalid field. Once a field is showing an error, it re-checks as you type so the message clears as soon as it's fixed. A valid submit shows the values in a `<pre>` under the form (and logs them to the console). The form uses `noValidate` so browser bubbles don't compete with the custom messages.

## Design decisions worth calling out

- **Why a Textarea atom.** The brief lists `textarea` as a config type (Notes), and a `<textarea>` has different behaviour from an `<input>`: multi-line, resizable, no `type`. Bending `TextInput` to cover both would mean a pile of conditionals, so it gets its own small atom.
- **Labels live in Field, not the atoms.** Field owns the `<label>`, hint and error so the `useId` / `htmlFor` / `aria-describedby` wiring happens in one place and atoms stay dumb. The exception is Checkbox, which renders its own label next to the box (that's how checkboxes are normally laid out); the registry flags it with `controlHasLabel` and Field skips its label.
- **Atoms are lead-agnostic.** They take a value, an `onChange(value)`, `onBlur` and native attributes. No validation, no lead names. The invalid style hangs off `aria-invalid`, so there's no separate "error" prop to keep in sync.
- **Accessibility.** Labels are linked with `htmlFor`/`id`, invalid controls get `aria-invalid`, hints and errors are linked with `aria-describedby`, and the error slot is an `aria-live="polite"` region so new messages get announced. After a valid submit, focus moves to the "Submitted values" heading.

## Responsive layout

Mobile first. Breakpoints are written as literal values in the CSS (custom properties can't be used inside `@media`) and documented in `tokens.css`.

- **Under 768px:** one column, full-width inputs, submit button in a bar that sticks to the bottom of the screen (with `env(safe-area-inset-bottom)` padding).
- **768px to 1024px:** same layout as mobile, with more page padding.
- **Over 1024px** (`min-width: 1025px`): two columns. Fields with `span: 'half'` share a row (Full name + Email); Notes and Consent span the full width. The submit button sits in the normal flow under the form.
- No horizontal overflow: grid columns are `minmax(0, 1fr)`, grid children get `min-width: 0`, and labels, hints and errors use `overflow-wrap: anywhere`.

Checked at 360, 768, 1024 and 1280px wide.
