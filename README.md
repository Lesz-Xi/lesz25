# Rhine Tague — Portfolio

![Rhine Tague — I watch, doubt, and build.](public/cover.jpg)

> I watch, doubt, and build.

A portfolio built as a place rather than a page: a full-viewport WebGL ocean under a
day/night sky, with the work opening as paper letters over water that never restarts.

Live: **[lesz25.com](https://lesz25.com)**

---

## What's here

- **Work** — causal AI, companion-agent runtimes, observational interfaces.
- **Research** — preprints and white papers.
- **Photography** — six albums, shot across Switzerland, Paris, and the Philippines.
- **Archive** — field notes. Currently: *What My Hands Knew First*.
- **Purpose** — the ground under the work.

## The ocean

A raymarched WebGL sea (based on afl_ext's *Ocean*, MIT) retuned to a warm two-tone
palette. Day and night are one shader: the entire palette resolves from two anchor
colours in a duotone post-process, so the two themes are the same geometry seen under
different light.

**Day** — an Interstellar-warm sea: cream sky, sun-path glints, clear water.
**Night** — a Milky Way band overhead, and bioluminescent plankton blooms lighting the
crests of breaking waves.

A boat sails the horizon; click it to pause the ambient audio.

## Stack

Vanilla — no framework. Vite, WebGL2, ES modules. Five languages (EN/DE/FR/IT/ZH).

```bash
npm install
npm run dev     # localhost:5174
npm run build
```

## Credits

Ocean shader based on [afl_ext](https://www.shadertoy.com/user/afl_ext)'s *Ocean* (MIT).
Ambient track: *ICARUS (Sleep Version)* — Tony Ann.

## Licence

Apache 2.0.
