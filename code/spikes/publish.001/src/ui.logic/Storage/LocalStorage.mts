import { t, R } from '../common';

type O = Record<string, unknown>;

export const LocalStorage = {
  /**
   * Helper for reading/writing a typed object into the [localStorage] API.
   */
  object<T extends O>(key: string, defaultValue: T) {
    const api = {
      get current(): T {
        return api.get();
      },

      get(): T {
        const json = localStorage.getItem(key);
        return typeof json === 'string' ? JSON.parse(json) : defaultValue;
      },

      set(value: T) {
        localStorage.setItem(key, JSON.stringify(value));
      },

      merge(value: t.PartialDeep<T>) {
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
