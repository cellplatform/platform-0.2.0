import type { t } from './common';
import { Pkg } from '../index.pkg.mjs';
export { Pkg };
const ns = Pkg.name;

export const Specs = {
  [`${ns}.tests`]: () => import('./-TestRunner'),
  [`${ns}.Syncer`]: () => import('../ui/logic.Syncer.dev/-SPEC'),
  [`${ns}.ui.Info`]: () => import('../ui/ui.Info/-SPEC'),
} as t.SpecImports;

export default Specs;
