// Local browser-only data storage using localStorage
// Mimics the base44 entities API interface

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
  UserSettings: makeEntity('UserSettings'),
};