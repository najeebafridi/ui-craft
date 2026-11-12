# Forms

Load this when you build any form, input, validation flow, settings page, sign-in or sign-up screen.

A form is a conversation. Ask for as little as possible, in a clear order, and say plainly what went wrong.

## Layout
- **One column.** Short, related fields may share a row (city / state / postcode; first / last name). Never put unrelated fields side by side.
- **Label above the field**, left-aligned, always visible. Placeholder is never the label (it vanishes on typing and is low contrast).
- **Field width hints at the answer.** Postcode 120px, date 160px, phone 200px, name or email full column width (max 400–480px). A full-width box for a 4-digit code looks wrong.
- Gap between label and input: 4–8px. Gap between fields: 16–24px. Gap between groups: 32–48px.
- Max form width 480–640px on desktop. Do not stretch a form across 1440px.
- Group related fields with `<fieldset>` and `<legend>` ("Shipping address", "Payment method"). Always do this for radio and checkbox groups. Reason: screen readers read the legend with each option.
- Primary button below the fields, left-aligned with them. On phones, full width. Secondary action ("Cancel") is a text button next to it, never above it.
- No "Reset" or "Clear" button. It destroys work and nobody wants it.
- Cut fields. Each one lowers completion. If you do not need it now, ask later.

## Input types, autocomplete, inputmode
Pick the right `type`, `autocomplete` and `inputmode`. It gives the right phone keyboard and lets browsers autofill.

| Data | Markup |
|---|---|
| Email | `type="email" autocomplete="email" spellcheck="false"` |
| Phone | `type="tel" autocomplete="tel"` |
| Name | `type="text" autocomplete="name"` (or `given-name`, `family-name`) |
| Street, city, postcode | `autocomplete="street-address"`, `address-level2`, `postal-code` |
| Card number | `inputmode="numeric" autocomplete="cc-number"` |
| One-time code | `inputmode="numeric" autocomplete="one-time-code"` |
| Whole number / amount | `inputmode="numeric"` or `decimal` |
| Search | `type="search"` |
| Password | `type="password" autocomplete="current-password"` or `new-password` |

- Use `inputmode="numeric"` instead of `type="number"` for codes, IDs and card numbers. `type="number"` adds spinners and changes values on scroll.
- Input font size 16px or more on phones, or iOS zooms in.
- Trim leading and trailing spaces on submit. Accept formats flexibly ("555 123 4567", "555-123-4567"); store them strictly.
- Show the expected format up front in the hint ("DD/MM/YYYY"), not only after an error.
- Never block paste. Never block autofill.

## Required and optional
- Most fields are required. So **mark the optional ones** with "(optional)" in the label: "Company (optional)". Reason: words beat a symbol people must decode.
- If most fields are optional, mark the required ones instead.
- Keep optional fields to 1–2 per form.

## Helper text
- Sits under the field, 12–14px, muted colour (still 4.5:1).
- One short sentence, no full stop needed. Say what you want, not what the field is: "We'll send the receipt here", not "Email address field".
- When an error appears, it replaces or sits above the helper text. Keep both linked with `aria-describedby`.

## Validation
- **Validate when the user leaves a field (blur), and again on submit.** Never show an error while the user is still typing the first time.
- After a field has an error, re-check it on every change so the error clears as soon as it is fixed.
- Live positive feedback is fine while typing: password strength, "username is free".
- **Error message = what is wrong + how to fix it.** "Enter an email like name@example.com". Not "Invalid input".
- Show the message under the field, in red with an icon, plus a red border (3:1 contrast). Never red alone.
- **Never clear what the user typed.**
- Long forms (more than ~5 fields or several sections): also show an **error summary at the top** with links to each bad field. Put focus on the summary (or on the first bad field), and make each link focus its field.
- Short forms: inline errors only, and move focus to the first invalid field.
- Same wording in the summary and next to the field.
- Three or more errors on one submit usually means the form design is the problem. Fix the form.

## Submit button
- **Keep it enabled** while the form is incomplete. On click, show what is missing. A greyed button gives no reason.
- Disable it only while the request runs, and show a spinner inside it. Keep the label width stable ("Saving…").
- Name the action: "Create account", "Save changes", "Send invoice". Not "Submit".
- Guard against double submit (disable while pending). Reason: duplicate orders cost real money.
- On success, confirm (toast or inline) and move the user on. On failure, keep all input and explain.
- Warn before leaving a form with unsaved changes.

## Choosing the control
| Options | Use |
|---|---|
| 2–3, pick one | Radio buttons, all visible |
| 4–6, pick one | Radios if space allows, else select |
| 7–15, pick one | Native select |
| 15+, or users know the name | Combobox with type-ahead filter |
| Yes/no that needs a decision | Two radios ("Yes" / "No") |
| Pick many, 2–10 | Checkboxes |
| Pick many, long list | Multi-select combobox with chips |
| Dates | Native date input, or text input with format hint; calendar only if date range matters |

- Radio group: one option preselected only if there is a safe default. Otherwise none.
- **Checkbox** = a choice you confirm with Save/Submit. **Toggle (switch)** = takes effect immediately, no Save. Never use a toggle inside a form that has a Submit button. Reason: users cannot tell if it is on yet.
- Toggle label states the thing ("Email notifications"), and the on/off state is shown by position plus text or icon, not colour alone.
- Target size 44px on touch, with the label also clickable.

## Multi-step forms
- Use steps only when the form is long or has clearly separate parts (account, shipping, payment). Otherwise one page.
- Show progress: "Step 2 of 4" plus step names. A bar alone is not enough.
- Each step: one topic, 3–6 fields. Back button always works and keeps answers.
- Save answers between steps. Do not ask for the same data twice.
- Last step is a review with "Edit" links, then the final action button.
- Put the step number in the URL so refresh and Back work.

## Settings pages
- **Auto-save** for independent toggles and selects: change applies at once, show a small "Saved" confirmation. Offer undo for risky ones.
- **Explicit Save** for forms with text fields or settings that depend on each other (profile, billing). Show a sticky Save / Cancel bar once something changes.
- Do not mix both styles in one section. Say which one it is by using toggles (instant) or a Save button.
- Group by topic with headings; label on the left and control on the right is fine on wide screens, above on phones.
- Danger zone (delete account, transfer ownership) at the bottom, separated, red button.

## Sign-in and sign-up
- Allow paste in every field. Support password managers (`autocomplete="username"` / `current-password` / `new-password`).
- Offer a show/hide password button (a real `<button>` with `aria-pressed` and a label).
- Offer passkeys or a magic link first when the product supports it. Do not force memory tests or puzzles.
- Sign-up: email and password only. Ask the rest after.
- Show password rules before the user types them, and check them live (positive feedback).
- Error on failed sign-in: "Email or password is incorrect" in one message; do not reveal which one.
- "Forgot password?" link next to the password field, not below the button.
- Put Sign in as the primary button; "Create account" as a text link.

## Destructive actions
- Red button with a specific label: "Delete project", not "Delete" or "Yes".
- Confirm dialog names what is lost: "Delete Acme Rebrand? Its 24 files and 3 members' access will be removed. This cannot be undone."
- For very high stakes, ask the user to type the name.
- For quick, frequent deletes (a row, an email), skip the dialog and offer **Undo** in a toast for 6–10s.
- Focus starts on the safe button (Cancel) in the dialog.

## Example: one good field
```html
<div class="field">
  <label for="email">Work email</label>
  <p id="email-hint" class="hint">We'll send the invoice receipt here</p>
  <input id="email" name="email" type="email"
         autocomplete="email" spellcheck="false"
         aria-describedby="email-hint email-error"
         aria-invalid="true" required>
  <p id="email-error" class="error">
    <svg aria-hidden="true" width="16" height="16"><!-- alert icon --></svg>
    Enter an email like name@company.com
  </p>
</div>
```
```css
.field { display: grid; gap: 4px; max-width: 400px; }
.hint, .error { font-size: 13px; margin: 0; }
.hint { color: var(--text-muted); }
.error { color: var(--danger); display: flex; gap: 6px; align-items: center; }
input { height: 40px; padding: 0 12px; font-size: 16px;
        border: 1px solid var(--border-strong); border-radius: var(--radius); }
input[aria-invalid="true"] { border-color: var(--danger); }
input:focus-visible { outline: 2px solid var(--accent); outline-offset: 2px; }
```
- Render `.error` only when there is an error, and set `aria-invalid="true"` only then. Remove both when fixed.
- For a long-form summary, use `<div role="alert" tabindex="-1">` and focus it after a failed submit.

## Do / Don't
- Do: label above, hint below, error below the hint.
- Do: keep every input value after an error.
- Do: use `autocomplete` on every personal-data field.
- Don't: use placeholder as label, or disable submit to "prevent" errors.
- Don't: validate while typing, or show an error before the user touched the field.
- Don't: use a select for 2–3 options, or a toggle that needs a Save button.

## Common mistakes
- Placeholder-only fields, so the label disappears mid-typing.
- Error text that says "Invalid" with no fix, or errors shown only as a red border.
- Greyed-out submit with no hint about what is missing.
- Wiping the form after a server error.
- `type="number"` for phone numbers, zip codes and card numbers.
- Two-column forms where the reading order jumps around.
