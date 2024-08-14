import type { t } from '../common';

import { Pkg } from '../index.pkg';
export { Pkg };
const ns = Pkg.name;

export const Specs = {
  [`${ns}.tests`]: () => import('./-TestRunner'),
  [`${ns}.ui.Info`]: () => import('../ui/ui.Info/-SPEC'),
} as t.SpecImports;

export default Specs;
