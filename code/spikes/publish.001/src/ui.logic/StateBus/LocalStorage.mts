import { R } from '../common.mjs';

type O = Record<string, unknown>;

export const LocalStorage = {
  /**
   * Helper for reading/writing a typed object into the [localStorage] API.
   */
  object<T extends O>(key: string, defaultValue: T) {
    const api = {
      get(): T {
        const json = localStorage.getItem(key);
        return typeof json === 'string' ? JSON.parse(json) : defaultValue;
      },

      set(value: T) {
        const data = R.mergeDeepRight(api.get(), value);
        localStorage.setItem(key, JSON.stringify(data));
      },

      delete() {
        localStorage.removeItem(key);
      },
    };
    return api;
  },
};
