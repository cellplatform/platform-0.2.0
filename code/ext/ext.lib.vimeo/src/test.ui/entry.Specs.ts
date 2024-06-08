import type { t } from './common';
import { Pkg } from '../index.pkg';
export { Pkg };
const ns = Pkg.name;

export const Specs = {
  [`${ns}.tests`]: () => import('./-TestRunner'),
  [`${ns}.ui.Info`]: () => import('../ui/Info/-SPEC'),
  [`${ns}.ui.Vimeo`]: () => import('../ui/Vimeo/-dev/-SPEC.Vimeo'),
  [`${ns}.ui.VimeoBackground`]: () => import('../ui/Vimeo/-dev/-SPEC.VimeoBg'),
} as t.SpecImports;

export default Specs;
