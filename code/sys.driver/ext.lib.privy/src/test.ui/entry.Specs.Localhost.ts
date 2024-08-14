import type { t } from './common';
import { Specs as Main } from './entry.Specs';

import { Pkg } from '../index.pkg';
export { Pkg };

const ns = Pkg.name;

export const Specs = {
  ...Main,

  /**
   * NOTE: seperated out as causes bundle error when importing
   *       from external module (circular dependency).
   */
  [`${ns}.tests`]: () => import('./-TestRunner'),
} as t.SpecImports;

export default Specs;
