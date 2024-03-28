import type { t } from '../common';
import { Pkg } from '../index.pkg.mjs';
export { Pkg };
const ns = Pkg.name;

export const Specs = {
  [`${ns}.tests`]: () => import('./-TestRunner'),
  [`${ns}.ui.Info`]: () => import('../ui/Crdt.Info/-dev/-SPEC'),
  [`${ns}.ui.History`]: () => import('../ui/Crdt.History/-SPEC'),
  [`${ns}.types.Text`]: () => import('../test.ui.specs/-SPEC.Text'),
} as t.SpecImports;

export default Specs;
