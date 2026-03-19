// IndexedDB-based audio blob storage
// Stores blobs locally and returns a local-audio:// reference

const DB_NAME = 'hifz_audio';
const STORE = 'files';
let dbPromise = null;

function openDB() {
  if (dbPromise) return dbPromise;
  dbPromise = new Promise((resolve, reject) => {
    const req = indexedDB.open(DB_NAME, 1);
    req.onupgradeneeded = e => e.target.result.createObjectStore(STORE);
    req.onsuccess = e => resolve(e.target.result);
    req.onerror = reject;
  });
  return dbPromise;
}

function generateFileId() {
  return 'audio_' + Date.now().toString(36) + Math.random().toString(36).substr(2, 5);
}

export async function storeAudioBlob(blob) {
  const id = generateFileId();
  const db = await openDB();
  await new Promise((resolve, reject) => {
    const tx = db.transaction(STORE, 'readwrite');
    tx.objectStore(STORE).put(blob, id);
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
  return blob ? URL.createObjectURL(blob) : null;
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