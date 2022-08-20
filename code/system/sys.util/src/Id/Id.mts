import { customAlphabet } from 'nanoid';

const alphabet = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
const cuid = customAlphabet(alphabet, 30);
const short = customAlphabet(alphabet, 6);

const slug = () => {
  return short();
};

export const Id = {
  /**
   * Creates long collision-resistant long identifier.
   */
  cuid,

  /**
   * Creates a short sequental identifier.
   * IMPORTANT
   *    [[DO NOT]] put "slugs" into databases as keys.
   *    Use the long "cuid" for that.
   */
  slug,
};

export { slug, cuid };
