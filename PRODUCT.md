# Rhine Tague — portfolio

<!-- impeccable:product-schema 1 -->

## Platform

web

## Stack

Existing vanilla JavaScript / ES modules and Vite. No framework or new runtime dependency is required.

## Users

Visitors exploring Rhine's software, research, and photography, including potential collaborators. The approved minimal portfolio gives these three practices balanced representation rather than turning the portfolio into a sales funnel.

## Product Purpose

Make Rhine's work, publications, photographs, notes, and contact details available to inspect. Project status and publication type remain visible; presentation is not proof of a claim.

## Capabilities and Constraints

- Serve the minimal Quiet portfolio at `/`; keep `/templates/quiet/` as a compatible entry.
- Preserve the original ocean portfolio at `/templates/ocean/`, including its design, wording, hash routes, and controls.
- Keep Quiet's styling and interaction code independent of the ocean runtime.
- Support English, German, French, Italian, Chinese, and Japanese; reuse the existing language preference. Japanese covers the portfolio, readers' navigation, Approach, gallery and Dev controls; the authored essay remains English. The shared registry also adds Japanese to the independent ocean edition without rewriting its existing locales.
- Preserve original project/publication URLs, in-development statuses, album manifests, and contact information.
- The new template must not import the ocean renderer or letter-overlay runtime.
- Chief authorized this homepage migration, production checks, commit and push. Do not install dependencies or start a development server automatically.
- Keep root HTML synchronized from Quiet, and distinguish a successful push from a verified deployment.
- Chief's latest explicit exception is one optional, skippable Philippine-SVG welcome sequence, replacing the inline country flag. Preserve native scrolling and fail-open/no-script content; reduced motion bypasses it. This is not resource progress and must not delay initialization or repeat on reader returns. The prior inline-flag commit/push was paused when this scope changed; Chief subsequently approved the completed welcome with its 1500ms greeting hold and authorized committing/pushing it. A push does not establish deployment.

- Chief's reload refinement: Command–R/browser reload of Quiet returns to its hero and replays eligible welcome motion; clear only the fragment, preserve the route/query, and do not alter ordinary deep links, reader returns or Back navigation. Remove the visible “Skip introduction” button while retaining immediate keyboard/click/touch/wheel dismissal and all reduced-motion/failure safeguards. Chief subsequently authorized committing and pushing this follow-up; deployment is verified separately.

- Chief's first-paint refinement removes the hero glimpse before eligible welcome playback: reserve the existing theme ground in the head, then hand off atomically to the visible SVG cover. Keep a bounded, input-interruptible startup with independent JS/CSS fail-open; do not hide or delay portfolio initialization. Reduced motion, ordinary deep links/Back and no-script content stay native. Chief explicitly authorized committing and pushing this follow-up together with the favicon/copy and Japanese changes on 2026-10-04; deployment is verified separately.

- Chief requested a white favicon chevron in dark browser/system appearance only. Preserve its original light rendering, orange dots, geometry and fixed PNG fallback; browser preference, not Quiet's saved page theme, owns the adaptive SVG.
- Describe 2041 as a terminal workspace for companion-assisted software work, consistently in Quiet and Dev Mode; preserve its development status and lack of a public link. Chief explicitly authorized committing and pushing the combined first-paint, favicon/copy and Japanese follow-ups on 2026-10-04. A successful push does not establish deployment.

## Brand Commitments

Rhine Tague is a designer, photographer, and researcher based in the Philippines. Work is a form of inquiry: building to understand, preserving provenance and uncertainty, and making systems inspectable. Photography is part of that practice, not stock decoration.

The user approved Ellipsis's label/content structure and hairlines, Conductor-informed neutral themes, and one Readman-inspired wide photograph. This applies to the default Quiet portfolio and its readers, not to the preserved ocean edition.

The user additionally requested concise, simple, pragmatic section wording, grounded in existing work and personal principles. New wording must not invent experience, credentials, research validation, or commercial results.

## Evidence on Hand

- `src/data.js`: project/research/album/contact records and authored archive essay.
- `src/i18n.js`: established content, language registry, and translation behaviour.
- `public/img/`: existing portfolio photographs supplied by the user.
- User-supplied Ellipsis and Readman local capture bundles and Conductor screenshot.

## Product Principles

- Let the visitor inspect work rather than rely on claims about it.
- Keep research proposals distinguishable from established results.
- Use concise language without erasing meaningful uncertainty.
- Make the work directly readable; preserve the earlier ocean edition without making it the default.

## Accessibility & Inclusion

Keyboard-operable controls, visible focus, contrast-aware themes, readable mobile layouts, native scrolling, reduced-motion support, and a useful English page when JavaScript is unavailable.
