import type { t } from './common';
import { Pkg } from '../index.pkg.mjs';
export { Pkg };
const ns = Pkg.name;

export const Specs = {
  [`${ns}.tests`]: () => import('./-TestRunner'),
  [`${ns}.ui.Info`]: () => import('../ui/ui.Info/-SPEC'),
  [`${ns}.ui.Index`]: () => import('../ui/ui.Index/-SPEC'),
  [`${ns}.ui.VideoDiagram`]: () => import('../ui/ui.VideoDiagram/-SPEC'),
  [`${ns}.ui.VideoDiagram.Edit`]: () => import('../ui/ui.VideoDiagram/-SPEC.Edit'),
  [`${ns}.ui.Empty`]: () => import('../ui/ui.Empty/-SPEC'),
} as t.SpecImports;

export default Specs;
