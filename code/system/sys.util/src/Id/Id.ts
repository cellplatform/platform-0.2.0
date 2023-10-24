import { init, isCuid } from '@paralleldrive/cuid2';
import '../Value/Value.Random.mjs';

const Length = { cuid: 25, slug: 6 } as const;
const cuid = init({ length: Length.cuid });
const slug = init({ length: Length.slug });

function isFactory(length: number) {
  return (input: any) => {
    if (typeof input !== 'string') return false;
    return input.length === length ? isCuid(input) : false;
  };
}

/**
 * Helpers to determine if a value is a cuid.
 */
const Is = {
  cuid: isFactory(Length.cuid),
  slug: isFactory(Length.slug),
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

  /**
   * Initialize a new ID generator with the given length.
   */
  init(length: number) {
    const generate = init({ length });
    const is = isFactory(length);
    return { generate, length, is } as const;
  },
} as const;

export { Is, cuid, slug };
