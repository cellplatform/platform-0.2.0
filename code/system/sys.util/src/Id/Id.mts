import { customAlphabet } from 'nanoid';
import '../Value/Value.Random.mjs';

/**
 * Random generator.
 */
type Generator = (size?: number | undefined) => string;
type Lazy = { slug?: Generator; cuid?: Generator };
const alphabet = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
const lazy: Lazy = {};

const cuid = () => {
  const fn = lazy.cuid || (lazy.cuid = customAlphabet(alphabet, 30));
  return fn();
};
const slug = () => {
  const fn = lazy.slug || (lazy.slug = customAlphabet(alphabet, 6));
  return fn();
};

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
};

export { slug, cuid };
