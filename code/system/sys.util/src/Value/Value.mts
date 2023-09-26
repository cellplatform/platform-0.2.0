import * as Array from './Value.Array.mjs';
import * as Hash from './Value.Hash.mjs';
import * as Math from './Value.Math.mjs';
import * as Random from './Value.Random.mjs';
import * as To from './Value.To.mjs';
import * as Util from './Value.Util.mjs';

import { is } from '../Is';

import * as object from './Value.Object.mjs';

/**
 * Value conversion and interpretation helpers.
 */
export const Value = {
  is,
  object,
  ...To,
  ...Array,
  ...Math,
  ...Random,
  ...Util,
  ...Hash,
};
