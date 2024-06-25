/**
 * Helpers for testing keyboard events in unit-tests.
 */
export const Mock = {
  event(type: string, key = 'z', keyCode = 90, code?: string) {
    code = code ?? `Key${key.toUpperCase()}`;
    return new window.KeyboardEvent(type, { key, keyCode, code });
  },
  keydownEvent(key = 'z', keyCode = 90) {
    return Mock.event('keydown', key, keyCode);
  },
  keyupEvent(key = 'z', keyCode = 90) {
    return Mock.event('keyup', key, keyCode);
  },

  fire(event?: KeyboardEvent) {
    const e = event ?? Mock.keydownEvent();
    document.dispatchEvent(e);
  },
} as const;
