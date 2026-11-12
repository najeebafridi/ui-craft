# Feedback states

Load this when you build loading, empty, error or success states, toasts, banners, or any action that talks to a server.

## 1. Timing ladder

| Wait | What to show |
|---|---|
| under 100ms | Pressed state only. The control reacts at once. |
| 100–300ms | Nothing new. A flash of spinner is worse than no spinner. |
| ~300ms and more | Show a spinner or skeleton. Once shown, keep it at least ~500ms. |
| 1–10s | Skeleton (page/section) or spinner (button/small widget). Say what is loading. |
| over 10s | Progress bar with % and time left. Add a Cancel button. |

- Press feedback comes from CSS (`:active`), not from the network. It must not wait for anything.
- Batches under 10s can show a count: "Sending 3 of 50".
- After the first click, never show "Don't click twice". Disable the button while the request runs, and show the spinner in it.
- Never show a bare static "Loading…". Say what: "Loading invoices…".

## 2. Skeleton, spinner or progress bar

- **Skeleton**: page or large section, layout known. Same boxes, sizes and columns as the real content. Reason: no layout jump when data arrives.
- **Spinner**: inside a button, a small card, or a widget. Not on every card in a grid (many tiny shimmers look busy).
- **Progress bar with %**: uploads, exports, imports, anything over ~10s.
- Shimmer is optional. If you add it, turn it off under `prefers-reduced-motion`.
- A skeleton does not fix a slow app. Fetch only what the first view needs.

## 3. Optimistic updates

Use for fast, likely-to-succeed actions: like, star, check off, rename, reorder.

1. Update the UI at once.
2. Send the request in the background.
3. On failure: roll the UI back and say so ("Couldn't save. Your change was undone. [Retry]").

Do not use for payments, deletes of shared data, or anything the server may reject often. Show a real pending state there.

**Undo beats confirm** for quick, frequent actions. Do the delete, show "Task deleted. [Undo]" for 6s, and only then really remove it. Use a confirm dialog only for rare, heavy loss, and name what is lost: "Delete project Apollo and its 42 files?"

## 4. Empty states

Formula: what this is + why it is empty + one button to start. Left-align in apps; centre is fine inside a blank panel.

| Type | Example copy | Action |
|---|---|---|
| First use | "No invoices yet. Invoices you create will appear here." | [Create invoice] |
| No results from filter | "No invoices match 'Acme' with status Overdue." | [Clear filters] |
| Cleared / done | "All caught up. No unread messages." | none, or a quiet link |
| No permission | "You don't have access to billing. Ask an admin to add you." | [Request access] |

- While data is loading, show a skeleton, never an empty state. "No results" during a fetch is a lie.
- Keep the filter bar visible in a no-results state so the user can change it.
- Done states may be warm, but stay short. One line, no mascot needed.

## 5. Error states

Pick the smallest scope that fits.

- **Field**: message under the field, red text + icon, border 3:1. Shown when the user leaves the field, and on submit. Not while typing. Keep the typed value.
- **Section or widget**: replace only that area with a message and [Retry]. The rest of the page keeps working.
- **Full page** (404, 500, offline): say what happened, then give a way back: [Go to dashboard], [Try again], search. Keep the app header so the user is not stuck.
- **Form submit**: put a summary at the top with links to each bad field, and move focus to it. Keep the inline messages too.

**Error message formula:** what happened + what to do, plain words, near the cause.

- Good: "Card declined. Check the number or try another card."
- Good: "Password needs 8 or more characters."
- Bad: "Error 500", "Invalid input", "Oops! Something went wrong."
- Do not blame the user. Do not apologise in every message. Put codes in small text only if support needs them.

## 6. Success feedback

- **Inline** (a check next to the field, "Saved" near the button) when the result is local and the user is looking at it.
- **Toast** when the result is off-screen or the screen changed (e.g. after closing a dialog): "Invoice sent to Acme."
- A toast is never the only place for information. If the user must keep the content (a link, a code, an error to fix), put it on the page.
- Move the user on after success: go to the new item, or reset the form.

### Toast rules

- Place at bottom-left or bottom-centre on desktop, top or bottom on mobile (not over the primary action or a bottom tab bar). Pick one place for the whole product.
- Success toast lasts 4–6s. Errors that need action stay until dismissed.
- Pause the timer on hover and on keyboard focus. Always include a close button.
- Stack at most 3. Newer ones push older ones.
- Announce with a polite live region. The region must exist in the DOM before you add text.

```html
<!-- Put once in the page layout, empty on load -->
<div id="toasts" role="status" aria-live="polite" aria-atomic="true"></div>

<script>
  function toast(msg) {
    const el = document.createElement('div');
    el.className = 'toast';
    el.textContent = msg;               // inject text into the existing region
    document.getElementById('toasts').append(el);
    setTimeout(() => el.remove(), 5000);
  }
</script>
```

Use `role="alert"` (assertive) only for errors that block the user. Overuse makes screen readers interrupt.

## 7. Banners for system status

Use a banner for things that affect the whole page and last a while: maintenance, offline, expired trial, failed payment.

- Sits at the top of the content area, full width, above the page title. Not floating.
- Text + icon + colour (never colour alone). One action max: "Update card".
- Dismissible only if it is not critical. Status that is still true must not vanish.

```html
<div class="banner banner--warning" role="status">
  <svg aria-hidden="true" width="20" height="20">…</svg>
  <p>Payment failed. Update your card by 20 Nov to keep your plan.</p>
  <a href="/billing" class="btn btn--secondary">Update card</a>
</div>
```

## 8. Unsaved changes

- Warn when the user leaves a dirty form: browser `beforeunload` plus an in-app dialog for route changes.
- Dialog copy: "Leave without saving? Your changes to this invoice will be lost." Buttons: [Keep editing] (primary) and [Discard changes] (danger).
- Best fix is autosave with a quiet "Saved 2 min ago" status. Then no warning is needed.
- Clear the dirty flag after a successful save, or the warning nags.

## 9. Partial failure

When a batch only half works, say so with numbers and offer the fix: "Imported 46 of 50 rows. 4 rows have errors. [Download error list] [Retry failed]". Never say "Success" or "Failed" for a mixed result. Keep the successes.

## 10. Offline and slow network

- Detect with `navigator.onLine` and failed requests. Show a banner: "You're offline. Changes will sync when you reconnect."
- Keep showing cached data. Mark it stale ("Last updated 10:42").
- Queue writes and show them as "Pending". Retry with backoff. Never silently drop a user's change.
- On reconnect, remove the banner and show one quiet "Back online".

## Do / Don't

- Do show a pressed state in under 100ms. Don't wait for the network to do it.
- Do match skeleton shape to content. Don't use a skeleton for a 400ms load.
- Do keep what the user typed after an error. Don't clear the form.
- Do give every error a next step. Don't end on "Something went wrong."
- Do put important results on the page. Don't hide them in a toast.

## Common mistakes

- Showing "No results" while data is still loading.
- Spinner that flashes for 120ms, then content (no delay, no minimum time).
- Toast with an error the user must act on, gone after 4s.
- Toast region added to the DOM at the same moment as its text, so screen readers say nothing.
- Full-page error with no link back, or an error that resets the form.
- A disabled submit button with no explanation. Keep it enabled and show what is missing on click.
