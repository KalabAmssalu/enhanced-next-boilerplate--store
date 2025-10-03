// Storage utilities
export class Storage {
  constructor(private storage: globalThis.Storage) {}

  get<T>(key: string, defaultValue?: T): T | null {
    try {
      const item = this.storage.getItem(key);
      if (item === null) {
        return defaultValue ?? null;
      }
      return JSON.parse(item);
    } catch {
      return defaultValue ?? null;
    }
  }

  set<T>(key: string, value: T): void {
    try {
      this.storage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.error("Failed to set storage item:", error);
    }
  }

  remove(key: string): void {
    this.storage.removeItem(key);
  }

  clear(): void {
    this.storage.clear();
  }

  keys(): string[] {
    const keys: string[] = [];
    for (let i = 0; i < this.storage.length; i++) {
      const key = this.storage.key(i);
      if (key) {
        keys.push(key);
      }
    }
    return keys;
  }

  has(key: string): boolean {
    return this.storage.getItem(key) !== null;
  }

  size(): number {
    return this.storage.length;
  }
}

// Create storage instances
export const localStorage = new Storage(window.localStorage);
export const sessionStorage = new Storage(window.sessionStorage);

// Utility functions
export function getStorageItem<T>(key: string, defaultValue?: T): T | null {
  return localStorage.get(key, defaultValue);
}

export function setStorageItem<T>(key: string, value: T): void {
  localStorage.set(key, value);
}

export function removeStorageItem(key: string): void {
  localStorage.remove(key);
}

export function clearStorage(): void {
  localStorage.clear();
}

// Session storage utilities
export function getSessionItem<T>(key: string, defaultValue?: T): T | null {
  return sessionStorage.get(key, defaultValue);
}

export function setSessionItem<T>(key: string, value: T): void {
  sessionStorage.set(key, value);
}

export function removeSessionItem(key: string): void {
  sessionStorage.remove(key);
}

export function clearSession(): void {
  sessionStorage.clear();
}
