// Pure gallery state helpers; shared by the DOM controller and tests.
export function albumFromHash(hash, albums) {
  const id = hash.startsWith('#album-') ? hash.slice(7) : '';
  return albums.find((album) => album.id === id) || null;
}

export function galleryImages(album) {
  return [album.cover, ...album.images];
}

export function wrapIndex(index, length) {
  return length > 0 ? ((index % length) + length) % length : 0;
}
