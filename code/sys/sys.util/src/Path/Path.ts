import { ObjectPath as Object } from '../ObjectPath';
import { parts } from './Path.parts';

import * as ensure from './Path.ensure';
import * as join from './Path.join';
import * as to from './Path.to';
import * as trim from './Path.trim';
import * as within from './Path.within';

export const Path = {
  Object,
  parts,
  ...join,
  ...trim,
  ...to,
  ...within,
  ...ensure,
} as const;
