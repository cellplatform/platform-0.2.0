import { Text as Util } from 'sys.util';
import { replace, splice } from './Text.splice';

/**
 * Syncer for a text <input> element.
 */
export const Text = {
  diff: Util.diff,
  splice,
  replace,
} as const;
