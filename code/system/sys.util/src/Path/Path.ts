import { parts } from './Path.parts';
import * as within from './Path.within';
import * as join from './Path.join';
import * as trim from './Path.trim';
import * as to from './Path.to';
import * as ensure from './Path.ensure';

export const Path = {
  parts,
  ...join,
  ...trim,
  ...to,
  ...within,
  ...ensure,
} as const;
