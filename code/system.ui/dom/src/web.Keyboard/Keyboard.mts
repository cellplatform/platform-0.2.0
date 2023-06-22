import { KeyboardMonitor as Monitor } from './KeyboardMonitor.mjs';
import { KeyListener } from './KeyListener.mjs';
import { Match } from './Match.mjs';
import { Util } from './Util.mjs';

/**
 * Tools for working with a keyboard-input device.
 */
export const Keyboard = {
  Monitor,
  Match,
  on: Monitor.on,
  onKeydown: KeyListener.keydown,
  onKeyup: KeyListener.keyup,
  toKeypress: Util.toKeypress,
};
