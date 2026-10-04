# Rhine Tague

I build to understand.

A minimal portfolio of software, research, and photography.

[lesz25.com](https://lesz25.com)

## Direction

A short introduction, then the work. Simple typography, thin rules, neutral light
and dark themes, and room for the photographs. Native scrolling, without scroll effects.

A short, skippable first-tab welcome draws the supplied Philippine SVG flag, then
reveals “Magandang araw!” below it. It is not a loading-progress indicator. Reduced
motion, deep links and reader returns bypass it; failures keep the page usable.
The country label itself remains text-only.

Page order: About → Selected Work → Photography → Research → Notes → Contact.

Selected projects and papers keep their source links and development status.
Notes and Approach are dedicated reading pages. The authored essay stays in English;
the portfolio and interface support English, German, French, Italian, and Chinese.

GUI is the default view. Dev Mode offers a small set of commands for finding and
opening the same work—it is a browser interface, not a shell.

## Run locally

Use Node.js 22. From the repository root:

```sh
npm install
npm run dev
```

Open the local URL printed by Vite. The new portfolio is at `/`.

```sh
npm run build
npm run preview
```

Vite writes the production site to `dist/`.

## Structure

- `templates/quiet/` — portfolio, readers, styles, and interaction code.
- `src/data.js` and `src/i18n.js` — shared records and translations.
- `public/quiet/` — optimized images with provenance sidecars.
- `public/img/` — original portfolio photographs.
- `scripts/sync-quiet.mjs` — English fallbacks and synchronized root homepage.
- `tests/` — content, navigation, accessibility, and browser checks.

Quiet serves at `/`. The existing `/templates/quiet/` URL remains available.
Notes and Approach retain their URLs under `/templates/quiet/` and return to the
homepage. The earlier ocean portfolio is preserved at `/templates/ocean/`, with
its own visual system and runtime.

## Checks

After changing copy, records, or rendering:

```sh
node scripts/sync-quiet.mjs
npm test
npm run check:quiet
```

Browser checks use an existing Playwright installation; they do not install packages
or start a server. See `tests/quiet.browser.mjs` for source, live-server, and compiled
`dist/` verification options. `tests/entry-intro.browser.mjs` checks the welcome
sequence on an existing live Vite server, including interruption and failure paths;
`ENTRY_CAPTURE=1` records a bounded desktop/mobile light/dark capture batch.
