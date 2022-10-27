import { parts } from './Path.parts.mjs';
import * as Within from './Path.within.mjs';
import * as Join from './Path.join.mjs';
import * as Trim from './Path.trim.mjs';
import * as To from './Path.to.mjs';

export const Path = {
  parts,
  ...Join,
  ...Trim,
  ...To,
  ...Within,
};
