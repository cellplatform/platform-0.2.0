import cuid from 'cuid';

export function generate() {
  return cuid.slug() as string;
}

export const Id = {
  /**
   * Creates a short non-sequental identifier.
   *    Wrapper around the `shortid` NPM module.
   *    https://www.npmjs.com/package/shortid
   */
  slug() {
    return cuid.slug();
  },

  /**
   * Creates a CUID (collision-resistant id).
   *    Wrapper around the `cuid` NPM module.
   *    https://github.com/ericelliott/cuid
   */
  cuid() {
    return cuid();
  },
};

export const id = Id;
