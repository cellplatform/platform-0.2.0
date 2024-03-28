import type { t } from './common';
export { Pkg } from '../index.pkg.mjs';

export const Specs = {
  'ext.lib.stripe': () => import('./-root.SPEC'),
} as t.SpecImports;

export default Specs;
