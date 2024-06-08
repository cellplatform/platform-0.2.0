import type { t } from '../common';

import { Pkg } from '../index.pkg';
export { Pkg };
const ns = Pkg.name;

export const Specs = {
  [`${ns}.tests`]: () => import('./-TestRunner'),
  [`${ns}.ui.Info`]: () => import('../ui/ui.Info/-SPEC'),
  [`${ns}.ui.LabelItem`]: () => import('../ui/ui.LabelItem/-dev/-SPEC'),
  [`${ns}.ui.LabelItem.Stateful`]: () => import('../ui/ui.LabelItem.Stateful/-dev/-SPEC'),
  [`${ns}.ui.LabelItem.VirtualList`]: () => import('../ui/ui.LabelItem.VirtualList/-SPEC'),
} as t.SpecImports;

export default Specs;
