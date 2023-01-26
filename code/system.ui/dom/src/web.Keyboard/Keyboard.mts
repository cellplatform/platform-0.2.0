import { KeyboardMonitor as Monitor } from './KeyboardMonitor.mjs';
import { Match } from './Match.mjs';
import { Util } from './util.mjs';

const { toKeypress } = Util;

export const Keyboard = {
  Monitor,
  Match,
  toKeypress,
};
