import { Calc } from './Sync.Calc';
import { listen } from './Sync.listen';

/**
 * Syncer for a text <input> element.
 */
export const TextboxSync = {
  listen,
  Calc,
} as const;
