import { Doc, type t } from './common';
import { Shared } from './Shared';

/**
 * The raw binary representation of a [Shared] genesis document.
 */
export const binary = new Uint8Array([
  133, 111, 74, 131, 192, 67, 52, 52, 0, 140, 2, 1, 16, 52, 249, 9, 12, 1, 121, 77, 52, 166, 120,
  156, 254, 61, 118, 188, 243, 1, 206, 66, 135, 66, 171, 218, 14, 8, 97, 253, 147, 23, 53, 67, 171,
  12, 190, 39, 108, 31, 83, 230, 154, 197, 21, 226, 29, 192, 138, 200, 245, 65, 7, 1, 2, 3, 2, 19,
  2, 35, 7, 53, 24, 64, 2, 86, 2, 12, 1, 4, 2, 10, 17, 6, 19, 9, 21, 48, 33, 2, 35, 11, 52, 3, 66,
  10, 86, 10, 87, 19, 128, 1, 2, 127, 0, 127, 1, 127, 27, 127, 206, 251, 151, 155, 158, 50, 127, 22,
  115, 121, 115, 116, 101, 109, 58, 32, 105, 110, 105, 116, 105, 97, 108, 32, 99, 111, 109, 109,
  105, 116, 127, 0, 127, 7, 0, 3, 24, 0, 0, 3, 2, 1, 127, 2, 19, 3, 2, 24, 0, 7, 18, 0, 0, 2, 0, 6,
  126, 0, 4, 17, 1, 0, 2, 122, 5, 46, 109, 101, 116, 97, 2, 110, 115, 3, 115, 121, 115, 9, 101, 112,
  104, 101, 109, 101, 114, 97, 108, 4, 116, 121, 112, 101, 4, 110, 97, 109, 101, 0, 19, 126, 4, 100,
  111, 99, 115, 5, 112, 101, 101, 114, 115, 27, 0, 123, 1, 26, 125, 127, 107, 20, 1, 126, 4, 127, 6,
  19, 2, 3, 0, 125, 1, 0, 4, 19, 1, 2, 0, 3, 0, 127, 2, 2, 0, 19, 22, 2, 0, 99, 114, 100, 116, 46,
  110, 101, 116, 119, 111, 114, 107, 46, 115, 104, 97, 114, 101, 100, 27, 0, 0,
]);

/**
 * Call this function to generate the file contents of the Uint8Array.
 * Store and compile this into this ESM module when/if the schema
 * ever updates.
 */
export function generate(options: { silent?: boolean } = {}) {
  const { silent = false } = options;
  const binary = Doc.toBinary<t.CrdtShared>((d) => Shared.Doc.init(d));
  const length = binary.length;
  const body = Array.from(binary).join(', ');
  const constant = `export const binary = new Uint8Array([${body}]);`;
  if (!silent) console.info(constant);
  return {
    binary,
    length,
    toString() {
      return constant;
    },
  } as const;
}
