// Storage utilities
export class LocalStorage {
  static get<T>(key: string, defaultValue?: T): T | null {
    if (typeof window === "undefined") return defaultValue || null;

    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : defaultValue || null;
    } catch (error) {
      console.warn(`Error reading localStorage key "${key}":`, error);
      return defaultValue || null;
    }
  }

  static set<T>(key: string, value: T): void {
    if (typeof window === "undefined") return;

    try {
      window.localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.warn(`Error setting localStorage key "${key}":`, error);
    }
  }

  static remove(key: string): void {
    if (typeof window === "undefined") return;

    try {
      window.localStorage.removeItem(key);
    } catch (error) {
      console.warn(`Error removing localStorage key "${key}":`, error);
    }
  }

  static clear(): void {
    if (typeof window === "undefined") return;

    try {
      window.localStorage.clear();
    } catch (error) {
      console.warn("Error clearing localStorage:", error);
    }
  }

  static has(key: string): boolean {
    if (typeof window === "undefined") return false;
    return window.localStorage.getItem(key) !== null;
  }

  static keys(): string[] {
    if (typeof window === "undefined") return [];

    try {
      return Object.keys(window.localStorage);
    } catch (error) {
      console.warn("Error getting localStorage keys:", error);
      return [];
    }
  }
}

export class SessionStorage {
  static get<T>(key: string, defaultValue?: T): T | null {
    if (typeof window === "undefined") return defaultValue || null;

    try {
      const item = window.sessionStorage.getItem(key);
      return item ? JSON.parse(item) : defaultValue || null;
    } catch (error) {
      console.warn(`Error reading sessionStorage key "${key}":`, error);
      return defaultValue || null;
    }
  }

  static set<T>(key: string, value: T): void {
    if (typeof window === "undefined") return;

    try {
      window.sessionStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.warn(`Error setting sessionStorage key "${key}":`, error);
    }
  }

  static remove(key: string): void {
    if (typeof window === "undefined") return;

    try {
      window.sessionStorage.removeItem(key);
    } catch (error) {
      console.warn(`Error removing sessionStorage key "${key}":`, error);
    }
  }

  static clear(): void {
    if (typeof window === "undefined") return;

    try {
      window.sessionStorage.clear();
    } catch (error) {
      console.warn("Error clearing sessionStorage:", error);
    }
  }

  static has(key: string): boolean {
    if (typeof window === "undefined") return false;
    return window.sessionStorage.getItem(key) !== null;
  }

  static keys(): string[] {
    if (typeof window === "undefined") return [];

    try {
      return Object.keys(window.sessionStorage);
    } catch (error) {
      console.warn("Error getting sessionStorage keys:", error);
      return [];
    }
  }
}


