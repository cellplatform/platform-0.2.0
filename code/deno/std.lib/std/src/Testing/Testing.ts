import { describe, it } from '@std/testing/bdd';
import { expect } from 'npm:chai';

import type { t } from '../common/mod.ts';
import { TestingHttp } from './Testing.Http.ts';

export { describe, expect, it };

/**
 * Testing helpers.
 */
export const Testing = {
  /**
   * Factory: create and start an HTTP test server.
   */
  http: TestingHttp.create,
} as t.Testing;
