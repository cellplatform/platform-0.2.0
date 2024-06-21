import { Doc, type t } from './common';
import { Shared } from './Shared';

/**
 * The raw binary representation of a [Shared] genesis document.
 */
export const binary = new Uint8Array([
  133, 111, 74, 131, 223, 43, 224, 47, 0, 137, 2, 1, 16, 213, 69, 237, 87, 36, 159, 64, 48, 169,
  183, 74, 122, 117, 168, 57, 49, 1, 39, 89, 112, 146, 165, 17, 251, 214, 248, 101, 85, 194, 225,
  34, 177, 178, 203, 182, 187, 74, 177, 75, 38, 42, 175, 138, 142, 20, 208, 136, 127, 126, 7, 1, 2,
  3, 2, 19, 2, 35, 7, 53, 21, 64, 2, 86, 2, 12, 1, 4, 2, 10, 17, 6, 19, 9, 21, 48, 33, 2, 35, 11,
  52, 3, 66, 10, 86, 10, 87, 19, 128, 1, 2, 127, 0, 127, 1, 127, 27, 127, 176, 242, 220, 229, 242,
  49, 127, 19, 115, 121, 115, 58, 32, 105, 110, 105, 116, 105, 97, 108, 32, 99, 111, 109, 109, 105,
  116, 127, 0, 127, 7, 0, 3, 24, 0, 0, 3, 2, 1, 127, 2, 19, 3, 2, 24, 0, 7, 18, 0, 0, 2, 0, 6, 126,
  0, 4, 17, 1, 0, 2, 122, 5, 46, 109, 101, 116, 97, 2, 110, 115, 3, 115, 121, 115, 9, 101, 112, 104,
  101, 109, 101, 114, 97, 108, 4, 116, 121, 112, 101, 4, 110, 97, 109, 101, 0, 19, 126, 4, 100, 111,
  99, 115, 5, 112, 101, 101, 114, 115, 27, 0, 123, 1, 26, 125, 127, 107, 20, 1, 126, 4, 127, 6, 19,
  2, 3, 0, 125, 1, 0, 4, 19, 1, 2, 0, 3, 0, 127, 2, 2, 0, 19, 22, 2, 0, 99, 114, 100, 116, 46, 110,
  101, 116, 119, 111, 114, 107, 46, 115, 104, 97, 114, 101, 100, 27, 0, 0,
]);

/**
 * Call this function to generate the file contents of the Uint8Array.
 * Store and compile this into this ESM module when/if the schema
 * ever updates.
 */
export function generate() {
  const binary = Doc.toBinary<t.CrdtShared>((d) => Shared.Doc.init(d));
  const body = Array.from(binary).join(', ');
  console.log(`export const binary = new Uint8Array([${body}]);`);
}