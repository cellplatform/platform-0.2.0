import { parts } from './Path.parts.mjs';
import * as within from './Path.within.mjs';
import * as join from './Path.join.mjs';
import * as trim from './Path.trim.mjs';
import * as to from './Path.to.mjs';
import * as ensure from './Path.ensure.mjs';

export const Path = {
  parts,
  ...join,
  ...trim,
  ...to,
  ...within,
  ...ensure,
};
