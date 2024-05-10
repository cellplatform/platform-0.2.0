import { Pkg } from '../index.pkg.mjs';
import type { t } from './common';
export { Pkg };
const ns = Pkg.name;

export const Specs = {
  [`${ns}.tests`]: () => import('./-TestRunner'),
  [`${ns}.ui.Image`]: () => import('../ui/Image/-SPEC'),
} as t.SpecImports;

export default Specs;
