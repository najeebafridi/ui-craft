# Platform conventions research (v2), as of Nov 2026

Method note: only public pages, WebFetch/WebSearch only. Fetch results: Microsoft Learn (materials, geometry, typography), Android Developers (adaptive layouts), Electron (custom title bar), Flutter (adaptive/responsive) and GNOME HIG landing were read. Apple HIG and m3.material.io are JavaScript-rendered and returned only titles, so their rules come from my own background knowledge and are marked (unverified). Everything is paraphrased. Numbers marked (verified) were seen on a fetched page this session.

Units: pt (Apple), dp (Android), epx (Windows), CSS px for web. 1 pt = 1 dp = 1 epx = 1 CSS px at 100% density.

## Apple Human Interface Guidelines (iOS 26 / iPadOS 26 / macOS Tahoe 26 and later)
Link: https://developer.apple.com/design/human-interface-guidelines/ (sub-pages: materials, tab-bars, sheets, sidebars, toolbars, typography, layout, playing-haptics, menus, settings)
Made by: Apple Inc.
Licence: all rights reserved; paraphrase only. Page text not retrievable here (JS-rendered), so all rules are (unverified) unless noted.
Rules:
- Liquid Glass is for the control layer only (toolbars, tab bars, sidebars, floating buttons, sheets). Content (lists, photos, text) stays opaque and sits beneath. Never put glass on glass; never use it as a card background for content. (partially confirmed by fetch tool's summary, unverified on page)
- Prefer standard controls (SwiftUI/UIKit/AppKit): rebuilding with the new SDK gives the new look free. Custom bars with solid fills or heavy dividers fight it. Drop custom nav-bar backgrounds.
- Group neighbouring glass controls in one container so they merge and morph together (SwiftUI `GlassEffectContainer`, `.glassEffect()`, `.buttonStyle(.glass)` / `.glassProminent`). Tint only the one primary action.
- Content scrolls under bars with a soft "scroll edge effect" instead of a hard line. Let content run edge to edge; do not paint a bar background behind the status area.
- iOS tab bar: 3 to 5 tabs at the bottom, icon (SF Symbol) plus short label, selected state tinted. In iOS 26 it can minimise on scroll and can hold a separate search tab. Tab bar = top-level sections only, never actions.
- Hamburger menus are wrong on iOS: use tab bar for peers, push navigation (large title collapsing to inline) for hierarchy. Back = swipe from the left edge plus a back button showing the previous title; never break the edge swipe.
- Typography: system font SF Pro (SF Pro Rounded/New York optional); use text styles, not fixed sizes. iOS default sizes at Large content size: Large Title 34, Title 1 28, Title 2 22, Title 3 20, Headline 17 semibold, Body 17, Callout 16, Subhead 15, Footnote 13, Caption 1 12, Caption 2 11. Support Dynamic Type through accessibility sizes; layouts must reflow, not truncate. macOS defaults are smaller: body 13, caption 10-11.
- Targets: 44x44 pt minimum on iOS/iPadOS; 28 pt is typical macOS control height (regular), mini and small sizes exist; 60x60 pt on visionOS. Standard iOS side margin 16 pt (20 on larger phones in readable guides); respect safe areas and the home indicator, put primary bottom action above it.
- Sheets: use medium and large detents with a grabber; sheets are for focused tasks, dismissible by swipe down; confirm destructive dismissal only if data would be lost. Destructive confirm = action sheet / confirmation dialog anchored to the source on iPad, red label, separate Cancel.
- Haptics: use system feedback generators (selection tick, light/medium/rigid impact, success/warning/error notification) sparingly and only for meaningful state change, always paired with a visual cue; never haptic on every tap or scroll.
- Colour: use semantic system colours and `Color.accentColor`; adopt dark mode via semantic colours; elevated surfaces in dark mode are lighter. Respect user accent choice on macOS (sidebar icons and selection follow it) and the Increase Contrast, Reduce Transparency, Reduce Motion settings; glass must degrade to opaque.
- Icons: SF Symbols, matching text weight, with multicolour/hierarchical rendering and variable-colour where fitting; do not use emoji or Material icons.
- iPad: sidebar that can collapse to a tab bar (adaptive `TabView` sidebarAdaptable), resizable windows (iPadOS 26 windowing), menu bar with keyboard shortcuts, pointer hover effects, drag and drop, support Stage-Manager-like free resizing so never assume fixed size.
- macOS: menu bar is mandatory home for every command with shortcuts shown; toolbar with unified title; sidebar with source list; Settings window opened by Cmd+, with toolbar tab icons; no bottom tab bar; windows are resizable with traffic lights top-left; actions are in toolbar/menus, destructive in a sheet attached to the window.
Notable: Apple expects you to use native components; bespoke chrome is the main cause of "fake" feel. The Liquid Glass numbers (radii, blur) are not published as tokens; use system shapes (capsule, concentric corners). Concentric corner radius with the device or window corner is a stated principle (unverified).

## Material Design 3 and Material 3 Expressive
Link: https://m3.material.io/ and https://m3.material.io/blog/building-with-m3-expressive (page body not retrievable)
Made by: Google
Licence: Design text/specs copyrighted by Google, not stated as open (unverified); paraphrase only. Component code in Material Components / Compose Material 3 is Apache 2.0 (unverified here).
Rules (all unverified on page; from background knowledge):
- Expressive (2025) = more shape variety, springy motion, bolder emphasised type, larger/clearer components, and stronger colour. It is still M3 and rolls out through Compose Material 3 / MDC releases.
- Shape: scale from 0 to full; the expressive shape library adds ~35 morphing shapes; corner sizes extra-small 4, small 8, medium 12, large 16, large-increased 20, extra-large 28, XL-increased 32, XXL 48, full.
- Motion: spring-based. Spatial springs (position, size, rotation) may overshoot slightly; effects springs (colour, opacity) never overshoot. Prefer `MotionScheme.expressive()` for hero moments and `standard()` for utility screens.
- Typography: Roboto Flex / system default; baseline and "emphasized" variants add heavier weights for key lines. Sizes (sp): display 57/45/36, headline 32/28/24, title 22/16/14, body 16/14/12, label 14/12/11.
- Dynamic colour (Android 12+): derive scheme from wallpaper; tonal roles (primary, secondary, tertiary, surface containers). Never hard-code brand colour only; provide seed colour so system can theme. Use surface-container tiers for depth rather than shadows.
- Targets: 48x48 dp minimum touch target; 8 dp gaps; 16 dp (compact) margins, 24 dp from medium.
- Navigation: bottom navigation bar (3 to 5 destinations) on compact width, navigation rail on medium, permanent drawer on large; the nav drawer (hamburger) is secondary. Primary action = FAB or extended FAB at bottom-right; expressive adds FAB menu and button groups, split buttons and a toolbar component.
- Back: system back/gesture, with predictive back animations (Android 13+, mandatory for target SDK 36 style apps) (unverified), so no custom back handler that blocks it.
- Edge to edge is enforced from Android 15 (target SDK 35): draw behind system bars and handle insets (`enableEdgeToEdge`, `WindowInsets`).
- Loading: expressive wavy/morphing progress indicators; skeletons for layout-known loads.
- Haptics: `HapticFeedbackConstants` (CONFIRM, REJECT, GESTURE_START/END, CLOCK_TICK); use for confirm and reject; not decoration.
Notable: Material is a design system, not only Android. Using full Material on iOS or Windows is a "wrong platform" tell; but on Android it is expected.

## Android adaptive layouts (window size classes, canonical layouts, foldables)
Link: https://developer.android.com/develop/ui/compose/layouts/adaptive/support-different-display-sizes (verified) ; also /use-window-size-classes, /foldables, https://developer.android.com/docs/quality-guidelines/large-screen-app-quality
Made by: Google / Android Open Source Project
Licence: Android Developers site content is CC BY 4.0, code samples Apache 2.0 (site footer convention; unverified on fetched page).
Rules:
- Decide layout from the window size actually given to the app (WindowManager metrics), never from "is this a tablet" or physical screen size, since apps run in split-screen, desktop windows, ChromeOS and on foldables. (verified)
- Window width classes: compact <600 dp, medium 600-839, expanded 840-1199, large 1200-1599, extra-large >=1600 (large and XL need the opt-in flag `supportLargeAndXLargeWidth`, verified in the code sample; breakpoint values are from the Flutter page summary and background knowledge). Height classes: compact <480, medium 480-899, expanded >=900.
- Compute the size class once at the app root, pass it down as state; reusable child composables use the width they are given (`BoxWithConstraints` or custom layout), never global screen size. (verified)
- Always hoist and pass enough data for any size so state survives rotation, fold, unfold, and resize. (verified)
- Canonical layouts: list-detail (two panes from medium/expanded), supporting pane (main content plus secondary pane), feed (grid of cards, column count grows). Use `NavigationSuiteScaffold` to switch bottom bar / rail / drawer automatically. (names from background; list-detail URL verified)
- Android 16 (API 36): for apps targeting it, the system ignores orientation, aspect-ratio and resizability restrictions on displays with smallest width >=600 dp, so you cannot lock portrait on tablets. (verified)
- Foldables: react to posture (tabletop = half-opened with horizontal hinge: content on top, controls below; book = vertical hinge: two panes); keep text and tap targets off the hinge/fold area; do not restart activity on fold (handle config changes). (unverified)
- Large-screen quality tiers: Tier 3 basic (does not break), Tier 2 optimised (adapts layout, keyboard/mouse), Tier 1 differentiated (foldable postures, stylus, drag-and-drop). (unverified details)
- Large screens need keyboard (Tab focus order, shortcuts), mouse (hover, right-click context menu, scroll), stylus; support multi-window and drag and drop.
Notable: Google even ships an "adaptive" agent skill (`android skills add adaptive`), a direct precedent for this project.

## Windows 11 design (Fluent 2, WinUI 3)
Link: https://learn.microsoft.com/en-us/windows/apps/design/ (materials, geometry, typography verified); https://fluent2.microsoft.design/
Made by: Microsoft
Licence: Learn docs text is CC BY 4.0 with code under MIT (repo convention; unverified on fetched page, page front-matter points to MicrosoftDocs/windows-dev-docs-pr). Fluent icons are MIT (unverified).
Rules:
- Corner radius: 8 px for top-level windows, flyouts, dialogs, menus, teaching tips; 4 px for in-page controls (buttons, text boxes, list items), bars (scrollbar, slider, progress) and tooltips; 0 where straight edges touch (split-button halves, snapped or maximised windows). Resources `ControlCornerRadius` 4 and `OverlayCornerRadius` 8. (verified)
- Materials: Mica = opaque, tinted by the wallpaper, for the window base layer/title bar, shows active vs inactive window state. Acrylic = translucent frosted, only for transient light-dismiss surfaces (flyouts, context menus). Smoke = black dim behind modal dialogs, same in light and dark. Do not use acrylic as the permanent app background. (verified)
- Font: Segoe UI Variable (weight + optical size axes, 8-36 pt auto). Ramp (size/line height, epx): Caption 12/16, Body 14/20, Body strong 14/20 semibold, Body large 18/24, Subtitle 20/28 semibold, Title 28/36, Title large 40/52, Display 68/92. (verified)
- Typographic details: only Regular and Semibold in the ramp, no bold or italic; sentence case; left aligned; minimum 12 px regular or 14 px semibold; 50-60 characters per line; use ellipsis for truncation when containers are undefined. (verified)
- Icons: Segoe Fluent Icons font (Regular) for glyph icons; Fluent System Icons for SVG. (verified font name)
- Spacing (background knowledge, unverified here): 4-px grid, 12 px control padding typical, 16/24 px page margins, 48 px nav-view top bar, compact control height 32, standard 40 (Win11 buttons are 32 px tall by default); touch targets 40x40 min, 44 recommended.
- Navigation: `NavigationView`: left pane (expanded 320 px, compact 48 px rail) for 5+ sections; top tabs for few; Settings item pinned at bottom of the left pane; Back button in the title bar.
- Title bar: extend content into the title bar, keep caption buttons (min, max, close) on the right and system-drawn; leave a drag region; Snap Layouts appear on hover over the maximise button, so never replace or hide that button (unverified).
- Context menus: right-click and Shift+F10 / menu key, 8 px acrylic flyout, keyboard accelerator text right-aligned; command bars for toolbars.
- Dark/light follow system; accent colour is user chosen (`SystemAccentColor`); use accent for primary buttons, selection, focus. Provide high-contrast theme support. (unverified)
- Keyboard: full Tab/arrow access; Ctrl+Z, Ctrl+F, F2 rename, Delete; Alt for access keys; focus visuals (2 px dual ring) always shown.
- Motion: short (83-250 ms), subtle, ease-out; "connected animation" between pages; respect animations-off setting.
Notable: Windows is the one platform here where the docs give exact corner radii and ramps; use them verbatim in WinUI, Qt-on-Windows and web-in-Electron.

## GNOME Human Interface Guidelines / libadwaita
Link: https://developer.gnome.org/hig/ (landing verified; sub-page contents not retrieved)
Made by: GNOME Project
Licence: HIG text believed CC BY-SA 4.0 (unverified).
Rules (mostly unverified; landing page confirmed only structure and GTK 4 + libadwaita target):
- Use GTK 4 + libadwaita widgets; they provide adaptive layouts, dark mode, accent colour and high contrast for free. (verified target)
- Window chrome: client-side header bar with title, window buttons right, primary menu (hamburger "open-menu-symbolic") at the far right, primary action left or beside it. Here a hamburger primary menu is legitimate, unlike iOS.
- Navigation: sidebar (`AdwNavigationSplitView`) collapsing on narrow widths; view switcher (tabs) in the header bar, bottom bar on narrow; no hidden gesture-only paths.
- Adaptive down to ~360 px wide and up; apps should work on phones (Librem/PinePhone) so use breakpoints.
- Rounded window corners ~12 px, soft flat style, no heavy shadows, flat buttons in the header bar, pill buttons for suggested actions, Cantarell/Adwaita Sans UI font, base text ~11 pt (about 15 px) (unverified).
- Suggested action = blue "suggested-action"; destructive = red "destructive-action"; dialogs use `AdwAlertDialog` with a title, body and verb-labelled response buttons.
- Preferences use `AdwPreferencesDialog` with grouped rows and no Apply/OK; changes take effect instantly (like toggles on mobile).
- Standard shortcuts: Ctrl+Q quit, Ctrl+W close, Ctrl+, preferences, Ctrl+? shortcuts window, F10 primary menu.
- Search: Ctrl+F toggles a search bar below the header, or a search toggle button in the header.
- Dark mode via system preference; accent colour from GNOME 47 settings; do not hard-code colours, use named Adwaita colours.
Notable: HIG has the clearest "do not copy other platforms" stance: no tray icons as primary UI, no menu bar, no custom title bars drawn in the content.

## KDE Human Interface Guidelines (brief)
Link: https://develop.kde.org/hig/
Made by: KDE community
Licence: believed CC BY-SA 4.0 (unverified); not fetched.
Rules (unverified):
- Plasma/Kirigami/Qt Quick Controls (Breeze style); apps keep a traditional menu bar plus toolbar on desktop, hamburger menu allowed as an option.
- Highly configurable: respect user colour scheme, fonts and icon theme; do not hard-code colours or fonts.
- Kirigami `GlobalDrawer` + `ContextDrawer` for mobile/adaptive; sidebar on wide screens.
- Default control height ~ 30-36 px, spacing from `Kirigami.Units.smallSpacing`/`largeSpacing` (not fixed px).
- Keyboard first: every action has a shortcut, KDE standard shortcuts (Ctrl+Shift+, preferences, F1 help).
Notable: use unit helpers, never raw px, because users scale fonts and icons independently.

## Electron / Tauri native-feel guidance
Link: https://www.electronjs.org/docs/latest/tutorial/custom-title-bar (verified); https://tauri.app/ (window customisation; not fetched)
Made by: OpenJS Foundation (Electron), Tauri Contributors
Licence: Electron docs believed CC BY 4.0 / code MIT (unverified); Tauri MIT/Apache-2.0 (unverified).
Rules:
- Custom title bar: `titleBarStyle: 'hidden'` removes the bar; macOS keeps traffic lights; on Windows/Linux add `titleBarOverlay` (true or object with `color`, `symbolColor`, `height`) to keep native window controls. (verified)
- Add `app-region: drag` (CSS) on your bar and `no-drag` on buttons and inputs inside it; otherwise the window cannot be dragged. (verified)
- Respect the controls' area with `env(titlebar-area-x)` and `env(titlebar-area-width)` since controls may sit on either side. (verified)
- macOS options: `hiddenInset`, `customButtonsOnHover`, `trafficLightPosition: {x,y}` (verified); `vibrancy` / `visualEffectState` for sidebar blur (name from background, unverified); keep ~12-16 px traffic light inset.
- Windows 11: `backgroundMaterial: 'mica' | 'acrylic' | 'tabbed'` on BrowserWindow (unverified), rounded window corners come from the OS.
- Menus: build a real application menu (`Menu.setApplicationMenu`) on macOS incl. App menu (About, Settings Cmd+, Quit Cmd+Q), Edit (so Cmd+C/V work), Window, Help. Windows/Linux put it in a menu bar or hamburger.
- Use `nativeTheme` to follow system dark/light, `systemPreferences.getAccentColor()` for accent, and `-apple-system`/`system-ui` font stack, not a webfont, for chrome.
- Disable what screams "web": text selection on UI labels (`user-select: none`), rubber-band overscroll, default cursor `pointer` on everything (use default arrow for buttons on desktop), blue link underlines, browser focus ring on mouse click, visible web scrollbars (use overlay or thin themed), drag-image ghosts, context menu with "Inspect".
- Remember window state (size, position, maximised), single-instance lock, native file dialogs, native notifications, tray only if useful, deep links, auto-update with release notes.
- Startup < 1 s feel: show window when `ready-to-show`; set `backgroundColor` to avoid white flash in dark mode.
Notable: Most "fake native" tells come from not honouring the platform menu, shortcuts (Cmd vs Ctrl), font and window-control placement.

## Flutter adaptive and responsive design
Link: https://docs.flutter.dev/ui/adaptive-responsive (verified)
Made by: Google / Flutter team
Licence: docs CC BY 4.0, code BSD-3 (site convention; unverified on page).
Rules:
- Responsive = rearrange to fit; adaptive = pick the right layout and input method for the space (e.g. bottom nav vs side panel). One codebase should look and feel right on phone, foldable, tablet, desktop and web. (verified)
- Design for touch, mouse and keyboard, not touch only. (verified)
- Use `LayoutBuilder` for the space a widget gets, `MediaQuery` sparingly for screen info, `SafeArea` for insets; decide by width constraints, not device type. (partly verified)
- Swap `NavigationBar` (bottom) for `NavigationRail` at >=600 and a drawer/extended rail at >=840-1200 dp, same M3 classes as Android.
- Material widgets on Android/web/desktop; Cupertino widgets (`CupertinoNavigationBar`, `CupertinoTabBar`, `CupertinoSliverNavigationBar`, `showCupertinoModalPopup`) on iOS/macOS; `.adaptive` constructors (`Switch.adaptive`, `Slider.adaptive`, `CircularProgressIndicator.adaptive`) auto-switch. (unverified)
- Scroll physics (bouncing on Apple, clamping on Android), page transitions (slide from right on iOS with edge swipe back, fade-through/predictive back on Android) change per platform automatically; do not override them globally.
- On desktop add: `Shortcuts`/`Actions`, `MenuBar`/`PlatformMenuBar` (native macOS menu), hover and focus states, `SelectionArea` for selectable text, context menus.
Notable: Flutter paints its own pixels, so Liquid Glass does not appear unless the app recreates it; don't claim iOS 26 look from Cupertino widgets alone (unverified, check version).

## React Native and Compose Multiplatform (brief)
Link: https://reactnative.dev/docs/platform-specific-code ; https://www.jetbrains.com/compose-multiplatform/ (not fetched)
Made by: Meta / JetBrains
Licence: RN docs CC BY 4.0, code MIT (unverified); Compose Multiplatform Apache 2.0 (unverified).
Rules (unverified):
- React Native renders real native views, so system controls (UIKit tab bar, Android navigation) follow the OS look; use `Platform.select`, `.ios.tsx` / `.android.tsx` files, and native navigation (React Navigation native stack, Expo Router native tabs) over JS-drawn navigators for correct large titles, edge swipe and Liquid Glass tab bar.
- Use `SafeAreaView` from react-native-safe-area-context, `useWindowDimensions` for size classes, `PlatformColor`/`DynamicColorIOS` for system colours, `Haptics` from expo-haptics.
- Compose Multiplatform: Material 3 on all targets; on iOS wrap in native chrome where possible and honour safe area and swipe-back; desktop target needs menu bar, shortcuts and window state handling.
Notable: a single UI kit across iOS and Android reads as "Android" on iPhone more often than the reverse.

## Watch and TV (brief)
Link: https://developer.apple.com/design/human-interface-guidelines/designing-for-watchos ; https://developer.android.com/design/ui/wear ; https://developer.apple.com/design/human-interface-guidelines/designing-for-tvos ; https://developer.android.com/design/ui/tv
Made by: Apple, Google
Licence: Apple all rights reserved (paraphrase); Android CC BY 4.0 (unverified). None fetched.
Rules (all unverified):
- Watch: glanceable, one task, 1-2 actions per screen, under ~5 s interaction; vertical scroll with Digital Crown (watchOS) or rotary bezel (Wear OS); text >= 16 sp on Wear OS body, big numerals for the key value; targets 38-44 pt+ (Wear OS min 48 dp); edge-to-edge dark black backgrounds (OLED), curved-screen safe margins ~ 5-8 % inset; complications and tiles over launching the app; use haptic taps for notifications; no hamburger and no long lists of settings.
- tvOS: focus engine, never a cursor. The focused item scales (~1.05-1.1x) with parallax/shadow; every interactive element must be reachable by D-pad; safe area 90 pt left/right and 60 pt top/bottom (1920x1080); minimum text about 29 pt, body 38 pt, titles 76 pt (unverified); Siri Remote Menu = back; Play/Pause shortcuts; tab bar at the top.
- Android TV / Google TV: 10-foot UI, overscan-safe margin 5 % (about 48 dp horizontal, 27 dp vertical on 960x540 dp), D-pad focus with clear highlight, leanback rows (carousels), text >= 14 sp but design for ~ 20-24 sp body at 10 ft, no touch assumptions, back button always exits one level.
- Both: dark theme default, big hit areas, minimal text input (voice, dictation, pairing with phone).
Notable: The core of 10-foot design is focus-state visibility; anything that requires hover or fine pointer fails.

## Same feature, per platform
Legend: (unverified) = from background knowledge, not an official page seen this session.

| Feature | iOS / iPadOS | Android | macOS | Windows 11 | GNOME / Linux | Web (desktop) |
|---|---|---|---|---|---|---|
| Primary navigation | Bottom tab bar (3-5); iPad: sidebar that folds to tabs | Bottom bar (compact), rail (medium), drawer (large) | Sidebar (source list) + toolbar; no bottom tabs | `NavigationView` left pane, or top tabs | Sidebar with header bar; view switcher | Left sidebar or top bar; avoid bottom tabs |
| Back | Edge swipe + back button with previous title | System back / predictive-back gesture; top app bar up arrow | Toolbar Back chevron, Cmd+[ ; no gesture-only | Title-bar back arrow, Alt+Left, mouse back | Back button left in header bar, Alt+Left | Browser back must work; real URLs |
| Primary action | Top-right bar button, or prominent button at the bottom; no FAB | FAB / extended FAB bottom-right | Toolbar button, or default (blue) button in dialog, Return key | Accent button; command bar | Suggested-action button in header bar | One solid accent button per view |
| Settings | In-app list or Settings app; row pushes | Settings screen from overflow/profile, lists with switches | Settings window, Cmd+, toolbar tabs | Settings in left nav pinned bottom, or Ctrl+, | Preferences dialog, Ctrl+, , instant apply | Settings page, avatar menu |
| Destructive confirm | Action sheet / confirmation dialog, red "Delete", Cancel | AlertDialog with verb buttons; or snackbar Undo | Sheet attached to window; Cancel is Esc | ContentDialog with red/primary verb | `AdwAlertDialog` destructive response | Dialog naming what is lost, or Undo toast |
| Date picking | Compact inline `DatePicker` popover or wheel; graphical calendar | Modal date picker (M3) or input mode; dial for time | Compact stepper+calendar popover | CalendarDatePicker flyout / DatePicker spinner | Calendar popover (GtkCalendar) | `<input type=date>` or calendar popover |
| Context menu | Long-press menu (`contextMenu`), swipe actions on rows | Long-press, overflow (3-dot) menu | Right-click / Ctrl+click menus | Right-click, Shift+F10 | Right-click popover, long-press | Right-click custom menu on desktop |
| Search | Search tab (iOS 26) or `searchable` under nav bar, pull down | Top search bar/SearchView in M3, expands full screen | Toolbar search field, Cmd+F, Cmd+Opt+F | AutoSuggestBox in title bar/top of page, Ctrl+F/E | Ctrl+F search bar below header | `/` or Cmd/Ctrl+K command palette, visible field |
| Share | Share sheet (`ShareLink`) | Sharesheet intent | Share toolbar button / menu | Share contract (DataTransferManager), Win+... | Portal/file "Open with"; limited | Web Share API on mobile; Copy link on desktop |

## Cross-platform quick numbers
| Item | Apple | Android | Windows | Web default |
|---|---|---|---|---|
| Touch/click min | 44 pt (iOS), ~28 macOS | 48 dp | 40-44 epx touch, 32 mouse | 24 CSS px AA, 44 touch |
| Body text | 17 pt iOS, 13 pt macOS | 16 sp (body L), 14 (M) | 14 epx | 16 px |
| Corner radius | concentric/system capsule (no fixed) | 12-28 dp per component scale | 8 overlays, 4 controls | by brand |
| Side margin | 16 pt | 16 dp compact, 24 medium+ | 16-24 epx | 16 / 24 / 32 |
| Press feedback | highlight + haptic | ripple/state layer + haptic | pointer-over fill, accent | hover + active |

## Premium on each platform (5-8 details)
iOS: concentric corners matching the device; large title collapsing on scroll; interruptible spring transitions with velocity from the gesture; selection/impact haptics in sync with UI; SF Symbols in matching weight; Dynamic Type honoured at accessibility sizes; content scrolling under glass bars with edge effect; proper keyboard avoidance with interactive dismissal (unverified).
Android: dynamic colour from wallpaper; predictive back preview; edge-to-edge with correct insets; state layers and ripple; themed monochrome app icon; large-screen list-detail with rail; expressive springs on hero actions; haptic confirm/reject (unverified).
macOS: full menu bar with every command and shortcut; vibrant sidebar; unified toolbar with customise; Cmd+, Settings; Quick Look/Space preview; drag and drop everywhere; state restoration; Touch-bar-free sensible Undo/Redo for all edits (unverified).
Windows: Mica base with correct inactive state; snap-layout friendly custom title bar; 4/8 px radius correct; Segoe UI Variable with semibold titles; full keyboard focus visuals; accent colour respected; jump lists and notifications (unverified); context menus with shortcuts.
GNOME: adaptive to narrow widths; Adwaita rows and groups; instant-apply preferences; correct shortcuts window; respects accent and dark; symbolic icons.
Web-tech desktop: native menu, no flash on start, remembers window, native dialogs, real font/accent, snappy under 100 ms input response.
Tablet/foldable: two-pane at >=840 dp / iPad regular width; posture-aware tabletop mode; pointer hover and right-click; resizable windows without restart.

## Things that make a web-tech app feel fake-native
- Bottom tab bar or hamburger on macOS/Windows desktop; top tabs styled as iOS segment on Android; Material FAB on iOS; iOS back chevron on Android.
- Pointer cursor on buttons, text-selectable labels, browser-blue focus rings, web scrollbars, rubber-band page overscroll, 300 ms click delay.
- Webfont (Inter) for chrome where the system font is expected; Cmd shortcuts on Windows or Ctrl on macOS; missing Cmd+, / Cmd+Q / Ctrl+Z.
- Custom window controls on the wrong side, traffic lights re-drawn badly, no drag region, no double-click-to-maximise.
- No dark mode follow, ignoring accent colour, ignoring Reduce Motion, white flash on launch, no window state restore.
- Toast-only feedback, spinner for everything, modals for everything, uppercase buttons, bouncing everything.

## Disagreements spotted
- Touch targets: Apple 44 pt, Material 48 dp, Windows 40 epx (44 recommended in some docs, unverified), WCAG 2.2 AA 24 px. AGENTS.md's 44 px rule is a safe cross-platform choice; use 48 on Android.
- Body text: iOS 17 pt vs Windows 14 epx vs macOS 13 pt vs Material 16 sp. AGENTS.md's 14-16 px default is fine for web; prefer platform defaults in native shells.
- Type scale: the repo's 12/14/16/18/20/24 matches Windows 12/14/18/20 closely but not Apple's 11/13/15/17 or Material's 11/12/14/16/22/24/28; do not force the web scale onto native text styles.
- Corner radius: Windows publishes 4/8, Material scale goes to 28+ and "full", Apple uses concentric system shapes; no single number. AGENTS.md "nested radius = parent minus padding" matches Apple's concentric idea.
- Hamburger menus: wrong on iOS, tolerated in Material drawer for large sets, standard primary menu on GNOME, optional in KDE; so rule must be platform-specific.
- Material 3 Expressive pushes bold springy shape and colour; Apple Liquid Glass pushes translucency; Windows pushes calm Mica; Fluent/Mica opacity vs AGENTS.md "no glassmorphism on app screens". Resolve as: glass only when it is the platform's own system chrome, never as a custom web effect.
- Breakpoints: Android 600/840/1200/1600 vs AGENTS.md 640/1024/1440; Android values are official, the repo's are a web simplification. Large and XL classes needed an opt-in in the code sample.
- Edge swipe back (iOS) vs system back gesture (Android) vs no gesture (desktop): custom swipe handlers conflict with both.
- Settings behaviour: GNOME and mobile toggles apply instantly, macOS/Windows classic dialogs may have Apply/OK; AGENTS.md toggle vs checkbox rule is consistent with mobile only.
- Fonts: one family per app (AGENTS.md) vs using each platform's system font, which means different families per platform for cross-platform apps.
