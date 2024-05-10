import type { t } from './common';
export { Pkg } from '../index.pkg.mjs';

export const Specs = {
  'sys.fs': () => import('./-dev/-TestRunner'),
} as t.SpecImports;

export default Specs;
