import type { t } from '../common.ts';
import { Testing as Base } from '../u.Testing/mod.ts';
import { TestHttp as Http } from './Test.Http.ts';

const { describe, expect, it } = Base.Bdd;
export { describe, expect, it };

/**
 * Testing helpers including light-weight HTTP server helpers (Deno).
 */
export const Testing: t.TestingHttp = {
  ...Base,
  Http,
};
