import type { t } from './common';
export { Pkg } from '../index.pkg';

export const Specs = {
  'ext.lib.akahu': () => import('./-root.SPEC'),
} as t.SpecImports;

export default Specs;
