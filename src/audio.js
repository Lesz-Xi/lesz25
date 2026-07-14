// Ambient audio. The boat is the control: it sails from load, freezes when the
// audio is paused, and resumes when it plays again.

export function initAudio() {
  const audio = document.getElementById('ambient-audio');
  const btn = document.getElementById('audio-toggle');
  if (!audio || !btn) return;

  audio.loop = true;
  audio.volume = 0.55;

  const reflect = () => {
    const playing = !audio.paused;
    btn.classList.toggle('is-playing', playing);
    btn.setAttribute('aria-pressed', playing ? 'true' : 'false');
    btn.setAttribute('aria-label', playing ? 'Pause ambient audio' : 'Play ambient audio');
  };
  audio.addEventListener('play', reflect);
  audio.addEventListener('pause', reflect);

  // Boat travel is independent of audio start: it sails from load. Only an
  // explicit pause freezes it (these events never fire on the initial load),
  // and playing again resumes travel from where it stopped.
  audio.addEventListener('pause', () => btn.classList.add('boat-stopped'));
  audio.addEventListener('play', () => btn.classList.remove('boat-stopped'));

  // --- Autostart -----------------------------------------------------------
  // Browsers block autoplay WITH SOUND until the origin has media engagement,
  // but muted autoplay is always permitted. So: try with sound first; if that's
  // refused, start muted and immediately lift the mute. Chrome carries on
  // playing; Safari re-gates the unmute, in which case the track runs silently
  // until the first interaction with the scene lifts it.
  let userPaused = false; // an explicit pause must never be auto-resumed

  const startAudio = async () => {
    if (userPaused) return;
    try {
      audio.muted = false;
      await audio.play();
      return;
    } catch (_) { /* blocked with sound — fall through */ }
    try {
      audio.muted = true;
      await audio.play();
      audio.muted = false;
      if (audio.paused) {
        // Safari re-gated it: keep the track running silently, unmute on gesture.
        audio.muted = true;
        await audio.play().catch(() => {});
      }
    } catch (_) { /* nothing more we can do without a gesture */ }
  };

  startAudio();
  audio.addEventListener('canplay', () => { if (audio.paused) startAudio(); }, { once: true });
  document.addEventListener('visibilitychange', () => {
    if (!document.hidden && audio.paused) startAudio();
  });

  // Getting sound at the earliest moment the browser permits.
  const CHROME = '#audio-toggle, #theme-toggle, .top-nav, .bottom-controls';
  const onFirstGesture = (e) => {
    if (userPaused) return;

    // Already running, just gagged by the autoplay policy: ANY interaction lifts
    // the mute — including the chrome. Nothing is being "started" here that the
    // page didn't already start itself, so this isn't the theme toggle doubling
    // as a play button; it's the earliest instant sound is legal.
    if (!audio.paused && audio.muted) {
      audio.muted = false;
      if (audio.paused) startAudio(); // re-gated: recover
      return;
    }

    // Fully stopped: the chrome keeps its hands off. It has its own job.
    if (e.target.closest && e.target.closest(CHROME)) return;
    if (audio.paused) startAudio();
  };
  window.addEventListener('pointerdown', onFirstGesture);
  window.addEventListener('keydown', onFirstGesture);

  // --- Hint ----------------------------------------------------------------
  // Shown under the boat from the moment the page loads, held for 8s, then it
  // fades away. A click on the boat clears it early.
  btn.classList.add('show-hint');
  const hideHint = () => btn.classList.remove('show-hint');
  const hintTimer = setTimeout(hideHint, 8000);
  btn.addEventListener('click', () => { clearTimeout(hintTimer); hideHint(); }, { once: true });

  // The boat is the manual control: click to pause/play.
  btn.addEventListener('click', (e) => {
    e.stopPropagation();
    if (audio.paused || audio.muted) {
      userPaused = false;
      startAudio();
    } else {
      userPaused = true;
      audio.pause();
    }
  });

  reflect();
}
