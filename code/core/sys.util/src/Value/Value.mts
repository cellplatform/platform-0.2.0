import * as Array from './Value.Array.mjs';
import * as Math from './Value.Math.mjs';
import * as object from './Value.Object.mjs';
import * as To from './Value.To.mjs';
import * as Util from './Value.Util.mjs';

/**
 * Value conversion and interpretation helpers.
 */
export const Value = {
  object,
  ...To,
  ...Array,
  ...Math,
  ...Util,
};
