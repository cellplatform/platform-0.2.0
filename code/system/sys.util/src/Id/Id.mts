import { init } from '@paralleldrive/cuid2';
import '../Value/Value.Random.mjs';

const slug = init({ length: 6 });
const cuid = init({ length: 25 });

/**
 * Random ID (identifier) generators.
 */
export const Id = {
  /**
   * Creates long collision-resistant long identifier.
   */
  cuid,

  /**
   * Creates a non-sequental identifier.
   * IMPORTANT
   *    [[DO NOT]] put "slugs" into databases as keys.
   *    Use the long "cuid" for that.
   */
  slug,
} as const;

export { cuid, slug };
