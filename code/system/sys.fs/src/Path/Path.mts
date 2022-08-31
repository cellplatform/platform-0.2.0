import { parts } from './Path.parts.mjs';
import { PathUri as Uri } from '../PathUri/index.mjs';
import { join, isWithin } from './Path.join.mjs';
import * as trim from './Path.trim.mjs';
import * as to from './Path.to.mjs';

export const Path = {
  Uri,
  parts,
  join,
  isWithin,
  ...trim,
  ...to,
};
