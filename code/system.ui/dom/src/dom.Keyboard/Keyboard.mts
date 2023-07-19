import { KeyListener } from './KeyListener.mjs';
import { KeyboardMonitor as Monitor } from './Keyboard.Monitor.mjs';
import { until } from './Keyboard.until.mjs';
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

  until,
  toKeypress: Util.toKeypress,
} as const;
