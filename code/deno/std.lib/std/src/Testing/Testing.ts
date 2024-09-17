import { describe, it } from '@std/testing/bdd';
import { expect } from 'npm:chai';

import type { t } from '../common/mod.ts';
import { TestHttp } from './Test.Http.ts';

export { describe, expect, it };

/**
 * Testing helpers.
 */
export const Testing: t.Testing = {
  Http: TestHttp,
};
