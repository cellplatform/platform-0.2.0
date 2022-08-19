import { customAlphabet } from 'nanoid';

const alphabet = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
const cuid = customAlphabet(alphabet, 30);
const slug = customAlphabet(alphabet, 8);

export const Id = {
  /**
   * Creates long collision-resistant long identifier.
   */
  cuid,

  /**
   * Creates a short non-sequental identifier.
   */
  slug,
};

export { slug, cuid };
