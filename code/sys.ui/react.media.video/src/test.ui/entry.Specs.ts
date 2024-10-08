import type { t } from './common';
import { Pkg } from '../index.pkg';
export { Pkg };
const ns = Pkg.name;

export const Specs = {
  [`${ns}.tests`]: () => import('./-TestRunner'),
  [`${ns}.ui.Info`]: () => import('../ui/ui.Info/-SPEC'),
  [`${ns}.ui.PlayButton`]: () => import('../ui/ui.PlayButton/-SPEC'),
  [`${ns}.ui.PlayBar`]: () => import('../ui/ui.PlayBar/-SPEC'),
  [`${ns}.ui.VideoPlayer`]: () => import('../ui/ui.VideoPlayer/-SPEC'),
} as t.SpecImports;

export default Specs;
