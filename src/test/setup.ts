import '@testing-library/jest-dom';

// Polyfill localStorage for jsdom environments where the native Storage API
// is unavailable (e.g. jsdom 28+ with Node.js built-in localStorage).
if (typeof window !== 'undefined' && typeof window.localStorage.setItem !== 'function') {
  const storage = new Map<string, string>();
  const localStoragePolyfill: Storage = {
    getItem: (key: string) => storage.get(key) ?? null,
    setItem: (key: string, value: string) => { storage.set(key, value); },
    removeItem: (key: string) => { storage.delete(key); },
    clear: () => { storage.clear(); },
    get length() { return storage.size; },
    key: (index: number) => [...storage.keys()][index] ?? null,
  };
  Object.defineProperty(window, 'localStorage', {
    value: localStoragePolyfill,
    configurable: true,
    writable: true,
  });
}
