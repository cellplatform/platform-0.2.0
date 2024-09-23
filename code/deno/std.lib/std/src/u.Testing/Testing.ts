import { describe, it } from '@std/testing/bdd';
import { expect } from 'npm:chai';

import type { t } from '../common.ts';

export { describe, expect, it };

/**
 * Testing helpers.
 */
export const Testing: t.Testing = {
  Bdd: { describe, expect, it },

  /**
   * Wait for
   */
  wait(msecs): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, msecs));
  },
};
