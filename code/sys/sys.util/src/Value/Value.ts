import { Is } from '../Is';
import * as Array from '../Value.Array';
import * as Object from '../Value.Object';

import { Text } from '../Text';
import * as Hash from './Value.Hash';
import * as Math from './Value.Math';
import * as Random from './Value.Random';
import * as To from './Value.To';
import * as u from './Value.u';
import * as Uint8Array from './Value.Uint8Array';

const { asArray } = Array;

/**
 * Value conversion and interpretation helpers.
 */
export const Value = {
  Is,
  Object,
  Array,
  Text,
  Uint8Array,
  ...To,
  ...Math,
  ...Random,
  ...Hash,
  ...u,
  asArray,
} as const;
