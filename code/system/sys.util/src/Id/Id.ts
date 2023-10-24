import { init, isCuid } from '@paralleldrive/cuid2';
import '../Value/Value.Random.mjs';

const Length = { cuid: 25, slug: 6 } as const;
const cuid = init({ length: Length.cuid });
const slug = init({ length: Length.slug });

/**
 * Helpers to determine if a value is a cuid.
 */
const Is = {
  cuid(input: any) {
    if (typeof input !== 'string') return false;
    return input.length === Length.cuid ? isCuid(input) : false;
  },

  slug(input: any) {
    if (typeof input !== 'string') return false;
    return input.length === Length.slug ? isCuid(input) : false;
  },
} as const;

/**
 * Random ID (identifier) generators.
 */
export const Id = {
  Length,
  Is,

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

export { Is, cuid, slug };
