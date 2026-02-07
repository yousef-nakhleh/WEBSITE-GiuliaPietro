const memoryStorage = new Map<string, string>();

const isBrowser = typeof window !== 'undefined';

const getSessionStorage = (): Storage | null => {
  if (!isBrowser) return null;

  try {
    return window.sessionStorage;
  } catch (error) {
    console.warn('Session storage unavailable, using in-memory fallback.', error);
    return null;
  }
};

export const bookingStorage = {
  getItem(key: string): string | null {
    const memoryValue = memoryStorage.get(key);
    if (memoryValue !== undefined) {
      return memoryValue;
    }

    const storage = getSessionStorage();
    if (!storage) {
      return null;
    }

    try {
      const sessionValue = storage.getItem(key);
      if (sessionValue !== null) {
        memoryStorage.set(key, sessionValue);
      }
      return sessionValue;
    } catch (error) {
      console.warn('Failed reading from session storage, using fallback.', error);
      return null;
    }
  },

  setItem(key: string, value: string): void {
    memoryStorage.set(key, value);

    const storage = getSessionStorage();
    if (!storage) return;

    try {
      storage.setItem(key, value);
    } catch (error) {
      console.warn('Failed writing to session storage, using fallback.', error);
    }
  },

  removeItem(key: string): void {
    memoryStorage.delete(key);

    const storage = getSessionStorage();
    if (!storage) return;

    try {
      storage.removeItem(key);
    } catch (error) {
      console.warn('Failed removing from session storage, using fallback.', error);
    }
  },
};
