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
  button-primary:
    backgroundColor: "{colors.button-slate}"
    textColor: "{colors.button-ink}"
    rounded: "{rounded.control}"
    padding: "12px 20px"
    typography: "{typography.label}"
  button-primary-hover:
    backgroundColor: "{colors.orange}"
    textColor: "{colors.orange-ink}"
    rounded: "{rounded.control}"
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

Orange is interaction feedback, not a page field. Light primary actions pair slate with white. At Chief's explicit request, dark actions pair warm sand (`#d8c8b4`) with charcoal (`#211f1c`) rather than carrying the cool slate into the warm dark surface. Both themes switch to orange with charcoal text on hover/focus. Light-theme text accents use the darker orange tone for readability.

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

The body sequence after the unchanged hero photograph is **About → Selected Work → Photography → Research → Notes → Contact**. Header navigation and Dev Mode's section list follow the same order. It is encoded in the DOM/renderers rather than CSS visual order, keeping keyboard, screen-reader and no-JavaScript reading coherent. About is moved, not repeated; copy and spacing are unchanged. All six header links use the existing wrapping and touch-target rules. The hero's Explore the work action still bypasses the introduction when desired.

The shell is at most 1200px wide. Desktop uses a 180px label column and a 32px gutter. At 1040px and below, the label column becomes 140px with a 24px gutter. At 700px and below, sections stack and the shell has 20px side gutters.

Work uses text rows. Papers form two columns on desktop and one on mobile. All six albums have photographic previews: three columns on desktop, two at intermediate widths, one on mobile. Notes is a separate section after About. Sections use 64px vertical padding on desktop and 40px on mobile. The dedicated Notes page uses the same rail, a 68ch reading column, 16px body at 1.85 line height (15px on mobile), and a larger two-line title.

## Elevation & Depth

There are no shadows or simulated physical materials. Tonal separation defines the active album's cinematic field; the hero has no padded mat. Hairlines separate related groups; whitespace separates larger sections.

## Shapes

Controls and content rows are square. The small identity portrait has subtly softened 4px corners; the signature photograph keeps its existing 12px corners. Its 2:1 frame is filled edge-to-edge, with no surround padding. The caption and link remain outside the image. Album previews fill their rectangular crops; original photographs in the viewer are never cropped.

## Components

### Page footer

Quiet's portfolio footer contains only the author signature, matching Notes and Approach. At Chief's request, the “Original portfolio” link is removed rather than hidden with CSS; unused translations are also removed. Contact/social actions stay in the preceding Contact section. No replacement footer action is introduced. The subsequent homepage migration makes Quiet the root entry; readers return to the corresponding root section.

### Identity portrait

Chief's supplied `xi_profile.png` sits directly above the name in Quiet's existing identity rail, left-aligned with the name. It is 80×80px desktop and 64×64px below 700px, with 4px corners and no card, border, shadow, badge or added interaction. A 160×160 WebP derivative preserves the complete square source and supplies 2× desktop pixels for about 5.6KB. Explicit dimensions reserve the square footprint; empty alt avoids repeating the adjacent name to screen readers. Mobile adds 8px image-to-name spacing on top of the existing 4px stack gap. The source PNG, ocean hero, reader headers and favicon are unchanged by this addition. Cost: one small eager image and additional identity-rail height, not a new content block.

### SVG welcome sequence

Chief explicitly replaced the inline country decoration with one skippable welcome sequence inside the existing Quiet world. The country is text-only again. Latest Paper node `7M-0` supplies the full pole flag, already blue above red; its colors, paths, gradients and orientation stay intact. A centered 176–240px contained SVG reserves its complete aspect ratio, with a 28px interval to the caption below: “Magandang araw!” (`lang="fil"`), then localized “Good day. Welcome.” A cardless 44px-minimum Skip action rests at the bottom-right. Use the page's existing neutral ground, mono type and readable theme roles; flag colors are artwork, not new UI palette tokens.

Entry behavior is one finite native Web Animations sequence: pole → six stroke-drawn stripes → sun → three sequential stars → greeting → brief completed hold → opacity exit. Its nominal duration is 3350ms, including Chief's explicitly requested 1500ms hold after the completed caption is fully visible, with a 3700ms JS deadline and independent 4s CSS visibility/pointer fail-open. Actual animation completion drives each next stage. No GSAP dependency, extra ticker, inert state, modal, body scroll lock or smoother is added. The optional module is dynamically imported so its failure cannot disable portfolio controls. It plays once per tab on a healthy fresh non-hash arrival; reduced motion, hidden/late/returning pages, unavailable storage, slow/missing artwork and existing interaction bypass it. Skip, keyboard, pointer/touch/wheel input, route changes, page departure and live reduced-motion changes retire the work and preserve native input. Static/no-script content remains immediately available. Cut: persistent country flag and any progress fiction. Tradeoff: a short first-visit welcome before the underlying ready page, never repeated page-load choreography.

### Buttons and links

Primary buttons have a 44px minimum target, slate/light or warm-sand/dark rest state, and orange hover/focus fill. Links use a thin underline on hover; small authored SVG arrows clarify destinations. Keyboard focus is a 2px accent outline with 5px offset. Selection uses orange with dark ink.

### Preferences

The language picker remains a native select. Chief's latest feedback replaces both reference sliders with bespoke cardless controls: separate GUI and Dev Mode text buttons, 12px in both desktop and mobile layouts, with a 1px active underline and complementary `aria-pressed` states. They explicitly select a view rather than toggle ambiguously. The single 44×44px theme button displays the current sun or moon SVG; its pressed state denotes dark mode, its localized accessible name stays stable (Colour theme: Dark), and its tooltip identifies the next theme. Dark uses warm sand; hover uses the existing accent. Every button retains a minimum 44px target and visible keyboard focus. No tracks, thumbs or travel animation remain. Theme preference stays isolated from the ocean edition and follows the OS until a deliberate choice. Controls are hidden until enhancement is ready. Theme-only changes update the palette and theme control without refreshing language content. Touch-only devices omit colour/background hover transitions; theme and image-navigation controls use manipulation touch handling.

Scrollbars are hidden throughout the Quiet stylesheet, including the command transcript. Native wheel, touch and keyboard scrolling remain enabled; the transcript remains a focusable native scroller. Cost: the scrollbar no longer advertises scroll position or provides a drag handle. This is scoped to Quiet, not the original ocean edition.

### Album viewer

An inline, initially hidden viewer opens from album links or a known album hash. Chief's final spacing choice replaces the briefly tested close-fitting mat: a 2:1 desktop field leaves deliberate side breathing room around complete photos. It uses a 4:3 mobile field to keep them legible, with `object-fit: contain` in both. Interior safety gutters are 24px vertical / 32px horizontal on desktop, 16px / 12px on mobile; remaining space follows the original photograph's aspect ratio. Controls are 44px, the count uses tabular numerals, arrow keys work within the viewer, and Escape closes it and restores focus. An image error is reported while navigation remains available. A pending selection retains the preceding decoded photograph and stable field, with localized loading status and `aria-busy`. Preview is temporarily unavailable until the selected photo is ready; failed selections hide the original-image link until recovery. Only adjacent photographs are prepared, with at most three cached images; Save Data and known slow connections disable preparation. Cost: limited extra bandwidth and decoded-image memory rather than fetching an entire album.

### Large photo preview

At Chief's explicit request, clicking the open album photograph creates a temporary native `<dialog>` preview, not a new gallery route. It uses the active Quiet theme, a contained full photograph, album title/count, original-image link, a 44px Close control and centered 44px previous/next chevrons beneath the photograph. Navigation buttons and Left/Right keys use the inline album's selection and wraparound rather than creating another gallery state. Close, clicking the photograph (a native button with Enter/Space support), Escape, or an outside click returns to the latest selected inline image, unchanged hash and scroll position. Native modal inertness protects the background; a visible-control Tab cycle includes the photo button, navigation and original-image link without escaping to BODY. Failure keeps navigation available, moves focus away from hidden actions and uses inline navigation as the return target if the selected photo is unavailable. Loading/error feedback and late-event invalidation prevent stale previews from reappearing. Hash changes dismiss the layer without forcing the old scroll position. A brief opacity-only exit (120ms, with a 160ms fallback) keeps native modality until close and restores document scrolling before focus returns. Reduced motion and route changes close immediately; cleanup is idempotent, and late image events cannot alter an exiting preview. Cost: one transient focus layer and two footer controls, admitted for viewing and browsing the album without a new route. Equal side fields center navigation independently of count/link text length; the original-image link keeps an intrinsic-width focus target and may wrap on narrow screens.

### Notes reader

`/templates/quiet/notes.html` is a normal document, not an ocean overlay or modal. It inherits the same theme/language controls and native scrolling. The full essay, original date, and seven source links are preserved from `renderArchive()` through the shared snapshot renderer. The essay stays marked English while surrounding controls translate. The main title precedes metadata; generous paragraph intervals replace the portfolio's dense row rhythm. One “Back to portfolio” link sits directly after the essay and lands at the portfolio's Notes section. The separate page footer contains only the author signature; it does not repeat the return action. The portfolio's “Read the note” action is an underlined 13px text link with a 44px hit target: no fill, enclosing card, or button rectangle. The complete reading and return path works without JavaScript.

### Approach reader

`/templates/quiet/approach.html` inherits the existing reader's title-first hierarchy, 68ch field and single native return link after the content. As on Notes, the page footer contains only the author signature. Three original purpose paragraphs and six working principles are reused without rewriting, using their existing five-language translations. Principles are separated by thin rules rather than cards or decorative numbering. Reading and return to About work without JavaScript.

### Dev Mode

Dev Mode replaces the GUI content field, not its document or data. The theme's surface plane supports a bounded transcript, real source links, and a labelled command input. Output uses 13px text, identifiers use the text accent, and descriptions/status remain muted. No shadows, simulated operating-system chrome, blinking cursor or always-black terminal skin. The transcript is capped at 50svh on desktop and 24svh on mobile so the command prompt remains reachable in the first mobile viewport; it is a native keyboard-focusable scroller. Square Run, command shortcuts and Return to GUI controls retain 44px targets. Input has native editing, accent caret/focus, normal Tab navigation and Arrow-key history. GUI album/focus/scroll state is retained in memory while hidden, not duplicated into a second gallery.

### Motion

Colour/background and active-underline opacity feedback last 150ms with CSS ease. Touch-only devices omit colour/background transitions. The protected-focus photo preview has the bounded exit described above; image changes themselves do not add slide effects or artificial delay. Reduced motion disables transitions and exit animation. There is no scroll manipulation, media autoplay or idle render loop. The explicitly requested, once-per-tab SVG welcome is the sole page-entry exception described above.

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
