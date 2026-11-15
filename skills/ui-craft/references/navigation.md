# Navigation

Load this when you build an app shell, sidebar, top bar, tabs, breadcrumbs, menus, search, a marketing header, or native app navigation.

## App shell by screen size
| Size | Pattern |
|---|---|
| Phone (<640px) | **Bottom tab bar, 3–5 items**, 56–64px tall plus safe area. Top bar with title. |
| Tablet (640–1024px) | **Navigation rail**, ~72–80px, icons with small labels. |
| Desktop app (≥1024px) | **Left sidebar 220–280px**, collapsible to an **icon rail 56–72px**. |
| Marketing site | **Top bar**, 4–6 links + 1 CTA button. |

- Choose by window width, not by device name. Windows resize.
- Content area gets the rest; page max-width 1200–1440px, centred, or fluid for data screens.
- Sidebar and top bar stay fixed while the content scrolls.
- Hamburger menus only for secondary items. Never hide the main sections on desktop.

## Sidebar structure
From top to bottom:
1. **Logo or workspace switcher** (40–56px tall).
2. **Primary sections** (5–8 items): Dashboard, Projects, Invoices… Group with small headings if more than 8.
3. Flexible space.
4. **Secondary** at the bottom: Settings, Help, Docs.
5. **User menu** (avatar + name) at the very bottom, opens a menu: Profile, Switch account, Sign out.

- Items 36–40px tall (compact 32), 8–12px horizontal padding, icon 16–20px + label 14px.
- Icon and text both: icons alone are ambiguous. In the collapsed rail, show a tooltip on hover/focus.
- Max 2 levels. A third level means your information structure needs work.
- Badges (counts) sit on the right, small and muted; use accent only when action is needed.
- Collapse state is remembered. Keyboard shortcut to toggle (e.g. `[`).

## Active state
- Current item: tinted background + stronger weight or text colour + a 2–3px accent bar on the edge. **Not colour alone.**
- Mark with `aria-current="page"` on the link.
- Hover is lighter than active. Focus ring is separate and always visible.
- Parent stays highlighted when a child page is open.

## Top bar
- Height 48–64px (apps 48–56). Contents, left to right: page or workspace context, global search (or its button), then right-aligned: help, notifications, user menu.
- On phones, shrink to: back or menu button, title, 1–2 icon actions.
- No more than ~5 items on the right. Move the rest into the user menu.
- Do not duplicate sidebar items in the top bar.

## Page header
Every page starts the same way:
```
Breadcrumbs (if depth ≥ 3)
Title (h1)                                   [Secondary] [Primary action]
One-line description in muted text
Tabs (if the page has peer views)
```
- Title 24–30px semibold. Description 14px muted, 1 line.
- **Primary action on the right**, one only. Others are secondary or in a "⋯" menu.
- Sticky page header only if the page is long and has actions users need while scrolling.
- Same pattern on every page. Reason: users learn where to look.

## Breadcrumbs
- Use when the hierarchy is **3 or more levels** deep: `Projects / Acme Rebrand / Files`.
- Every part is a link except the last (`aria-current="page"`). Wrap in `<nav aria-label="Breadcrumb">` with an `<ol>`.
- On phones, show only the parent as a "‹ Projects" back link.
- Do not use breadcrumbs as the main navigation, and do not add them on flat apps.

## Tabs
- For **peer views of the same object** (Overview, Activity, Settings of one project). Not for steps and not for site sections.
- **Max 6 tabs.** More means use a sidebar sub-nav or an overflow "More" tab.
- Labels 1–2 words, sentence case. Active tab: accent underline 2px plus stronger text.
- Each tab has its own URL (`/projects/12/activity`). Tab switch must not lose unsaved work without a warning.
- Keyboard: Left/Right arrows between tabs, Home/End, only the active tab in the Tab order; `role="tablist"` when tabs swap panels on the same page. If tabs are really links to pages, use `<nav>` with links and `aria-current`.
- Tabs scroll horizontally on phones; show a clipped edge to hint at more.

## Command palette and search
- **Cmd/Ctrl+K** opens a palette: search pages, records and actions in one box. Add it to apps with 20+ destinations or many actions.
- Show the shortcut in the search field ("Search… ⌘K"). Also provide a visible button, since not everyone knows shortcuts.
- Results grouped (Pages, Records, Actions), keyboard-driven: arrows move, Enter runs, Esc closes. Show recent items when empty.
- ARIA: dialog with a combobox and listbox; focus returns to the opener on close.
- Plain site search: a search field in the top bar (marketing: an icon that expands). Results page with filters.

## URL state and deep links
- **URL holds the state that matters:** current tab, filters, sort, page, selected record, open panel.
- Every screen can be opened by link and survives a refresh.
- Use real `<a href>` so Cmd/Ctrl-click, middle-click and "copy link" work. Use `<button>` for actions only.
- Use replace (not push) for small changes like typing in a filter, so Back does not step through every keystroke.
- Unknown URL: a helpful 404 with a link home and the sidebar still present.

## Back behaviour
- Browser Back goes to the previous view with the same scroll position and filters.
- In-app "Back" link goes to the parent in the hierarchy, not just history, when the user arrived from outside.
- Closing a panel or dialog with Esc or X does not change the page behind it. Panels that change the URL should be closable with Back.
- Warn before leaving a form with unsaved changes.

## Mobile menu (web)
- A button with `aria-expanded` and `aria-controls` that shows a panel with a **list of links** (disclosure pattern). Do **not** use `role="menu"`. Reason: that role promises arrow-key menu behaviour a site nav does not have.
- Button label: "Menu" or an icon with `aria-label="Open menu"`. Target ≥ 44px.
- Full-width panel or drawer from the left; links 48px tall; Esc and a close button work; focus moves in and returns.
- Prevent body scroll while open. Show the CTA at the bottom.
- `role="menu"` is only for app action menus (a "⋯" menu of Edit / Duplicate / Delete).

## Keyboard shortcuts
- Offer for frequent actions in pro tools: `C` create, `/` focus search, `?` show shortcut list, `G` then `D` go to dashboard.
- Never override browser or OS shortcuts (Cmd/Ctrl+R, T, W, L).
- Single-letter shortcuts only work when focus is not in a text field, and must be disable-able or remappable.
- Show shortcuts in tooltips and menus. Every shortcut has a visible alternative.

## Marketing site header and footer
- Header: logo left, 4–6 links, one filled CTA right ("Start free trial"), optional quiet "Sign in" link. Height 64–80px.
- Sticky header is fine if slim (≤ 64px) and it does not cover focused items.
- Dropdowns only if a section has 4+ sub-pages; open on click, not only hover.
- Footer: 3–5 columns of links (Product, Company, Resources, Legal), logo, one line about the company, social links, copyright, legal links. Repeat the main CTA once above it.
- Footer links 14px, muted, with enough spacing for touch (≥ 24px targets, 44px on phones).
- Skip link ("Skip to content") as the first focusable item.

## Desktop app notes (Electron, native)
- Follow the OS: macOS app menu bar, Cmd shortcuts, traffic lights top-left; Windows menu in the title bar or hamburger, Ctrl shortcuts, controls top-right.
- Custom title bar must keep a draggable area (≥ 24px) and the window controls in the standard place.
- Provide the standard menus: File, Edit, View, Window, Help; Preferences/Settings at the OS-expected shortcut (`Cmd+,` / `Ctrl+,`).
- Sidebar + toolbar (36–48px). Toolbar holds the main actions with labels or tooltips.
- Support right-click context menus, drag and drop, and window resize down to ~800px.

## Native mobile notes
- **iOS:** tab bar at the bottom (3–5 tabs, icon + label), navigation bar on top with a large title and a back chevron labelled with the previous title. Swipe from the left edge goes back; never block it. Sheets slide up from the bottom. Avoid hamburger menus.
- **Android (Material):** bottom navigation bar for 3–5 destinations on phones, navigation rail on medium widths, drawer on large. Top app bar with up arrow. System back gesture always works. Targets 48dp.
- Respect safe areas, keep primary actions in the thumb zone, and keep the same tab order across sessions.
- Tapping the active tab returns to its root (and scrolls to top).

## Do / Don't
- Do: one clear place for each destination; same name everywhere.
- Do: show where you are (active state, breadcrumb, page title).
- Don't: hide main navigation behind a hamburger on desktop.
- Don't: put more than 6 tabs, 8 top-bar links, or 3 nav levels.

## Common mistakes
- Active item shown only by a slightly different colour.
- `role="menu"` on a site navigation list.
- Tabs used as wizard steps, or with state that is lost on switch.
- Filters and tabs kept in memory, so refresh and shared links break.
- Bottom tab bar with 7 items, or with icons only.
- Page headers that move the primary action to a different corner on each page.
