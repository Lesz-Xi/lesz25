// Bounded decoded-image cache. Never prefetch an entire album or retain failed loads.
export function createPhotoLoader({ createImage = () => new Image(), limit = 3 } = {}) {
  if (!Number.isInteger(limit) || limit < 1) throw new Error('Photo cache limit must be a positive integer.');
  const entries = new Map();
  function load(source) {
    const cached = entries.get(source);
    if (cached) {
      entries.delete(source);
      entries.set(source, cached);
      return cached.promise;
    }
    const image = createImage();
    image.decoding = 'async';
    let settled = false;
    let rejectLoad;
    const entry = { image, promise: null, cancel: null };
    function clean() { image.onload = null; image.onerror = null; }
    function fail(error) {
      if (settled) return;
      settled = true;
      clean();
      if (entries.get(source) === entry) entries.delete(source);
      rejectLoad(error);
    }
    entry.promise = new Promise((resolve, reject) => {
      rejectLoad = reject;
      image.onerror = () => fail(new Error('Photograph could not be loaded.'));
      image.onload = async () => {
        try {
          if (typeof image.decode === 'function') await image.decode();
          if (settled) return;
          settled = true;
          clean();
          resolve(image);
        } catch (error) { fail(error); }
      };
    });
    entry.cancel = () => {
      if (settled) return;
      fail(new Error('Photograph request superseded.'));
      image.removeAttribute('src');
    };
    entries.set(source, entry);
    while (entries.size > limit) {
      const oldest = entries.keys().next().value;
      const removed = entries.get(oldest);
      entries.delete(oldest);
      removed.cancel();
    }
    image.src = source;
    return entry.promise;
  }
  function clear() {
    for (const entry of entries.values()) entry.cancel();
    entries.clear();
  }
  return { load, clear };
}
