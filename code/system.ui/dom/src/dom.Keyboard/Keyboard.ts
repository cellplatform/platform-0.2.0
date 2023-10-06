import { KeyListener } from './KeyListener';
import { KeyboardMonitor as Monitor } from './Keyboard.Monitor';
import { until } from './Keyboard.until';
import { Match } from './Match';
import { Util } from './Util';

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
