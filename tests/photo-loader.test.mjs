import test from 'node:test';
import assert from 'node:assert/strict';
import { createPhotoLoader } from '../templates/quiet/photo-loader.js';

function harness(options = {}) {
  const images = [];
  const loader = createPhotoLoader({ ...options, createImage: () => {
    const image = { src: '', onload: null, onerror: null, decode: async () => {}, removeAttribute: () => { image.src = ''; } };
    images.push(image);
    return image;
  } });
  return { loader, images };
}

test('photo readiness waits for decode; duplicate requests share one image and promise', async () => {
  const { loader, images } = harness();
  let decodeReady;
  const pending = loader.load('/a.webp');
  images[0].decode = () => new Promise(resolve => { decodeReady = resolve; });
  let ready = false;
  pending.then(() => { ready = true; });
  const loading = images[0].onload();
  await Promise.resolve();
  assert.equal(ready, false);
  assert.equal(loader.load('/a.webp'), pending);
  decodeReady();
  await loading;
  assert.equal(await pending, images[0]);
  assert.equal(images.length, 1);
  assert.equal(images[0].onload, null);
});

test('failed image loads are removed and retryable', async () => {
  const { loader, images } = harness();
  const failed = loader.load('/a.webp');
  const rejection = assert.rejects(failed, /could not be loaded/);
  images[0].onerror();
  await rejection;
  const retry = loader.load('/a.webp');
  await images[1].onload();
  assert.equal(await retry, images[1]);
});

test('decode failures do not become reusable successful images', async () => {
  const { loader, images } = harness();
  const failed = loader.load('/a.webp');
  images[0].decode = async () => { throw new Error('decode failed'); };
  const rejection = assert.rejects(failed, /decode failed/);
  await images[0].onload();
  await rejection;
  const retry = loader.load('/a.webp');
  await images[1].onload();
  await retry;
  assert.equal(images.length, 2);
});

test('LRU cache bounds pending images and cancellation ignores late decoded results', async () => {
  const { loader, images } = harness();
  const a = loader.load('/a.webp'); const b = loader.load('/b.webp'); const c = loader.load('/c.webp');
  const results = Promise.allSettled([a, b, c]);
  const lateB = images[1].onload;
  assert.equal(loader.load('/a.webp'), a);
  const d = loader.load('/d.webp');
  const dResult = Promise.allSettled([d]);
  assert.equal(images[1].src, '');
  await lateB();
  await images[0].onload(); await images[2].onload(); await images[3].onload();
  const states = await results;
  assert.equal(states[0].status, 'fulfilled');
  assert.equal(states[1].status, 'rejected');
  assert.equal(states[2].status, 'fulfilled');
  assert.equal((await dResult)[0].status, 'fulfilled');
});

test('clear aborts pending requests; cache limit must remain positive and finite', async () => {
  const { loader, images } = harness();
  const result = Promise.allSettled([loader.load('/a.webp'), loader.load('/b.webp')]);
  loader.clear();
  assert.ok(images.every(image => image.src === ''));
  assert.ok((await result).every(entry => entry.status === 'rejected'));
  for (const limit of [0, -1, 1.5, Infinity]) assert.throws(() => createPhotoLoader({ limit }), /positive integer/);
});
