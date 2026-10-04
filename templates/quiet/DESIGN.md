---
name: Rhine Tague — Quiet
description: A readable portfolio with thin rules, neutral surfaces, and real photographs.
colors:
  page-light: "#f4f4f5"
  surface-light: "#ebebeb"
  ink-light: "#242424"
  muted-light: "#656461"
  rule-light: "#d9dadd"
  page-dark: "#211f1c"
  surface-dark: "#2b2926"
  ink-dark: "#f4f3f0"
  muted-dark: "#aaa6a0"
  rule-dark: "#403d38"
  button-slate: "#4b5563"
  button-ink: "#ffffff"
  button-sand: "#d8c8b4"
  button-dark-ink: "#211f1c"
  orange: "#fb923c"
  orange-ink: "#211f1c"
  accent-light: "#b94708"
  surface-accent-light: "#af4207"
  accent-dark: "#fb923c"
  preview-backdrop: "rgba(0, 0, 0, 0.65)"
typography:
  display:
    fontFamily: "ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, Liberation Mono, Courier New, monospace"
    fontSize: "clamp(24px, 2.3vw, 32px)"
    fontWeight: 500
    lineHeight: 1.3
    letterSpacing: "-0.035em"
  body:
    fontFamily: "ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, Liberation Mono, Courier New, monospace"
    fontSize: "15px"
    lineHeight: 1.65
  description:
    fontSize: "14px"
    lineHeight: 1.65
  label:
    fontSize: "12px"
    lineHeight: 1.65
  metadata:
    fontSize: "11px"
    lineHeight: 1.65
  album-label:
    fontSize: "13px"
  command-output:
    fontSize: "13px"
  control-label:
    fontSize: "12px"
  identity:
    fontSize: "16px"
  mobile-display:
    fontSize: "27px"
  note-preview-title:
    fontSize: "clamp(22px, 2vw, 28px)"
    lineHeight: 1.4
  reader-title:
    fontSize: "clamp(30px, 3.2vw, 44px)"
    lineHeight: 1.18
  reader-title-mobile:
    fontSize: "clamp(30px, 7vw, 38px)"
  reading:
    fontSize: "16px"
    lineHeight: 1.85
  reading-lead:
    fontSize: "20px"
    lineHeight: 1.6
  reading-lead-mobile:
    fontSize: "18px"
  reading-ending:
    fontSize: "24px"
    lineHeight: 1.5
  contact:
    fontSize: "clamp(18px, 1.6vw, 22px)"
    lineHeight: 1.55
rounded:
  control: "0px"
  identity-portrait: "4px"
  cinematic-image: "12px"
spacing:
  compact: "8px"
  small: "12px"
  regular: "16px"
  medium: "24px"
  gutter: "32px"
  section-mobile: "40px"
  section-desktop: "64px"
components:
  cardless-action:
    backgroundColor: "transparent"
    textColor: "{colors.ink-light}"
    fontSize: "13px"
    minHeight: "44px"
    textDecoration: "underline"
    textDecorationColor: "{colors.muted-light}"
  cardless-action-hover:
    textColor: "{colors.accent-light}"
    textDecorationColor: "currentColor"
---

# Design System: Rhine Tague — Quiet

## Overview

**Creative North Star: "Quiet portfolio"**

This document applies to the default portfolio at `/`, its `/templates/quiet/` alias, and its readers. It does not replace the preserved ocean edition's visual system at `/templates/ocean/`. The approved synthesis uses Ellipsis's label/content composition, Conductor-informed neutral planes, and Readman's wide photographic framing.

**Key Characteristics:**
- Thin rules instead of enclosing project cards.
- Compact mono typography and generous intervals.
- Real photography as the primary visual material.
- Native scrolling with hidden scrollbars and immediately visible content.

## Colors

### Primary

Orange is interaction feedback, not a page field. Slate/white and warm-sand/charcoal remain palette pairs for incumbent controls; the hero and Contact now use cardless underlined text actions instead of filled rectangles. These text actions use the existing accent on hover/focus, not an orange background. Light-theme text accents use the darker orange tone for readability. All six header navigation links share Dev Mode's existing `--accent` on hover and keyboard `:focus-visible`: `#fb923c` in dark mode, `#b94708` in light mode. Rest stays muted; hover/focus adds label-bound square brackets and the existing focus outline remains. No filled nav treatment, persistent orange state, new color token or layout change.

### Neutral

Cool off-white grounds the light edition. Warm charcoal grounds the dark edition. Text and secondary text have separate contrast-safe roles. Decorative rules are deliberately faint; they are not used as the sole indication of an interactive control.

**The Contrast Rule.** Keep button foreground and fill paired. White on the orange hover fill does not meet the normal-text contrast target. Text on the lighter command surface uses its darker orange tone: the normal page accent measured 4.44:1 there; the surface accent measures 4.89:1. Dark command text keeps the existing orange.

## Typography

The mono stack follows the user's explicitly chosen Ellipsis reference, rather than an arbitrary technical costume. There is no network font request. Platform-native metrics are a known tradeoff; Chinese uses available script fallback.

### Hierarchy

- Display: compact sentence, maximum 28ch; mobile size 27px, maximum 24ch.
- Body: 15px with a 68ch maximum paragraph measure.
- Project and paper descriptions: 14px, secondary ink.
- Labels, controls, metadata: 12px; in-development status is 11px.
- Contact sentence: `clamp(18px, 1.6vw, 22px)` with 1.55 line height.

Titles precede supporting publication types and note introductions. Metadata must preserve status and type rather than become decorative eyebrows.

## Layout

The body sequence after the unchanged hero photograph is **About → Selected Work → Photography → Research → Notes → Contact**. Header navigation and Dev Mode's section list follow the same order. It is encoded in the DOM/renderers rather than CSS visual order, keeping keyboard, screen-reader and no-JavaScript reading coherent. About is moved, not repeated; copy and spacing are unchanged. All six header links retain 44px touch targets and desktop wrapping; the approved mobile disclosure supersedes uneven wrapped rows. The hero's Explore the work action still bypasses the introduction when desired.

The shell is at most 1200px wide. Desktop uses a 180px label column and a 32px gutter. At 1040px and below, the label column becomes 140px with a 24px gutter. At 700px and below, sections stack and the shell has 20px side gutters.

Work uses text rows. Papers form two columns on desktop and one on mobile. All six albums have photographic previews: three columns on desktop, two at intermediate widths, one on mobile. Notes is a separate section after About. Sections use 64px vertical padding on desktop and 40px on mobile. The dedicated Notes page uses the same rail, a 68ch reading column, 16px body at 1.85 line height (15px on mobile), and a larger two-line title.

## Elevation & Depth

There are no shadows or simulated physical materials. Tonal separation defines the active album's cinematic field; the hero has no padded mat. Hairlines separate related groups; whitespace separates larger sections.

## Shapes

Controls and content rows are square. The small identity portrait has subtly softened 4px corners; the signature photograph keeps its existing 12px corners. Its 2:1 frame is filled edge-to-edge, with no surround padding. The caption and link remain outside the image. Album previews fill their rectangular crops; original photographs in the viewer are never cropped.

## Components

### Mobile navigation

At <=700px, one compact Menu / language / theme row replaces the always-visible wrapped links. A 1.2px-stroke SVG accompanies the localized Menu/Close label; the button and other controls retain 44px targets. The non-modal disclosure opens in document flow with six left-aligned destinations and a thin-rule View group. Existing GUI/Dev buttons move into that group and return to the original preferences above the breakpoint, preserving identity, listeners and pressed state; brackets now replace the underline. Desktop uses display: contents for the navigation wrapper and remains visually incumbent. No new card, blur, fullscreen overlay, fixed shell, scroll lock, focus trap, animation or dependency.

Language and theme stay available while closed or open; translation/theme changes preserve open state. Selection, Escape, outside activation, route/Back and breakpoint changes close coherently, preserving a visible focus destination and Dev transcript/GUI state. Plain native links remain visible with no JavaScript or missing enhancement; only the usable enhancement exposes Menu. Cut: scattered mobile rows and GUI/Dev competing in the opening bar. Tradeoff: a disclosure tap and in-flow expansion; the hero's direct work link remains outside it.

### Page footer

Quiet's portfolio footer contains only the author signature, matching Notes and Approach. At Chief's request, the “Original portfolio” link is removed rather than hidden with CSS; unused translations are also removed. Contact/social actions stay in the preceding Contact section. No replacement footer action is introduced. The subsequent homepage migration makes Quiet the root entry; readers return to the corresponding root section.

### About narrative

The About section keeps its existing label/content rail, 68ch text field, 20px gaps and single native Approach link. Chief's LinkedIn About and his explicit design-foundation clarification inform three paragraphs: current practice, design as the way imagination becomes buildable/questionable/refinable form, then the intelligent-systems direction and accountability standard. All six Quiet locales carry the same sequence. Treat explanation, memory and causal reasoning as the direction being built toward; do not turn aspiration into proven capabilities. No Design badge, new section, decorative quote, larger type or card is added. Photography and nature remain influences on framing/restraint, not invented biographical milestones. The authored essay and original ocean narrative stay untouched.

### Identity portrait

Chief's supplied `xi_profile.png` sits directly above the name in Quiet's existing identity rail, left-aligned with the name. It is 80×80px desktop and 64×64px below 700px, with 4px corners and no card, border, shadow, badge or added interaction. A 160×160 WebP derivative preserves the complete square source and supplies 2× desktop pixels for about 5.6KB. Explicit dimensions reserve the square footprint; empty alt avoids repeating the adjacent name to screen readers. Mobile adds 8px image-to-name spacing on top of the existing 4px stack gap. The source PNG, ocean hero, reader headers and favicon are unchanged by this addition. Cost: one small eager image and additional identity-rail height, not a new content block.

### SVG welcome sequence

Chief explicitly replaced the inline country decoration with one finite welcome sequence inside the existing Quiet world. The country is text-only again. Latest Paper node `7M-0` supplies the full pole flag, already blue above red; its colors, paths, gradients and orientation stay intact. A centered 176–240px contained SVG reserves its complete aspect ratio, with a 28px interval to the caption below: one of “Magandang umaga!”, “Magandang hapon!” or “Magandang gabi!” (`lang="fil"`), then a localized morning/afternoon/evening welcome Chief subsequently removed the visible “Skip introduction” button; no replacement control or label is added. Use the page's existing neutral ground, mono type and readable theme roles; flag colors are artwork, not new UI palette tokens.

The caption samples the visitor-device local hour once per eligible welcome: morning 05:00–11:59, afternoon 12:00–17:59, evening/overnight 18:00–04:59. All six locales translate the supporting line; the Filipino primary greeting stays cultural rather than location-dependent. No geolocation/IP lookup, permissions, live clock, network service or new persisted time state. A crossing boundary does not change an active caption; reload resamples. entry-greeting.js supplies the runtime selector and deterministic generic/invalid-hour fallback; rendering static HTML explicitly uses that fallback rather than the build host clock. Cut: the fixed live caption, not an added caption, clock or motion. Tradeoff: an incorrect device clock/time zone yields an inappropriate greeting.

Entry behavior is one finite native Web Animations sequence: pole → six stroke-drawn stripes → sun → three sequential stars → greeting → brief completed hold → opacity exit. Its nominal duration is 3350ms, including Chief's explicitly requested 1500ms hold after the completed caption is fully visible, with a 3700ms JS deadline and independent 4s CSS visibility/pointer fail-open. Actual animation completion drives each next stage. No GSAP dependency, extra ticker, inert state, modal, body scroll lock or smoother is added. The optional module is dynamically imported so its failure cannot disable portfolio controls. It plays on a healthy first-tab arrival and explicit reload. The early head reload policy returns to the hero by suppressing native scroll restoration during startup and clearing only the fragment, preserving the route/query/history entry. A document-ready reset is confirmed after load in one layout frame, then the prior restoration mode is restored; ordinary deep links, reader returns and Back remain native. Only optional reload motion waits for this settled frame; portfolio initialization and controls do not. This hero reset works independently of optional motion. Reduced motion, hidden/late/scrolled/returning pages, unavailable storage and slow/missing artwork bypass motion. Chief’s latest completion refinement absorbs ordinary keyboard/pointer/click/touch/wheel input instead of skipping; Tab/activation/scroll cannot operate the covered portfolio, and no input is queued. Programmatic focus alone does not dismiss the sequence. Modifier/function-key browser/OS shortcuts remain native. Route/history changes, hidden/page departure and live reduced-motion changes still retire the work. Completion/failure removes the guards and restores normal focus/controls/scroll. Static/no-script content remains immediately available. Cut: persistent country flag and any progress fiction. Tradeoff: page interaction waits for a short bounded welcome on first visit and explicit reload; reload intentionally discards the prior section/scroll position, while ordinary returning navigation does not replay the welcome.

The first-paint refinement reserves the same Quiet ground before modules or artwork arrive. A head-only eligibility check sets `data-entry-boot="pending"`; inline critical CSS paints a viewport-sized neutral pseudo-element, with theme-correct fallback colors. The animation unhides its actual cover before changing boot state to `playing`, so the ground retires atomically without revealing the hero between them. Ordinary input is guarded during preparation; route changes, hidden state, page departure and reduced motion can cancel it; once canceled or timed out it cannot replay late. A 1200ms head deadline and independent CSS fallback release failed startup; the existing 350ms asset budget and 3700ms JS/4s CSS active-motion deadlines remain. Listeners/observer/timer retire at handoff or bypass. No-script content is visible by default, and portfolio rendering/controls initialize normally beneath this finite ground. Cut: late cover activation and the hero-to-welcome flash. Tradeoff: eligible entry preparation can show the existing plain ground briefly; cold/failed arrivals release content instead of waiting indefinitely. Flag geometry, palette, sequence and the fully visible 1500ms greeting hold are unchanged.

### Hero arrival — horizon opening

Chief requested a new adaptation of the **Reveal Hero** component in `/Users/lesz/Developer/xi_pro_lab/XI Pro Component Lab.dc.html` (id `reveal-hero`), grounded in `/Users/lesz/Developer/xi_pro_lab/uploads/mitsuhiko_skills/xi_pro_skills/reveal_hero.md`. Fidelity lane: adaptation, not a copy. Preserve its window → wider view → full-image idea, but turn the vertical full-viewport zoom into one horizontal photographic opening inside the incumbent Swiss 2:1 frame. No new markup, mat, image, palette, layout, type, overlay or scroll system. The clip opens from `inset(48% 44% 48% 44%)` through `inset(44% 0% 44% 0%)` at offset .4 to full frame over 1100ms, easing cubic-bezier(.65,0,.35,1). Headline/body settle by 8/4px over 560/480ms (body delay 80ms); neither text nor the native hero action becomes invisible. The photograph itself never scales.

The seam is actual-completion owned: `entry-intro.js` calls an optional, isolated `onExit` after the complete 1500ms greeting hold, while the cover is still opaque. `hero-reveal.js` prepares paused first frames there, before the unchanged 150ms cover fade. `main.js` plays them only when `entry.finished` resolves with played=true/reason=complete. No guessed 2.24s text timer and no full-photo → collapsed-photo flash at the handoff. A separately imported missing/late hero module never holds the welcome or masks already-exposed content. Only a connected, decoded current responsive source in the initial viewport is eligible; slow/missing/failed imagery stays static instead of revealing later.

Use native Web Animations, not a new GSAP/SplitText dependency or frame scheduler. Default HTML/CSS is fully visible. Completion/cancellation cancels all owned effects and removes listeners, restoring the incumbent image and text styles; no inline style rewrites. A 1700ms preparation-to-retirement watchdog includes the welcome fade and bounds stalled hero work. Unlike the welcome, the hero does not absorb input: key/pointer/wheel/touch, scroll, resize, route/departure, hidden page and reduced-motion changes settle immediately. Language/Dev changes retire the old hero before replacing/hiding it. Theme tokens remain live without rebuilding content. Healthy first-tab welcomes and explicit reload can play the pair; seen/deep-link/Back/reduced-motion/storage/failure bypasses remain native/static. Cut: full-screen media takeover, scale dip, shading, text splitting and extra runtime. Tradeoff: an additional 1100ms photographic arrival, without extending the welcome's input lock or changing the resting composition.

### Buttons and links

The hero's “Explore the work” is a native `.text-link.hero-work-link` to `#work`, not a filled button. At Chief's request it has no background, border, shadow or horizontal padding: the 12px mono label aligns with the heading, retains the existing arrow and sits over a thin muted underline. Its 44px minimum height and previous 8px top interval remain. Hover and keyboard focus change only text/underline to the existing accent, with the global 2px focus outline and 5px offset. Copy and all six translations stay unchanged. Cut: the hero's enclosing rectangle. Tradeoff: quieter emphasis, with the underline and arrow preserving recognizability. Contact's Email me now matches Read the note: a 13px cardless underlined native mailto action with the same arrow, gap, 44px minimum height, muted resting underline and accent text/underline on hover or keyboard focus. No background, border, padding or shadow; unused filled-button CSS is removed, while theme/icon palette tokens remain. Other links keep their existing behavior. Selection uses orange with dark ink.

### Preferences

The language picker remains a native select. Chief requested removal of its enclosing orange focus rectangle. Its scoped focus cue is now a 2px accent underline (an inset paint-only line), preserving native picker behavior, focus, 44px geometry and all six locales without a blur handler or custom dropdown. Native selects may retain focus-visible after a pointer choice, so the line can also appear then; it never encloses the control. Forced-colors mode restores a system Highlight outline because shadows are suppressed there. The shared focus ring on other controls and the Dev input hairline stay unchanged. Chief's latest feedback replaces both reference sliders with bespoke cardless controls: separate GUI and Dev Mode text buttons, 12px in both desktop and mobile layouts, with resting selected-view brackets and complementary `aria-pressed` states. They explicitly select a view rather than toggle ambiguously. The single 44×44px theme button displays the current sun or moon SVG; its pressed state denotes dark mode, its localized accessible name stays stable (Colour theme: Dark), and its tooltip identifies the next theme. Dark uses warm sand; hover uses the existing accent. Every button retains a minimum 44px target and visible keyboard focus. No tracks, thumbs or travel animation remain. Theme preference stays isolated from the ocean edition and follows the OS until a deliberate choice. Controls are hidden until enhancement is ready. Theme-only changes update the palette and theme control without refreshing language content. Touch-only devices omit colour/background hover transitions; theme and image-navigation controls use manipulation touch handling.

Scrollbars are hidden throughout the Quiet stylesheet, including the command transcript. Native wheel, touch and keyboard scrolling remain enabled; the transcript remains a focusable native scroller. Cost: the scrollbar no longer advertises scroll position or provides a drag handle. This is scoped to Quiet, not the original ocean edition.

### Album viewer

An inline, initially hidden viewer opens from album links or a known album hash. Chief's final spacing choice replaces the briefly tested close-fitting mat: a 2:1 desktop field leaves deliberate side breathing room around complete photos. It uses a 4:3 mobile field to keep them legible, with `object-fit: contain` in both. Interior safety gutters are 24px vertical / 32px horizontal on desktop, 16px / 12px on mobile; remaining space follows the original photograph's aspect ratio. Controls are 44px, the count uses tabular numerals, arrow keys work within the viewer, and Escape closes it and restores focus. An image error is reported while navigation remains available. A pending selection retains the preceding decoded photograph and stable field, with localized loading status and `aria-busy`. Preview is temporarily unavailable until the selected photo is ready; failed selections hide the original-image link until recovery. Only adjacent photographs are prepared, with at most three cached images; Save Data and known slow connections disable preparation. Cost: limited extra bandwidth and decoded-image memory rather than fetching an entire album.

### Large photo preview

At Chief's explicit request, clicking the open album photograph creates a temporary native `<dialog>` preview, not a new gallery route. It uses the active Quiet theme, a contained full photograph, album title/count, original-image link, a 44px Close control and centered 44px previous/next chevrons beneath the photograph. Navigation buttons and Left/Right keys use the inline album's selection and wraparound rather than creating another gallery state. Close, clicking the photograph (a native button with Enter/Space support), Escape, or an outside click returns to the latest selected inline image, unchanged hash and scroll position. Native modal inertness protects the background; a visible-control Tab cycle includes the photo button, navigation and original-image link without escaping to BODY. Failure keeps navigation available, moves focus away from hidden actions and uses inline navigation as the return target if the selected photo is unavailable. Loading/error feedback and late-event invalidation prevent stale previews from reappearing. Hash changes dismiss the layer without forcing the old scroll position. A brief opacity-only exit (120ms, with a 160ms fallback) keeps native modality until close and restores document scrolling before focus returns. Reduced motion and route changes close immediately; cleanup is idempotent, and late image events cannot alter an exiting preview. Cost: one transient focus layer and two footer controls, admitted for viewing and browsing the album without a new route. Equal side fields center navigation independently of count/link text length; the original-image link keeps an intrinsic-width focus target and may wrap on narrow screens.

### Notes reader

`/templates/quiet/notes.html` is a normal document, not an ocean overlay or modal. It inherits the same theme/language controls and native scrolling. The full essay, original date, and seven source links are preserved from `renderArchive()` through the shared snapshot renderer. The essay stays marked English while surrounding controls translate. The main title precedes metadata; generous paragraph intervals replace the portfolio's dense row rhythm. One “Back to portfolio” link sits directly after the essay and lands at the portfolio's Notes section. The separate page footer contains only the author signature; it does not repeat the return action. The portfolio's “Read the note” action is an underlined 13px text link with a 44px hit target: no fill, enclosing card, or button rectangle. The complete reading and return path works without JavaScript.

### Approach reader

`/templates/quiet/approach.html` inherits the existing reader's title-first hierarchy, 68ch field and single native return link after the content. As on Notes, the page footer contains only the author signature. Three original purpose paragraphs and six working principles are reused through the shared translation table. The six-language set now includes Japanese; the original five translations remain unchanged. Principles are separated by thin rules rather than cards or decorative numbering. Reading and return to About work without JavaScript.

Chief subsequently moved Relics out of Approach into Selected work. Neither the uncommitted direction passage nor the earlier hero-design colophon remains in this reader; its static HTML is identical to the last released version.

### Relics in Selected work

One Relics row follows 2041, using the existing thin-rule work list, system mono, neutral colors and responsive columns/stack. “Ex-formation” replaces generic template metadata: it is the core method named in Relics’ local Hara doctrine, emphasizing fresh perception through removal of inherited assumptions. The shorter six-language body describes a developing documentation/research reference for Twin-Sparrow’s TUI and 2041 (Aurelian), with a planned manuscript-based podcast on brittle AI and self-correcting intelligence. The local Brittle AI archive and Continuous Valence-Corrected Intelligence abstract/introduction ground the subject; integration stays planned and the theoretical framework is not a proven capability. The action now uses shared ui.visit, exactly like other public work links; keep https://relics.quest/#top, noopener/noreferrer, 44px height, accent hover and visible focus. work.js still feeds GUI and Dev Mode, while ocean data and original project statuses/URLs remain untouched. Remove redundant relicsKind/relicsLink keys and custom action override. Cut: generic category label, roadmap-length prose and a special action name. Tradeoff: fewer roadmap details; no new card, badge, dependency or motion.

### Japanese locale

The existing native language select now includes 日本語 (`ja`), with options derived from the shared registry. Quiet supplies full Japanese copy; shared project/status/album labels and Approach text use Japanese translations in `src/i18n.js`. Japanese browser preferences are recognized without overriding a saved `rhine-lang` choice. Notes keeps its authored English essay and translates only surrounding navigation. Preserve the system font stack, line wrapping, palette, 44px targets, URLs and independent ocean visual language; no new language-specific skin or remote font is introduced. 2041 retains companion-assisted wording and its development status in both views.

### Dev Mode

Dev Mode replaces the GUI content field, not its document or data. The theme's surface plane supports a bounded transcript, real source links, and a labelled command input. Output uses 13px text, identifiers use the text accent, and descriptions/status remain muted. No shadows, simulated operating-system chrome, blinking cursor or always-black terminal skin. The transcript is capped at 50svh on desktop and 24svh on mobile so the command prompt remains reachable in the first mobile viewport; it is a native keyboard-focusable scroller. Chief's approved Ellipsis-informed refinement uses path-style display labels instead of Dev shortcut/result underlines: `~/help`, `~/ls --work`, and stable record IDs such as `~/relics --open`. Payloads remain `help`/`ls work`; native destinations and new-tab safety are unchanged. The 22ch desktop identifier rail contains the path links, with full names/status/descriptions beside them; mobile keeps stacked rows. Only real destinations get the open qualifier, with 44px link targets and the global focus outline. Unavailable work stays unlinked without an open cue. Tooltips and accessible shortcut names disclose the actual commands; help and command echoes retain the true grammar. Cut: underlined Dev names and shortcuts. Tradeoff: a slightly wider rail and visual labels distinct from accepted input syntax. These are display identifiers, not a filesystem or new shell. Square Run, command shortcuts and Return to GUI controls retain 44px targets. Input has native editing, an accent caret and a 1px focus hairline with a tight 2px offset, normal Tab navigation and Arrow-key history. This local command-field exception preserves the global 2px/5px focus indicator on other controls. GUI album/focus/scroll state is retained in memory while hidden, not duplicated into a second gallery.

### Motion

Header nav/view feedback is a symmetric square-bracket gather, authored for this scope under XI Base Motion System. Empty, pointer-transparent pseudo-elements hug an intrinsic label span (not the mobile link row): 1px stroke, 3px caps, 16px height, 6px side offset. They translate 2px inward and fade over 240ms, then outward over 160ms with XI cubic-out cubic-bezier(0.215, 0.61, 0.355, 1); state reversal uses current CSS transition progress. No text movement/duplication, spring, idle loop, new JS scheduler or dependency. Active GUI/Dev retains neutral-ink brackets at rest; hover/keyboard focus accents the same frame, with the global focus outline intact. Unselected nav has no persistent frame or underline. Touch and reduced motion are immediate. Other colour/background feedback remains 150ms with the incumbent CSS ease. Touch-only devices omit colour/background transitions. The protected-focus photo preview has the bounded exit described above; image changes themselves do not add slide effects or artificial delay. Reduced motion disables transitions and exit animation. There is no scroll manipulation, media autoplay or idle render loop. The explicitly requested first-visit/reload SVG welcome is the sole page-entry exception described above; there is no scroll animation or persistent scroll owner.

## Do's and Don'ts

### Do:
- **Do** preserve the label/content alignment and readable mobile reflow.
- **Do** keep publication types, development status, and uncertainty visible.
- **Do** use the user's photographs with recorded provenance.
- **Do** keep the static English snapshot synchronized with the renderer.

### Don't:
- **Don't** import this stylesheet into the original ocean entry.
- **Don't** add card shells, shadows, page loaders, or decorative animation to this template without a new brief.
- **Don't** put white text on the orange button state.
- **Don't** turn a research proposal into a claim of demonstrated performance.
