export const Mock = {
  keydownEvent(key = 'z', keyCode = 90) {
    return new window.KeyboardEvent('keydown', { key, keyCode });
  },
  keyupEvent(key = 'z', keyCode = 90) {
    return new window.KeyboardEvent('keydown', { key, keyCode });
  },
};
