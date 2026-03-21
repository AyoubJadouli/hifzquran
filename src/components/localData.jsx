// Local browser-only data storage using localStorage + IndexedDB
// localStorage is used for small entity datasets, while larger generated
// indexes should go to IndexedDB to avoid quota issues.

const DB_NAME = 'hifz_app_storage';
const DB_VERSION = 1;
const LARGE_STORE = 'large_kv';
let dbPromise = null;

function openDB() {
  if (typeof indexedDB === 'undefined') {
    return Promise.reject(new Error('IndexedDB is not available in this browser'));
  }

  if (dbPromise) return dbPromise;

  dbPromise = new Promise((resolve, reject) => {
    const req = indexedDB.open(DB_NAME, DB_VERSION);
    req.onupgradeneeded = () => {
      const db = req.result;
      if (!db.objectStoreNames.contains(LARGE_STORE)) {
        db.createObjectStore(LARGE_STORE);
      }
    };
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error || new Error('Failed to open IndexedDB'));
  });

  return dbPromise;
}

async function getLargeValue(key) {
  const db = await openDB();
  return await new Promise((resolve, reject) => {
    const tx = db.transaction(LARGE_STORE, 'readonly');
    const req = tx.objectStore(LARGE_STORE).get(key);
    req.onsuccess = () => resolve(req.result ?? null);
    req.onerror = () => reject(req.error || new Error(`Failed to read ${key}`));
  });
}

async function setLargeValue(key, value) {
  const db = await openDB();
  return await new Promise((resolve, reject) => {
    const tx = db.transaction(LARGE_STORE, 'readwrite');
    tx.objectStore(LARGE_STORE).put(value, key);
    tx.oncomplete = () => resolve(value);
    tx.onerror = () => reject(tx.error || new Error(`Failed to write ${key}`));
  });
}

async function deleteLargeValue(key) {
  const db = await openDB();
  return await new Promise((resolve, reject) => {
    const tx = db.transaction(LARGE_STORE, 'readwrite');
    tx.objectStore(LARGE_STORE).delete(key);
    tx.oncomplete = resolve;
    tx.onerror = () => reject(tx.error || new Error(`Failed to delete ${key}`));
  });
}

async function clearLargeStore() {
  const db = await openDB();
  return await new Promise((resolve, reject) => {
    const tx = db.transaction(LARGE_STORE, 'readwrite');
    tx.objectStore(LARGE_STORE).clear();
    tx.oncomplete = resolve;
    tx.onerror = () => reject(tx.error || new Error('Failed to clear IndexedDB storage'));
  });
}

function generateId() {
  return Date.now().toString(36) + Math.random().toString(36).substr(2, 5);
}

function getStore(name) {
  try { return JSON.parse(localStorage.getItem(`hifz_${name}`) || '[]'); }
  catch { return []; }
}

function saveStore(name, data) {
  localStorage.setItem(`hifz_${name}`, JSON.stringify(data));
}

function getObjectStore(name) {
  try { return JSON.parse(localStorage.getItem(`hifz_${name}`) || '{}'); }
  catch { return {}; }
}

function saveObjectStore(name, data) {
  localStorage.setItem(`hifz_${name}`, JSON.stringify(data));
}

function applySort(data, sort) {
  if (!sort) return data;
  const desc = sort.startsWith('-');
  const field = sort.replace(/^-/, '');
  return [...data].sort((a, b) => {
    const av = a[field] ?? '';
    const bv = b[field] ?? '';
    if (desc) return bv > av ? 1 : bv < av ? -1 : 0;
    return av > bv ? 1 : av < bv ? -1 : 0;
  });
}

function makeEntity(name) {
  return {
    list: async (sort, limit) => {
      let d = applySort(getStore(name), sort);
      return limit ? d.slice(0, limit) : d;
    },
    filter: async (query, sort, limit) => {
      let d = getStore(name).filter(item =>
        Object.entries(query || {}).every(([k, v]) => item[k] === v)
      );
      d = applySort(d, sort);
      return limit ? d.slice(0, limit) : d;
    },
    create: async (item) => {
      const store = getStore(name);
      const newItem = {
        ...item,
        id: generateId(),
        created_date: new Date().toISOString(),
        updated_date: new Date().toISOString(),
        created_by: 'local',
      };
      store.push(newItem);
      saveStore(name, store);
      return newItem;
    },
    bulkCreate: async (items) => {
      const store = getStore(name);
      const newItems = items.map(item => ({
        ...item,
        id: generateId(),
        created_date: new Date().toISOString(),
        updated_date: new Date().toISOString(),
        created_by: 'local',
      }));
      store.push(...newItems);
      saveStore(name, store);
      return newItems;
    },
    update: async (id, updates) => {
      const store = getStore(name);
      const idx = store.findIndex(i => i.id === id);
      if (idx < 0) return null;
      store[idx] = { ...store[idx], ...updates, updated_date: new Date().toISOString() };
      saveStore(name, store);
      return store[idx];
    },
    delete: async (id) => {
      saveStore(name, getStore(name).filter(i => i.id !== id));
    },
  };
}

export const localEntities = {
  Chunk: makeEntity('Chunk'),
  Recording: makeEntity('Recording'),
  RecitationAttempt: makeEntity('RecitationAttempt'),
  UserSettings: makeEntity('UserSettings'),
};

export const localChunkIndex = {
  get: async () => {
    const value = await getLargeValue('ChunkIndex');
    return value || {};
  },
  set: async (value) => setLargeValue('ChunkIndex', value || {}),
  clear: async () => deleteLargeValue('ChunkIndex'),
};

export async function getStorageUsageEstimate() {
  let usedBytes = 0;
  let quotaBytes = 5 * 1024 * 1024;

  try {
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (!key) continue;
      const value = localStorage.getItem(key) || '';
      usedBytes += (key.length + value.length) * 2;
    }
  } catch {}

  try {
    const chunkIndex = await getLargeValue('ChunkIndex');
    if (chunkIndex) {
      usedBytes += JSON.stringify(chunkIndex).length * 2;
    }
  } catch {}

  try {
    if (navigator.storage?.estimate) {
      const estimate = await navigator.storage.estimate();
      if (estimate.usage) usedBytes = Math.max(usedBytes, estimate.usage);
      if (estimate.quota) quotaBytes = estimate.quota;
    }
  } catch {}

  return { usedBytes, quotaBytes };
}

export async function clearAppStoragePreserveSettings() {
  const savedSettingsRaw = localStorage.getItem('hifz_UserSettings');

  try {
    const keys = [];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith('hifz_') && key !== 'hifz_UserSettings') keys.push(key);
    }
    keys.forEach((key) => localStorage.removeItem(key));
  } catch {}

  try {
    await clearLargeStore();
  } catch {}

  if (savedSettingsRaw) {
    localStorage.setItem('hifz_UserSettings', savedSettingsRaw);
  }
}