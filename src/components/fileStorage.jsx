// IndexedDB-based audio blob storage
// Stores blobs locally and returns a local-audio:// reference.
// On iOS Safari, audio playback is more reliable when the stored blob has an
// explicit, playable MIME type and when generated object URLs are revoked
// carefully after use.

const DB_NAME = 'hifz_audio';
const STORE = 'files';
let dbPromise = null;

function openDB() {
  if (dbPromise) return dbPromise;
  dbPromise = new Promise((resolve, reject) => {
    const req = indexedDB.open(DB_NAME, 1);
    req.onupgradeneeded = () => req.result.createObjectStore(STORE);
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
  return dbPromise;
}

function generateFileId() {
  return 'audio_' + Date.now().toString(36) + Math.random().toString(36).substr(2, 5);
}

export async function storeAudioBlob(blob) {
  const id = generateFileId();
  const normalizedBlob = normalizeAudioBlob(blob);
  const db = await openDB();
  await new Promise((resolve, reject) => {
    const tx = db.transaction(STORE, 'readwrite');
    tx.objectStore(STORE).put(normalizedBlob, id);
    tx.oncomplete = resolve;
    tx.onerror = reject;
  });
  return `local-audio://${id}`;
}

export async function resolveAudioUrl(fileRef) {
  if (!fileRef) return null;
  if (!fileRef.startsWith('local-audio://')) return fileRef;
  const id = fileRef.replace('local-audio://', '');
  const db = await openDB();
  const blob = await new Promise((resolve, reject) => {
    const tx = db.transaction(STORE, 'readonly');
    const req = tx.objectStore(STORE).get(id);
    req.onsuccess = () => resolve(req.result);
    req.onerror = reject;
  });
  if (!blob) return null;
  const playableBlob = normalizeAudioBlob(blob);
  return URL.createObjectURL(playableBlob);
}

export async function deleteAudioBlob(fileRef) {
  if (!fileRef || !fileRef.startsWith('local-audio://')) return;
  const id = fileRef.replace('local-audio://', '');
  const db = await openDB();
  await new Promise((resolve, reject) => {
    const tx = db.transaction(STORE, 'readwrite');
    tx.objectStore(STORE).delete(id);
    tx.oncomplete = resolve;
    tx.onerror = reject;
  });
}

function normalizeAudioBlob(blob) {
  if (!blob) return blob;
  const sourceType = (blob.type || '').toLowerCase();
  let targetType = sourceType;

  if (!targetType || targetType === 'audio/webm') {
    // Safari/iOS can fail to play blobs saved as generic/implicit webm.
    // Explicit codecs information improves compatibility checks, while still
    // preserving playback in Chromium-based browsers.
    targetType = 'audio/webm;codecs=opus';
  }

  if (sourceType === targetType) return blob;
  return new Blob([blob], { type: targetType });
}