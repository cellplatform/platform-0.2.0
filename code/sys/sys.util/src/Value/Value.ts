import { Is } from '../Is';
import * as Object from '../Value.Object';
import * as Array from '../Value.Array';

import * as Hash from './Value.Hash';
import * as Math from './Value.Math';
import * as Random from './Value.Random';
import * as To from './Value.To';
import * as u from './Value.u';
import { Text } from '../Text';

const { asArray } = Array;

/**
 * Value conversion and interpretation helpers.
 */
export const Value = {
  Is,
  Object,
  Array,
  Text,
  ...To,
  ...Math,
  ...Random,
  ...Hash,
  ...u,
  asArray,
} as const;
