import { customAlphabet } from 'nanoid';

import { Is } from '../Is/index.mjs';
import { random } from '../Value/Value.Math.mjs';

/**
 * NOTE: [Shim/Polyfill]
 *    Required when running on node-js.
 *    Prevents environment error within module 'nonoid':
 *
 *        ReferenceError: "crypto is not defined"
 *
 * IMPORTANT:
 *    Do NOT rely on this being secure in it's generation
 *    if random numbers when running on node-js.
 *
 */
if (Is.node && !(global as any).crypto?.getRandomValues) {
  (global as any).crypto = {
    getRandomValues(buffer: Uint8Array) {
      const length = buffer.length;
      const values = Array.from({ length }).map(() => random(1000, 999999));
      return new Uint8Array(values);
    },
  };
}

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
