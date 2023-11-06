import { init as config, isCuid } from '@paralleldrive/cuid2';

function isFactory(length: number) {
  return (input: any) => {
    if (typeof input !== 'string') return false;
    return input.length === length ? isCuid(input) : false;
  };
}

/**
 * Initialize a new ID generator with the given length.
 */
function init(length: number) {
  const generate = config({ length });
  const is = isFactory(length);
  return { generate, length, is } as const;
}

const Length = { cuid: 25, slug: 6 } as const;
const cuid = init(Length.cuid);
const slug = init(Length.slug);

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
  init,

  /**
   * Creates long collision-resistant long identifier.
   */
  cuid: cuid.generate,

  /**
   * Creates a non-sequental identifier.
   * IMPORTANT
   *    [[DO NOT]] put "slugs" into databases as keys.
   *    Use the long "cuid" for that.
   */
  slug: slug.generate,
} as const;
