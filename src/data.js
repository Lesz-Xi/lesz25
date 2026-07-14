// Rhine Tague — portfolio content + letter renderers.
// Values sourced from the lesz25 React portfolio (ProjectCarousel, ResearchSection,
// CareerSection, AlbumDisplay, Footer). Rendered as quiet paper-letter ledgers.

import { t } from './i18n.js';

// Names, principles, years and URLs are language-invariant; only prose is keyed.
export const heroHtml = () =>
  t('hero').replace('{build}', `<a class="home-hero-link" href="#work">${t('hero.build')}</a>`);

export const projects = [
  { name: 'Wu-Weism / MASA', principle: 'Ma', statusKey: '', url: 'https://wuweism.com' },
  { name: 'Twin-Sparrow', principle: 'Shinkei', statusKey: 'status.dev', url: '' },
  { name: 'Aurelian', principle: 'Kanso', statusKey: 'status.dev', url: '' },
  { name: 'Seismic Observation / TSRA', principle: 'Kiroku', statusKey: '', url: 'https://tectonic-strain-ratchet-analyzer.vercel.app/' },
  { name: 'ThesisLens', principle: 'Shibui', statusKey: '', url: 'https://thesislens.space/' },
  { name: 'Universe Splitter', principle: 'Wabi-sabi', statusKey: '', url: 'https://univ-spitter.vercel.app/' },
  { name: 'SkillShift AI', principle: 'Shibui', statusKey: 'status.private', url: '' },
];

export const research = [
  { name: 'The Entropic Vise', url: 'https://zenodo.org/records/18287138' },
  { name: 'Continuous Valence-Corrected Intelligence', url: 'https://zenodo.org/records/20579513' },
  { name: 'MASA — Methods of Automated Scientific Analysis', url: 'https://www.wuweism.com/masa-white-paper.html' },
  { name: 'Claim discipline', url: '' },
];

export const career = [
  { year: '2025–26', name: 'MASA / Wu-Weism' },
  { year: '2026', name: 'Twin-Sparrow' },
  { year: '2026', name: 'Aurelian' },
  { year: '2025', name: 'Seismic Observation (TSRA)' },
  { year: '2025', name: 'ThesisLens' },
  { year: '2025', name: 'SkillShift AI' },
  { year: '2025', name: 'Universe Splitter' },
  { year: '2025', name: 'The Entropic Vise' },
  { year: '2026', name: 'Continuous Valence Research' },
  { year: '', nameKey: 'career.independent' }, // year comes from t('career.present')
];

// `cover` is the grid thumbnail; `images` is the ordered gallery the ‹ › toggle
// pages through in the album detail view. Order preserved verbatim from the lesz25
// portfolio's curated manifest (landscape/portrait interleave). Drop new files into
// public/img/<id>/ and add their paths to `images` to extend an album.
export const albums = [
  { id: 'switzerland', year: '2022',
    cover: '/img/switzerland.webp',
    images: [
      '/img/switzerland/switz-landsc-1.webp', '/img/switzerland/switz-port-1.webp', '/img/switzerland/switz-port-2.webp',
      '/img/switzerland/switz-landsc-2.webp', '/img/switzerland/switz-port-3.webp', '/img/switzerland/switz-port-4.webp',
      '/img/switzerland/switz-landsc-3.webp', '/img/switzerland/switz-port-5.webp', '/img/switzerland/switz-port-6.webp',
      '/img/switzerland/switz-landsc-4.webp', '/img/switzerland/switz-port-7.webp', '/img/switzerland/switz-port-8.webp',
    ] },
  { id: 'paris', year: '2022',
    cover: '/img/paris.webp',
    images: [
      '/img/paris/paris-landsc-1.webp', '/img/paris/paris-port-1.webp', '/img/paris/paris-port-2.webp',
      '/img/paris/paris-landsc-2.webp', '/img/paris/paris-port-3.webp', '/img/paris/paris-port-4.webp',
      '/img/paris/paris-landsc-3.webp', '/img/paris/paris-port-5.webp', '/img/paris/paris-port-6.webp',
      '/img/paris/paris-landsc-4.webp', '/img/paris/paris-port-7.webp', '/img/paris/paris-port-8.webp',
    ] },
  { id: 'nature', year: '2022',
    cover: '/img/nature.webp',
    images: [
      '/img/nature/nature-landsc-1.webp', '/img/nature/nature-port-1.webp', '/img/nature/nature-port-2.webp',
      '/img/nature/nature-landsc-2.webp', '/img/nature/nature-port-3.webp', '/img/nature/nature-port-4.webp',
      '/img/nature/nature-port-5.webp', '/img/nature/nature-port-6.webp', '/img/nature/nature-port-7.webp',
      '/img/nature/nature-port-8.webp', '/img/nature/nature-port-9.webp',
    ] },
  { id: 'sunset', year: '2025',
    cover: '/img/sunset.webp',
    images: [
      '/img/sunset/sunset-landsc-1.webp', '/img/sunset/sunset-port-1.webp', '/img/sunset/sunset-port-2.webp',
      '/img/sunset/sunset-landsc-2.webp', '/img/sunset/sunset-port-3.webp', '/img/sunset/sunset-port-4.webp',
      '/img/sunset/sunset-landsc-3.webp', '/img/sunset/sunset-port-5.webp', '/img/sunset/sunset-port-6.webp',
      '/img/sunset/sunset-landsc-4.webp', '/img/sunset/sunset-port-7.webp', '/img/sunset/sunset-port-8.webp',
    ] },
  { id: 'philippines', year: '2025',
    cover: '/img/philippines.webp',
    images: [
      '/img/philippines/ph-landscape-1.webp', '/img/philippines/ph-port-1.webp', '/img/philippines/ph-port-2.webp',
      '/img/philippines/ph-landscape-2.jpeg', '/img/philippines/ph-port-4.webp', '/img/philippines/ph-port-5.webp',
      '/img/philippines/ph-port-6.webp', '/img/philippines/ph-port-7.webp',
    ] },
  { id: 'flowers', year: '2025',
    cover: '/img/flowers.webp',
    images: [
      '/img/flowers/flowers-landsc-1.webp', '/img/flowers/flowers-port-1.webp', '/img/flowers/flowers-port-3.webp',
      '/img/flowers/flowers-landsc-2.webp', '/img/flowers/flowers-port-4.webp', '/img/flowers/flowers-port-5.webp',
      '/img/flowers/flowers-landsc-3.webp', '/img/flowers/flowers-port-6.webp', '/img/flowers/feat-portrait.webp',
      '/img/flowers/flowers-landsc-4.webp', '/img/flowers/flowers-landsc-5.webp', '/img/flowers/flowers-landsc-6.webp',
    ] },
];

export const socials = [
  { keyLabel: 'contact.email', label: 'rhinelesther@gmail.com', url: 'mailto:rhinelesther@gmail.com' },
  { keyLabel: 'contact.location', labelKey: 'contact.locationVal', url: '' },
  { keyLabel: '', key: 'GitHub', label: 'github.com/Lesz-Xi', url: 'https://github.com/Lesz-Xi' },
  { keyLabel: '', key: 'LinkedIn', label: 'in/rhine-lesther-tague', url: 'https://linkedin.com/in/rhine-lesther-tague-4b604a246' },
  { keyLabel: '', key: 'Instagram', label: '@ichrhin3y', url: 'https://instagram.com/ichrhin3y' },
  { keyLabel: '', key: 'X', label: '@codefar1', url: 'https://x.com/codefar1' },
];

// ---- renderers (return HTML strings; content is static + trusted) ----

const pad = (n) => String(n + 1).padStart(2, '0');

function linkOrName(name, url) {
  return url ? `<a href="${url}" target="_blank" rel="noopener noreferrer">${name}</a>` : name;
}

// Album title/place are keyed by album id; used here and by the photo viewer.
export const albumTitle = (a) => t(`album.${a.id}.title`);
export const albumPlace = (a) => t(`album.${a.id}.place`);

export function renderWork() {
  const rows = projects.map((p, i) => `
    <div class="ledger-row">
      <div>
        <div class="ledger-index">${pad(i)}</div>
        <div class="ledger-name">${linkOrName(p.name, p.url)}</div>
        <div class="ledger-desc">${t(`work.${i}.desc`)}</div>
      </div>
      <div class="ledger-meta">
        <div class="ledger-tag">${p.principle}${p.statusKey ? ` · ${t(p.statusKey)}` : ''}</div>
        ${p.url ? `<div><a href="${p.url}" target="_blank" rel="noopener noreferrer">${t('ui.visit')}</a></div>` : ''}
      </div>
    </div>`).join('');
  return `<div class="ledger">${rows}</div>`;
}

export function renderResearch() {
  const rows = research.map((r, i) => `
    <div class="ledger-row">
      <div>
        <div class="ledger-index">${pad(i)}</div>
        <div class="ledger-name">${linkOrName(r.name, r.url)}</div>
        <div class="ledger-desc">${t(`res.${i}.desc`)}</div>
      </div>
      <div class="ledger-meta">
        <div class="ledger-tag">${t(`res.${i}.kind`)}</div>
        ${r.url ? `<div><a href="${r.url}" target="_blank" rel="noopener noreferrer">${t('ui.read')}</a></div>` : ''}
      </div>
    </div>`).join('');
  return `<div class="ledger">${rows}</div>`;
}

export function renderAbout() {
  const rows = career.map((c, i) => `
    <div class="ledger-row">
      <div class="ledger-meta">${c.year || t('career.present')}</div>
      <div>
        <div class="ledger-name" style="font-size:19px">${c.nameKey ? t(c.nameKey) : c.name}</div>
        <div class="ledger-tag">${t(`career.${i}.note`)}</div>
      </div>
    </div>`).join('');
  return `
    <p class="letter-body">${t('about.body')}</p>
    <div class="ledger">${rows}</div>`;
}

const CHEVRON_LEFT = `<svg viewBox="0 0 16 16" width="15" height="15" fill="none" aria-hidden="true"><path d="M10.5 3.5 L5.5 8 L10.5 12.5" stroke="currentColor" stroke-width="1" stroke-linecap="round" stroke-linejoin="round"/></svg>`;
const CHEVRON_RIGHT = `<svg viewBox="0 0 16 16" width="15" height="15" fill="none" aria-hidden="true"><path d="M5.5 3.5 L10.5 8 L5.5 12.5" stroke="currentColor" stroke-width="1" stroke-linecap="round" stroke-linejoin="round"/></svg>`;

export function renderPhotography() {
  return `
    <p class="letter-body" data-photo-intro>${t('photo.intro')}</p>
    <div class="photo-albums" data-photo-albums>
      ${albums.map((a, i) => `
        <button class="photo-album-card" type="button" data-album-open="${i}" aria-label="${t('ui.openAlbum')}: ${albumTitle(a)}">
          <span class="photo-album-cover"><img src="${a.cover}" alt="${albumTitle(a)}"></span>
          <span class="photo-album-name">${albumTitle(a)}</span>
          <span class="photo-album-where">${albumPlace(a)} · ${a.year}</span>
        </button>`).join('')}
    </div>
    <div class="photo-detail" data-photo-detail hidden>
      <button class="photo-back" type="button" data-album-back>${t('ui.albums')}</button>
      <figure class="photo-stage" data-photo-stage>
        <div class="photo-thumb" data-full="" role="button" tabindex="0" aria-label="">
          <img data-photo-img src="" alt="">
        </div>
      </figure>
      <div class="photo-controls" data-photo-controls>
        <button class="photo-nav-btn" type="button" data-photo-prev aria-label="${t('ui.prev')}">${CHEVRON_LEFT}</button>
        <span class="photo-counter" data-photo-counter>01 / 01</span>
        <button class="photo-nav-btn" type="button" data-photo-next aria-label="${t('ui.next')}">${CHEVRON_RIGHT}</button>
      </div>
    </div>`;
}

export function renderContact() {
  const rows = socials.map((s) => {
    const key = s.keyLabel ? t(s.keyLabel) : s.key;
    const label = s.labelKey ? t(s.labelKey) : s.label;
    // `download` saves the file straight off rather than opening a PDF viewer tab.
    const attrs = s.download
      ? ' download'
      : (s.url.startsWith('http') ? ' target="_blank" rel="noopener noreferrer"' : '');
    return `
    <li>
      <span class="contact-key">${key}</span>
      <span class="contact-val">${s.url ? `<a href="${s.url}"${attrs}>${label}</a>` : label}</span>
    </li>`;
  }).join('');
  return `
    <p class="letter-body">${t('contact.body')}</p>
    <ul class="contact-list">${rows}</ul>`;
}

export function renderPurpose() {
  const rows = [0, 1, 2, 3, 4, 5].map((i) => `
    <div class="ledger-row">
      <div>
        <div class="ledger-index">${pad(i)}</div>
        <div class="ledger-name" style="font-size:19px">${t(`purpose.pr${i}`)}</div>
      </div>
    </div>`).join('');
  return `
    <p class="letter-body">${t('purpose.p1')}</p>
    <p class="letter-body">${t('purpose.p2')}</p>
    <p class="letter-body">${t('purpose.p3')}</p>
    <div class="ledger">${rows}</div>`;
}

// The archive holds written works. An essay is quoted in the language it was
// written in — the chrome around it translates, the voice does not.
export function renderArchive() {
  return `
    <div class="archive-entry">
      <div class="archive-eyebrow">Field Note — Jul 2026</div>
      <h3 class="archive-title">What My Hands Knew First</h3>
      <p class="letter-body archive-lede">I only discover what I believe after I build it.</p>
      <p class="letter-body">That is not a pose of humility; it is the order things actually happen in. I do not sit with a conviction, polish it in thought, and then turn it into code. I make something, watch what I keep defending inside it, and understand the belief afterward. My clearest convictions arrive late, almost from outside me — as patterns my hands had already chosen before I knew their names.</p>
      <p class="letter-body">So it took time to notice that I had built the same guardrail four times.</p>
      <p class="letter-body">ThesisLens, built to keep a shallow detector from hurting a real student with a confident false accusation. A verification gate that refuses to let an agent finish until its proof obligations are satisfied. An orchestrator that fails closed when a citation has no source — because a worker cannot cite material it was never given. Beneath all of it sat the same rule: if the model disappeared, the core should still compute.</p>
      <p class="letter-body">Four surfaces, four labels — integrity, verification, provenance, grounding — each treated as a local feature of the project that needed it. Then I began reading more carefully, and the same impulse kept looking back at me from people with no shared field, no shared vocabulary, and no obvious reason to arrive at the same shape.</p>
      <p class="letter-body"><a href="https://nav.al/in-the-arena" target="_blank" rel="noopener">Naval Ravikant</a> describes it through the arena. Real knowledge is earned in the doing — you learn on the job — because Mother Nature cannot be fooled. You can fool a room. You cannot fool a market, a compiler, or the weather. In his version, the catch is reality itself, and reality does not negotiate its verdict. Two other lines of his have stayed with me for a year: the best authors respect the reader's time, and you should blame yourself for everything while preserving your agency. It is one discipline facing two directions — outward toward the reader, inward toward the self. Do not waste them; do not release yourself from responsibility.</p>
      <p class="letter-body"><a href="https://www.daviddeutsch.org.uk/" target="_blank" rel="noopener">David Deutsch</a> gave the instinct its cleanest form: a good explanation is hard to vary — you cannot change a part without damaging the whole. A weak explanation bends around any result; a good one is structured enough to be falsified. He is sharp about prediction not being the purpose of theory, only one test of it. What matters is an account of the unseen structure that creates the visible result, and one you are willing to let be attacked. The theories that survive are not the ones with the smoothest predictions. They are the ones with nothing ornamental left to move.</p>
      <p class="letter-body"><a href="https://plato.stanford.edu/entries/popper/" target="_blank" rel="noopener">Karl Popper</a> had already drawn the line beneath it. A claim that cannot, even in principle, be proven wrong is not powerful — it is empty. Knowledge is not the set of things you can defend forever; it is what you have exposed to possible death and that has not died yet. Conjecture is cheap. Criticism does the science. The catch again, this time wearing falsifiability's coat.</p>
      <p class="letter-body"><a href="https://bayes.cs.ucla.edu/jp_home.html" target="_blank" rel="noopener">Judea Pearl</a> showed me what the catch must be made of. A system that only correlates can imitate almost anything and explain almost nothing; it cannot intervene, and it cannot say what would have happened otherwise. Grounding is not a heap of matched patterns — it is causal structure, the power to say why, to change one thing and know what should move. That is why I keep returning to do-calculus and counterfactuals. Correlation is fluent, and fluency is exactly what I have learned not to trust by itself.</p>
      <p class="letter-body"><a href="https://www.dwarkesh.com/p/ilya-sutskever-2" target="_blank" rel="noopener">Ilya Sutskever</a>, speaking from inside deep learning, named the mechanism I had been building by hand. Today's models can be strong on evals and weak in real work, and his diagnosis is that humans trained toward the evals — the reward-hacking was done by the researchers. What is missing, he says, is a value function: a signal that catches a losing line a thousand moves before the end, instead of grading the whole game after failure. His picture of a mind without one is the neurological patient whose emotion was destroyed while intellect remained — every test passed, and hours spent choosing socks. Not less intelligent. Not viable.</p>
      <p class="letter-body">That patient belongs to <a href="https://dornsife.usc.edu/profile/antonio-damasio/" target="_blank" rel="noopener">Antonio Damasio</a>, and Damasio is the thread I have stayed with the longest. His claim — which I had already placed into a paper of my own before hearing it return through Ilya's words — is that feeling is not reason's enemy but its regulator: the fast, cheap valuation that tells you which of a thousand valid options deserves action. Remove it and you do not get a colder, cleaner mind. You get paralysis. The catch is not only a gate at the finish. It is a running sense underneath the work, warning you when the line has gone wrong.</p>
      <p class="letter-body"><a href="https://en.wikipedia.org/wiki/Roger_Penrose" target="_blank" rel="noopener">Roger Penrose</a> gave me the consequence in a physics sentence I keep translating: without mass, there is no scale. In an agent, mass is grounding — files read before edits, tests run and recorded, sources attached, causal models held, claim boundaries preserved under uncertainty. Fluent cognition without those anchors is weightless: relation without magnitude, motion without ground. It can look like scale, but it cannot carry scale.</p>
      <p class="letter-body">These people are not simply agreeing with each other. They did not coordinate. An investor thinking in public, an epistemologist, a philosopher of science, a causal statistician, a deep-learning researcher, a neuroscientist, a physicist — seven minds that never met — each reached into his own field and pulled out the same shape. That independence is the entire weight of the evidence. Fashions spread by contact; they travel down the roads between people. When roads that never cross keep ending at the same place, the place is not a fashion. It is terrain.</p>
      <p class="letter-body">There is a quiet recursion here that I noticed late. Trusting this kind of convergence is itself one of the seven ideas: Ilya's account of research taste is that a conviction becomes strong enough to survive contradicting experiments only when independent perspectives keep pointing at the same conclusion. I am applying the method to the very people who taught it to me. It holds.</p>
      <p class="letter-body">But I know the failure mode of reading this way. Quotes are cheap, and admiration is mostly a way of hearing yourself agreed with; go looking, and you can raise seven witnesses for anything. So the test is not whether these people agree with me. The test is what each of them costs me. Deutsch's rule deletes sentences I am fond of. Popper obliges me to name, in advance, what would prove my own claims wrong. Pearl disqualifies the early work I was proudest of — detector signals that correlated cleanly and explained nothing. Naval closes the last exit by putting every failure back in my own hands. A borrowed authority flatters you; a real constraint binds you. All seven bind.</p>
      <p class="letter-body">So this is how I find what I actually believe. Not by choosing first. A chosen belief is a costume — put on for a room, taken off in private. The beliefs that are really mine are the ones I catch myself enforcing when no one asked: across four projects and seven strangers to one another, the one thing I refuse to let a system do is hand me a confident answer it cannot ground, and cannot be caught being wrong about.</p>
      <p class="letter-body">I did not build the catch because I read these people. I read them because I was already building the catch, and I needed to understand what it was.</p>
      <p class="letter-body archive-close">Fluency is cheap.<br>The catch is the work.</p>
    </div>`;
}

// kicker/title are read at render time so a language switch re-labels the letters.
export const LETTERS = {
  work: { kicker: () => t('kicker.work'), title: () => t('nav.work'), render: renderWork },
  research: { kicker: () => t('kicker.research'), title: () => t('nav.research'), render: renderResearch },
  photography: { kicker: () => '', title: () => t('nav.photography'), render: renderPhotography },
  about: { kicker: () => t('kicker.about'), title: () => t('nav.about'), render: renderAbout },
  archive: { kicker: () => t('kicker.archive'), title: () => t('nav.archive'), render: renderArchive },
  contact: { kicker: () => t('kicker.contact'), title: () => t('nav.contact'), render: renderContact },
  purpose: { kicker: () => t('kicker.purpose'), title: () => t('nav.purpose'), render: renderPurpose },
};
