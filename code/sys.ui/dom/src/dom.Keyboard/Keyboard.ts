import { KeyListener } from './KeyListener';
import { KeyboardMonitor as Monitor } from './Keyboard.Monitor';
import { until } from './Keyboard.until';
import { Match } from './Match';
import { Util } from './u';
import { dbl } from './Keyboard.dbl';

/**
 * Tools for working with a keyboard-input device.
 */
export const Keyboard = {
  Monitor,
  Match,

  onKeydown: KeyListener.keydown,
  onKeyup: KeyListener.keyup,
  on: Monitor.on,
  filter: Monitor.filter,

  toKeypress: Util.toKeypress,
  until,
  dbl,
} as const;
