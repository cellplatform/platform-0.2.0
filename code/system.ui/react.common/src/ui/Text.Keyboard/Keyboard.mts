import { Keyboard as Base, KeyboardMonitor } from 'sys.ui.dom';

export const Keyboard = {
  ...Base,
  ui: { EventProps: () => import('./ui.EventProps') },
};

export { KeyboardMonitor };
