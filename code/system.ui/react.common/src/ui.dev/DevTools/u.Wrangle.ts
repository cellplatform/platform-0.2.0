import type { t } from '../common';
import { Is } from './Is';

/**
 * Helpers
 */
export const Wrangle = {
  ctx(input: t.DevTools | t.DevCtx) {
    if (Is.dev(input)) return input.ctx;
    if (Is.ctx(input)) return input;
    return;
  },
} as const;
