# Platforms: feeling native and premium on every device

Load this when you build for a specific platform: an iPhone or iPad app, an Android app, a Mac or Windows desktop app (native, Electron, Tauri, Qt), a tablet or foldable layout, a cross-platform app (Flutter, React Native, Compose Multiplatform), or a watch or TV screen. For responsive web layout see `layout-spacing.md` and `mobile-touch.md`.

## The rule

**The platform owns the bones; the brand owns the character.** On each platform, use its own navigation, controls, system font for chrome, gestures, shortcuts and materials. Express the product through colour, content, icons, imagery, voice, the layout of your own content and one signature. An app that redraws the operating system looks fake, however pretty.

Platform design languages change every year. Use the numbers here as sound defaults and check the platform's current guidelines for exact values when it matters.

## Quick numbers

| | iOS / iPadOS | Android | macOS | Windows 11 | Web |
|---|---|---|---|---|---|
| Unit | pt | dp | pt | epx | CSS px |
| Minimum target | 44 | 48 | ~28 high controls, pointer-sized | 32 mouse, 40-44 touch | 24 (44 touch) |
| Body text | 17 | 16 (14 secondary) | 13 | 14 | 16 (14 dense) |
| System font | SF Pro | Roboto / device font | SF Pro | Segoe UI Variable | project font |
| Side margin | 16-20 | 16 compact, 24 from medium | 16-20 | 16-24 | 16 / 24 / 32 |
| Corner radius | system, concentric with device | per component, 4 to 28 and "full" | system | 4 controls, 8 windows and overlays | by direction |
| Press feedback | highlight + haptic | state layer (ripple) + haptic | highlight | hover fill, pressed fill | hover + pressed |

1 pt = 1 dp = 1 epx = 1 CSS px at standard density. Do not force the web type scale onto native text styles: use the platform's named styles so user font-size settings work.

## The same feature on each platform

| Feature | iOS / iPadOS | Android | macOS | Windows 11 | Web (desktop) |
|---|---|---|---|---|---|
| Main navigation | bottom tab bar, 3-5; iPad: sidebar that folds to tabs | bottom bar (narrow), rail (medium), drawer (wide) | sidebar + toolbar; never bottom tabs | left navigation pane or top tabs | sidebar or top bar |
| Back | swipe from the left edge + back button | system back gesture (predictive) | toolbar back, Cmd+[ | title-bar back, Alt+Left | browser back must work |
| Primary action | top-right bar button, or a prominent bottom button | floating action button, bottom right | toolbar button; default button answers Return | accent button; command bar | one solid accent button |
| Settings | in-app list of rows | settings screen from the profile or overflow | Settings window, Cmd+, | Settings at the bottom of the nav pane | settings page from the avatar menu |
| Destructive confirm | action sheet, red verb, Cancel | dialog with verb buttons, or a snackbar with Undo | sheet attached to the window | dialog with a clear verb | dialog naming what is lost, or Undo |
| Context menu | long press; swipe actions on rows | long press; three-dot overflow | right click | right click, Shift+F10 | right click on desktop |
| Search | search field under the title, or a search tab | top search bar that expands | toolbar field, Cmd+F | search box in the title bar or page top | visible field, or Cmd/Ctrl+K |
| Share | system share sheet | system share sheet | toolbar share menu | system share | Web Share on phones, "Copy link" on desktop |
| Dates | system date picker | system date picker | calendar popover | calendar flyout | native date input or a calendar popover |

## iPhone and iPad

- Use system components (SwiftUI or UIKit). They carry the current system look, including translucent "glass" bars, for free. Custom opaque bars and heavy dividers fight it.
- **Translucent material is for the control layer only**: tab bars, toolbars, sidebars, sheets, floating buttons. Content (lists, text, media) stays solid beneath. Never glass on glass, never glass as a content card. Tint only the one primary action.
- Navigation: tab bar for 3-5 top-level sections (icon + short label); push navigation with a large title that collapses on scroll for hierarchy. **No hamburger menus.** Never break the edge-swipe back gesture.
- Text: system text styles (Large Title 34, Title 28/22/20, Headline 17 semibold, Body 17, Footnote 13, Caption 12/11), which scale with the user's Dynamic Type setting. Layouts reflow at large sizes; nothing truncates.
- Targets at least 44x44pt. Respect safe areas and the home indicator; keep the primary bottom action above it.
- Sheets with medium and large stops for focused tasks, dismissed by swiping down.
- Haptics for meaningful changes only (selection tick, success, warning, error, a snap landing), always with a visual cue. Never on every tap.
- Icons: SF Symbols in the weight of the neighbouring text. No emoji, no Material icons.
- Colour: semantic system colours plus your accent; dark mode through semantic colours; honour Increase Contrast, Reduce Transparency and Reduce Motion.
- iPad: sidebar that can collapse to tabs, resizable windows, pointer hover, keyboard shortcuts with a menu, drag and drop. Never assume a fixed screen size.

## Android

- Material 3 components, including the newer "expressive" style: more shape variety, springy motion for movement, bolder type for key lines.
- **Motion rule worth using everywhere:** springs for things that move or resize (they may overshoot slightly); plain fades for colour and opacity (never overshoot).
- Navigation follows window width: bottom navigation bar under 600dp, navigation rail from 600dp, drawer on wide screens. The floating action button holds the screen's main action.
- Targets 48x48dp with 8dp between; margins 16dp, 24dp from medium width.
- Decide layout from the **window size the app actually has**, never from "is it a tablet": apps run split-screen, in desktop windows and on foldables. Width classes: compact under 600dp, medium 600-839, expanded 840-1199, large 1200+.
- Canonical large-screen layouts: list-detail (two panes), supporting pane, feed (more columns as width grows).
- Draw edge to edge behind the system bars and pad for insets. Support the system back gesture with its predictive preview; never block it.
- Dynamic colour: give the system a seed colour so the app can follow the user's theme; use surface tiers for depth instead of shadows.
- Foldables: keep text and targets off the fold; in tabletop posture put content on the top half and controls on the bottom; never lose state when the device folds.
- Tablets cannot be locked to portrait on recent Android versions; support rotation and resizing.

## Mac

- The **menu bar holds every command**, with shortcuts shown. Cmd+, opens Settings; Cmd+Q, Cmd+W, Cmd+Z, Cmd+F behave as expected.
- Window: traffic-light buttons top left, a unified toolbar, a sidebar for navigation. Windows resize freely and remember their size and position. **No bottom tab bars, no hamburger.**
- Dense and quiet: 13pt body, compact controls, pointer-sized targets, hover states, right-click menus everywhere, drag and drop.
- Sidebar uses the system translucent material; follow the user's accent colour and light/dark setting.
- Destructive confirmations are sheets attached to the window; Esc cancels, Return triggers the default button.
- Keyboard first: full tab order, shortcuts for all frequent actions, undo for every edit.

## Windows 11

- Fluent design. **Corner radius: 8px** for windows, dialogs, flyouts and menus; **4px** for buttons, inputs and list items; 0 where edges meet or a window is maximised.
- Materials: **Mica** (opaque, softly tinted by the wallpaper) for the window base and title bar; **Acrylic** (frosted) only for short-lived surfaces such as menus and flyouts; a dark "smoke" layer behind modal dialogs. Never acrylic as a permanent background.
- Type: Segoe UI Variable. Caption 12/16, Body 14/20, Body strong 14 semibold, Subtitle 20/28 semibold, Title 28/36. Only regular and semibold; sentence case; left aligned; nothing under 12px.
- Navigation pane on the left (expands to about 320px, collapses to a 48px rail), Settings pinned at its bottom; or top tabs for a few sections.
- Extend content into the title bar but keep the system minimise, maximise and close buttons on the right and leave a drag region. The maximise button must stay so snap layouts work.
- Follow the user's accent colour and light/dark setting; support high-contrast themes; always show keyboard focus.
- Controls 32px high for mouse, 40px or more where touch is likely. Motion is short and subtle.
- Right-click menus with shortcut text aligned right; Ctrl-based shortcuts; F2 to rename, Delete to delete.

## Linux desktop (GNOME)

Use the toolkit's own widgets (GTK 4 with libadwaita): header bar with window buttons, a primary menu at its far end (here a "hamburger" menu is the convention), sidebar that collapses on narrow windows, preferences that apply instantly, standard shortcuts (Ctrl+Q, Ctrl+W, Ctrl+,). Respect the user's accent, dark setting and fonts; never hard-code them.

## Desktop apps built with web tech (Electron, Tauri)

These feel fake unless you remove the web's habits and add the desktop's.

Add:
- A real application menu with standard items and shortcuts (Cmd on Mac, Ctrl on Windows and Linux).
- A custom title bar that keeps the **native window buttons** in their native place, with a drag region (`app-region: drag`, and `no-drag` on controls inside it).
- The system font for chrome (`system-ui`), the system accent colour and light/dark setting.
- Window size and position remembered; native file dialogs and notifications; a background colour set before first paint so there is no white flash.
- Right-click menus, keyboard access to everything, drag and drop.

Remove:
- Text selection on labels and buttons (`user-select: none` on chrome; keep it on content).
- The pointer (hand) cursor on buttons: desktop buttons keep the arrow.
- Rubber-band page scrolling, web-style scrollbars, browser-blue focus rings on mouse click, link underlines in chrome.
- Bottom tab bars, hamburger menus on wide windows, toast-only feedback, a spinner for everything.

Performance is part of the feel: respond to input within 100ms and open in about a second.

## Tablets and foldables

- Two panes from about 840px wide: list on the left (320-400px), detail on the right. Selecting a row fills the detail pane with no page change. On the web, use two panes from 1024px.
- Support pointer hover, right click and keyboard as well as touch and stylus.
- Windows resize and rotate at any time. Keep state; never restart the screen.
- Use the extra space for a second pane or more columns, not for stretched phone layouts.

## Watch and TV

- **Watch:** glanceable. One task and one or two actions per screen, done in about five seconds. Large numerals for the key value, black background, big targets, scrolling with the crown or bezel. Prefer complications and tiles to opening the app.
- **TV:** viewed from three metres and driven by a remote. Everything is reachable with the direction pad, the focused item is obvious (it scales and brightens), text is large (about 24px or more at 1080p), content stays inside safe margins (about 5% from each edge), and text entry is avoided. No hover, no cursor.

## One codebase, several platforms (Flutter, React Native, Compose Multiplatform)

- Keep the product's own content screens shared; **adapt the chrome per platform**: navigation, back behaviour, dialogs, pickers, scroll physics, haptics, typography.
- Use the framework's platform-adaptive components and native navigation containers so titles, gestures and system bars behave correctly.
- A single Material look on every platform reads as "an Android app" on iPhone. Either adapt, or commit to a strong brand direction and still honour each platform's navigation, gestures and safe areas.
- Decide layout from available width, not device type. On desktop targets add menus, shortcuts, hover and focus states.

## Carrying a direction into native code

Tokens translate directly. Keep the names.

```swift
// SwiftUI
extension Color { static let accentBrand = Color("Accent"); static let surface2 = Color("Surface2") } // asset catalog with light + dark values
```
```kotlin
// Compose: feed the palette into a Material colour scheme
val Light = lightColorScheme(primary = Color(0xFF0B4C92), onPrimary = Color.White, surface = Color(0xFFFEFEFF) /* … */)
```

Colours and their light/dark pairs come from `scripts/palette.mjs --json`. Use the direction's display font for headings only where the platform allows custom type; keep system text styles for body and controls so accessibility settings keep working.

## Tells of a fake-native app

Bottom tabs or a hamburger on a desktop app; a Material floating button on iPhone; an iOS-style back chevron on Android; hand cursors and selectable button text on desktop; a web font where the system font belongs; Ctrl shortcuts on a Mac; redrawn window buttons on the wrong side; no window memory; ignoring dark mode, accent colour or Reduce Motion; a white flash on launch; uppercase buttons everywhere; everything bouncing.

## Common mistakes

- Designing one phone layout and stretching it across tablet and desktop.
- Applying the brand so hard that system navigation and gestures break.
- Fixed font sizes on platforms where users set their own text size.
- Treating haptics and sound as decoration.
- Forgetting keyboard and pointer users on tablets and desktops.
