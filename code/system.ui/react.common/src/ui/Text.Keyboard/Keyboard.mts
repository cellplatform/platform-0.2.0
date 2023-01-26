import { EventProps } from './ui.EventProps';
import { Keyboard as Base, KeyboardMonitor } from 'sys.ui.dom';

export const Keyboard = {
  ...Base,
  ui: { EventProps },
};

export { KeyboardMonitor };
