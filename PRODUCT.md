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
- Retain English, German, French, Italian, and Chinese; reuse the existing language preference.
- Preserve original project/publication URLs, in-development statuses, album manifests, and contact information.
- The new template must not import the ocean renderer or letter-overlay runtime.
- Chief authorized this homepage migration, production checks, commit and push. Do not install dependencies or start a development server automatically.
- Keep root HTML synchronized from Quiet, and distinguish a successful push from a verified deployment.

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
