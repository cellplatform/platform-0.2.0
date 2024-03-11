import * as Array from './Value.Array';
import * as Hash from './Value.Hash';
import * as Math from './Value.Math';
import * as Random from './Value.Random';
import * as To from './Value.To';
import * as Util from './Value.Util';

import { is } from '../Is';

import * as object from './Value.Object';

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
