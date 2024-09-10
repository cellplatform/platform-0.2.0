import type { t } from './common';
import { Pkg } from '../index.pkg';
export { Pkg };
const ns = Pkg.name;

export const Specs = {
  [`${ns}.tests`]: () => import('./-TestRunner'),
  [`${ns}.Syncer`]: () => import('../ui/u.Syncer.dev/-SPEC'),
  [`${ns}.ui.Info`]: () => import('../ui/ui.Info/-SPEC'),
  [`${ns}.ui.CrdtEditor`]: () => import('../ui/ui.CrdtEditor/-SPEC'),
} as t.SpecImports;

export default Specs;
